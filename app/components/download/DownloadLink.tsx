'use client'

import { useId, useState, type ReactNode } from 'react'
import LegalDialog from '../legal/LegalDialog'
import DownloadAgreement from './DownloadAgreement'
import styles from '../legal/legal-controls.module.css'

export default function DownloadLink({ children, className }: { children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  return (
    <>
      <a href="/download" className={className} aria-haspopup="dialog" onClick={(event) => {
        // Modified clicks and browsers without JavaScript use the full page.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        setOpen(true)
      }}>{children}</a>
      <LegalDialog open={open} onClose={() => setOpen(false)} titleId={titleId}>
        <p className={styles.eyebrow}>One small step</p>
        <h2 id={titleId} className={styles.title}>Bring Mischi home</h2>
        <DownloadAgreement key={open ? 'open' : 'closed'} />
      </LegalDialog>
    </>
  )
}
