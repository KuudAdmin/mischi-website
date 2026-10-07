'use client'

import Image from 'next/image'
import { Coffee } from 'iconsax-react'
import { RELEASE } from '@/lib/release'
import { ANALYTICS_CONFIGURED } from '@/lib/privacy-preferences'
import { PrivacySettingsButton } from '../legal/PrivacyControls'
import styles from './footer.module.css'

// `soon: true` marks something not ready until launch — rendered greyed-out and
// non-clickable with a "Soon" tag, instead of a dead link. A group can be marked
// soon (one tag on the heading) or individual items can be.
type FooterLink = { label: string; href: string; soon?: boolean }
type FooterGroup = { group: string; soon?: boolean; items: FooterLink[] }

const LINKS: FooterGroup[] = [
  {
    group: 'Product',
    items: [
      { label: 'Download', href: '/#download' },
      { label: 'Features', href: '/#features' },
      { label: 'Pets', href: '/pets' },
      { label: 'Newsletter', href: '/#newsletter' },
      { label: 'Changelog', href: '#', soon: true },
    ],
  },
  {
    group: 'Docs',
    items: [
      { label: 'Getting started', href: '/docs#install' },
      { label: 'Ask Mischi & AI', href: '/docs#ask' },
      { label: 'Create a pet', href: '/docs#create-pets' },
      { label: 'Troubleshooting', href: '/docs#troubleshooting' },
    ],
  },
  {
    group: 'Support',
    items: [
      { label: 'FAQ', href: '/#faq' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', paddingBlock: '64px 40px', paddingInline: '24px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '40px',
            marginBottom: '56px',
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Image
                src="/mischi-icon-02.svg"
                alt="Mischi icon"
                width={28}
                height={28}
                style={{ scale: '1.2' }}
              />
              <Image
                src="/mischi-typo-dark.svg"
                alt="Mischi"
                width={72}
                height={20}
                style={{ height: '20px', width: 'auto' }}
              />
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: '180px' }}>
              Animated desktop pets for macOS. Alive, interactive, offline-first.
            </p>
            <p style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--color-text-dim)', fontFamily: 'var(--font-geist-mono)' }}>
              v{RELEASE.version} · {RELEASE.channel}
            </p>
            {/* A small, warm button rather than another plain link, in the clay
                tones reserved for supporting the maker. */}
            <a
              href="https://www.buymeacoffee.com/ajjuism"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-coffee footer-coffee"
            >
              <Coffee size={16} color="currentColor" aria-hidden="true" />
              Buy me a coffee
            </a>
            <style>{`
              .footer-coffee {
                margin-top: 16px;
                padding: 7px 14px 7px 11px;
                border-radius: 9999px;
                font-weight: 500;
                text-decoration: none;
                white-space: nowrap;
              }
              .footer-coffee svg { flex: none; transition: transform var(--dur-fast) var(--ease-spring); }
              .footer-coffee:hover svg { transform: rotate(-10deg) translateY(-1px); }
              .footer-coffee:focus-visible { outline: 2px solid var(--clay); outline-offset: 2px; }
            `}</style>
          </div>

          {LINKS.map((group) => (
            <div key={group.group}>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                {group.group}
                {group.soon && <SoonTag />}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {group.items.map((item) => {
                  const soon = group.soon || item.soon
                  return (
                    <li key={item.label}>
                      {soon ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '0.875rem', color: 'var(--color-text-dim)', opacity: 0.5, cursor: 'default' }}>
                          {item.label}
                          {item.soon && !group.soon && <SoonTag />}
                        </span>
                      ) : (
                        <a
                          href={item.href}
                          target={item.href.startsWith('http') ? '_blank' : undefined}
                          rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          style={{ fontSize: '0.875rem', color: 'var(--color-text-dim)', textDecoration: 'none', transition: 'color var(--dur-fast)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)' }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-dim)' }}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © 2026 Mischi. A tiny desktop companion with an opinion.
            {ANALYTICS_CONFIGURED && <>{' '}<span className={styles.privacy}><span aria-hidden="true">·</span>{' '}<PrivacySettingsButton /></span></>}
          </p>
          <div style={{ display: 'flex', flex: 'none', gap: '16px' }}>
            <SocialLink href="https://x.com/ajjuism" label="Follow Mischi’s maker on X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </SocialLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SoonTag() {
  return (
    <span
      style={{
        fontSize: '0.5625rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--color-text-muted)',
        background: 'var(--color-surface-sunken)',
        border: '1px solid var(--color-border)',
        borderRadius: '999px',
        padding: '1px 6px',
        lineHeight: 1.5,
        whiteSpace: 'nowrap',
      }}
    >
      Soon
    </span>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: 'var(--color-text-dim)', transition: 'color var(--dur-fast)', display: 'flex' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-dim)' }}
    >
      {children}
    </a>
  )
}
