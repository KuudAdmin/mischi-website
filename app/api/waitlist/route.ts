import { NextResponse } from 'next/server'

// Server-side waitlist endpoint. The browser posts here (same-origin), so the
// real provider keys/URLs never ship in the client bundle and we get genuine
// success/error responses. It accepts the signup if AT LEAST ONE configured
// backend takes it — run the Google Sheet now, add Kit later, no downtime.

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// --- Best-effort in-memory rate limit -------------------------------------
// Note: Vercel functions are per-instance and ephemeral, so this resets on cold
// starts and isn't shared across instances. Fine for a waitlist; swap in Upstash
// / Vercel KV if you ever need a hard, shared limit.
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

// --- Backends --------------------------------------------------------------
async function subscribeKit(email: string): Promise<boolean> {
  const apiKey = process.env.KIT_API_KEY
  const formId = process.env.KIT_FORM_ID
  if (!apiKey || !formId) return false
  try {
    const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    })
    if (!res.ok) {
      console.error('[waitlist] Kit error', res.status, await res.text().catch(() => ''))
      return false
    }
    return true
  } catch (err) {
    console.error('[waitlist] Kit request failed', err)
    return false
  }
}

async function mirrorToSheet(email: string, source: string): Promise<boolean> {
  const url = process.env.WAITLIST_SHEET_ENDPOINT
  if (!url) return false
  try {
    // Server-to-server: no CORS, and we can read the real response.
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ email, source }),
    })
    return res.ok
  } catch (err) {
    console.error('[waitlist] Sheet request failed', err)
    return false
  }
}

export async function POST(request: Request) {
  let body: { email?: string; company?: string; source?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 })
  }

  const email = (body.email ?? '').trim()
  const company = (body.company ?? '').trim()
  const source = (body.source ?? 'mischi-website-waitlist').slice(0, 80)

  // Honeypot: a real user never fills this. Pretend success, store nothing.
  if (company) return NextResponse.json({ ok: true })

  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter a valid email address.' },
      { status: 422 },
    )
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts — please try again in a minute.' },
      { status: 429 },
    )
  }

  const configured = Boolean(
    (process.env.KIT_API_KEY && process.env.KIT_FORM_ID) || process.env.WAITLIST_SHEET_ENDPOINT,
  )
  if (!configured) {
    // Nothing wired up yet: let the UI work locally, but fail loudly in prod so
    // real signups are never silently dropped.
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[waitlist] No backend configured — accepting without storing (dev only).')
      return NextResponse.json({ ok: true })
    }
    console.error('[waitlist] No waitlist backend configured in production.')
    return NextResponse.json(
      { ok: false, error: 'Waitlist is temporarily unavailable.' },
      { status: 503 },
    )
  }

  const results = await Promise.allSettled([subscribeKit(email), mirrorToSheet(email, source)])
  const accepted = results.some((r) => r.status === 'fulfilled' && r.value === true)

  if (!accepted) {
    return NextResponse.json(
      { ok: false, error: 'Could not join right now — please try again.' },
      { status: 502 },
    )
  }
  return NextResponse.json({ ok: true })
}
