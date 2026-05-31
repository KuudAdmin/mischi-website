'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Fades + slides its children up the first time they scroll into view.
 * No-op (shown immediately) when the user prefers reduced motion or the
 * browser lacks IntersectionObserver. The animation itself lives in
 * `.reveal` / `.reveal-in` in globals.css.
 */
export default function Reveal({
  children,
  delay = 0,
}: {
  children: ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      // Trigger once the element's top edge crosses ~88% down the viewport.
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal${shown ? ' reveal-in' : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
