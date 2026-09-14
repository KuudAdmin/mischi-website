'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import { useInView } from '../useInView'

const STEPS = [
  {
    number: '01',
    title: 'Download & install',
    body: 'Grab the DMG and drag Mischi into Applications. It’s signed and notarised by Apple, so it opens like any other app.',
    icon: '/feature-1.webp',
    iconAlt: 'A folder holding the Mischi app',
  },
  {
    number: '02',
    title: 'Meet your pet',
    body: 'A pet is already waiting on your desktop, in a transparent window that never blocks your work. Drag it anywhere you like.',
    icon: '/feature-2.webp',
    iconAlt: 'The Mischi pet sitting in a window',
  },
  {
    number: '03',
    title: 'Make it yours',
    body: 'Import Codex pets or your own, name animations, set reminders, and add a Groq key to chat with ⌘K.',
    icon: '/feature-3.webp',
    iconAlt: 'The Mischi pet next to its settings',
  },
]

export default function HowItWorks() {
  // Draw the connecting line once, when the steps first come into view.
  const [trackRef, inView] = useInView<HTMLDivElement>({ once: true, rootMargin: '0px 0px -20% 0px' })

  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="section-pad how">
      <div className="how-inner">
        <div className="how-head">
          <p className="how-eyebrow">How it works</p>
          <h2 id="how-heading" className="how-title">Up and running in minutes</h2>
        </div>

        <div ref={trackRef} className="how-track" data-in={inView || undefined}>
          <span className="how-line" aria-hidden="true">
            <span className="how-line-fill" />
          </span>
          <ol className="how-steps">
            {STEPS.map((step, i) => (
              <li key={step.number} className="how-step" style={{ '--i': i } as CSSProperties}>
                <div className="how-art">
                  <Image src={step.icon} alt={step.iconAlt} width={150} height={140} />
                </div>
                <span className="how-num">Step {step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
        .how { padding-inline: 24px; }
        .how-inner { max-width: 1040px; margin: 0 auto; }
        .how-head { margin-bottom: 56px; text-align: center; }
        .how-eyebrow {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .how-title {
          font-size: clamp(1.9rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: var(--color-text);
        }
        .how-track { position: relative; }
        /* A grey track that's always there, with a sage fill that draws across
           when the steps scroll into view. */
        .how-line {
          position: absolute;
          top: 78px;
          left: calc(100% / 6);
          right: calc(100% / 6);
          height: 2px;
          overflow: hidden;
          border-radius: 2px;
          background: var(--color-border);
        }
        .how-line-fill {
          display: block;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, var(--sage-300), var(--sage-600));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.4s var(--ease-expo) 0.2s;
        }
        .how-track[data-in] .how-line-fill { transform: scaleX(1); }
        .how-steps {
          position: relative;
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
        }
        .how-step { display: flex; flex-direction: column; align-items: center; text-align: center; }
        .how-art {
          display: grid;
          place-items: center;
          width: 156px;
          height: 156px;
          border-radius: 50%;
          background: var(--color-bg);
        }
        .how-art img { width: 150px; height: auto; }
        .how-track[data-in] .how-art img {
          animation: how-pop 0.7s var(--ease-spring) both;
          animation-delay: calc(var(--i) * 160ms + 0.25s);
        }
        @keyframes how-pop {
          from { transform: translateY(10px) scale(0.92); }
          to   { transform: none; }
        }
        .how-num {
          margin-top: 18px;
          font-family: var(--font-mono);
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .how-step h3 {
          margin: 8px 0;
          font-size: 1.125rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-text);
        }
        .how-step p { max-width: 30ch; font-size: 0.9375rem; line-height: 1.65; color: var(--color-text-muted); }

        /* Phones: a left-rail timeline. Image on the left, text beside it, and
           a short segment from each image down to the next, so the line only
           ever runs through the image column, never through text. */
        @media (max-width: 760px) {
          .how-head { margin-bottom: 40px; }
          .how-line { display: none; }
          .how-steps { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .how-step {
            position: relative;
            display: grid;
            grid-template-columns: 88px minmax(0, 1fr);
            column-gap: 18px;
            align-items: start;
            text-align: left;
          }
          .how-art { grid-row: 1 / span 3; width: 88px; height: 88px; }
          .how-art img { width: 84px; }
          .how-num, .how-step h3, .how-step p { grid-column: 2; }
          .how-num { margin-top: 6px; }
          .how-step h3 { margin: 4px 0 6px; }
          .how-step p { max-width: none; }
          .how-step:not(:last-child)::before {
            content: '';
            position: absolute;
            left: 43px;
            top: 96px;
            bottom: -32px;
            width: 2px;
            border-radius: 2px;
            background: linear-gradient(var(--sage-300), var(--sage-600));
            transform: scaleY(0);
            transform-origin: top;
            transition: transform 0.9s var(--ease-expo);
            transition-delay: calc(var(--i) * 250ms + 0.2s);
          }
          .how-track[data-in] .how-step::before { transform: scaleY(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .how-line-fill, .how-step::before { transition: none !important; }
          .how-track[data-in] .how-art img { animation: none; }
        }
      `}</style>
    </section>
  )
}
