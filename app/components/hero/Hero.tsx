'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px',
        paddingBottom: '60px',
        paddingInline: '24px',
      }}
    >
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse 70% 55% at 50% 62%,
              oklch(74% 0.16 78 / 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 100% 60% at 50% 100%,
              oklch(74% 0.16 78 / 0.06) 0%, transparent 60%)
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
          backgroundImage: 'radial-gradient(oklch(100% 0 0 / 0.04) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '760px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '5px 14px',
            borderRadius: '9999px',
            background: 'var(--color-accent-dim)',
            border: '1px solid oklch(74% 0.16 78 / 0.25)',
            marginBottom: '28px',
          }}
        >
          <span style={{
            fontSize: '0.71875rem',
            color: 'var(--color-accent)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            Now available for macOS
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          style={{
            fontSize: 'var(--text-hero)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textAlign: 'center',
            color: 'var(--color-text)',
            marginBottom: '20px',
          }}
        >
          Your Mac{' '}
          <span style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, oklch(74% 0.16 78) 0%, oklch(82% 0.13 65) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
          }}>deserves</span>{' '}
          a companion.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'var(--text-lg)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
            maxWidth: '480px',
            lineHeight: 1.65,
            marginBottom: '44px',
          }}
        >
          Run animated desktop pets on macOS. Interactive, expressive, offline&#8209;first.
          No cloud. No setup. Just magic.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          <a
            href="#download"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '13px 28px',
              borderRadius: '9999px',
              background: 'var(--color-accent)',
              color: 'oklch(12% 0.01 60)',
              fontWeight: 600,
              fontSize: '0.9375rem',
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              transition: 'opacity var(--dur-fast), transform var(--dur-fast)',
              boxShadow: '0 0 28px oklch(74% 0.16 78 / 0.28)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '0.88'; el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '1'; el.style.transform = 'translateY(0)'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 1.5v9M4.5 7 8 10.5 11.5 7M2 14.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Download for macOS
            <Image src="/app-icon.png" alt="" width={20} height={20} style={{ borderRadius: '4px' }} />
          </a>

          <a
            href="#demo"
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
              transition: 'background var(--dur-fast), transform var(--dur-fast)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'oklch(100% 0 0 / 0.08)'; el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'oklch(100% 0 0 / 0.05)'; el.style.transform = 'translateY(0)'
            }}
          >
            Try Live Demo
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Platform badges */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 1L1.5 3v4L5 9l3.5-2V3L5 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
            Apple Silicon
          </span>
          <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
              <path d="M5 1L1.5 3v4L5 9l3.5-2V3L5 1z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
            </svg>
            Intel Mac
          </span>
          <span style={{ color: 'var(--color-text-dim)', fontSize: '0.75rem' }}>·</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>macOS 13+</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          opacity: 0.3,
        }}
      >
        <svg width="16" height="22" viewBox="0 0 16 22" fill="none">
          <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="8" cy="6" r="2" fill="currentColor">
            <animate attributeName="cy" from="6" to="14" dur="1.4s" repeatCount="indefinite" calcMode="ease-in-out"/>
            <animate attributeName="opacity" from="1" to="0" dur="1.4s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <style>{``}</style>
      </div>
    </section>
  )
}

