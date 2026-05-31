'use client'

import Image from 'next/image'

// `soon: true` marks something not ready until launch — rendered greyed-out and
// non-clickable with a "Soon" tag, instead of a dead link. A group can be marked
// soon (one tag on the heading) or individual items can be.
type FooterLink = { label: string; href: string; soon?: boolean }
type FooterGroup = { group: string; soon?: boolean; items: FooterLink[] }

const LINKS: FooterGroup[] = [
  {
    group: 'Product',
    items: [
      { label: 'Join waitlist', href: '#waitlist' },
      { label: 'Features', href: '#features' },
      { label: 'Changelog', href: '#', soon: true },
      { label: 'Roadmap', href: '#', soon: true },
    ],
  },
  {
    group: 'Creators',
    soon: true,
    items: [
      { label: 'Creator Docs', href: '#' },
      { label: 'pet.json schema', href: '#' },
      { label: 'Spritesheet guide', href: '#' },
      { label: 'Example pets', href: '#' },
    ],
  },
  {
    group: 'Support',
    items: [
      { label: 'FAQ', href: '#faq' },
      { label: 'GitHub', href: 'https://github.com/ajjuism' },
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

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-dim)' }}>
            © 2026 Mischi. A tiny desktop companion with an opinion.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <SocialLink href="https://github.com/ajjuism" label="Mischi on GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </SocialLink>
            <SocialLink href="https://x.com/ajjuism" label="Mischi on X">
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
