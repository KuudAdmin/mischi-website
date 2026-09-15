'use client'

import { useState } from 'react'
import { Add, Sms } from 'iconsax-react'

const QUESTIONS: { q: string; a: string }[] = [
  {
    q: 'Is Mischi free?',
    a: 'Yes. Mischi is free to download and use, with no accounts and no subscriptions. If you turn on the AI features with your own Groq API key, Groq’s pricing applies to that usage, and Groq has a free tier.',
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
    q: 'How does the AI chat work?',
    a: 'Bring your own Groq key: paste it in Preferences → Advanced, pick a model, and hit Test. Then press ⌘K, or ⌘-double-click your pet, to ask Mischi anything. It can set reminders, take screenshots, read your clipboard, save notes, and open apps or websites. Your key is kept in the macOS Keychain.',
  },
  {
    q: 'Is Mischi the only pet I can use?',
    a: 'No. Mischi, the cream cat, is the one pet that comes built in, but you can have as many as you like. Use Import Pet Folder… or Import Pet .zip… in the menu bar menu, click Scan Codex in Preferences to bring in pets from ~/.codex/pets, or draw your own. Switch between them anytime from Library in the menu bar menu.',
  },
  {
    q: 'Can I use my Codex pets?',
    a: 'Yes. Mischi uses the same pet format as OpenAI Codex. Click Scan Codex in Preferences → Pet and any pets in ~/.codex/pets are added to your library. The originals are never modified.',
  },
  {
    q: 'Does Mischi collect any data about me?',
    a: 'Not from the app: it has no analytics, crash reporting or usage telemetry, and it never phones home. This website uses cookieless, anonymous analytics to count things like downloads, and we only get your email if you subscribe to the newsletter or write to us. See the Privacy Policy for the full picture.',
  },
  {
    q: 'Mischi is in beta. What does that mean?',
    a: 'Mischi works, and we use it every day, but it’s young. Expect frequent updates and the occasional rough edge. If something breaks, the Report it button in Preferences → About opens our contact page with your version already filled in.',
  },
  {
    q: 'What Macs does it run on?',
    a: 'Mischi is a Universal app for macOS 13 (Ventura) and later. It runs natively on Apple Silicon (M-series) and on Intel Macs.',
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
    q: 'Why can’t I see my pet when an app is in full screen?',
    a: 'First check Window level in Preferences → Window. Desktop tucks the pet behind every window, full-screen apps included, so set it to Floating or Always on Top. Next, open the menu bar menu: if it says Show Pet, the pet is hidden, so click it. If the pet still doesn’t appear over a particular full-screen app, fill the screen without full screen instead (hold Option and click the green window button), and tell us which app on the contact page so we can look into it.',
  },
  {
    q: 'Is it available on Windows, Linux, or iOS?',
    a: 'Not today. Mischi relies on macOS-specific window behavior: transparent always-on-top overlays that work across Spaces and full-screen apps. A Windows port is something we’re exploring. iOS isn’t on the roadmap, since the sandbox model doesn’t allow desktop pets.',
  },
]

// The most-asked questions show first; the rest stay in the page (and in
// search results) behind "Show more".
const VISIBLE = 7

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)
  const hiddenCount = QUESTIONS.length - VISIBLE

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-pad faq">
      <div className="faq-inner">
        <div className="faq-side">
          <p className="faq-eyebrow">FAQ</p>
          <h2 id="faq-heading" className="faq-title">Questions, answered</h2>
          <p className="faq-lede">Everything you might want to know before installing.</p>
          <div className="faq-help">
            <p className="faq-help-title">Still have a question?</p>
            <p className="faq-help-body">Send us a note. A person reads every one.</p>
            <a href="/contact" className="faq-help-link">
              <Sms size={16} color="currentColor" aria-hidden="true" />
              Contact us
            </a>
          </div>
        </div>

        <div className="faq-list">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className="faq-item" data-open={isOpen || undefined} hidden={!showAll && i >= VISIBLE}>
                <h3 className="faq-q">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {item.q}
                    <span className="faq-toggle" aria-hidden="true">
                      <Add size={16} color="currentColor" />
                    </span>
                  </button>
                </h3>
                <div id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className="faq-a">
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
          {hiddenCount > 0 && (
            <button type="button" className="faq-more" aria-expanded={showAll} onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show fewer' : `Show ${hiddenCount} more`}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .faq { padding-inline: 24px; border-top: 1px solid var(--color-border); }
        .faq-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.4fr);
          gap: 64px;
          align-items: start;
        }
        .faq-side { position: sticky; top: 96px; }
        .faq-eyebrow {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .faq-title {
          font-size: clamp(1.9rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: var(--color-text);
          text-wrap: balance;
        }
        .faq-lede { margin-top: 12px; font-size: 1rem; line-height: 1.6; color: var(--color-text-muted); }
        .faq-help {
          margin-top: 32px;
          padding: 20px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          background: var(--color-surface);
        }
        .faq-help-title { font-size: 0.9375rem; font-weight: 600; color: var(--color-text); }
        .faq-help-body { margin: 4px 0 14px; font-size: 0.8125rem; color: var(--color-text-muted); }
        .faq-help-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 16px;
          border: 1px solid var(--color-border-strong);
          border-radius: 9999px;
          background: var(--color-surface-raised);
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text);
          text-decoration: none;
          transition: background var(--dur-fast), transform var(--dur-fast);
        }
        .faq-help-link:hover { background: var(--color-surface-sunken); transform: translateY(-1px); }
        .faq-list { display: flex; flex-direction: column; border-top: 1px solid var(--color-border); }
        .faq-item { border-bottom: 1px solid var(--color-border); }
        .faq-q { margin: 0; font: inherit; }
        .faq-q button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          width: 100%;
          padding: 20px 4px;
          border: 0;
          background: none;
          font: inherit;
          font-size: 1rem;
          font-weight: 500;
          line-height: 1.4;
          color: var(--color-text);
          text-align: left;
          cursor: pointer;
        }
        .faq-q button:hover { color: var(--sage-800); }
        .faq-q button:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 2px; border-radius: 6px; }
        .faq-toggle {
          flex: none;
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-surface-sunken);
          color: var(--color-text-muted);
          transition: transform var(--dur-normal) var(--ease-expo), background var(--dur-normal), color var(--dur-normal);
        }
        .faq-item[data-open] .faq-toggle { transform: rotate(45deg); background: var(--color-accent-dim); color: var(--color-accent); }
        .faq-a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows var(--dur-normal) var(--ease-expo); }
        .faq-item[data-open] .faq-a { grid-template-rows: 1fr; }
        .faq-a > div { overflow: hidden; }
        .faq-a p { max-width: 62ch; margin: 0; padding: 0 44px 20px 4px; font-size: 0.9375rem; line-height: 1.7; color: var(--color-text-muted); }
        .faq-more {
          align-self: flex-start;
          margin-top: 18px;
          padding: 8px 16px;
          border: 1px solid var(--color-border-strong);
          border-radius: 9999px;
          background: transparent;
          font: inherit;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text);
          cursor: pointer;
          transition: background var(--dur-fast);
        }
        .faq-more:hover { background: var(--color-surface-sunken); }
        .faq-more:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 2px; }
        @media (max-width: 860px) {
          .faq-inner { grid-template-columns: minmax(0, 1fr); gap: 32px; }
          .faq-side { position: static; }
          .faq-help { margin-top: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .faq-a, .faq-toggle { transition: none; }
        }
      `}</style>
    </section>
  )
}
