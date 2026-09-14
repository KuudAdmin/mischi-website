'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from 'react'
import { MagicStar, Magicpen, Messages2, Repeat, TickCircle, type Icon as IconsaxIcon } from 'iconsax-react'
import { useInView } from '../useInView'

// Pixels to crop from the top of each 1080-tall clip to hide the macOS menu bar.
const VIDEO_CROP_TOP = 64

interface Showcase {
  id: string
  tab: string
  Icon: IconsaxIcon
  title: string
  body: string
  video: string
  points: string[]
}

const SHOWCASES: Showcase[] = [
  {
    id: 'conversational',
    tab: 'Talks back',
    Icon: Messages2,
    title: 'Talk to it, and it talks back',
    body: 'Mischi isn’t just decoration. Strike up a conversation and your pet replies in its own chat bubble, right there on your desktop. No window to open, no tab to find.',
    video: '/features/conversational.mp4',
    points: ['Lives on your desktop', 'Responds in context', 'Always within reach'],
  },
  {
    id: 'ai',
    tab: 'Ask Mischi',
    Icon: MagicStar,
    title: 'Bring your own key',
    body: 'Mischi ships with Groq, so chat is bring-your-own-key. Drop in your Groq API key, pick from the available models in settings, and everything runs on your terms. Press ⌘K to open chat anytime.',
    video: '/features/ai-chat.mp4',
    points: ['Bring your own Groq key', 'Pick from Groq’s models', '⌘K to open chat'],
  },
  {
    id: 'animations',
    tab: 'Scripted moves',
    Icon: Magicpen,
    title: 'Every move, yours to script',
    body: 'Idle, walk, wave, jump: map each animation to behaviors and chat lines. Tune how your pet reacts until it has a personality that feels genuinely alive.',
    video: '/features/chatlines.mp4',
    points: ['Idle, walk, wave, jump', 'Map your own chat lines', 'Reactions that fit you'],
  },
  {
    id: 'change-pet',
    tab: 'Swap pets',
    Icon: Repeat,
    title: 'Swap pets whenever',
    body: 'Switch between any pet you’ve imported in a single click. Build a roster and change the vibe of your desktop on a whim. A focused cat now, a playful blob later.',
    video: '/features/change-pet.mp4',
    points: ['One-click switching', 'Unlimited roster', 'Codex-compatible pets'],
  },
]

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** One player with four tabs, replacing four long alternating rows. */
export default function Features() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const [hovering, setHovering] = useState(false)
  // Plays only while at least a third of the player is on screen.
  const [sectionRef, inView] = useInView<HTMLElement>({ threshold: 0.3 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabsRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )

  const item = SHOWCASES[active]

  // Only the visible recording ever plays, and only while the player is on
  // screen and not being hovered. The rest of the time it rests on its poster.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    if (inView && !hovering && !reducedMotion) video.play().catch(() => {})
    else video.pause()
  }, [active, inView, hovering, reducedMotion])

  // When the tabs overflow (phones), slide the chosen tab to the start of the
  // strip so the next ones peek in and read as more to tap. Only the strip
  // scrolls, never the page, so auto-advance can't yank the reader around.
  useEffect(() => {
    const list = tabsRef.current
    const tab = tabRefs.current[active]
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: Math.max(0, tab.offsetLeft - 4), behavior: reducedMotion ? 'auto' : 'smooth' })
  }, [active, reducedMotion])

  function select(index: number, focus = false) {
    const next = (index + SHOWCASES.length) % SHOWCASES.length
    setActive(next)
    setProgress(0)
    if (focus) tabRefs.current[next]?.focus()
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const moves: Record<string, number> = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: SHOWCASES.length - 1 }
    if (e.key in moves) {
      e.preventDefault()
      select(moves[e.key], true)
    }
  }

  return (
    <section ref={sectionRef} id="features" aria-labelledby="features-heading" className="section-pad fx">
      <div className="fx-inner">
        <div className="fx-head">
          <div>
            <p className="fx-eyebrow">What it does</p>
            <h2 id="features-heading" className="fx-title">A pet with a few tricks</h2>
          </div>
          <div ref={tabsRef} className="fx-tabs" role="tablist" aria-label="Features">
            {SHOWCASES.map((s, i) => (
              <button
                key={s.id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`fx-tab-${s.id}`}
                aria-selected={i === active}
                aria-controls="fx-panel"
                tabIndex={i === active ? 0 : -1}
                className="fx-tab"
                onClick={() => select(i)}
                onKeyDown={onTabKeyDown}
              >
                <s.Icon size={16} color="currentColor" variant={i === active ? 'Bold' : 'Outline'} aria-hidden="true" />
                {s.tab}
              </button>
            ))}
          </div>
        </div>

        <div
          id="fx-panel"
          role="tabpanel"
          aria-labelledby={`fx-tab-${item.id}`}
          className="fx-body"
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className="fx-screen">
            <div className="fx-frame" style={{ aspectRatio: `1664 / ${1080 - VIDEO_CROP_TOP}` }}>
              <video
                key={item.id}
                ref={videoRef}
                className="fx-video"
                muted
                playsInline
                preload="metadata"
                poster={item.video.replace(/\.mp4$/, '.jpg')}
                loop={reducedMotion}
                controls={reducedMotion}
                onEnded={() => {
                  if (!reducedMotion) select(active + 1)
                }}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  if (v.duration) setProgress(v.currentTime / v.duration)
                }}
                aria-label={`${item.title}, screen recording of Mischi`}
              >
                <source src={item.video} type="video/mp4" />
              </video>
            </div>
            {!reducedMotion && (
              <div className="fx-progress" aria-hidden="true">
                <span style={{ transform: `scaleX(${progress})` }} />
              </div>
            )}
          </div>

          <div key={item.id} className="fx-copy">
            <h3 className="fx-copy-title">{item.title}</h3>
            <p className="fx-copy-body">{item.body}</p>
            <ul className="fx-points">
              {item.points.map((point) => (
                <li key={point}>
                  <TickCircle size={18} variant="Bold" color="currentColor" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .fx {
          padding-inline: 24px;
          background: var(--color-surface-raised);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .fx-inner { max-width: 1120px; margin: 0 auto; display: flex; flex-direction: column; gap: 40px; }
        .fx-head { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: 24px; }
        .fx-eyebrow {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .fx-title {
          font-size: clamp(1.9rem, 1.2rem + 2vw, 2.6rem);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.028em;
          color: var(--color-text);
        }
        /* position: relative so each tab's offsetLeft is measured from the strip. */
        .fx-tabs {
          position: relative;
          display: flex;
          gap: 4px;
          max-width: 100%;
          padding: 4px;
          overflow-x: auto;
          border-radius: 9999px;
          background: var(--color-surface-sunken);
          scrollbar-width: none;
        }
        .fx-tabs::-webkit-scrollbar { display: none; }
        .fx-tab {
          flex: none;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 16px;
          border: 0;
          border-radius: 9999px;
          background: transparent;
          font: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: background var(--dur-fast), color var(--dur-fast), box-shadow var(--dur-fast);
        }
        .fx-tab:hover { color: var(--color-text); }
        .fx-tab[aria-selected='true'] {
          background: var(--color-surface-raised);
          color: var(--color-text);
          box-shadow: 0 1px 2px rgba(43, 38, 28, 0.12);
        }
        .fx-tab[aria-selected='true'] svg { color: var(--sage-600); }
        .fx-tab:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 2px; }
        .fx-body {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(0, 0.8fr);
          gap: 48px;
          align-items: center;
        }
        .fx-screen {
          overflow: hidden;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-xl);
          background: var(--color-surface-sunken);
          box-shadow: var(--shadow-window);
        }
        .fx-frame { position: relative; width: 100%; }
        .fx-video {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }
        .fx-progress { height: 3px; background: var(--color-surface-sunken); }
        .fx-progress span {
          display: block;
          height: 100%;
          background: var(--sage-600);
          transform-origin: left;
          transition: transform 0.25s linear;
        }
        .fx-copy { display: flex; flex-direction: column; gap: 14px; animation: fx-in 0.45s var(--ease-expo) both; }
        @keyframes fx-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        .fx-copy-title {
          font-size: clamp(1.35rem, 1rem + 1vw, 1.75rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.022em;
          color: var(--color-text);
        }
        .fx-copy-body { font-size: 0.9375rem; line-height: 1.7; color: var(--color-text-muted); }
        .fx-points { margin: 4px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
        .fx-points li { display: flex; align-items: center; gap: 10px; font-size: 0.9375rem; color: var(--color-text); }
        .fx-points svg { flex: none; color: var(--sage-600); }
        @media (max-width: 900px) {
          .fx-body { grid-template-columns: minmax(0, 1fr); gap: 28px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .fx-copy { animation: none; }
        }
      `}</style>
    </section>
  )
}
