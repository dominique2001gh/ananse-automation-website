/**
 * Minimal in-memory, sliding-window rate limiter. Server-only.
 *
 * This is a best-effort deterrent, not a robust defense: the counters live
 * in the memory of a single server instance, so on a multi-instance or
 * serverless deployment (Vercel, etc.) each instance/cold-start gets its
 * own counter and a determined abuser can route around it. It's enough to
 * stop a naive script hammering an endpoint in a tight loop. For real
 * protection at scale, replace this with a durable store (Upstash Redis,
 * Vercel KV) or a platform-level rate limit / WAF rule.
 */
export function createRateLimiter({
  windowMs,
  max,
}: {
  windowMs: number;
  max: number;
}) {
  const hits = new Map<string, number[]>();

  return function isRateLimited(key: string): boolean {
    const now = Date.now();
    const timestamps = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
    timestamps.push(now);
    hits.set(key, timestamps);

    // Opportunistic cleanup so this map can't grow unbounded over the life
    // of a warm instance.
    if (hits.size > 5000) {
      for (const [existingKey, existingTimestamps] of hits) {
        if (existingTimestamps.every((t) => now - t >= windowMs)) {
          hits.delete(existingKey);
        }
      }
    }

    return timestamps.length > max;
  };
}

/** Best-effort client identifier from standard proxy headers. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
