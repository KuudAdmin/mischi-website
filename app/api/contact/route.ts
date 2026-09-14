import { NextResponse } from 'next/server'
import { CONTACT_EMAIL } from '@/lib/release'
import { clientIp, createRateLimit } from '@/lib/rate-limit'

// Contact form endpoint. Validates the message, then hands it to Resend, which
// delivers it to our inbox with the sender as Reply-To — so answering is just
// hitting reply. Nothing is stored on the site.
//
// Env: RESEND_API_KEY (required), CONTACT_FROM_EMAIL (a sender on a domain
// verified in Resend), CONTACT_TO_EMAIL (defaults to CONTACT_EMAIL).

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

const TOPICS = {
  bug: 'Bug report',
  idea: 'Feature idea',
  question: 'Question',
  pet: 'Pet showcase',
  other: 'Message',
} as const
type Topic = keyof typeof TOPICS

const MAX_TEXT = 5000

// People rarely write more than once or twice; this only slows down a script.
const rateLimited = createRateLimit({ windowMs: 10 * 60_000, max: 5 })

/** A single-line value (safe for a subject), trimmed and capped. */
function line(value: unknown, max: number): string {
  return typeof value === 'string' ? value.replace(/[\r\n\t]+/g, ' ').trim().slice(0, max) : ''
}

/** A multi-line value, trimmed and capped. */
function block(value: unknown, max = MAX_TEXT): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function topicIsPet(value: unknown): boolean {
  return value === 'pet'
}

function fail(status: number, error: string, fallback = false) {
  return NextResponse.json({ ok: false, error, fallback }, { status })
}

export async function POST(request: Request) {
  // The form only lives on this site; a cross-site post is someone scripting
  // the endpoint.
  const origin = request.headers.get('origin')
  if (origin) {
    let sameHost = false
    try {
      sameHost = new URL(origin).host === request.headers.get('host')
    } catch {}
    if (!sameHost) return fail(403, 'Forbidden.')
  }

  let body: Record<string, unknown>
  try {
    const parsed: unknown = await request.json()
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object')
    body = parsed as Record<string, unknown>
  } catch {
    return fail(400, 'Bad request.')
  }

  // Honeypot: a real user never fills this. Pretend success, send nothing.
  if (line(body.company, 200)) return NextResponse.json({ ok: true })

  const topic: Topic =
    typeof body.topic === 'string' && body.topic in TOPICS ? (body.topic as Topic) : 'other'
  const email = line(body.email, 254)
  const name = line(body.name, 100)
  const version = line(body.version, 32)
  const os = line(body.os, 80)
  const happened = block(body.happened)
  const expected = block(body.expected)
  const steps = block(body.steps)
  const message = block(body.message)
  const link = topicIsPet(body.topic) ? line(body.link, 300) : ''
  const customSubject = line(body.subject, 120)

  if (!EMAIL_RE.test(email)) {
    return fail(422, 'Please enter a valid email address so we can reply.')
  }
  if (!(topic === 'bug' ? happened : message)) {
    return fail(422, 'Please add a message.')
  }

  if (rateLimited(clientIp(request))) {
    return fail(429, 'You’ve sent a few messages already. Please try again in a few minutes.')
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY is not set; message not sent.')
    return fail(503, 'Our contact form is temporarily unavailable.', true)
  }

  const sections: [string, string][] =
    topic === 'bug'
      ? [
          ['What happened', happened],
          ['What they expected', expected],
          ['Steps to reproduce', steps],
        ]
      : [
          ['Message', message],
          ['Link', link],
        ]

  const header = [
    `From: ${name ? `${name} <${email}>` : email}`,
    `Topic: ${TOPICS[topic]}`,
    ...(version ? [`Mischi: ${version}`] : []),
    ...(os ? [`macOS: ${os}`] : []),
  ]
  const text = [
    header.join('\n'),
    ...sections.filter(([, value]) => value).map(([label, value]) => `${label}:\n${value}`),
    '--\nSent from the contact form on mischi.app. Reply to this email to answer them directly.',
  ].join('\n\n')

  // A subject the sender edited wins; otherwise build one from the topic.
  const subject = customSubject
    ? `[Mischi] ${customSubject} (from ${name || email})`
    : `[Mischi] ${TOPICS[topic]}${version ? ` (v${version})` : ''} from ${name || email}`

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Mischi <onboarding@resend.dev>',
        to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
        reply_to: email,
        subject,
        text,
      }),
    })
    if (!res.ok) {
      console.error('[contact] Resend error', res.status, await res.text().catch(() => ''))
      return fail(502, 'We couldn’t send your message just now.', true)
    }
  } catch (err) {
    console.error('[contact] Resend request failed', err)
    return fail(502, 'We couldn’t send your message just now.', true)
  }

  return NextResponse.json({ ok: true })
}
