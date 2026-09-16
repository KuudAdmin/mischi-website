'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import PetCanvas from '../demo/PetCanvas'
import { useInView } from '../useInView'

interface PetPreviewProps {
  name: string
  previewSrc: string
  spritesheetSrc: string
  eager?: boolean
}

const warmedSheets = new Map<string, Promise<void>>()

function warmSpritesheet(src: string) {
  const cached = warmedSheets.get(src)
  if (cached) return cached

  const ready = new Promise<void>((resolve, reject) => {
    const img = new window.Image()
    img.decoding = 'async'
    img.src = src

    const finish = () => {
      if (img.naturalWidth > 0) resolve()
      else reject(new Error(`Could not load ${src}`))
    }

    if (img.complete) {
      finish()
      return
    }

    img.onload = finish
    img.onerror = () => reject(new Error(`Could not load ${src}`))

    img.decode?.().then(resolve, () => {
      if (img.complete && img.naturalWidth > 0) resolve()
    })
  })

  ready.catch(() => warmedSheets.delete(src))
  warmedSheets.set(src, ready)
  return ready
}

export default function PetPreview({ name, previewSrc, spritesheetSrc, eager = false }: PetPreviewProps) {
  const [ref, inView] = useInView<HTMLDivElement>({
    once: true,
    rootMargin: '360px 0px',
    threshold: 0.01,
  })
  const [readySheet, setReadySheet] = useState<string | null>(null)
  const shouldWarmSheet = eager || inView
  const showAnimated = shouldWarmSheet && readySheet === spritesheetSrc

  useEffect(() => {
    if (!shouldWarmSheet) return

    let cancelled = false
    const start = () => {
      warmSpritesheet(spritesheetSrc).then(
        () => {
          if (!cancelled) setReadySheet(spritesheetSrc)
        },
        () => {},
      )
    }

    let cancel: (() => void) | undefined
    const requestIdle = window.requestIdleCallback
    const cancelIdle = window.cancelIdleCallback

    if (typeof requestIdle === 'function' && typeof cancelIdle === 'function') {
      const idleId = requestIdle(start, { timeout: eager ? 800 : 1400 })
      cancel = () => cancelIdle(idleId)
    } else {
      const timeoutId = globalThis.setTimeout(start, eager ? 180 : 360)
      cancel = () => globalThis.clearTimeout(timeoutId)
    }

    return () => {
      cancelled = true
      cancel?.()
    }
  }, [eager, shouldWarmSheet, spritesheetSrc])

  return (
    <div
      ref={ref}
      className="pets-preview"
      data-animated={showAnimated ? 'true' : undefined}
      aria-label={`${name} preview`}
    >
      <Image
        src={previewSrc}
        alt=""
        width={256}
        height={277}
        sizes="150px"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        unoptimized
        className="pets-preview-image"
      />
      {showAnimated ? (
        <div className="pets-preview-motion" aria-hidden="true">
          <PetCanvas
            spritesheet={spritesheetSrc}
            interactive={false}
            autoAnimate={false}
            scale={0.74}
            repeatShortAnims
          />
        </div>
      ) : null}
    </div>
  )
}
