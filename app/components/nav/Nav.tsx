'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const NAV_LINKS = ['Features', 'Demo']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while drawer is open
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

  // Close on Escape + on resize to desktop
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false) }
    const onResize = () => { if (window.innerWidth > 767) setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: 'background var(--dur-normal) var(--ease-expo), border-color var(--dur-normal)',
        background: scrolled || menuOpen ? 'oklch(10% 0.01 164 / 0.85)' : 'transparent',
        backdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(160%)' : 'none',
        WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px) saturate(160%)' : 'none',
        borderBottom: scrolled || menuOpen ? '1px solid var(--color-border)' : '1px solid transparent',
      }}
    >
      <nav
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href="#"
          onClick={closeMenu}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          aria-label="Mischi — home"
        >
          <Image
            src="/mischi-icon-02.png"
            alt="Mischi icon"
            width={28}
            height={28}
            style={{ borderRadius: '6px', imageRendering: 'pixelated' }}
            priority
          />
          <Image
            src="/mischi-typo-light.svg"
            alt="Mischi"
            width={72}
            height={20}
            style={{ height: '20px', width: 'auto' }}
            priority
          />
        </a>

        {/* Desktop links */}
        <div className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'center' }}>
          {['Features', 'Demo', 'Download'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                textDecoration: 'none',
                transition: 'color var(--dur-fast)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-muted)' }}
            >
              {label}
            </a>
          ))}
        </div>

        {/* CTA + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <a
            href="#download"
            className="nav-cta-desktop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '7px 16px',
              borderRadius: '9999px',
              background: 'var(--color-accent)',
              color: 'oklch(98% 0 0)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              textDecoration: 'none',
              transition: 'opacity var(--dur-fast), transform var(--dur-fast)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '0.85'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.opacity = '1'
              el.style.transform = 'translateY(0)'
            }}
          >
            Download
          </a>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            style={{
              background: menuOpen ? 'oklch(100% 0 0 / 0.06)' : 'transparent',
              border: '1px solid',
              borderColor: menuOpen ? 'var(--color-border-strong)' : 'transparent',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              color: 'var(--color-text)',
              width: '40px',
              height: '40px',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'none',
              transition: 'background var(--dur-fast), border-color var(--dur-fast)',
            }}
            className="nav-hamburger"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {menuOpen
                ? <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                : <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile drawer — backdrop + panel */}
      {menuOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={closeMenu}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              right: 0,
              bottom: 0,
              background: 'oklch(7.5% 0.01 164 / 0.55)',
              backdropFilter: 'blur(2px)',
              WebkitBackdropFilter: 'blur(2px)',
              animation: 'nav-backdrop-in var(--dur-normal) var(--ease-expo)',
              zIndex: 90,
            }}
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            style={{
              position: 'relative',
              zIndex: 95,
              background: 'oklch(8% 0.01 164 / 0.98)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
              borderTop: '1px solid var(--color-border)',
              padding: '28px 24px 32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              animation: 'nav-drawer-in var(--dur-normal) var(--ease-expo)',
            }}
          >
            {NAV_LINKS.map((label) => (
              <a
                key={label}
                href={`#${label.toLowerCase()}`}
                onClick={closeMenu}
                className="nav-drawer-link"
                style={{
                  display: 'block',
                  width: '100%',
                  maxWidth: '320px',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  textAlign: 'center',
                  letterSpacing: '-0.01em',
                  transition: 'background var(--dur-fast), color var(--dur-fast)',
                }}
              >
                {label}
              </a>
            ))}

            <div style={{ width: '100%', maxWidth: '320px', height: '1px', background: 'var(--color-border)', margin: '14px 0 18px' }} />

            <a
              href="#download"
              onClick={closeMenu}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                width: '100%',
                maxWidth: '320px',
                padding: '14px 22px',
                borderRadius: '9999px',
                background: 'var(--color-accent)',
                color: 'oklch(98% 0 0)',
                fontWeight: 600,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                boxShadow: '0 0 24px rgba(81, 139, 112, 0.28)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M8 1.5v9M4.5 7 8 10.5 11.5 7M2 14.5h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Download for macOS
            </a>

            <p
              style={{
                marginTop: '18px',
                fontSize: '0.6875rem',
                color: 'var(--color-text-dim)',
                letterSpacing: '0.04em',
              }}
            >
              Apple Silicon · Intel · macOS 13+
            </p>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 767px) {
          .nav-hamburger { display: inline-flex !important; }
          .nav-desktop-links { display: none !important; }
          .nav-cta-desktop { display: none !important; }
        }
        .nav-drawer-link:hover,
        .nav-drawer-link:focus-visible {
          background: oklch(100% 0 0 / 0.05);
          color: var(--color-accent);
          outline: none;
        }
        .nav-drawer-link:active { background: oklch(100% 0 0 / 0.08); }
        @keyframes nav-drawer-in {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes nav-backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </header>
  )
}
