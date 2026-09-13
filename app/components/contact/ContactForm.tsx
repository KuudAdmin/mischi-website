'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/release'

type Topic = 'bug' | 'idea' | 'question' | 'other'
type Status = 'idle' | 'sending' | 'sent' | 'error'

const TOPICS: { id: Topic; label: string }[] = [
  { id: 'bug', label: 'Bug report' },
  { id: 'idea', label: 'Feature idea' },
  { id: 'question', label: 'Question' },
  { id: 'other', label: 'Something else' },
]

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// Messages go to our own route (app/api/contact/route.ts), which sends them
// through Resend. If that ever fails, the form offers a pre-filled email
// instead, so a report is never lost.
export default function ContactForm() {
  const params = useSearchParams()
  // Mischi's "Report it" button (Preferences → About) opens this page with the
  // app version and macOS build as ?v= and ?os=. They're untrusted, so keep
  // them short; the server caps them again.
  const appVersion = (params.get('v') ?? '').slice(0, 32)
  const macOS = (params.get('os') ?? '').slice(0, 80)
  const fromApp = appVersion !== ''

  const [topic, setTopic] = useState<Topic>(fromApp ? 'bug' : 'question')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [happened, setHappened] = useState('')
  const [expected, setExpected] = useState('')
  const [steps, setSteps] = useState('')
  const [message, setMessage] = useState('')
  const [version, setVersion] = useState(appVersion)
  const [company, setCompany] = useState('') // honeypot — stays empty for humans
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState(false)

  const isBug = topic === 'bug'
  const mainText = isBug ? happened : message
  const emailValid = EMAIL_RE.test(email.trim())
  const ready = emailValid && mainText.trim() !== ''

  // The same report as a pre-filled email, for when sending fails.
  const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? 'Message'
  const subject = `Mischi${version.trim() ? ` ${version.trim()}` : ''}: ${topicLabel}`
  const systemInfo = [version.trim() && `Mischi ${version.trim()}`, macOS && `macOS ${macOS}`]
    .filter(Boolean)
    .join('\n')
  const mailBody = (
    isBug
      ? [
          `What happened:\n${happened.trim()}`,
          `What I expected:\n${expected.trim()}`,
          `Steps to reproduce:\n${steps.trim()}`,
        ]
      : [message.trim()]
  )
    .concat(systemInfo ? [`---\n${systemInfo}`] : [])
    .join('\n\n')
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailBody)}`

  function clearError() {
    if (status === 'error') {
      setStatus('idle')
      setError('')
      setFallback(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    if (!ready) {
      setAttempted(true)
      return
    }
    // Honeypot tripped: pretend it worked and never hit the network.
    if (company) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          name,
          email,
          happened: isBug ? happened : '',
          expected: isBug ? expected : '',
          steps: isBug ? steps : '',
          message: isBug ? '' : message,
          version,
          os: macOS,
          company,
        }),
      })
      if (res.ok) {
        setStatus('sent')
        return
      }
      const data = (await res.json().catch(() => null)) as { error?: string; fallback?: boolean } | null
      setError(data?.error || 'Something went wrong. Please try again.')
      setFallback(data?.fallback ?? res.status >= 500)
      setStatus('error')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setFallback(true)
      setStatus('error')
    }
  }

  function reset() {
    setHappened('')
    setExpected('')
    setSteps('')
    setMessage('')
    setAttempted(false)
    setStatus('idle')
  }

  return (
    <div className="contact">
      {fromApp && status !== 'sent' && (
        <div className="contact-from-app">
          <svg width="18" height="18" viewBox="0 0 22 22" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: '2px', color: 'var(--color-accent)' }}>
            <circle cx="11" cy="11" r="9.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7 11.5 10 14.5 15.5 8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p>
            <strong>Thanks for reporting from the app.</strong> Your version details will be sent along with your message:
            <br />
            <span className="contact-chip">Mischi {appVersion}</span>
            {macOS && <span className="contact-chip">macOS {macOS}</span>}
          </p>
        </div>
      )}

      {status === 'sent' ? (
        <div className="contact-card contact-sent" role="status">
          <div className="contact-sent-icon" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M5 11.5 9 15.5 17 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="contact-sent-title">Message sent. Thank you!</p>
            <p className="contact-sent-body">
              We read every message and usually reply within a few days. Our answer will go to{' '}
              <strong>{email}</strong>.
            </p>
            <button type="button" className="contact-secondary" onClick={reset}>
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form className="contact-card" onSubmit={handleSubmit} noValidate>
          <fieldset className="contact-topics">
            <legend>What&apos;s this about?</legend>
            {TOPICS.map((t) => (
              <label key={t.id} className="contact-topic" data-active={topic === t.id}>
                <input
                  type="radio"
                  name="topic"
                  value={t.id}
                  checked={topic === t.id}
                  onChange={() => { setTopic(t.id); setAttempted(false); clearError() }}
                />
                {t.label}
              </label>
            ))}
          </fieldset>

          <div className="contact-row">
            <Field
              id="name"
              label="Name"
              hint="Optional"
              value={name}
              onChange={(v) => { setName(v); clearError() }}
              placeholder="Alex"
              autoComplete="name"
              singleLine
            />
            <Field
              id="email"
              label="Email"
              value={email}
              onChange={(v) => { setEmail(v); clearError() }}
              placeholder="you@example.com"
              autoComplete="email"
              type="email"
              singleLine
              invalid={attempted && !emailValid}
            />
          </div>

          {isBug ? (
            <>
              <Field
                id="happened"
                label="What happened?"
                value={happened}
                onChange={(v) => { setHappened(v); clearError() }}
                rows={4}
                placeholder="My pet disappeared after I unplugged my second display."
                invalid={attempted && !happened.trim()}
              />
              <Field
                id="expected"
                label="What did you expect?"
                hint="Optional"
                value={expected}
                onChange={setExpected}
                rows={2}
                placeholder="It should have moved back to my main screen."
              />
              <Field
                id="steps"
                label="Steps to reproduce"
                hint="Optional"
                value={steps}
                onChange={setSteps}
                rows={3}
                placeholder={'1. Drag the pet onto an external display\n2. Unplug the display'}
              />
              {!fromApp && (
                <Field
                  id="version"
                  label="Mischi version"
                  hint="Optional · Preferences → About"
                  value={version}
                  onChange={setVersion}
                  placeholder="0.9.11"
                  singleLine
                />
              )}
            </>
          ) : (
            <Field
              id="message"
              label={topic === 'idea' ? 'Your idea' : 'Your message'}
              value={message}
              onChange={(v) => { setMessage(v); clearError() }}
              rows={6}
              placeholder={topic === 'idea' ? 'It would be lovely if my pet could…' : 'Hi! I was wondering…'}
              invalid={attempted && !message.trim()}
            />
          )}

          {/* Honeypot — kept off-screen (not display:none, which savvier bots
              skip), hidden from real users and the tab order. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="contact-company">Company (leave this empty)</label>
            <input
              id="contact-company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="contact-actions">
            <button type="submit" className="contact-primary" disabled={status === 'sending'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m22 2-7 20-4-9-9-4Z" />
                <path d="M22 2 11 13" />
              </svg>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </div>

          <div aria-live="polite">
            {status === 'error' ? (
              <p className="contact-note contact-error" role="alert">
                {error}
                {fallback && (
                  <>
                    {' '}You can <a href={mailto}>send it by email instead</a>; we&apos;ve filled it in for you.
                  </>
                )}
              </p>
            ) : attempted && !ready ? (
              <p className="contact-note contact-error" role="alert">
                {!emailValid ? 'Add your email address so we can reply.' : 'Add a few words first, then send it.'}
              </p>
            ) : (
              <p className="contact-note">
                We&apos;ll only use your email to reply. See our <Link href="/privacy">Privacy Policy</Link>.
              </p>
            )}
          </div>
        </form>
      )}

      <div className="contact-aside">
        <Link href="/docs#troubleshooting" className="contact-link-card">
          <strong>Troubleshooting</strong>
          <span>Fixes for the most common problems.</span>
        </Link>
        <Link href="/#faq" className="contact-link-card">
          <strong>FAQ</strong>
          <span>Quick answers about Mischi.</span>
        </Link>
        <a href={`mailto:${CONTACT_EMAIL}`} className="contact-link-card">
          <strong>Email</strong>
          <span>{CONTACT_EMAIL}</span>
        </a>
      </div>

      <style>{`
        .contact { display: flex; flex-direction: column; gap: 20px; }
        .contact-from-app {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: rgba(81, 139, 112, 0.07);
          border: 1px solid rgba(81, 139, 112, 0.25);
          font-size: 0.875rem;
          line-height: 1.6;
        }
        .contact .contact-from-app p { margin: 0; }
        .contact-chip {
          display: inline-block;
          margin: 6px 6px 0 0;
          padding: 1px 8px;
          border-radius: 9999px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          color: var(--color-text);
          overflow-wrap: anywhere;
        }
        .contact-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 28px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-soft);
        }
        .contact-topics {
          border: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-width: 0;
        }
        .contact-topics legend {
          float: left;
          width: 100%;
          padding: 0;
          margin-bottom: 10px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .contact-topic {
          position: relative;
          display: inline-flex;
          align-items: center;
          padding: 7px 14px;
          border-radius: 9999px;
          border: 1px solid var(--color-border-strong);
          background: var(--color-surface);
          font-size: 0.8125rem;
          line-height: 1.4;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast);
        }
        .contact-topic:hover { border-color: rgba(81, 139, 112, 0.45); color: var(--color-text); }
        .contact-topic[data-active='true'] {
          background: var(--sage-600);
          border-color: transparent;
          color: var(--cta-ink);
        }
        .contact-topic input {
          position: absolute;
          inset: 0;
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }
        .contact-topic:has(input:focus-visible) { outline: 2px solid var(--sage-600); outline-offset: 2px; }
        .contact-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
        .contact-field { display: flex; flex-direction: column; gap: 7px; }
        .contact-field label {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .contact-field label span { font-weight: 400; font-size: 0.8125rem; color: var(--color-text-dim); }
        .contact-field textarea,
        .contact-field input {
          width: 100%;
          padding: 11px 14px;
          border-radius: var(--radius-md);
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          font: inherit;
          font-size: 0.9375rem;
          line-height: 1.55;
          resize: vertical;
          outline: none;
          transition: border-color var(--dur-fast), background var(--dur-fast);
        }
        .contact-field textarea::placeholder,
        .contact-field input::placeholder { color: var(--color-text-dim); }
        .contact-field textarea:focus,
        .contact-field input:focus { border-color: var(--color-accent); background: var(--color-surface-raised); }
        .contact-field [aria-invalid='true'] { border-color: var(--clay); }
        .contact-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 4px; }
        .contact-primary,
        .contact-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 11px 22px;
          border-radius: 9999px;
          font: inherit;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--dur-fast), transform var(--dur-fast), opacity var(--dur-fast);
        }
        .contact-primary { background: var(--cta); color: var(--cta-ink); border: none; box-shadow: var(--shadow-soft); }
        .contact-primary:hover:not(:disabled) { background: var(--cta-hover); transform: translateY(-1px); }
        .contact-primary:disabled { opacity: 0.7; cursor: default; }
        .contact-secondary {
          background: var(--color-surface);
          color: var(--color-text);
          border: 1px solid var(--color-border-strong);
          font-weight: 500;
        }
        .contact-secondary:hover { background: var(--color-surface-sunken); transform: translateY(-1px); }
        .contact .contact-note { margin: 0; font-size: 0.8125rem; line-height: 1.6; color: var(--color-text-dim); }
        .contact .contact-error { color: var(--clay-ink); }
        .contact-sent { flex-direction: row; align-items: flex-start; gap: 16px; }
        .contact-sent-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .contact .contact-sent-title { margin: 0 0 4px; font-weight: 600; color: var(--color-text); }
        .contact .contact-sent-body { margin: 0 0 16px; font-size: 0.9375rem; overflow-wrap: anywhere; }
        .contact-aside { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
        .contact .contact-link-card {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 18px;
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-size: 0.8125rem;
          line-height: 1.5;
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: border-color var(--dur-fast), background var(--dur-fast);
        }
        .contact .contact-link-card:hover { border-color: rgba(81, 139, 112, 0.35); background: var(--color-surface-raised); }
        .contact-link-card strong { color: var(--color-text); font-size: 0.875rem; }
        @media (max-width: 640px) {
          .contact-card { padding: 20px; }
          .contact-row { grid-template-columns: minmax(0, 1fr); }
          .contact-aside { grid-template-columns: minmax(0, 1fr); }
          .contact-primary { flex: 1 1 100%; }
        }
      `}</style>
    </div>
  )
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
  rows = 3,
  placeholder,
  invalid,
  singleLine,
  type = 'text',
  autoComplete,
}: {
  id: string
  label: string
  hint?: string
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
  invalid?: boolean
  singleLine?: boolean
  type?: 'text' | 'email'
  autoComplete?: string
}) {
  const inputId = `contact-${id}`
  return (
    <div className="contact-field">
      <label htmlFor={inputId}>
        {label}
        {hint && <span>{hint}</span>}
      </label>
      {singleLine ? (
        <input
          id={inputId}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          id={inputId}
          rows={rows}
          value={value}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}
