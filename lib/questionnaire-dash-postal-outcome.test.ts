import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveSubmissionOutcome, createIdempotencyStore } from "./questionnaire-dash-postal-outcome.ts";

// --- The four CRM/email success/failure combinations --------------------

test("CRM saved + email sent -> full success", () => {
  assert.deepEqual(resolveSubmissionOutcome(true, true), { ok: true, crmSaved: true });
});

test("CRM saved + email failed -> still full success (admin follow-up is a logging concern, not a visitor-facing one)", () => {
  assert.deepEqual(resolveSubmissionOutcome(true, false), { ok: true, crmSaved: true });
});

test("CRM failed + email sent -> partial success, must NOT claim CRM persistence", () => {
  const result = resolveSubmissionOutcome(false, true);
  assert.deepEqual(result, { ok: true, crmSaved: false });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.crmSaved, false);
});

test("CRM failed + email failed -> error, explicitly retryable", () => {
  assert.deepEqual(resolveSubmissionOutcome(false, false), {
    ok: false,
    error: "submission_failed",
    retryable: true,
  });
});

// --- Idempotency store ----------------------------------------------------

test("idempotency: a second call with the same id returns the cached successful result without re-running the attempt", async () => {
  const store = createIdempotencyStore<{ ok: boolean }>();
  let calls = 0;
  const attempt = async () => {
    calls += 1;
    return { body: { ok: true }, status: 200 };
  };

  const first = await store.run("submission-a", attempt);
  const second = await store.run("submission-a", attempt);

  assert.equal(calls, 1, "the underlying save/send attempt must only run once");
  assert.deepEqual(first, second);
});

test("idempotency: concurrent calls with the same id (double-click) share one in-flight attempt", async () => {
  const store = createIdempotencyStore<{ ok: boolean }>();
  let calls = 0;
  const attempt = async () => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 20));
    return { body: { ok: true }, status: 200 };
  };

  const [a, b] = await Promise.all([
    store.run("submission-b", attempt),
    store.run("submission-b", attempt),
  ]);

  assert.equal(calls, 1, "two concurrent requests for the same submission must not both write/send");
  assert.deepEqual(a, b);
});

test("idempotency: a hard failure is never cached, so a genuine retry actually re-attempts", async () => {
  const store = createIdempotencyStore<{ ok: boolean }>();
  let calls = 0;
  const attempt = async () => {
    calls += 1;
    return { body: { ok: false }, status: 502 };
  };

  await store.run("submission-c", attempt);
  await store.run("submission-c", attempt);

  assert.equal(calls, 2, "a failed submission must be retryable, not stuck replaying the same failure");
});

test("idempotency: different submission ids never share a cache entry", async () => {
  const store = createIdempotencyStore<{ ok: boolean }>();
  let calls = 0;
  const attempt = async () => {
    calls += 1;
    return { body: { ok: true }, status: 200 };
  };

  await store.run("submission-d1", attempt);
  await store.run("submission-d2", attempt);

  assert.equal(calls, 2);
});
