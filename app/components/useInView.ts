'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Tracks whether an element is on screen. With `once`, it latches to true the
 * first time the element appears, which suits one-off entrance effects; without
 * it, it follows the element in and out, which suits pausing work offscreen.
 *
 * If IntersectionObserver is missing it simply stays false, so effects that
 * depend on it never run and the content is shown in its resting state.
 */
export function useInView<T extends Element>({
  once = false,
  rootMargin = '0px',
  threshold = 0,
}: { once?: boolean; rootMargin?: string; threshold?: number } = {}) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once, rootMargin, threshold])

  return [ref, inView] as const
}
