'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ArrowRight2, Coffee, DocumentDownload } from 'iconsax-react'
import { RELEASE } from '@/lib/release'

/** The closing band, in the same warm wallpaper as the hero's desktop. */
export default function Download() {
  const [showChecksum, setShowChecksum] = useState(false)

  return (
    <section id="download" aria-labelledby="download-heading" className="section-pad dl">
      {/* Links to the pre-launch #waitlist anchor still land here. */}
      <span id="waitlist" aria-hidden="true" />

      <div className="dl-band">
        <div className="dl-copy">
          <p className="dl-eyebrow">Download · free {RELEASE.channel.toLowerCase()}</p>
          <h2 id="download-heading" className="dl-title">Bring a companion home</h2>
          <p className="dl-sub">Signed and notarised by Apple, so it installs like any other Mac app.</p>

          <div className="dl-actions">
            <a href={RELEASE.dmgUrl} download className="dl-btn">
              <DocumentDownload size={18} variant="Bold" color="currentColor" aria-hidden="true" />
              Download for Mac
            </a>
            <span className="dl-meta">v{RELEASE.version} · {RELEASE.size} · macOS 13+ · Universal</span>
          </div>

          <ol className="dl-steps">
            <li><b>1</b>Open the DMG</li>
            <li><b>2</b>Drag Mischi to Applications</li>
            <li><b>3</b>Open it and say hello</li>
          </ol>

          <div className="dl-foot">
            <a href="https://www.buymeacoffee.com/ajjuism" target="_blank" rel="noopener noreferrer" className="dl-coffee">
              <Coffee size={16} color="currentColor" aria-hidden="true" />
              Enjoying Mischi? Buy me a coffee
            </a>
            <button
              type="button"
              className="dl-verify"
              aria-expanded={showChecksum}
              aria-controls="dl-checksum"
              onClick={() => setShowChecksum(!showChecksum)}
            >
              <ArrowRight2 size={12} color="currentColor" aria-hidden="true" />
              Verify the download (SHA-256)
            </button>
          </div>
          {/* Its own row under the links, so opening it never moves them. */}
          <code id="dl-checksum" className="dl-checksum" hidden={!showChecksum}>
            {RELEASE.sha256}
          </code>
        </div>

        <div className="dl-art" aria-hidden="true">
          <Image src="/icon-3d-new.png" alt="" width={320} height={320} className="dl-render" />
        </div>
      </div>

      <style>{`
        .dl { position: relative; padding-inline: 24px; }
        .dl-band {
          position: relative;
          max-width: 1120px;
          margin: 0 auto;
          overflow: hidden;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
          gap: 32px;
          align-items: center;
          padding: clamp(32px, 5vw, 64px);
          border-radius: 28px;
          color: var(--desk-ink);
          background:
            radial-gradient(90% 120% at 100% 0%, var(--desk-a) 0%, transparent 55%),
            radial-gradient(80% 100% at 0% 100%, var(--desk-c) 0%, transparent 60%),
            linear-gradient(135deg, var(--desk-b), #B84A4A 55%, var(--desk-c));
          box-shadow: 0 30px 60px -40px rgba(90, 40, 30, 0.6);
        }
        .dl-eyebrow {
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 248, 240, 0.85);
        }
        .dl-title {
          margin: 10px 0 12px;
          font-size: clamp(2rem, 1.3rem + 2.2vw, 3rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--desk-ink);
        }
        .dl-sub { max-width: 42ch; font-size: 1.0625rem; line-height: 1.6; color: rgba(255, 248, 240, 0.9); }
        .dl-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px; margin-top: 28px; }
        .dl-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 26px;
          border-radius: 9999px;
          background: var(--desk-ink);
          font-size: 1rem;
          font-weight: 600;
          color: #7A2F2A;
          text-decoration: none;
          box-shadow: 0 10px 24px -12px rgba(60, 20, 15, 0.55);
          transition: transform var(--dur-fast);
        }
        .dl-btn:hover { transform: translateY(-2px); }
        .dl-btn:focus-visible,
        .dl-coffee:focus-visible { outline: 2px solid var(--desk-ink); outline-offset: 3px; }
        .dl-meta { font-family: var(--font-mono); font-size: 0.8125rem; color: rgba(255, 248, 240, 0.85); }
        .dl-steps {
          margin: 26px 0 0;
          padding: 18px 0 0;
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 10px 28px;
          border-top: 1px solid rgba(255, 248, 240, 0.25);
          font-size: 0.9375rem;
          color: rgba(255, 248, 240, 0.95);
        }
        .dl-steps b { margin-right: 8px; font-family: var(--font-mono); font-weight: 500; opacity: 0.7; }
        .dl-foot { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 24px; margin-top: 18px; font-size: 0.8125rem; }
        .dl-coffee {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--desk-ink);
          text-decoration: none;
          border-bottom: 1px solid rgba(255, 248, 240, 0.4);
          transition: border-color var(--dur-fast);
        }
        .dl-coffee:hover { border-bottom-color: var(--desk-ink); }
        .dl-verify {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          border: 0;
          background: none;
          font: inherit;
          color: rgba(255, 248, 240, 0.85);
          cursor: pointer;
          transition: color var(--dur-fast);
        }
        .dl-verify:hover { color: var(--desk-ink); }
        .dl-verify svg { transition: transform var(--dur-fast); }
        .dl-verify[aria-expanded='true'] svg { transform: rotate(90deg); }
        .dl-verify:focus-visible { outline: 2px solid var(--desk-ink); outline-offset: 3px; border-radius: 4px; }
        .dl-checksum {
          display: block;
          width: fit-content;
          max-width: 100%;
          margin-top: 12px;
          padding: 6px 10px;
          border-radius: 8px;
          background: rgba(40, 12, 10, 0.22);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--desk-ink);
          overflow-wrap: anywhere;
        }
        .dl-art { display: flex; justify-content: center; }
        .dl-render { width: 100%; max-width: 320px; height: auto; filter: drop-shadow(0 24px 30px rgba(60, 20, 15, 0.35)); }
        /* The cat rises into place as the band scrolls up, where the browser
           supports scroll-linked animation. Elsewhere it simply sits there. */
        @supports (animation-timeline: view()) {
          @media (prefers-reduced-motion: no-preference) {
            .dl-render {
              animation: dl-rise linear both;
              animation-timeline: view();
              animation-range: entry 0% cover 45%;
            }
          }
        }
        @keyframes dl-rise {
          from { transform: translateY(56px) rotate(-6deg) scale(0.92); }
          to   { transform: none; }
        }
        @media (max-width: 820px) {
          .dl-band { grid-template-columns: minmax(0, 1fr); }
          .dl-art { order: -1; justify-content: flex-start; }
          .dl-render { max-width: 170px; }
        }
      `}</style>
    </section>
  )
}
