'use client'

import { useState } from 'react'
import { TickCircle } from 'iconsax-react'
import PetCanvas from '../demo/PetCanvas'
import { track } from '@/lib/analytics'

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
        track('newsletter_subscribed')
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
    <section id="newsletter" aria-labelledby="newsletter-heading" className="nl">
      <div className="nl-band">
        {/* The cat peeks over the band's top edge. */}
        <div className="nl-pet" aria-hidden="true">
          <PetCanvas
            state={status === 'success' ? 'dancing' : 'waiting'}
            interactive={false}
            autoAnimate={false}
            scale={0.4}
            spritesheet="/spritesheet_cat.webp"
          />
        </div>

        <div className="nl-copy">
          <h2 id="newsletter-heading" className="nl-title">News from the desktop</h2>
          <p className="nl-sub">New versions and pets worth adopting. A few emails a year, never spam.</p>
        </div>

        <div className="nl-action">
          {status === 'success' ? (
            <p role="status" className="nl-done">
              <TickCircle size={20} variant="Bold" color="currentColor" aria-hidden="true" />
              <span>
                Subscribed. The next update goes to <strong>{email}</strong>.
              </span>
            </p>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="nl-form">
                <label htmlFor="newsletter-email" className="nl-sr">
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
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') {
                      setStatus('idle')
                      setError('')
                    }
                  }}
                  disabled={status === 'submitting'}
                  className="nl-input"
                />
                <button type="submit" disabled={status === 'submitting'} className="nl-btn">
                  {status === 'submitting' ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
              <p role={status === 'error' ? 'alert' : undefined} className="nl-note" data-error={status === 'error' || undefined}>
                {status === 'error'
                  ? error || 'Something went wrong. Please try again in a moment.'
                  : 'Unsubscribe with one click, anytime.'}
              </p>
            </>
          )}
        </div>
      </div>

      <style>{`
        .nl { padding: 96px 24px clamp(4rem, 3rem + 3vw, 6rem); }
        .nl-band {
          position: relative;
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
          gap: 24px 48px;
          align-items: center;
          padding: 32px 40px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          background: var(--color-surface);
        }
        /* Feet on the band's top edge; ~8px of transparent padding under the sprite. */
        .nl-pet { position: absolute; top: 8px; left: 40px; transform: translateY(-100%); line-height: 0; }
        .nl-title {
          font-size: clamp(1.4rem, 1.1rem + 1vw, 1.75rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.022em;
          color: var(--color-text);
        }
        .nl-sub { margin-top: 6px; font-size: 0.9375rem; line-height: 1.6; color: var(--color-text-muted); }
        .nl-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
        .nl-form { display: flex; align-items: stretch; gap: 8px; }
        .nl-input {
          flex: 1;
          min-width: 0;
          padding: 11px 16px;
          border: 1px solid var(--color-border);
          border-radius: 9999px;
          background: var(--color-surface-sunken);
          font-size: 0.9375rem;
          color: var(--color-text);
          outline: none;
          transition: border-color var(--dur-fast);
        }
        .nl-input:focus { border-color: var(--color-accent); }
        .nl-btn {
          padding: 11px 22px;
          border: 0;
          border-radius: 9999px;
          background: var(--cta);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--cta-ink);
          white-space: nowrap;
          cursor: pointer;
          transition: background var(--dur-fast), transform var(--dur-fast), opacity var(--dur-fast);
        }
        .nl-btn:hover:not(:disabled) { background: var(--cta-hover); transform: translateY(-1px); }
        .nl-btn:disabled { opacity: 0.7; cursor: default; }
        .nl-btn:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 2px; }
        .nl-note { margin-top: 8px; padding-inline: 4px; font-size: 0.75rem; color: var(--color-text-dim); }
        .nl-note[data-error] { color: var(--clay-ink); }
        .nl-done { display: flex; align-items: center; gap: 10px; font-size: 0.9375rem; color: var(--color-text-muted); overflow-wrap: anywhere; }
        .nl-done svg { flex: none; color: var(--sage-600); }
        .nl-done strong { font-weight: 600; color: var(--color-text); }
        @media (max-width: 820px) {
          .nl-band { grid-template-columns: minmax(0, 1fr); padding: 28px 24px 24px; }
          .nl-pet { left: auto; right: 24px; }
        }
        @media (max-width: 480px) {
          .nl-form { flex-direction: column; }
        }
      `}</style>
    </section>
  )
}
