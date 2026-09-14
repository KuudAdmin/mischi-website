'use client'

import type { CSSProperties } from 'react'
import Link from 'next/link'
import { ArrowRight, Book1 } from 'iconsax-react'
import { useInView } from '../useInView'

// Rows of the pet's real sprite sheet, with their frame counts and a pace
// that matches how the app plays them.
const ROWS = [
  { name: 'idle', row: 0, frames: 6, ms: 900 },
  { name: 'waving', row: 3, frames: 4, ms: 520 },
  // Not jumping (its frames touch the top of their cells and look cropped) or
  // waiting (almost identical to idle in this sheet).
  { name: 'dancing', row: 7, frames: 6, ms: 600 },
]

const CODEX_PETS_GUIDE = 'https://learn.chatgpt.com/docs/pets'

export default function CreatorSection() {
  // The live frames only play while the sheet is on screen.
  const [sheetRef, inView] = useInView<HTMLDivElement>()

  return (
    <section id="creators" aria-labelledby="creators-heading" className="cr">
      <div className="cr-inner">
        <div className="cr-copy">
          <p className="cr-eyebrow">For creators</p>
          <h2 id="creators-heading" className="cr-title">Draw a pet, or let Codex hatch one</h2>
          <p className="cr-body">
            A pet is just a sprite sheet and a small pet.json, the same format OpenAI Codex uses. Draw one frame by
            frame, or describe it to Codex and bring the result into Mischi with Scan Codex.
          </p>
          <div className="cr-actions">
            <Link href="/docs#create-pets" className="cr-cta">
              <Book1 size={18} variant="Bold" color="currentColor" aria-hidden="true" />
              Read the creator guide
            </Link>
            <a href={CODEX_PETS_GUIDE} target="_blank" rel="noopener noreferrer" className="cr-link">
              Codex pets guide
              <ArrowRight size={16} color="currentColor" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div
          ref={sheetRef}
          className="cr-sheet"
          data-in={inView || undefined}
          role="img"
          aria-label="A pet sprite sheet: rows of pixel-art frames for idle, waving and dancing, each playing as an animation"
        >
          {ROWS.map((r) => (
            <div key={r.name} className="cr-row" style={{ '--row': r.row, '--frames': r.frames } as CSSProperties}>
              <span className="cr-label">{r.name}</span>
              <span
                className="cr-live"
                style={{ animationTimingFunction: `steps(${r.frames})`, animationDuration: `${r.ms}ms` }}
              />
              <span className="cr-strip" />
            </div>
          ))}
          <pre className="cr-json">{`{ "id": "mochi", "spritesheetPath": "spritesheet.webp" }`}</pre>
        </div>
      </div>

      <style>{`
        .cr {
          padding: clamp(4.5rem, 3rem + 5vw, 7.5rem) 24px;
          background: var(--ink-surface);
          color: var(--ink-text);
        }
        .cr-inner {
          max-width: 1120px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
          gap: 64px;
          align-items: center;
        }
        .cr-eyebrow {
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink-accent);
        }
        .cr-title {
          margin: 12px 0 16px;
          font-size: clamp(1.9rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: var(--ink-text);
        }
        .cr-body { max-width: 46ch; font-size: 1rem; line-height: 1.7; color: var(--ink-muted); }
        .cr-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 16px 22px; margin-top: 28px; }
        .cr-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 22px;
          border-radius: 9999px;
          background: var(--ink-accent);
          font-size: 0.9375rem;
          font-weight: 600;
          color: #13201A;
          text-decoration: none;
          transition: transform var(--dur-fast), filter var(--dur-fast);
        }
        .cr-cta:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .cr-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--ink-text);
          text-decoration: none;
          transition: gap var(--dur-fast), color var(--dur-fast);
        }
        .cr-link:hover { gap: 10px; color: var(--ink-accent); }
        .cr-cta:focus-visible,
        .cr-link:focus-visible { outline: 2px solid var(--ink-accent); outline-offset: 3px; }

        /* One cell is 192x208 in the sheet; --cell sets its display width. */
        .cr-sheet {
          --cell: 64px;
          --cell-h: calc(var(--cell) * 208 / 192);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 22px;
          overflow-x: auto;
          border: 1px solid var(--ink-line);
          border-radius: 18px;
          background-color: #232925;
          background-image: conic-gradient(#2A302C 25%, #232925 0 50%, #2A302C 0 75%, #232925 0);
          background-size: 18px 18px;
        }
        .cr-row { display: grid; grid-template-columns: 62px var(--cell) auto; align-items: center; gap: 14px; }
        .cr-label { font-family: var(--font-mono); font-size: 0.75rem; color: var(--ink-accent); }
        .cr-live,
        .cr-strip { display: block; height: var(--cell-h); image-rendering: pixelated; }
        .cr-live {
          width: var(--cell);
          border-radius: 10px;
          background: url(/spritesheet.webp) 0 calc(var(--row) * var(--cell-h) * -1) / calc(var(--cell) * 8) calc(var(--cell-h) * 9) no-repeat,
            rgba(143, 199, 166, 0.1);
          box-shadow: inset 0 0 0 1px rgba(143, 199, 166, 0.35);
          animation-name: cr-play;
          animation-iteration-count: infinite;
          animation-play-state: paused;
        }
        .cr-sheet[data-in] .cr-live { animation-play-state: running; }
        @keyframes cr-play {
          to { background-position-x: calc(var(--cell) * var(--frames) * -1), 0; }
        }
        /* The same row laid out frame by frame, over a faint cell grid. */
        .cr-strip {
          width: calc(var(--cell) * var(--frames));
          background:
            url(/spritesheet.webp) 0 calc(var(--row) * var(--cell-h) * -1) / calc(var(--cell) * 8) calc(var(--cell-h) * 9) no-repeat,
            repeating-linear-gradient(to right, transparent 0 calc(var(--cell) - 1px), rgba(143, 199, 166, 0.22) calc(var(--cell) - 1px) var(--cell));
          box-shadow: inset 0 0 0 1px var(--ink-line);
        }
        .cr-json {
          align-self: flex-start;
          max-width: 100%;
          margin: 6px 0 0;
          padding: 10px 14px;
          overflow-x: auto;
          border: 1px solid var(--ink-line);
          border-radius: 10px;
          background: #161B18;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: #CFE3D8;
          white-space: pre;
        }
        @media (max-width: 900px) {
          .cr-inner { grid-template-columns: minmax(0, 1fr); gap: 40px; }
        }
        /* Phones: the label sits above its frames and the code wraps, so
           nothing in the sheet ever needs a sideways scrollbar. */
        @media (max-width: 520px) {
          .cr-sheet { --cell: 32px; gap: 14px; padding: 16px; overflow-x: visible; }
          /* Label on its own line; the live frame leads its strip underneath,
             left-aligned like desktop, so the two always read together. */
          .cr-row {
            grid-template-columns: var(--cell) auto;
            grid-template-areas: "label label" "live strip";
            justify-content: start;
            gap: 6px 8px;
          }
          .cr-label { grid-area: label; }
          .cr-live { grid-area: live; }
          .cr-strip { grid-area: strip; }
          .cr-json { overflow-x: visible; white-space: pre-wrap; overflow-wrap: anywhere; }
        }
        @media (prefers-reduced-motion: reduce) {
          .cr-sheet[data-in] .cr-live { animation-play-state: paused; }
        }
      `}</style>
    </section>
  )
}
