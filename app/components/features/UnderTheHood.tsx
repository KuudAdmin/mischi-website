'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { CloudCross, Code, Cpu, EyeSlash, Microphone2, NotificationBing } from 'iconsax-react'
import { useInView } from '../useInView'

// Heights (percent) of the voice tile's waveform bars.
const BARS = [30, 62, 44, 88, 56, 34, 76, 48, 26, 64, 40, 72]

/** A bento grid where every tile shows its point instead of a symbol. */
export default function UnderTheHood() {
  // The waveform only animates while the grid is on screen.
  const [gridRef, inView] = useInView<HTMLDivElement>()

  return (
    <section id="under-the-hood" aria-labelledby="uth-heading" className="section-pad uth">
      <div className="uth-inner">
        <div className="uth-head">
          <p className="uth-eyebrow">Under the hood</p>
          <h2 id="uth-heading" className="uth-title">Small app, careful choices</h2>
        </div>

        <div ref={gridRef} className="uth-grid" data-in={inView || undefined}>
          <article className="uth-tile uth-offline">
            <h3><CloudCross size={20} color="currentColor" aria-hidden="true" />Works offline</h3>
            <p>Your pet, animations and reminders never need the internet. AI is optional and uses your own key.</p>
            <Image src="/icon-3d-new.png" alt="" width={260} height={260} className="uth-render" />
          </article>

          <article className="uth-tile uth-reminders">
            <h3><NotificationBing size={20} color="currentColor" aria-hidden="true" />Reminders</h3>
            <p>Once, daily, weekly or on any interval, delivered by your pet in a chat bubble.</p>
            <div className="uth-notif" aria-hidden="true">
              <span className="uth-notif-pet" />
              Time to drink some water.
            </div>
          </article>

          <article className="uth-tile uth-voice">
            <h3><Microphone2 size={20} color="currentColor" aria-hidden="true" />Voice mode</h3>
            <p>Talk instead of type.</p>
            <div className="uth-wave" aria-hidden="true">
              {BARS.map((h, i) => (
                <i key={i} style={{ '--h': `${h}%`, '--d': `${i * 90}ms` } as CSSProperties} />
              ))}
            </div>
          </article>

          <article className="uth-tile uth-zero">
            <h3><EyeSlash size={20} color="currentColor" aria-hidden="true" />No telemetry</h3>
            <p className="uth-big" aria-hidden="true">0</p>
            <p><span className="uth-sr">Zero </span>analytics or crash-reporting SDKs in the app.</p>
          </article>

          <article className="uth-tile uth-codex">
            <h3><Code size={20} color="currentColor" aria-hidden="true" />Codex-compatible</h3>
            <p>The same pet format as OpenAI Codex. Import a folder, a .zip, or everything in ~/.codex/pets.</p>
            <pre className="uth-code" aria-hidden="true">{`~/.codex/pets/biscuit/pet.json`}</pre>
          </article>

          <article className="uth-tile uth-native">
            <h3><Cpu size={20} color="currentColor" aria-hidden="true" />Native &amp; Universal</h3>
            <p>Built in Swift, signed and notarised by Apple.</p>
            <ul className="uth-chips">
              <li>Apple Silicon</li>
              <li>Intel</li>
              <li>macOS 13+</li>
            </ul>
          </article>
        </div>
      </div>

      <style>{`
        .uth { padding-inline: 24px; }
        .uth-inner { max-width: 1120px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
        .uth-eyebrow {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .uth-title {
          font-size: clamp(1.9rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: var(--color-text);
        }
        .uth-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          grid-template-areas:
            "offline offline reminders reminders"
            "offline offline voice zero"
            "codex codex native native";
          gap: 12px;
        }
        .uth-tile {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 168px;
          padding: 22px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface);
        }
        .uth-tile h3 {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-text);
        }
        .uth-tile h3 svg { flex: none; color: var(--sage-700); }
        .uth-tile p { font-size: 0.875rem; line-height: 1.6; color: var(--color-text-muted); }
        .uth-offline { grid-area: offline; min-height: 360px; background: linear-gradient(160deg, var(--sage-50), var(--color-surface) 65%); }
        .uth-offline p { max-width: 30ch; }
        .uth-render { position: absolute; right: -16px; bottom: -24px; width: 250px; height: auto; }
        .uth-reminders { grid-area: reminders; }
        .uth-voice { grid-area: voice; }
        .uth-zero { grid-area: zero; }
        .uth-codex { grid-area: codex; }
        .uth-native { grid-area: native; }
        .uth-notif {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: auto;
          padding: 8px 16px 8px 8px;
          border: 1px solid var(--color-border-strong);
          border-radius: 16px;
          background: var(--color-surface-raised);
          font-size: 0.875rem;
          color: var(--color-text);
          box-shadow: var(--shadow-card);
        }
        /* The pet's waving frame (row 4, first column) straight from the sprite sheet. */
        .uth-notif-pet {
          width: 36px;
          height: 39px;
          background: url(/spritesheet.webp) 0 calc(-3 * 39px) / calc(8 * 36px) calc(9 * 39px) no-repeat;
          image-rendering: pixelated;
        }
        .uth-wave { display: flex; align-items: center; gap: 4px; height: 44px; margin-top: auto; }
        .uth-wave i {
          display: block;
          width: 4px;
          height: var(--h);
          border-radius: 3px;
          background: var(--sage-600);
        }
        .uth-grid[data-in] .uth-wave i {
          animation: uth-wave 1.1s ease-in-out infinite alternate;
          animation-delay: var(--d);
        }
        @keyframes uth-wave {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
        .uth-big {
          margin-top: auto;
          font-family: var(--font-display);
          font-size: 3.5rem !important;
          font-weight: 700;
          line-height: 1 !important;
          letter-spacing: -0.04em;
          color: var(--sage-700) !important;
        }
        .uth-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
        .uth-code {
          margin: auto 0 0;
          padding: 12px 14px;
          overflow-x: auto;
          border-radius: 10px;
          background: var(--ink-surface);
          font-family: var(--font-mono);
          font-size: 0.78rem;
          color: #CFE3D8;
          white-space: pre;
        }
        .uth-chips { margin: auto 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 6px; }
        .uth-chips li {
          padding: 3px 10px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface-raised);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--color-text);
        }
        @media (max-width: 900px) {
          .uth-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-template-areas: "offline offline" "reminders reminders" "voice zero" "codex codex" "native native";
          }
          .uth-offline { min-height: 300px; }
        }
        @media (max-width: 520px) {
          .uth-grid {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas: "offline" "reminders" "voice" "zero" "codex" "native";
          }
          .uth-render { width: 190px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .uth-grid[data-in] .uth-wave i { animation: none; }
        }
      `}</style>
    </section>
  )
}
