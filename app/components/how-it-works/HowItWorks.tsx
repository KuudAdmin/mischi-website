'use client'

import Image from 'next/image'

const STEPS = [
  {
    number: '01',
    title: 'Download & install',
    body: 'Grab the DMG and drag Mischi into Applications. It’s signed and notarised by Apple, so it opens like any other app.',
    icon: '/feature-1.webp',
    iconAlt: 'Pet file icon',
  },
  {
    number: '02',
    title: 'Meet your pet',
    body: 'A pet is already waiting on your desktop, in a transparent window that never blocks your work. Drag it anywhere you like.',
    icon: '/feature-2.webp',
    iconAlt: '3D pet icon',
  },
  {
    number: '03',
    title: 'Make it yours',
    body: 'Import Codex pets or your own, name animations, set reminders, and add a Groq key to chat with ⌘K.',
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
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        transition: 'border-color var(--dur-normal), background var(--dur-normal)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'rgba(81, 139, 112, 0.35)'
        el.style.background = 'var(--color-surface-raised)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--color-border)'
        el.style.background = 'var(--color-surface)'
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
