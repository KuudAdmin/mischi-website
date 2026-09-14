'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { Wifi } from 'iconsax-react'
import PetCanvas from '../demo/PetCanvas'

type Mood = 'idle' | 'wave' | 'jump' | 'dancing' | 'tired' | 'waiting' | 'review' | 'runLeft' | 'runRight'

// Where the pet can stand on the floor, as a percentage of the scene's width.
const LEFT_X = 20
const RIGHT_X = 80
const INTRO_X = 56
// Walking pace: milliseconds per percent of the scene crossed.
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

// Abstract "text" lines in the two background windows. Deliberately not a
// real app: they're scenery, and the pet is the subject.
const LINES_A = [58, 82, 70, 44]
const LINES_B = [64, 40, 76]

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

/** A small macOS desktop with the pet living on it, plus controls for every animation. */
export default function DesktopScene() {
  const [x, setX] = useState(LEFT_X)
  const [mood, setMood] = useState<Mood>('idle')
  const [walkDir, setWalkDir] = useState<1 | -1 | null>(null)
  const [walkMs, setWalkMs] = useState(0)
  const [bubble, setBubble] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const sceneRef = useRef<HTMLDivElement>(null)
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
    const scene = sceneRef.current?.getBoundingClientRect()
    const pet = petRef.current?.getBoundingClientRect()
    if (!scene || !pet || !scene.width) return x
    return ((pet.left + pet.width / 2 - scene.left) / scene.width) * 100
  }

  // The page's one orchestrated moment: the pet strolls in and says hello.
  // With reduced motion it's simply already there.
  useEffect(() => {
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
      }, 700),
    )
    return () => pending.forEach(clearTimeout)
  }, [])

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
  const moving = walkDir !== null && walkMs > 0 && !reducedMotion

  return (
    <div ref={sceneRef} className="desk" role="group" aria-label="Try Mischi: a pet living on a Mac desktop">
      <div className="desk-menubar" aria-hidden="true">
        <span className="desk-menus">
          <b>Finder</b>
          <span>File</span>
          <span>Edit</span>
          <span>View</span>
          <span>Go</span>
          <span>Window</span>
        </span>
        <span className="desk-status">
          <span className="desk-mischi">
            <Image src="/mischi-icon-02.svg" alt="" width={13} height={13} />
          </span>
          <Wifi size={13} variant="Bold" color="currentColor" />
          <span>Mon 9:41</span>
        </span>
      </div>

      <div className="desk-window desk-window-a" aria-hidden="true">
        <div className="desk-bar"><i /><i /><i /></div>
        <div className="desk-lines">
          {LINES_A.map((w, i) => <span key={i} style={{ width: `${w}%` }} />)}
        </div>
      </div>
      <div className="desk-window desk-window-b" aria-hidden="true">
        <div className="desk-bar"><i /><i /><i /></div>
        <div className="desk-lines">
          {LINES_B.map((w, i) => <span key={i} style={{ width: `${w}%` }} />)}
        </div>
      </div>

      {/* The pet's stage sits directly on top of the dock, so the pet always
          stands just above the controls however many rows they wrap to. */}
      <div className="desk-floor">
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
            />
            {bubble && <span className="desk-bubble">Stretch break in 5 minutes?</span>}
          </div>
        </div>

        <div className="desk-dock" aria-label="Pet animations">
          {CONTROLS.map((c) => (
            <button
              key={c.label}
              type="button"
              className="desk-ctl"
              aria-label={c.aria}
              aria-pressed={isActive(c)}
              onClick={() => act(c)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .desk {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 11;
          overflow: hidden;
          isolation: isolate;
          border-radius: 20px;
          background-color: #C4533F;
          background-image:
            radial-gradient(120% 90% at 88% 0%, var(--desk-a, #F4A259) 0%, transparent 55%),
            radial-gradient(110% 100% at 0% 100%, var(--desk-c, #9E3A5B) 0%, transparent 60%),
            linear-gradient(135deg, var(--desk-b, #D95D39), #B84A4A 60%, var(--desk-c, #9E3A5B));
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 32px 64px -36px rgba(90, 40, 30, 0.5);
        }
        /* No backdrop-filter anywhere in the scene: combined with the hero's
           fade-in it can make Chrome paint the whole scene washed out. */
        .desk-menubar {
          position: absolute;
          inset: 0 0 auto 0;
          z-index: 3;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 14px;
          background: rgba(255, 248, 240, 0.14);
          font-size: 12px;
          color: rgba(255, 248, 240, 0.82);
        }
        .desk-menus { display: flex; gap: 14px; }
        .desk-menus b { font-weight: 600; color: rgba(255, 248, 240, 0.95); }
        .desk-status { display: flex; align-items: center; gap: 10px; }
        .desk-mischi {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 17px;
          border-radius: 5px;
          background: rgba(255, 248, 240, 0.55);
        }
        .desk-window {
          position: absolute;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 248, 240, 0.1);
        }
        .desk-window-a { left: 7%; top: 14%; width: 44%; height: 38%; }
        .desk-window-b { left: 47%; top: 24%; width: 40%; height: 34%; }
        .desk-bar { height: 18px; display: flex; align-items: center; gap: 5px; padding: 0 9px; background: rgba(255, 255, 255, 0.08); }
        .desk-bar i { display: block; width: 6px; height: 6px; border-radius: 50%; background: rgba(255, 255, 255, 0.4); }
        .desk-lines { display: flex; flex-direction: column; gap: 8px; padding: 12px 14px; }
        .desk-lines span { display: block; height: 6px; border-radius: 3px; background: rgba(255, 255, 255, 0.16); }

        /* Bottom-anchored column: the pet's stage, then the dock. Because the
           dock is in the flow, the stage always rests right on top of it. */
        .desk-floor {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 14px;
          z-index: 4;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        /* As tall as the pet, less the ~9px of empty space under its feet, plus
           a 10px gap so it stands just above the dock. */
        .desk-stage { position: relative; align-self: stretch; height: 87px; margin-bottom: 10px; }
        .desk-pet {
          position: absolute;
          bottom: -9px;
          transform: translateX(-50%);
          line-height: 0;
          cursor: pointer;
        }
        .desk-shadow {
          position: absolute;
          left: 50%;
          bottom: 7px;
          width: 56%;
          height: 8px;
          border-radius: 50%;
          background: rgba(40, 12, 10, 0.28);
          filter: blur(3px);
          transform: translateX(-50%);
        }
        /* Sits just clear of the ears (the sprite has ~9px of empty space above
           them at this size). Placement uses the translate property so the
           pop-in animation can own transform. */
        .desk-bubble {
          position: absolute;
          left: 50%;
          bottom: calc(100% - 3px);
          z-index: 2;
          padding: 6px 11px;
          border-radius: 13px;
          background: #FFFFFF;
          font-size: 12px;
          line-height: 1.3;
          color: #1B211D;
          white-space: nowrap;
          box-shadow: 0 8px 20px -10px rgba(40, 15, 10, 0.5);
          translate: -50% 0;
          transform-origin: bottom center;
          animation: desk-pop 0.35s var(--ease-spring) both;
        }
        .desk-bubble::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -4px;
          width: 9px;
          height: 9px;
          background: #FFFFFF;
          transform: translateX(-50%) rotate(45deg);
        }
        /* With room to spare, the bubble rises up and to the right of the
           head, its tail pointing back down at the pet. */
        @media (min-width: 601px) {
          .desk-bubble { left: 60%; translate: -20px 0; transform-origin: bottom left; }
          .desk-bubble::after { left: 20px; }
        }
        .desk-dock {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 2px;
          width: max-content;
          max-width: calc(100% - 24px);
          padding: 4px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.94);
          box-shadow: 0 10px 24px -12px rgba(40, 15, 10, 0.5);
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
        .desk-ctl[aria-pressed='true'] { background: var(--sage-600); color: var(--cta-ink); }
        .desk-ctl:focus-visible { outline: 2px solid var(--sage-600); outline-offset: 1px; }
        @keyframes desk-pop {
          from { opacity: 0; transform: translateY(4px) scale(0.94); }
          to   { opacity: 1; transform: none; }
        }
        @media (max-width: 1100px) and (min-width: 961px) {
          .desk-dock { width: 330px; border-radius: 18px; }
        }
        @media (max-width: 600px) {
          .desk { aspect-ratio: 4 / 4.2; border-radius: 16px; }
          .desk-menubar { font-size: 11px; }
          .desk-menus span:nth-child(n + 4) { display: none; }
          .desk-dock { width: 290px; border-radius: 18px; }
          .desk-ctl { padding: 5px 9px; font-size: 11.5px; }
          .desk-bubble { font-size: 11.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .desk-bubble { animation: none; }
        }
      `}</style>
    </div>
  )
}
