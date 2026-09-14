'use client'

import { CloudCross, Command, Cpu, EyeSlash, Gift, MagicStar, Microphone2, NotificationBing, Pet, ShieldTick } from 'iconsax-react'

// Only things that are true of the shipping app; no invented numbers.
const FACTS = [
  { Icon: ShieldTick, text: 'Signed & notarised by Apple' },
  { Icon: Pet, text: 'Works with Codex pets' },
  { Icon: EyeSlash, text: 'No account, no tracking' },
  { Icon: Cpu, text: 'Apple Silicon & Intel' },
  { Icon: Gift, text: 'Free to use' },
  { Icon: CloudCross, text: 'Works offline' },
  { Icon: Command, text: 'Press ⌘K to ask anything' },
  { Icon: NotificationBing, text: 'Reminders from your pet' },
  { Icon: Microphone2, text: 'Voice mode' },
  { Icon: MagicStar, text: 'Bring your own Groq key' },
]

function FactList({ copy }: { copy?: boolean }) {
  return (
    <ul className="trust-list" aria-hidden={copy || undefined}>
      {FACTS.map(({ Icon, text }) => (
        <li key={text} className="trust-item">
          <Icon size={20} color="currentColor" aria-hidden="true" />
          {text}
        </li>
      ))}
    </ul>
  )
}

/** A slow marquee of facts. The list is rendered twice so the loop is seamless. */
export default function TrustBand() {
  return (
    <section aria-label="Mischi at a glance" className="trust">
      <div className="trust-viewport">
        <div className="trust-track">
          <FactList />
          <FactList copy />
        </div>
      </div>

      <style>{`
        .trust {
          padding-block: 26px;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .trust-viewport {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
        }
        .trust-track {
          display: flex;
          width: max-content;
          animation: trust-scroll 70s linear infinite;
        }
        .trust:hover .trust-track { animation-play-state: paused; }
        .trust-list { display: flex; margin: 0; padding: 0; list-style: none; }
        /* Plain text with an icon; a small sage star sits between facts. Each
           item carries its own trailing spacing, so half the track is exactly
           one copy and the loop is seamless. */
        .trust-item {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-display);
          font-size: 1.0625rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: var(--color-text-muted);
          white-space: nowrap;
        }
        .trust-item svg { flex: none; color: var(--sage-600); }
        .trust-item::after {
          content: '✦';
          margin-inline: 28px;
          font-size: 0.625rem;
          color: var(--sage-300);
        }
        @keyframes trust-scroll {
          to { transform: translateX(-50%); }
        }
        @media (max-width: 600px) {
          .trust { padding-block: 20px; }
          .trust-item { font-size: 0.9375rem; }
          .trust-item::after { margin-inline: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .trust { padding-inline: 24px; }
          .trust-viewport { -webkit-mask-image: none; mask-image: none; }
          .trust-track { width: auto; animation: none; justify-content: center; }
          .trust-list { flex-wrap: wrap; justify-content: center; row-gap: 12px; }
          .trust-list[aria-hidden] { display: none; }
        }
      `}</style>
    </section>
  )
}
