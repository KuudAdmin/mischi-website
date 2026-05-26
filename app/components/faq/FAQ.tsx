'use client'

import { useState } from 'react'

const QUESTIONS = [
  {
    q: 'Does Mischi require Codex or any cloud service?',
    a: 'No. Mischi runs entirely offline. There are no accounts, no server calls, and no cloud services of any kind. Your pets and data stay on your machine.',
  },
  {
    q: 'Is Apple Silicon supported?',
    a: 'Yes — Mischi ships as a Universal Binary, running natively on M-series and Intel Macs. Performance is great on both.',
  },
  {
    q: 'Where are my pets stored?',
    a: 'Pets are stored in ~/Library/Application Support/Mischi/Pets/. Each pet is a self-contained folder with a pet.json and atlas image. Back them up or share them freely.',
  },
  {
    q: 'Can I import my existing Codex pets?',
    a: 'Yes. Codex pets use a compatible format. Drag the pet folder into Mischi and it should work out of the box. The pet.json schema is fully documented for manual adjustments.',
  },
  {
    q: 'How do I create a custom pet?',
    a: 'You need a spritesheet (PNG or WebP, 192×208px per frame) and a pet.json describing your animations. The creator docs cover the full format. A visual editor is planned for v2.',
  },
  {
    q: 'Will there be a Mac App Store version?',
    a: 'Possibly in a future release. The transparent window and always-on-top behavior require sandbox entitlements. The direct download and Homebrew install will always be available.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="section-pad"
      style={{ paddingInline: '24px', borderTop: '1px solid var(--color-border)' }}
    >
      <div style={{ maxWidth: '660px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p style={{ fontSize: '0.71875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-accent)', marginBottom: '12px' }}>
            FAQ
          </p>
          <h2
            id="faq-heading"
            style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--color-text)' }}
          >
            Questions & answers
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {QUESTIONS.map((item, i) => (
            <FAQItem
              key={i}
              question={item.q}
              answer={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQItem({
  question, answer, isOpen, onToggle,
}: {
  question: string; answer: string; isOpen: boolean; onToggle: () => void
}) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isOpen ? 'oklch(74% 0.16 78 / 0.2)' : 'var(--color-border)'}`,
        background: isOpen ? 'oklch(74% 0.16 78 / 0.04)' : 'oklch(100% 0 0 / 0.02)',
        overflow: 'hidden',
        transition: 'border-color var(--dur-normal), background var(--dur-normal)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: '16px', width: '100%', padding: '16px 20px',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.4 }}>
          {question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '22px', height: '22px', borderRadius: '50%',
            background: isOpen ? 'var(--color-accent-dim)' : 'oklch(100% 0 0 / 0.05)',
            border: `1px solid ${isOpen ? 'oklch(74% 0.16 78 / 0.25)' : 'var(--color-border)'}`,
            transition: 'transform var(--dur-normal) var(--ease-expo), background var(--dur-normal)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            color: isOpen ? 'var(--color-accent)' : 'var(--color-text-muted)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </span>
      </button>

      {isOpen && (
        <div style={{ padding: '0 20px 18px' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            {answer}
          </p>
        </div>
      )}
    </div>
  )
}
