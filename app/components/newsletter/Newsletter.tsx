'use client'

import { useState } from 'react'

// Submissions go to our own server route (app/api/subscribe/route.ts), which
// holds the provider keys server-side and forwards to Kit / a Google Sheet.
// Same-origin, so we get real success/error responses.
type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot — stays empty for humans
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || status === 'submitting') return
    // Honeypot tripped: a real user never fills the hidden field. Pretend it
    // worked and never hit the network. (The server drops it too.)
    if (company) {
      setStatus('success')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, source: 'mischi-website-newsletter' }),
      })
      if (res.ok) {
        setStatus('success')
        return
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      setError(data?.error || 'Something went wrong. Please try again.')
      setStatus('error')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  return (
    <section
      id="newsletter"
      aria-labelledby="newsletter-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="newsletter-card">
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 90% at 0% 0%, rgba(81, 139, 112, 0.10) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative' }}>
          <p style={{ fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
            Newsletter
          </p>
          <h2
            id="newsletter-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15, color: 'var(--color-text)', marginBottom: '12px' }}
          >
            News from the desktop
          </h2>
          <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-muted)', lineHeight: 1.65, maxWidth: '42ch' }}>
            New versions, pets worth adopting, and a peek at what we&apos;re building next. A few emails a year, never spam.
          </p>
        </div>

        <div style={{ position: 'relative' }}>
          {status === 'success' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                aria-hidden="true"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  width: 44, height: 44, borderRadius: '50%',
                  background: 'var(--color-accent-dim)', color: 'var(--color-accent)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <path d="M5 11.5 9 15.5 17 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div role="status">
                <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '2px' }}>You&apos;re subscribed!</p>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', overflowWrap: 'anywhere' }}>
                  The next update goes to <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{email}</strong>.
                </p>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="newsletter-form">
                <label htmlFor="newsletter-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  Email address
                </label>

                {/* Honeypot — kept off-screen (not display:none, which savvier
                    bots skip), hidden from real users and the tab order. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="newsletter-company">Company (leave this empty)</label>
                  <input
                    id="newsletter-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <input
                  id="newsletter-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setError('') } }}
                  disabled={status === 'submitting'}
                  className="newsletter-input"
                />
                <button type="submit" disabled={status === 'submitting'} className="newsletter-btn">
                  {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>

              <p role={status === 'error' ? 'alert' : undefined} style={{ fontSize: '0.75rem', color: status === 'error' ? 'var(--clay-ink)' : 'var(--color-text-dim)', marginTop: '12px', paddingInline: '4px' }}>
                {status === 'error'
                  ? error || 'Something went wrong. Please try again in a moment.'
                  : 'Unsubscribe with one click, anytime.'}
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        .newsletter-card {
          position: relative;
          overflow: hidden;
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          gap: 40px;
          align-items: center;
          padding: 44px;
          border-radius: var(--radius-2xl);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-soft);
        }
        .newsletter-form { display: flex; align-items: stretch; gap: 10px; }
        .newsletter-input {
          flex: 1;
          min-width: 0;
          padding: 11px 16px;
          border-radius: 9999px;
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--dur-fast);
        }
        .newsletter-input:focus { border-color: var(--color-accent); }
        .newsletter-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 11px 22px;
          border-radius: 9999px;
          background: var(--cta);
          color: var(--cta-ink);
          font-weight: 600;
          font-size: 0.875rem;
          border: none;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: var(--shadow-soft);
          transition: background var(--dur-fast), transform var(--dur-fast), opacity var(--dur-fast);
        }
        .newsletter-btn:hover:not(:disabled) { background: var(--cta-hover); transform: translateY(-1px); }
        .newsletter-btn:disabled { opacity: 0.7; cursor: default; }
        @media (max-width: 820px) {
          .newsletter-card { grid-template-columns: minmax(0, 1fr); gap: 24px; padding: 28px; }
        }
        @media (max-width: 480px) {
          .newsletter-form { flex-direction: column; }
          .newsletter-btn { width: 100%; }
        }
      `}</style>
    </section>
  )
}
