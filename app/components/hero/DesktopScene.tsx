'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import PetCanvas from '../demo/PetCanvas'

type Mood = 'idle' | 'wave' | 'jump' | 'dancing' | 'tired' | 'waiting' | 'review' | 'runLeft' | 'runRight'

// Where the pet can stand on the floor, as a percentage of the screen's width.
const LEFT_X = 20
const RIGHT_X = 80
const INTRO_X = 56
// Walking pace: milliseconds per percent of the screen crossed.
const MS_PER_PCT = 42

// In the cat sheet, the runRight row faces right and runLeft faces left.
const walkMood = (dir: 1 | -1): Mood => (dir > 0 ? 'runRight' : 'runLeft')

type Control = { label: string; aria?: string; mood?: Mood; walk?: 1 | -1 }

const CONTROLS: Control[] = [
  { label: 'Idle', mood: 'idle' },
  { label: 'Wave', mood: 'wave' },
  { label: 'Jump', mood: 'jump' },
  { label: '← Walk', aria: 'Walk left', walk: -1 },
  { label: 'Walk →', aria: 'Walk right', walk: 1 },
  // This cat's "dancing" row is drawn as a playful hop, so it's labelled Play.
  { label: 'Play', mood: 'dancing' },
  { label: 'Wait', mood: 'waiting' },
  { label: 'Tired', mood: 'tired' },
  { label: 'Review', mood: 'review' },
]

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/**
 * The pet living on a real MacBook Pro, plus controls for every animation.
 * The live layer sits exactly over the mockup's screen, so its own macOS
 * wallpaper and menu bar show through behind the pet.
 */
export default function DesktopScene() {
  const [x, setX] = useState(LEFT_X)
  const [mood, setMood] = useState<Mood>('idle')
  const [walkDir, setWalkDir] = useState<1 | -1 | null>(null)
  const [walkMs, setWalkMs] = useState(0)
  const [bubble, setBubble] = useState(false)
  // False until the laptop image and the cat's sprite sheet are both ready, so
  // the scene appears as one piece instead of the cat arriving on its own.
  const [ready, setReady] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const screenRef = useRef<HTMLDivElement>(null)
  const petRef = useRef<HTMLDivElement>(null)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )

  // One-shot animations (wave, jump) hand back to idle on their own.
  const syncMood = useCallback((state: string) => setMood(state as Mood), [])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  // Where the pet actually is right now, including partway through a walk.
  const currentX = () => {
    const screen = screenRef.current?.getBoundingClientRect()
    const pet = petRef.current?.getBoundingClientRect()
    if (!screen || !pet || !screen.width) return x
    return ((pet.left + pet.width / 2 - screen.left) / screen.width) * 100
  }

  // Reveal the laptop, pet and controls together once the laptop image and the
  // sprite sheet are decoded (both are preloaded, so this is usually quick).
  // A cap makes sure a slow network never leaves the hero empty.
  useEffect(() => {
    let cancelled = false
    const reveal = () => {
      if (!cancelled) setReady(true)
    }
    const img = imgRef.current
    const laptop = !img
      ? Promise.resolve()
      : img.complete && img.naturalWidth > 0
        ? img.decode()
        : new Promise<void>((resolve) => {
            img.addEventListener('load', () => resolve(), { once: true })
            img.addEventListener('error', () => resolve(), { once: true })
          }).then(() => img.decode())
    const sheet = new window.Image()
    sheet.src = '/spritesheet_cat.webp'
    Promise.all([laptop, sheet.decode()].map((p) => p.catch(() => {}))).then(reveal)
    const cap = setTimeout(reveal, 2500)
    return () => {
      cancelled = true
      clearTimeout(cap)
    }
  }, [])

  // The page's one orchestrated moment: once the scene is in, the pet strolls
  // in and says hello. With reduced motion it's simply already there.
  useEffect(() => {
    if (!ready) return
    const pending = timers.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    pending.push(
      setTimeout(() => {
        const greet = () => {
          setWalkDir(null)
          setMood('wave')
          setBubble(true)
        }
        if (reduce) {
          setX(INTRO_X)
          greet()
          return
        }
        setWalkMs((INTRO_X - LEFT_X) * MS_PER_PCT)
        setWalkDir(1)
        setMood(walkMood(1))
        setX(INTRO_X)
        pending.push(setTimeout(greet, (INTRO_X - LEFT_X) * MS_PER_PCT))
      }, 450),
    )
    return () => pending.forEach(clearTimeout)
  }, [ready])

  function act(control: Control) {
    clearTimers()
    setBubble(false)
    const here = currentX()

    // Everything except walking happens on the spot: stop exactly where the
    // pet is, even if that's partway through a walk.
    if (!control.walk) {
      setWalkDir(null)
      setX(here)
      setMood(control.mood ?? 'idle')
      return
    }

    const dir = control.walk
    const target = dir > 0 ? RIGHT_X : LEFT_X
    const distance = Math.abs(target - here)

    if (reducedMotion) {
      setWalkDir(null)
      setX(target)
      setMood('idle')
      return
    }

    // Already at that edge: turn to face it and pace briefly on the spot.
    const ms = distance < 1 ? 900 : distance * MS_PER_PCT
    setWalkMs(distance < 1 ? 0 : ms)
    setWalkDir(dir)
    setMood(walkMood(dir))
    setX(target)
    timers.current.push(
      setTimeout(() => {
        setWalkDir(null)
        setMood('idle')
      }, ms),
    )
  }

  const isActive = (c: Control) => (c.walk ? walkDir === c.walk : walkDir === null && mood === c.mood)

  // When the dock overflows (phones), slide the pressed control to the start
  // of the row so the ones beyond it peek in. Only the dock scrolls.
  function slideToStart(button: HTMLButtonElement) {
    const dock = button.parentElement
    if (!dock || dock.scrollWidth <= dock.clientWidth) return
    dock.scrollTo({ left: Math.max(0, button.offsetLeft - 4), behavior: reducedMotion ? 'auto' : 'smooth' })
  }
  const moving = walkDir !== null && walkMs > 0 && !reducedMotion

  return (
    <div
      className="desk-wrap"
      data-ready={ready || undefined}
      role="group"
      aria-label="Try Mischi: a pet living on a Mac desktop"
    >
      {/* Without JavaScript nothing would flip data-ready, so just show it. */}
      <noscript dangerouslySetInnerHTML={{ __html: '<style>.desk-wrap{opacity:1;transform:none}</style>' }} />
      <div className="desk">
        <Image
          ref={imgRef}
          className="desk-mac"
          src="/hero/macbook-pro.webp"
          alt=""
          width={2000}
          height={1220}
          sizes="(max-width: 960px) 92vw, 640px"
          preload
        />

        {/* The live layer, placed exactly over the mockup's screen. */}
        <div ref={screenRef} className="desk-screen">
          <div className="desk-stage">
            <div
              ref={petRef}
              className="desk-pet"
              // Only a walk ever animates the pet's position.
              style={{ left: `${x}%`, transition: moving ? `left ${walkMs}ms linear` : 'none' }}
              onClick={() => act({ label: 'Wave', mood: 'wave' })}
              aria-hidden="true"
            >
              <span className="desk-shadow" />
              <PetCanvas
                state={mood}
                onStateChange={syncMood}
                interactive={false}
                autoAnimate={false}
                scale={0.46}
                spritesheet="/spritesheet_cat.webp"
                className="desk-sprite"
              />
              {bubble && <span className="desk-bubble">Stretch break in 5 minutes?</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Under the laptop, like a remote. */}
      <div className="desk-dock" aria-label="Pet animations">
        {CONTROLS.map((c) => (
          <button
            key={c.label}
            type="button"
            className="desk-ctl"
            aria-label={c.aria}
            aria-pressed={isActive(c)}
            onClick={(e) => {
              act(c)
              slideToStart(e.currentTarget)
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      <style>{`
        /* Hidden (its space already reserved) until data-ready, then the
           laptop, cat and controls fade up together in one motion. */
        .desk-wrap {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s var(--ease-expo), transform 0.9s var(--ease-expo);
        }
        .desk-wrap[data-ready] { opacity: 1; transform: none; }
        .desk { position: relative; width: 100%; isolation: isolate; }
        .desk-mac {
          display: block;
          width: 100%;
          height: auto;
          user-select: none;
          pointer-events: none;
        }
        /* A soft floor shadow under the laptop (cheaper than a drop-shadow
           filter on the whole image). */
        .desk::after {
          content: '';
          position: absolute;
          left: 4%;
          right: 4%;
          bottom: -3%;
          z-index: -1;
          height: 8%;
          border-radius: 50%;
          background: radial-gradient(closest-side, rgba(70, 35, 25, 0.22), transparent);
        }
        /* Measured from the mockup, inside the black bezel: the screen starts
           9% from the left and 2.131% from the top, and is 82% x 86.885% of
           the image, with top corners rounded by about 1% x 1.5%.
           It's also a size container, so the cat can be sized as a share of
           the screen and stay in proportion at any laptop size. */
        .desk-screen {
          --cat: 15cqw;
          position: absolute;
          left: 9%;
          top: 2.131%;
          width: 82%;
          height: 86.885%;
          overflow: hidden;
          container-type: size;
          border-radius: 0.98% 0.98% 0 0 / 1.51% 1.51% 0 0;
        }

        /* The cat's size comes from --cat (its width). The sprite is 192x208,
           with empty space under its feet worth about a tenth of its width;
           the offsets below are in those proportions. PetCanvas sets pixel
           sizes inline, hence the !important. */
        .desk-sprite {
          width: var(--cat) !important;
          height: calc(var(--cat) * 1.0833) !important;
          background-size: 800% 900% !important;
        }
        .desk-sprite canvas { width: 100% !important; height: 100% !important; }
        .desk-stage {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 5%;
          height: calc(var(--cat) * 0.98);
        }
        .desk-pet {
          position: absolute;
          bottom: calc(var(--cat) * -0.102);
          transform: translateX(-50%);
          line-height: 0;
          cursor: pointer;
        }
        .desk-shadow {
          position: absolute;
          left: 50%;
          bottom: calc(var(--cat) * 0.08);
          width: 56%;
          height: max(5px, calc(var(--cat) * 0.09));
          border-radius: 50%;
          background: rgba(20, 8, 6, 0.35);
          filter: blur(3px);
          transform: translateX(-50%);
        }
        /* Sits just clear of the ears. Placement uses the translate property
           so the pop-in animation can own transform. */
        .desk-bubble {
          position: absolute;
          left: 60%;
          bottom: calc(100% + var(--cat) * 0.03);
          z-index: 2;
          padding: 6px 11px;
          border-radius: 13px;
          background: #FFFFFF;
          font-size: 12px;
          line-height: 1.3;
          color: #1B211D;
          white-space: nowrap;
          box-shadow: 0 8px 20px -10px rgba(40, 15, 10, 0.5);
          translate: -20px 0;
          transform-origin: bottom left;
          animation: desk-pop 0.35s var(--ease-spring) both;
        }
        .desk-bubble::after {
          content: '';
          position: absolute;
          left: 20px;
          bottom: -4px;
          width: 9px;
          height: 9px;
          background: #FFFFFF;
          transform: translateX(-50%) rotate(45deg);
        }

        .desk-dock {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2px;
          width: max-content;
          max-width: 100%;
          padding: 4px;
          border: 1px solid var(--color-border);
          border-radius: 9999px;
          background: var(--color-surface-raised);
          box-shadow: 0 10px 24px -16px rgba(40, 15, 10, 0.35);
        }
        .desk-ctl {
          padding: 6px 10px;
          border: 0;
          border-radius: 9999px;
          background: transparent;
          font: inherit;
          font-size: 12px;
          font-weight: 500;
          color: #3A3F3B;
          white-space: nowrap;
          cursor: pointer;
          transition: background 0.13s, color 0.13s;
        }
        .desk-ctl:hover { background: rgba(27, 33, 29, 0.07); color: #1B211D; }
        /* A soft tint, not a solid fill: solid sage is kept for real calls to
           action (Download), so the chosen animation never competes with it. */
        .desk-ctl[aria-pressed='true'] { background: var(--sage-100); color: var(--sage-900); font-weight: 600; }
        .desk-ctl:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 1px; }
        @keyframes desk-pop {
          from { opacity: 0; transform: translateY(4px) scale(0.94); }
          to   { opacity: 1; transform: none; }
        }
        @media (max-width: 1100px) and (min-width: 961px) {
          .desk-dock { border-radius: 18px; }
        }

        /* Phones: the same laptop, sized so the whole hero still fits the first
           screen. About 567px of it goes to the hero copy, the gap and the
           dock; the laptop takes the height that's left (it's 0.61 as tall as
           it is wide), but never narrower than 220px. The cat takes a larger
           share of the smaller screen, the bubble centres over it, and the
           dock is one swipeable row. */
        @media (max-width: 600px) {
          .desk-wrap { gap: 12px; }
          .desk { width: max(220px, min(100%, calc((100svh - 567px) / 0.61))); }
          .desk-screen { --cat: 20cqw; }
          .desk-bubble {
            left: 50%;
            padding: 4px 9px;
            border-radius: 10px;
            font-size: 10.5px;
            translate: -50% 0;
            transform-origin: bottom center;
          }
          .desk-bubble::after { left: 50%; bottom: -3px; width: 7px; height: 7px; }
          .desk-dock {
            flex-wrap: nowrap;
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .desk-dock::-webkit-scrollbar { display: none; }
          .desk-ctl { padding: 5px 9px; font-size: 11.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .desk-wrap { transform: none; transition: none; }
          .desk-bubble { animation: none; }
        }
      `}</style>
    </div>
  )
}
