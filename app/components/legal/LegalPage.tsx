import Nav from '../nav/Nav'
import Footer from '../footer/Footer'

interface LegalPageProps {
  title: string
  updated: string
  intro?: string
  children: React.ReactNode
}

export default function LegalPage({ title, updated, intro, children }: LegalPageProps) {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: 'calc(100dvh - 60px)',
          paddingTop: '120px',
          paddingBottom: '80px',
          paddingInline: '24px',
          position: 'relative',
        }}
      >
        {/* Ambient backdrop */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(81, 139, 112, 0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <article
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '720px',
            margin: '0 auto',
          }}
        >
          <header style={{ marginBottom: '40px' }}>
            <p
              style={{
                fontSize: '0.71875rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '14px',
              }}
            >
              Legal
            </p>
            <h1
              style={{
                fontSize: 'clamp(2rem, 1rem + 3vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                lineHeight: 1.1,
                color: 'var(--color-text)',
                marginBottom: '16px',
              }}
            >
              {title}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-dim)' }}>
              Last updated {updated}
            </p>
            {intro && (
              <p
                style={{
                  marginTop: '28px',
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.65,
                }}
              >
                {intro}
              </p>
            )}
          </header>

          <div className="legal-body">{children}</div>
        </article>

        <style>{`
          .legal-body {
            color: var(--color-text-muted);
            font-size: 1rem;
            line-height: 1.7;
          }
          .legal-body h2 {
            font-size: 1.25rem;
            font-weight: 700;
            letter-spacing: -0.015em;
            color: var(--color-text);
            margin-top: 48px;
            margin-bottom: 14px;
          }
          .legal-body h2:first-child { margin-top: 0; }
          .legal-body h3 {
            font-size: 0.9375rem;
            font-weight: 600;
            color: var(--color-text);
            margin-top: 28px;
            margin-bottom: 8px;
          }
          .legal-body p { margin-bottom: 16px; }
          .legal-body ul, .legal-body ol {
            margin: 0 0 18px 0;
            padding-left: 22px;
          }
          .legal-body li { margin-bottom: 8px; }
          .legal-body strong { color: var(--color-text); font-weight: 600; }
          .legal-body a {
            color: var(--color-accent);
            text-decoration: none;
            border-bottom: 1px solid rgba(81, 139, 112, 0.35);
            transition: border-color var(--dur-fast);
          }
          .legal-body a:hover { border-bottom-color: var(--color-accent); }
          .legal-body code {
            font-family: var(--font-geist-mono), monospace;
            font-size: 0.875em;
            padding: 2px 6px;
            background: oklch(100% 0 0 / 0.05);
            border: 1px solid var(--color-border);
            border-radius: 4px;
            color: var(--color-text);
          }
        `}</style>
      </main>
      <Footer />
    </>
  )
}
