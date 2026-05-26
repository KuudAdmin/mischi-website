'use client'

const FEATURES: {
  title: string
  body: string
  icon: string
  size?: 'wide' | 'normal'
  accent?: boolean
}[] = [
  {
    title: 'Offline-first',
    body: 'Everything runs locally. No server calls, no cloud, no internet required. Your pets work at 35,000 ft.',
    icon: '⚡',
    size: 'wide',
    accent: true,
  },
  {
    title: 'Transparent rendering',
    body: 'Pets render on a transparent window layer — they live on your actual desktop, not inside a box.',
    icon: '✦',
  },
  {
    title: 'Always-on-top',
    body: 'Stays visible across all Spaces and full-screen apps without blocking anything.',
    icon: '◈',
  },
  {
    title: 'Menu bar controls',
    body: 'Pause, hide, or switch behavior modes from the macOS menu bar.',
    icon: '≡',
  },
  {
    title: 'Multiple behavior modes',
    body: 'Focus mode, idle wandering, reactive mode — your pet adapts to how you work.',
    icon: '◎',
    size: 'wide',
  },
  {
    title: 'Import any format',
    body: 'Drag in a folder, .zip, or individual files. Supports PNG spritesheets and Codex packs.',
    icon: '↓',
  },
  {
    title: 'No telemetry',
    body: 'Zero analytics, zero tracking. What runs on your Mac stays on your Mac.',
    icon: '☽',
  },
  {
    title: 'Apple Silicon native',
    body: 'Built for M-series. Runs smooth on Intel too. macOS 13+.',
    icon: '◆',
  },
]

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)' }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{
            fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px',
          }}>
            Features
          </p>
          <h2
            id="features-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)' }}
          >
            Built for your desktop
          </h2>
        </div>

        {/* Bento grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
          }}
        >
          {FEATURES.map((feat) => (
            <FeatureCard key={feat.title} {...feat} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .features-bento { grid-template-columns: 1fr !important; }
          .feat-wide { grid-column: span 1 !important; }
        }
        @media (min-width: 641px) and (max-width: 900px) {
          .features-bento { grid-template-columns: repeat(2, 1fr) !important; }
          .feat-wide { grid-column: span 2 !important; }
        }
      `}</style>
    </section>
  )
}

function FeatureCard({ title, body, icon, size, accent }: {
  title: string; body: string; icon: string; size?: 'wide' | 'normal'; accent?: boolean
}) {
  return (
    <div
      style={{
        gridColumn: size === 'wide' ? 'span 2' : 'span 1',
        padding: '28px 24px',
        borderRadius: 'var(--radius-lg)',
        background: accent
          ? 'linear-gradient(135deg, oklch(14% 0.016 78) 0%, oklch(11% 0.01 60) 100%)'
          : 'oklch(100% 0 0 / 0.025)',
        border: `1px solid ${accent ? 'oklch(74% 0.16 78 / 0.18)' : 'var(--color-border)'}`,
        transition: 'border-color var(--dur-normal), transform var(--dur-normal)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = accent ? 'oklch(74% 0.16 78 / 0.35)' : 'oklch(74% 0.16 78 / 0.2)'
        el.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = accent ? 'oklch(74% 0.16 78 / 0.18)' : 'var(--color-border)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {accent && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '160px', height: '160px',
            background: 'radial-gradient(circle, oklch(74% 0.16 78 / 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      <span
        style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: '36px', height: '36px', borderRadius: 'var(--radius-md)',
          background: accent ? 'oklch(74% 0.16 78 / 0.15)' : 'oklch(100% 0 0 / 0.05)',
          border: `1px solid ${accent ? 'oklch(74% 0.16 78 / 0.25)' : 'var(--color-border)'}`,
          fontSize: '1rem', marginBottom: '20px',
          color: accent ? 'var(--color-accent)' : 'var(--color-text-muted)',
        }}
        aria-hidden="true"
      >
        {icon}
      </span>

      <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: accent ? 'var(--color-accent)' : 'var(--color-text)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
        {body}
      </p>
    </div>
  )
}
