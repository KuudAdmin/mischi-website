import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '404 — Page Not Found | Mischi',
  description: 'This page wandered off. Let’s get you back to your Mac companion.',
}

export default function NotFound() {
  return (
    <section
      style={{
        flex: 1,
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 24px 60px',
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 50%,
              rgba(81, 139, 112, 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 100% 60% at 50% 100%,
              rgba(81, 139, 112, 0.05) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }}
      />

      {/* Dot grid texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(oklch(100% 0 0 / 0.035) 0.5px, transparent 0.5px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 24%, black 56%, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 24%, black 56%, transparent 92%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '560px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Mac-style error window */}
        <div className="mac-window" style={{ width: '100%', marginBottom: '40px' }}>
          <div className="mac-titlebar">
            <div className="mac-traffic-lights">
              <span className="mac-light mac-light-red" />
              <span className="mac-light mac-light-yellow" />
              <span className="mac-light mac-light-green" />
            </div>
            <span className="mac-title">Mischi — Not Found</span>
          </div>

          <div
            className="mac-content"
            style={{
              padding: '56px 32px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
            }}
          >
            {/* Floating Mischi mark */}
            <div
              style={{
                position: 'relative',
                width: '88px',
                height: '88px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '4px',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-12px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, var(--color-accent-glow) 0%, transparent 70%)',
                  filter: 'blur(12px)',
                }}
              />
              <Image
                src="/mischi-icon-02.png"
                alt=""
                width={72}
                height={72}
                style={{
                  position: 'relative',
                  borderRadius: '12px',
                  imageRendering: 'pixelated',
                  animation: 'mischi-float 3.6s ease-in-out infinite',
                }}
                priority
              />
            </div>

            {/* Big 404 */}
            <h1
              style={{
                fontSize: 'var(--text-hero)',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                margin: 0,
                background: 'linear-gradient(135deg, #518B70 0%, #518B70 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              404
            </h1>

            <h2
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                color: 'var(--color-text)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              This page wandered off.
            </h2>

            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                maxWidth: '360px',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Even desktop pets get lost sometimes. Let’s head back home.
            </p>

            {/* Path indicator */}
            <div
              className="code-block"
              style={{
                marginTop: '8px',
                padding: '8px 14px',
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span style={{ color: 'var(--color-accent)' }}>$</span>
              <span>cd</span>
              <span style={{ color: 'var(--color-text-dim)' }}>~/</span>
              <span style={{ color: 'var(--color-text)' }}>home</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/"
            className="nf-cta-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 28px',
              borderRadius: '9999px',
              background: 'var(--color-accent)',
              color: 'oklch(98% 0 0)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 0 28px rgba(81, 139, 112, 0.28)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M7 4 3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Home
          </Link>

          <Link
            href="/#demo"
            className="nf-cta-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '9999px',
              background: 'oklch(100% 0 0 / 0.05)',
              border: '1px solid var(--color-border-strong)',
              color: 'var(--color-text)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              backdropFilter: 'blur(12px)',
            }}
          >
            Try the Demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes mischi-float {
          0%, 100% { transform: translateY(0) rotate(-2deg); }
          50%      { transform: translateY(-6px) rotate(2deg); }
        }
        .nf-cta-primary, .nf-cta-ghost {
          transition: opacity var(--dur-fast), transform var(--dur-fast), background var(--dur-fast);
        }
        .nf-cta-primary:hover { opacity: 0.88; transform: translateY(-2px); }
        .nf-cta-ghost:hover   { background: oklch(100% 0 0 / 0.08); transform: translateY(-2px); }
        @media (prefers-reduced-motion: reduce) {
          .nf-cta-primary:hover, .nf-cta-ghost:hover { transform: none; }
          [style*="mischi-float"] { animation: none !important; }
        }
      `}</style>
    </section>
  )
}
