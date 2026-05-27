'use client'

import Image from 'next/image'

const STEPS = [
  {
    number: '01',
    title: 'Import your pet',
    body: 'Drop in a folder or .zip containing your spritesheet and pet.json. Any existing Codex pet works out of the box.',
    icon: '/feature-1.webp',
    iconAlt: 'Pet file icon',
  },
  {
    number: '02',
    title: 'Pet appears on desktop',
    body: 'Mischi renders your pet in a transparent, always-on-top window — right on your screen, without blocking your work.',
    icon: '/feature-2.webp',
    iconAlt: '3D pet icon',
  },
  {
    number: '03',
    title: 'Customize & interact',
    body: 'Set behavior modes, tweak animation speed, pick what triggers reactions. Your pet adapts to your workflow.',
    icon: '/feature-3.webp',
    iconAlt: 'Settings icon',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="section-pad"
      style={{
        paddingInline: '24px',
        borderTop: '1px solid var(--color-border)',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{
            fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px',
          }}>
            How it works
          </p>
          <h2
            id="how-it-works-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)' }}
          >
            Up and running in minutes
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ number, title, body, icon, iconAlt }: typeof STEPS[number]) {
  return (
    <div
      style={{
        padding: '32px 28px',
        borderRadius: 'var(--radius-lg)',
        background: 'oklch(100% 0 0 / 0.025)',
        border: '1px solid var(--color-border)',
        transition: 'border-color var(--dur-normal), background var(--dur-normal)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(81, 139, 112, 0.25)'
        el.style.background = 'oklch(100% 0 0 / 0.04)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--color-border)'
        el.style.background = 'oklch(100% 0 0 / 0.025)'
      }}
    >
      <span style={{
        display: 'block', fontSize: '0.6875rem', fontWeight: 700,
        letterSpacing: '0.1em', color: 'var(--color-accent)',
        marginBottom: '20px', fontFamily: 'var(--font-geist-mono)',
      }}>
        {number}
      </span>
      <Image
        src={icon}
        alt={iconAlt}
        width={80}
        height={100}
        style={{ imageRendering: 'pixelated', marginBottom: '20px', display: 'block' }}
      />
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)', marginBottom: '10px', letterSpacing: '-0.01em' }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.65 }}>
        {body}
      </p>
    </div>
  )
}
