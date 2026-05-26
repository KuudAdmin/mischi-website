'use client'

import Image from 'next/image'

export default function Download() {
  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '700px', height: '500px',
          background: 'radial-gradient(ellipse, oklch(74% 0.16 78 / 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <Image
            src="/icon-3d.png"
            alt="Mischi app icon"
            width={88}
            height={88}
            style={{ borderRadius: '20px', boxShadow: '0 8px 32px oklch(74% 0.16 78 / 0.2), 0 2px 8px oklch(0% 0 0 / 0.4)', marginBottom: '24px', display: 'inline-block' }}
            priority
          />
          <p style={{ fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
            Download
          </p>
          <h2
            id="download-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)', marginBottom: '14px' }}
          >
            Get Mischi for macOS
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Free to download. No account needed. Apple Silicon and Intel.
          </p>
        </div>

        {/* Download card */}
        <div style={{ background: 'oklch(13% 0.012 60)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
          {/* Direct download row */}
          <div style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '3px' }}>Mischi.dmg</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>v0.1.0 — Universal Binary · 14.2 MB</p>
              </div>
              <a
                href="#"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 22px', borderRadius: '9999px',
                  background: 'var(--color-accent)', color: 'oklch(12% 0.01 60)',
                  fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'opacity var(--dur-fast), transform var(--dur-fast)',
                  boxShadow: '0 0 20px oklch(74% 0.16 78 / 0.25)',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.opacity = '0.88'; el.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.opacity = '1'; el.style.transform = 'translateY(0)'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M7 1v8M3.5 5.5L7 9l3.5-3.5M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download
              </a>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          {/* Homebrew */}
          <div style={{ padding: '20px 28px' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '10px', fontWeight: 500 }}>
              Or install with Homebrew:
            </p>
            <div style={{ position: 'relative' }}>
              <div className="code-block" style={{ paddingRight: '56px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>$</span>
                {' '}
                <span style={{ color: 'var(--color-accent)' }}>brew</span>
                {' '}
                <span style={{ color: 'var(--color-text)' }}>install --cask mischi</span>
              </div>
              <BrewCopyButton />
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          {/* Meta */}
          <div style={{ padding: '16px 28px', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {[
              { label: 'Version', value: '0.1.0' },
              { label: 'Requires', value: 'macOS 13+' },
              { label: 'Arch', value: 'Universal' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-geist-mono)' }}>{value}</p>
              </div>
            ))}
            <div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '2px' }}>Notarized</p>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: '#28C840' }}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1.5 5.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Apple verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function BrewCopyButton() {
  return (
    <button
      onClick={() => navigator.clipboard?.writeText('brew install --cask mischi')}
      aria-label="Copy Homebrew install command"
      style={{
        position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
        background: 'oklch(100% 0 0 / 0.06)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        padding: '3px 8px',
        cursor: 'pointer',
        color: 'var(--color-text-muted)',
        fontSize: '0.6875rem',
        fontWeight: 500,
        transition: 'background var(--dur-fast), color var(--dur-fast)',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'oklch(100% 0 0 / 0.1)'; el.style.color = 'var(--color-text)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = 'oklch(100% 0 0 / 0.06)'; el.style.color = 'var(--color-text-muted)'
      }}
    >
      copy
    </button>
  )
}
