'use client'

import { ArrowRight } from 'iconsax-react'
import DesktopScene from './DesktopScene'
import { RELEASE } from '@/lib/release'

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="hero">
      <div aria-hidden="true" className="hero-glow" />

      <div className="hero-grid">
        <div className="hero-copy">
          <a href="/docs" className="hero-pill hero-reveal" style={{ animationDelay: '0s' }}>
            <span className="hero-pill-tag">{RELEASE.channel}</span>
            v{RELEASE.version} is out · Read the docs
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <h1 id="hero-heading" className="hero-headline hero-reveal" style={{ animationDelay: '0.05s' }}>
            Your Mac <span className="hero-accent">deserves</span> a companion.
          </h1>

          <p className="hero-sub hero-reveal" style={{ animationDelay: '0.15s' }}>
            Animated pets that live right on your desktop. Drag them around, set reminders, or press ⌘K to ask them
            anything.
          </p>

          <div className="hero-actions hero-reveal" style={{ animationDelay: '0.25s' }}>
            <a href={RELEASE.dmgUrl} download className="hero-cta">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 2.5v7.5m0 0L4.75 6.75M8 10l3.25-3.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.75 13h10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Download for Mac
            </a>
            <a href="#features" className="hero-secondary">
              See it in action
              <ArrowRight size={16} color="currentColor" aria-hidden="true" />
            </a>
          </div>

          <p className="hero-meta hero-reveal" style={{ animationDelay: '0.35s' }}>
            {RELEASE.size} · macOS 13+ · Apple Silicon &amp; Intel
          </p>
        </div>

        {/* The scene handles its own entrance, once its images are ready. */}
        <div id="demo" className="hero-demo">
          <DesktopScene />
        </div>
      </div>

      <style>{`
        /* Fills the first screen; the facts marquee starts just below the fold. */
        .hero {
          position: relative;
          overflow: hidden;
          min-height: 100svh;
          display: flex;
          align-items: center;
          padding: 96px 24px 56px;
        }
        .hero-glow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 55% 55% at 74% 48%, rgba(217, 93, 57, 0.10) 0%, transparent 70%),
            radial-gradient(ellipse 60% 60% at 18% 30%, rgba(81, 139, 112, 0.08) 0%, transparent 70%);
        }
        .hero-grid {
          position: relative;
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 56px;
          align-items: center;
        }
        .hero-copy { display: flex; flex-direction: column; align-items: flex-start; }
        .hero-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 4px 14px 4px 4px;
          border: 1px solid var(--color-border);
          border-radius: 9999px;
          background: var(--color-surface);
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          text-decoration: none;
          white-space: nowrap;
          transition: border-color var(--dur-fast), background var(--dur-fast), color var(--dur-fast);
        }
        .hero-pill:hover { border-color: rgba(81, 139, 112, 0.35); background: var(--color-surface-raised); color: var(--color-text); }
        .hero-pill-tag {
          padding: 3px 9px;
          border-radius: 9999px;
          background: var(--color-accent-dim);
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sage-800);
        }
        .hero-headline {
          margin: 22px 0;
          font-size: clamp(2.5rem, 1.2rem + 4vw, 4.4rem);
          font-weight: 700;
          line-height: 1.03;
          letter-spacing: -0.035em;
          color: var(--color-text);
          text-wrap: balance;
        }
        .hero-accent { color: var(--sage-700); }
        .hero-sub {
          max-width: 470px;
          margin-bottom: 32px;
          font-size: var(--text-lg);
          line-height: 1.65;
          color: var(--color-text-muted);
        }
        .hero-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 24px; margin-bottom: 18px; }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 26px;
          border-radius: 9999px;
          background: var(--cta);
          font-size: 0.9375rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--cta-ink);
          text-decoration: none;
          box-shadow: var(--shadow-card);
          transition: background var(--dur-fast), transform var(--dur-fast);
        }
        .hero-cta:hover { background: var(--cta-hover); transform: translateY(-2px); }
        .hero-cta:focus-visible,
        .hero-secondary:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 3px; }
        .hero-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          transition: gap var(--dur-fast), color var(--dur-fast);
        }
        .hero-secondary:hover { gap: 10px; color: var(--sage-800); }
        .hero-meta { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-dim); }
        .hero-demo { width: 100%; }

        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-reveal { animation: hero-fade-up 0.7s var(--ease-expo) both; }
        @media (prefers-reduced-motion: reduce) {
          .hero-reveal { animation: none; opacity: 1; }
        }
        @media (max-width: 960px) {
          .hero { padding-top: 104px; }
          .hero-grid { grid-template-columns: minmax(0, 1fr); gap: 44px; }
          .hero-copy { align-items: center; text-align: center; }
          .hero-sub { margin-inline: auto; }
          .hero-actions { justify-content: center; }
        }
        /* Phones: tighter spacing and type so the copy and the cat scene both
           fit the first screen. */
        @media (max-width: 520px) {
          .hero { padding-top: 76px; padding-bottom: 20px; }
          .hero-grid { gap: 16px; }
          .hero-pill { white-space: normal; font-size: 0.75rem; }
          .hero-headline { margin: 14px 0 12px; font-size: 2.25rem; }
          .hero-sub { margin-bottom: 20px; font-size: 1rem; line-height: 1.55; }
          .hero-actions { flex-direction: column; width: 100%; gap: 10px; margin-bottom: 8px; }
          .hero-cta { width: 100%; padding-block: 13px; }
        }
      `}</style>
    </section>
  )
}
