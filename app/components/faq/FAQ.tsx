'use client'

import { useState } from 'react'

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Is Mischi free?',
    a: 'Yes. Mischi is free to download and use, with no accounts and no subscriptions. If you turn on the AI features with your own Groq API key, Groq’s pricing applies to that usage, and Groq has a free tier.',
  },
  {
    q: 'Mischi is in beta. What does that mean?',
    a: 'Mischi works, and we use it every day, but it’s young. Expect frequent updates and the occasional rough edge. If something breaks, the Report it button in Preferences → About opens our contact page with your version already filled in.',
  },
  {
    q: 'How do I install it?',
    a: 'Download the DMG, open it, and drag Mischi into your Applications folder. It’s signed and notarised by Apple, so it opens without warnings. Mischi lives in your menu bar rather than the Dock. The docs have the full walkthrough.',
  },
  {
    q: 'Does Mischi need internet or a cloud account?',
    a: 'No account, ever. Your pet, animations, reminders and settings all work offline. The only network traffic is optional: if you add a Groq API key, chat, voice and generated chatter go directly from your Mac to Groq.',
  },
  {
    q: 'What Macs does it run on?',
    a: 'Mischi is a Universal app for macOS 13 (Ventura) and later. It runs natively on Apple Silicon (M-series) and on Intel Macs.',
  },
  {
    q: 'How does the AI chat work?',
    a: 'Bring your own Groq key: paste it in Preferences → Advanced, pick a model, and hit Test. Then press ⌘K, or ⌘-double-click your pet, to ask Mischi anything. It can set reminders, take screenshots, read your clipboard, save notes, and open apps or websites. Your key is kept in the macOS Keychain.',
  },
  {
    q: 'Can I use my Codex pets?',
    a: 'Yes. Mischi uses the same pet format as OpenAI Codex. Click Scan Codex in Preferences → Pet and any pets in ~/.codex/pets are added to your library. The originals are never modified.',
  },
  {
    q: 'Can I make my own pet?',
    a: 'Yes. A pet is a folder with a pet.json and a 1536×1872 spritesheet: an 8×9 grid of 192×208 frames. Draw one yourself, or have Codex hatch one from a description or a photo. The creator guide in the docs walks through both.',
  },
  {
    q: 'Where are my pets and settings stored?',
    a: 'On your Mac. Pets live in ~/Library/Application Support/mischi/Pets, settings in Mischi’s macOS preferences, and your Groq key in the Keychain. Each pet is a self-contained folder you can copy, back up or share. The docs explain how to reset everything.',
  },
  {
    q: 'Is it available on Windows, Linux, or iOS?',
    a: 'Not today. Mischi relies on macOS-specific window behavior: transparent always-on-top overlays that work across Spaces and full-screen apps. A Windows port is something we’re exploring. iOS isn’t on the roadmap, since the sandbox model doesn’t allow desktop pets.',
  },
  {
    q: 'Does Mischi collect any data about me?',
    a: 'Not from the app: it has no analytics, crash reporting or usage telemetry, and it never phones home. This website uses cookieless, anonymous analytics to count things like downloads, and we only get your email if you subscribe to the newsletter or write to us. See the Privacy Policy for the full picture.',
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
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <p
            style={{
              fontSize: '0.71875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '12px',
            }}
          >
            FAQ
          </p>
          <h2
            id="faq-heading"
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}
          >
            Questions, answered
          </h2>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.6,
            }}
          >
            Everything you might want to know before installing.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {QUESTIONS.map((item, i) => (
            <FAQItem
              key={item.q}
              question={item.q}
              answer={item.a}
              isOpen={open === i}
              onToggle={() => setOpen(open === i ? null : i)}
            />
          ))}
        </div>

        {/* Still-have-questions footer */}
        <div
          style={{
            marginTop: '40px',
            padding: '24px 28px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ flex: '1 1 auto', minWidth: 0 }}>
            <p
              style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginBottom: '4px',
              }}
            >
              Still have a question?
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Send us a note. We read every one.
            </p>
          </div>
          <a
            href="/contact"
            style={{
              display: 'inline-flex',
              flexShrink: 0,
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '9999px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border-strong)',
              color: 'var(--color-text)',
              fontWeight: 500,
              fontSize: '0.8125rem',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background var(--dur-fast), transform var(--dur-fast)',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--color-surface-sunken)'
              el.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.background = 'var(--color-surface)'
              el.style.transform = 'translateY(0)'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            Contact us
          </a>
        </div>
      </div>
    </section>
  )
}

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        border: `1px solid ${isOpen ? 'rgba(81, 139, 112, 0.15)' : 'var(--color-border)'}`,
        background: isOpen ? 'rgba(81, 139, 112, 0.03)' : 'var(--color-surface)',
        overflow: 'hidden',
        transition:
          'border-color var(--dur-normal), background var(--dur-normal)',
      }}
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          width: '100%',
          padding: '18px 20px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <span
          style={{
            fontSize: '0.9375rem',
            fontWeight: 500,
            color: 'var(--color-text)',
            lineHeight: 1.4,
          }}
        >
          {question}
        </span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: isOpen ? 'var(--color-accent-dim)' : 'var(--color-surface-sunken)',
            border: `1px solid ${isOpen ? 'rgba(81, 139, 112, 0.3)' : 'var(--color-border)'}`,
            transition:
              'transform var(--dur-normal) var(--ease-expo), background var(--dur-normal), border-color var(--dur-normal)',
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
            color: isOpen ? 'var(--color-accent)' : 'var(--color-text-muted)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      {/* Smooth height transition using the grid-rows 0fr→1fr trick */}
      <div
        className="faq-answer"
        data-open={isOpen}
        style={{
          display: 'grid',
          gridTemplateRows: isOpen ? '1fr' : '0fr',
          transition: 'grid-template-rows var(--dur-normal) var(--ease-expo)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <p
            style={{
              padding: '0 20px 18px',
              fontSize: '0.875rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}
