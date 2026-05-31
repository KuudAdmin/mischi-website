'use client'

import { useState } from 'react'
import Image from 'next/image'

// Submissions go to our own server route (app/api/waitlist/route.ts), which
// holds the provider keys server-side and forwards to Kit / a Google Sheet.
// Same-origin, so we get real success/error responses.
type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Download() {
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
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, source: 'mischi-website-waitlist' }),
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
      id="waitlist"
      aria-labelledby="waitlist-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(81, 139, 112, 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Image
            src="/icon-3d.png"
            alt="Mischi app icon"
            width={88}
            height={88}
            style={{ borderRadius: '20px', boxShadow: '0 8px 24px rgba(81, 139, 112, 0.18), 0 2px 8px rgba(43, 38, 28, 0.12)', marginBottom: '24px', display: 'inline-block' }}
            priority
          />
          <p style={{ fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
            Waitlist
          </p>
          <h2
            id="waitlist-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)', marginBottom: '14px' }}
          >
            Be first to meet Mischi
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Mischi isn&apos;t on the App Store just yet. Drop your email and we&apos;ll let you know the moment it launches.
          </p>
        </div>

        {/* Waitlist card */}
        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {status === 'success' ? (
            <div style={{ padding: '36px 28px', textAlign: 'center' }}>
              <div
                aria-hidden="true"
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'var(--color-accent-dim)', color: 'var(--color-accent)',
                  marginBottom: '16px',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M5 11.5 9 15.5 17 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '4px' }}>You&apos;re on the list!</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                We&apos;ll email <strong style={{ color: 'var(--color-text)', fontWeight: 600 }}>{email}</strong> when Mischi is ready.
              </p>
            </div>
          ) : (
            <div style={{ padding: '24px 28px' }}>
              <form
                onSubmit={handleSubmit}
                className="waitlist-form"
                style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}
              >
                <label htmlFor="waitlist-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                  Email address
                </label>

                {/* Honeypot — kept off-screen (not display:none, which savvier
                    bots skip), hidden from real users and the tab order. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="waitlist-company">Company (leave this empty)</label>
                  <input
                    id="waitlist-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>

                <input
                  id="waitlist-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === 'error') { setStatus('idle'); setError('') } }}
                  disabled={status === 'submitting'}
                  style={{
                    flex: 1, minWidth: 0,
                    padding: '11px 16px',
                    borderRadius: '9999px',
                    background: 'var(--color-surface-sunken)',
                    border: '1px solid var(--color-border)',
                    color: 'var(--color-text)',
                    fontSize: '0.9375rem',
                    outline: 'none',
                    transition: 'border-color var(--dur-fast)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '11px 22px', borderRadius: '9999px',
                    background: 'var(--cta)', color: 'var(--cta-ink)',
                    fontWeight: 600, fontSize: '0.875rem', border: 'none',
                    whiteSpace: 'nowrap',
                    cursor: status === 'submitting' ? 'default' : 'pointer',
                    opacity: status === 'submitting' ? 0.7 : 1,
                    transition: 'opacity var(--dur-fast), transform var(--dur-fast)',
                    boxShadow: 'var(--shadow-soft)',
                  }}
                  onMouseEnter={(e) => { if (status !== 'submitting') { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = status === 'submitting' ? '0.7' : '1'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  {status === 'submitting' ? 'Joining…' : 'Join waitlist'}
                </button>
              </form>

              <p style={{ fontSize: '0.75rem', color: status === 'error' ? 'var(--clay-ink)' : 'var(--color-text-dim)', marginTop: '12px', paddingInline: '4px' }}>
                {status === 'error'
                  ? error || 'Something went wrong. Please try again in a moment.'
                  : 'No spam, ever. Just one email when Mischi is ready.'}
              </p>
            </div>
          )}

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          {/* Meta */}
          <div style={{ padding: '16px 28px', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {[
              { label: 'Platform', value: 'macOS 13+' },
              { label: 'Arch', value: 'Universal' },
              { label: 'Price', value: 'Free' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-geist-mono)' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .waitlist-form { flex-direction: column !important; }
          .waitlist-form button { width: 100% !important; }
        }
      `}</style>
    </section>
  )
}
