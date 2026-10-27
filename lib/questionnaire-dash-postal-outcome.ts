/**
 * Pure decision logic + idempotency store for the Dash Postal questionnaire
 * submission endpoint (app/api/project-questionnaire/dash-postal/route.ts).
 * Deliberately dependency-free (no Next.js types, no "@/" imports) so it
 * can be unit-tested directly with plain `node --test`, without mocking
 * Supabase or Resend -- see questionnaire-dash-postal-outcome.test.ts.
 *
 * Scoped to Dash Postal only. The generic questionnaire, Xmine Consult's
 * questionnaire, and the contact form each keep their own prior
 * CRM-write-failure-never-blocks-the-response behavior untouched -- this
 * module and its stricter contract only govern this one route.
 */

/**
 * CRM persistence (Supabase) is the primary success signal, per the
 * product decision: a visitor should never be told "success" unless we
 * can say *something* true actually happened --
 *
 * - CRM saved (email sent or not): full success. An email failure here is
 *   an operational concern (the admin should still get notified to follow
 *   up some other way), not something the visitor needs to see.
 * - CRM save failed but the email reached the inbox: still a real,
 *   partial success -- the business was notified -- but the response must
 *   say so accurately rather than implying the data was also saved.
 * - Both failed: nothing happened. This is the only case that should read
 *   as an error with a retry.
 */
export type DashPostalApiResult =
  | { ok: true; crmSaved: true }
  | { ok: true; crmSaved: false }
  | { ok: false; error: "submission_failed"; retryable: true };

export function resolveSubmissionOutcome(
  crmSaved: boolean,
  emailSent: boolean
): DashPostalApiResult {
  if (crmSaved) return { ok: true, crmSaved: true };
  if (emailSent) return { ok: true, crmSaved: false };
  return { ok: false, error: "submission_failed", retryable: true };
}

type StoredResult<T> = { body: T; status: number };
type CacheEntry<T> = StoredResult<T> & { cachedAt: number };

/**
 * Keyed by a client-generated, per-wizard-session id (see
 * DashPostalQuestionnaireWizard.tsx) so a double-click or a browser/network
 * retry of the *same* submission never writes a second lead or sends a
 * second notification email.
 *
 * Only a successful outcome (`body.ok === true`, i.e. crmSaved true or
 * false) is ever cached. A hard failure is deliberately never cached, so a
 * genuine retry after "both failed" always actually re-attempts the save
 * and the send rather than being stuck replaying the same failure forever.
 *
 * In-memory only, same trade-off as lib/rate-limit.ts -- a best-effort
 * safeguard against accidental double-submits within one server instance's
 * uptime, not a distributed-systems-grade idempotency layer.
 */
export function createIdempotencyStore<T extends { ok: boolean }>(
  ttlMs: number = 30 * 60 * 1000
) {
  const successCache = new Map<string, CacheEntry<T>>();
  const inFlight = new Map<string, Promise<StoredResult<T>>>();

  function getCached(id: string): StoredResult<T> | null {
    const entry = successCache.get(id);
    if (!entry) return null;
    if (Date.now() - entry.cachedAt > ttlMs) {
      successCache.delete(id);
      return null;
    }
    // Strip the internal cachedAt bookkeeping field so a cache hit returns
    // the exact same shape as a fresh attempt.
    return { body: entry.body, status: entry.status };
  }

  async function run(
    id: string,
    attempt: () => Promise<StoredResult<T>>
  ): Promise<StoredResult<T>> {
    const cached = getCached(id);
    if (cached) return cached;

    const existing = inFlight.get(id);
    if (existing) return existing;

    const promise = attempt().then((result) => {
      if (result.body.ok) {
        successCache.set(id, { ...result, cachedAt: Date.now() });
        // Opportunistic cleanup, same pattern as lib/rate-limit.ts, so this
        // map can't grow unbounded over a long-running warm instance.
        if (successCache.size > 2000) {
          const now = Date.now();
          for (const [key, value] of successCache) {
            if (now - value.cachedAt > ttlMs) successCache.delete(key);
          }
        }
      }
      return result;
    });

    inFlight.set(id, promise);
    try {
      return await promise;
    } finally {
      inFlight.delete(id);
    }
  }

  return { run, getCached };
}
