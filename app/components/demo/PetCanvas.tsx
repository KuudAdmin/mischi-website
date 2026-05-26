'use client'

import { useRef, useEffect, useCallback, useState } from 'react'

const FRAME_W = 192
const FRAME_H = 208
const DISPLAY_SCALE = 1.75

type AnimState = 'idle' | 'wave' | 'jump' | 'run' | 'sleep'

interface StateConfig {
  row: number
  frames: number
  fps: number
  loop: boolean
  next?: AnimState
}

const STATES: Record<AnimState, StateConfig> = {
  idle:  { row: 0, frames: 8, fps: 8,  loop: true },
  run:   { row: 1, frames: 8, fps: 12, loop: true },
  wave:  { row: 2, frames: 8, fps: 10, loop: false, next: 'idle' },
  jump:  { row: 3, frames: 8, fps: 12, loop: false, next: 'idle' },
  sleep: { row: 4, frames: 8, fps: 6,  loop: true },
}

const IDLE_TO_SLEEP_MS = 12000
const IDLE_AUTO_WAVE_MS = 5000

interface PetCanvasProps {
  state?: AnimState
  onStateChange?: (s: AnimState) => void
  interactive?: boolean
  scale?: number
  className?: string
  style?: React.CSSProperties
}

export default function PetCanvas({
  state: externalState,
  onStateChange,
  interactive = true,
  scale = DISPLAY_SCALE,
  className,
  style,
}: PetCanvasProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const imgRef     = useRef<HTMLImageElement | null>(null)
  const imgLoaded  = useRef(false)
  const rafRef     = useRef<number>(0)
  const frameRef   = useRef(0)
  const lastTime   = useRef(0)
  const stateRef   = useRef<AnimState>('idle')
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const autoWaveT  = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    if (!interactive) return
    autoWaveT.current = setTimeout(() => {
      if (stateRef.current === 'idle') applyState('wave')
    }, IDLE_AUTO_WAVE_MS)
    idleTimer.current = setTimeout(() => {
      if (stateRef.current === 'idle') applyState('sleep')
    }, IDLE_TO_SLEEP_MS)
  }, [interactive, applyState])

  useEffect(() => {
    if (externalState && externalState !== stateRef.current) {
      applyState(externalState)
    }
  }, [externalState, applyState])

  useEffect(() => {
    const img = new window.Image()
    img.src = '/spritesheet.webp'
    img.onload = () => {
      imgRef.current = img
      imgLoaded.current = true
      setLoaded(true)
      resetIdleTimers()
    }
  }, [resetIdleTimers])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.imageSmoothingEnabled = false

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick)
      if (!imgLoaded.current) return

      const cfg = STATES[stateRef.current]
      if (now - lastTime.current < 1000 / cfg.fps) return
      lastTime.current = now

      const next = frameRef.current + 1
      if (next >= cfg.frames) {
        if (!cfg.loop && cfg.next) {
          stateRef.current = cfg.next
          setCurrentState(cfg.next)
          onStateChange?.(cfg.next)
          frameRef.current = 0
          resetIdleTimers()
        } else {
          frameRef.current = cfg.loop ? 0 : cfg.frames - 1
        }
      } else {
        frameRef.current = next
      }

      const activeCfg = STATES[stateRef.current]
      const sx = frameRef.current * FRAME_W
      const sy = activeCfg.row * FRAME_H

      ctx.clearRect(0, 0, canvasW, canvasH)
      ctx.drawImage(imgRef.current!, sx, sy, FRAME_W, FRAME_H, 0, 0, canvasW, canvasH)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      if (idleTimer.current)  clearTimeout(idleTimer.current)
      if (autoWaveT.current)  clearTimeout(autoWaveT.current)
    }
  }, [canvasW, canvasH, onStateChange, resetIdleTimers])

  const handleClick = useCallback(() => {
    if (!interactive) return
    applyState(currentState === 'sleep' ? 'idle' : 'wave')
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
      style={{ position: 'relative', width: displayW, height: displayH, cursor: interactive ? 'pointer' : 'default', ...style }}
      onClick={handleClick}
      onDoubleClick={handleDblClick}
      onMouseEnter={() => { if (interactive && currentState === 'sleep') applyState('idle') }}
      role={interactive ? 'button' : undefined}
      aria-label={interactive ? 'Interactive pet — click to wave, double-click to jump' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={(e) => { if (interactive && (e.key === 'Enter' || e.key === ' ')) handleClick() }}
    >
      {!loaded && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            border: '2px solid var(--color-border)',
            borderTopColor: 'var(--color-accent)',
            animation: 'pet-spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes pet-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={canvasW}
        height={canvasH}
        style={{
          width: displayW,
          height: displayH,
          imageRendering: 'pixelated',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s',
          display: 'block',
        }}
      />
    </div>
  )
}
