'use client'

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './legal-controls.module.css'

const subscribe = () => () => {}
const clientReady = () => true
const serverReady = () => false

export default function LegalDialog({ open, onClose, titleId, children }: {
  open: boolean
  onClose: () => void
  titleId: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const mounted = useSyncExternalStore(subscribe, clientReady, serverReady)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open, mounted])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  if (!mounted) return null
  return createPortal(
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const box = event.currentTarget.getBoundingClientRect()
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose()
      }}
    >
      <button type="button" className={styles.close} aria-label="Close dialog" onClick={onClose} autoFocus>
        <span aria-hidden="true">×</span>
      </button>
      {children}
    </dialog>, document.body,
  )
}
