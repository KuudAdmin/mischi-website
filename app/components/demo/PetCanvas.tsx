'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

const FRAME_W = 192
const FRAME_H = 208
const SHEET_COLS = 8
const SHEET_ROWS = 9
const DISPLAY_SCALE = 1.75

type AnimState = 'idle' | 'runRight' | 'runLeft' | 'wave' | 'jump' | 'tired' | 'waiting' | 'dancing' | 'review'

interface StateConfig {
  row: number
  frames: number
  fps: number
  loop: boolean
  next?: AnimState
}

const STATES: Record<AnimState, StateConfig> = {
  idle:     { row: 0, frames: 6, fps: 8,  loop: true },
  runRight: { row: 1, frames: 8, fps: 12, loop: true },
  runLeft:  { row: 2, frames: 8, fps: 12, loop: true },
  wave:     { row: 3, frames: 4, fps: 10, loop: false, next: 'idle' },
  jump:     { row: 4, frames: 5, fps: 12, loop: false, next: 'idle' },
  tired:    { row: 5, frames: 8, fps: 6,  loop: true },
  waiting:  { row: 6, frames: 6, fps: 7,  loop: true },
  dancing:  { row: 7, frames: 6, fps: 10, loop: true },
  review:   { row: 8, frames: 6, fps: 8,  loop: true },
}

const IDLE_TO_SLEEP_MS = 12000
const IDLE_AUTO_WAVE_MS = 5000

// One decoded image per spritesheet, shared by every PetCanvas on the page.
// The page preloads the sheets from <head>, so by the time a canvas mounts the
// bytes are usually already here; decode() readies the bitmap off the main
// thread so the first frame can be drawn straight away.
const sheets = new Map<string, Promise<HTMLImageElement>>()

function loadSheet(src: string): Promise<HTMLImageElement> {
  const cached = sheets.get(src)
  if (cached) return cached

  const img = new window.Image()
  img.decoding = 'async'
  img.src = src
  const ready = img.decode().then(
    () => img,
    // decode() can reject for an image that is still drawable (an interrupted
    // decode, say); fall back to the load event before giving up.
    () =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const fail = () => reject(new Error(`Could not load ${src}`))
        if (img.complete) return img.naturalWidth > 0 ? resolve(img) : fail()
        img.onload = () => resolve(img)
        img.onerror = fail
      }),
  )
  // Don't cache a failure, so a later mount can retry.
  ready.catch(() => sheets.delete(src))
  sheets.set(src, ready)
  return ready
}

interface PetCanvasProps {
  state?: AnimState
  onStateChange?: (s: AnimState) => void
  interactive?: boolean
  autoAnimate?: boolean
  scale?: number
  spritesheet?: string
  repeatShortAnims?: boolean
  className?: string
  style?: React.CSSProperties
}

export default function PetCanvas({
  state: externalState,
  onStateChange,
  interactive = true,
  autoAnimate = true,
  scale = DISPLAY_SCALE,
  spritesheet = '/spritesheet.webp',
  repeatShortAnims = false,
  className,
  style,
}: PetCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const rafRef     = useRef<number>(0)
  const frameRef   = useRef(0)
  const lastTime   = useRef(0)
  const stateRef   = useRef<AnimState>('idle')
  const idleTimer          = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoWaveT          = useRef<ReturnType<typeof setTimeout> | null>(null)
  const repeatShortRef     = useRef(repeatShortAnims)

  useEffect(() => {
    repeatShortRef.current = repeatShortAnims
  }, [repeatShortAnims])

  const [currentState, setCurrentState] = useState<AnimState>('idle')
  const [loaded, setLoaded]             = useState(false)

  const displayW = Math.round(FRAME_W * scale)
  const displayH = Math.round(FRAME_H * scale)
  const canvasW  = displayW * 2
  const canvasH  = displayH * 2

  const applyState = useCallback((s: AnimState) => {
    if (stateRef.current === s) return
    stateRef.current = s
    frameRef.current = 0
    lastTime.current = 0
    setCurrentState(s)
    onStateChange?.(s)
  }, [onStateChange])

  const resetIdleTimers = useCallback(() => {
    if (idleTimer.current)  clearTimeout(idleTimer.current)
    if (autoWaveT.current)  clearTimeout(autoWaveT.current)
    if (!interactive || !autoAnimate) return
    autoWaveT.current = setTimeout(() => {
      if (stateRef.current === 'idle') applyState('wave')
    }, IDLE_AUTO_WAVE_MS)
    idleTimer.current = setTimeout(() => {
      if (stateRef.current === 'idle') applyState('tired')
    }, IDLE_TO_SLEEP_MS)
  }, [interactive, autoAnimate, applyState])

  // Paint the current frame. Smoothing is re-disabled on every draw because
  // resizing the canvas resets the context state.
  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const img = imgRef.current
    if (!ctx || !img) return
    ctx.imageSmoothingEnabled = false
    const sy = STATES[stateRef.current].row * FRAME_H
    ctx.clearRect(0, 0, canvasW, canvasH)
    ctx.drawImage(img, frameRef.current * FRAME_W, sy, FRAME_W, FRAME_H, 0, 0, canvasW, canvasH)
  }, [canvasW, canvasH])

  useEffect(() => {
    if (externalState && externalState !== stateRef.current) {
      applyState(externalState)
    }
  }, [externalState, applyState])

  useEffect(() => {
    let cancelled = false
    loadSheet(spritesheet).then(
      (img) => {
        if (cancelled) return
        imgRef.current = img
        draw() // now, rather than on the next animation tick
        setLoaded(true)
        resetIdleTimers()
      },
      () => {},
    )
    return () => { cancelled = true }
  }, [spritesheet, draw, resetIdleTimers])

  useEffect(() => {
    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick)
      if (!imgRef.current) return

      const cfg = STATES[stateRef.current]
      if (now - lastTime.current < 1000 / cfg.fps) return
      lastTime.current = now

      const next = frameRef.current + 1
      if (next >= cfg.frames) {
        if (!cfg.loop && cfg.next && !repeatShortRef.current) {
          stateRef.current = cfg.next
          setCurrentState(cfg.next)
          frameRef.current = 0
          resetIdleTimers()
        } else {
          frameRef.current = (cfg.loop || repeatShortRef.current) ? 0 : cfg.frames - 1
        }
      } else {
        frameRef.current = next
      }

      draw()
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (idleTimer.current)  clearTimeout(idleTimer.current)
      if (autoWaveT.current)  clearTimeout(autoWaveT.current)
    }
  }, [draw, resetIdleTimers])

  const handleClick = useCallback(() => {
    if (!interactive) return
    applyState(currentState === 'tired' ? 'idle' : 'wave')
    resetIdleTimers()
  }, [interactive, currentState, applyState, resetIdleTimers])

  const handleDblClick = useCallback(() => {
    if (!interactive) return
    applyState('jump')
    resetIdleTimers()
  }, [interactive, applyState, resetIdleTimers])

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: displayW,
        height: displayH,
        cursor: interactive ? 'pointer' : 'default',
        // Until the canvas has painted, show the current state's first frame
        // straight from the spritesheet as a CSS background. It's in the
        // server-rendered HTML, so the pet appears the moment the image
        // arrives instead of waiting for hydration and a decode.
        ...(loaded
          ? {}
          : {
              backgroundImage: `url(${spritesheet})`,
              backgroundSize: `${SHEET_COLS * displayW}px ${SHEET_ROWS * displayH}px`,
              backgroundPosition: `0 ${-STATES[currentState].row * displayH}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
            }),
        ...style,
      }}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
      onMouseEnter={() => { if (interactive && currentState === 'tired') applyState('idle') }}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'Interactive pet: click to wave, double-click to jump' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => { if (interactive && (e.key === 'Enter' || e.key === ' ')) handleClick() }}
    >
      <canvas
        ref={canvasRef}
        width={canvasW}
        height={canvasH}
        style={{
          width: displayW,
          height: displayH,
          imageRendering: 'pixelated',
          display: 'block',
        }}
      />
    </div>
  )
}
