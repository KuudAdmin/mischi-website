import Image from 'next/image'
import Link from 'next/link'
import { RELEASE } from '@/lib/release'

const INSTALL_STEPS = [
  {
    title: 'Open the download',
    body: `Double-click ${RELEASE.dmgFileName} in your Downloads folder.`,
  },
  {
    title: 'Drag to Applications',
    body: 'Drop Mischi onto the Applications folder in the window that appears.',
  },
  {
    title: 'Say hello',
    body: 'Open Mischi from Applications. Your pet shows up on the desktop and Mischi settles into your menu bar.',
  },
]

const META = [
  { label: 'Version', value: RELEASE.version },
  { label: 'Released', value: RELEASE.date },
  { label: 'Requires', value: 'macOS 13+' },
  { label: 'Arch', value: 'Universal' },
  { label: 'Price', value: 'Free' },
]

export default function Download() {
  return (
    <section
      id="download"
      aria-labelledby="download-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Links to the pre-launch #waitlist anchor still land here. */}
      <span id="waitlist" aria-hidden="true" />

      <div
        aria-hidden="true"
        style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '760px', height: '560px',
          background: 'radial-gradient(ellipse, rgba(81, 139, 112, 0.09) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Image
            src="/icon-3d.png"
            alt="Mischi app icon"
            width={88}
            height={88}
            style={{ borderRadius: '20px', boxShadow: '0 6px 16px -8px rgba(81, 139, 112, 0.22)', marginBottom: '24px', display: 'inline-block' }}
          />
          <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
            Download
            <span className="download-beta">{RELEASE.channel}</span>
          </p>
          <h2
            id="download-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)', marginBottom: '14px' }}
          >
            Get Mischi for your Mac
          </h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            Free, and in public beta. Signed and notarised by Apple, so it installs like any other app.
          </p>
        </div>

        <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-soft)' }}>
          <div className="download-top">
            <div>
              <p style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '1rem', marginBottom: '4px' }}>
                Mischi for macOS
              </p>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-geist-mono)' }}>
                v{RELEASE.version} · {RELEASE.size} · .dmg
              </p>
            </div>
            <a href={RELEASE.dmgUrl} download className="download-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2.5v7.5m0 0L4.75 6.75M8 10l3.25-3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.75 13h10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Download for Mac
            </a>
          </div>

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          <ol className="download-steps">
            {INSTALL_STEPS.map((step, i) => (
              <li key={step.title}>
                <span className="download-step-num" aria-hidden="true">{i + 1}</span>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)', margin: '12px 0 4px' }}>
                  {step.title}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          <div style={{ padding: '16px 28px', display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
            {META.map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '0.6875rem', color: 'var(--color-text-dim)', marginBottom: '2px' }}>{label}</p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-geist-mono)' }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{ height: '1px', background: 'var(--color-border)' }} />

          <details className="download-checksum">
            <summary>Verify your download (SHA-256)</summary>
            <code>{RELEASE.sha256}</code>
          </details>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          New to Mischi? <Link href="/docs" className="download-link">Read the docs</Link> for setup, AI and making your own pets.
        </p>
      </div>

      <style>{`
        .download-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 28px;
        }
        .download-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 13px 26px;
          border-radius: 9999px;
          background: var(--cta);
          color: var(--cta-ink);
          font-weight: 600;
          font-size: 0.9375rem;
          letter-spacing: -0.01em;
          text-decoration: none;
          white-space: nowrap;
          box-shadow: var(--shadow-soft);
          transition: background var(--dur-fast), transform var(--dur-fast);
        }
        .download-btn:hover { background: var(--cta-hover); transform: translateY(-2px); }
        .download-btn:active { background: var(--cta-active); transform: translateY(0); }
        .download-beta {
          font-size: 0.625rem;
          letter-spacing: 0.06em;
          color: var(--sage-800);
          background: var(--color-accent-dim);
          border: 1px solid rgba(81, 139, 112, 0.25);
          border-radius: 9999px;
          padding: 2px 7px;
          line-height: 1.4;
        }
        .download-steps {
          list-style: none;
          margin: 0;
          padding: 24px 28px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
        }
        .download-step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-accent-dim);
          color: var(--sage-800);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .download-checksum { padding: 14px 28px; }
        .download-checksum summary {
          cursor: pointer;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .download-checksum code {
          display: block;
          margin-top: 10px;
          padding: 8px 10px;
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          color: var(--color-text);
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          overflow-wrap: anywhere;
        }
        .download-link {
          color: var(--sage-800);
          text-decoration: none;
          border-bottom: 1px solid rgba(81, 139, 112, 0.35);
          transition: border-color var(--dur-fast);
        }
        .download-link:hover { border-bottom-color: var(--color-accent); }
        @media (max-width: 640px) {
          .download-top { flex-direction: column; align-items: stretch; }
          .download-steps { grid-template-columns: minmax(0, 1fr); gap: 18px; }
        }
      `}</style>
    </section>
  )
}
