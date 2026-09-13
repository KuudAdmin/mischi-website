/**
 * Best-effort, in-memory sliding-window rate limit for form endpoints.
 *
 * Vercel functions are per-instance and ephemeral, so this resets on cold
 * starts and isn't shared across instances. That's fine for slowing down a
 * form spammer; swap in Upstash / Vercel KV if you ever need a hard limit.
 */
export function createRateLimit({ windowMs, max }: { windowMs: number; max: number }) {
  const hits = new Map<string, number[]>()

  return function limited(key: string): boolean {
    const now = Date.now()
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    recent.push(now)
    hits.set(key, recent)
    return recent.length > max
  }
}

/** The caller's IP as reported by the hosting proxy, for rate-limit keys only. */
export function clientIp(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
