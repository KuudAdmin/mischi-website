'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { usePathname } from 'next/navigation'
import { trackPageview } from '@/lib/analytics'
import { privacyStatus, saveAnalyticsChoice, subscribePrivacyChanges, PRIVACY_SETTINGS_EVENT, type PrivacyStatus } from '@/lib/privacy-preferences'
import LegalDialog from './LegalDialog'
import styles from './legal-controls.module.css'

const serverStatus = (): PrivacyStatus => 'loading'

export function PrivacySettingsButton() {
  return <button type="button" className={styles.settings} onClick={() => window.dispatchEvent(new Event(PRIVACY_SETTINGS_EVENT))}>Privacy settings</button>
}

export default function PrivacyControls() {
  const status = useSyncExternalStore(subscribePrivacyChanges, privacyStatus, serverStatus)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { trackPageview(pathname) }, [pathname])
  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener(PRIVACY_SETTINGS_EVENT, show)
    return () => window.removeEventListener(PRIVACY_SETTINGS_EVENT, show)
  }, [])

  function choose(choice: 'accepted' | 'rejected') {
    saveAnalyticsChoice(choice)
    setOpen(false)
  }

  return (
    <>
      {status === 'unknown' && !open && (
        <aside className={styles.banner} aria-labelledby="analytics-choice-title">
          <h2 id="analytics-choice-title" className={styles.title}>Help improve Mischi?</h2>
          <p className={styles.copy}>Allow optional website analytics from PostHog to help us understand visits and downloads. We use temporary identifiers and device information. Your choice won’t affect downloads. <a href="/privacy#analytics">Privacy details</a></p>
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => choose('rejected')}>No thanks</button>
            <button type="button" className={styles.button} onClick={() => choose('accepted')}>Allow analytics</button>
          </div>
          <p className={styles.note}>Change your choice anytime in Privacy settings.</p>
        </aside>
      )}
      <LegalDialog open={open} onClose={() => setOpen(false)} titleId="privacy-settings-title">
        <p className={styles.eyebrow}>Your choice</p>
        <h2 id="privacy-settings-title" className={styles.title}>Website privacy</h2>
        <p className={styles.copy}>Optional analytics help us understand visits and downloads. They are separate from accepting the app’s terms and signing up for the newsletter. <a href="/privacy#analytics" target="_blank" rel="noopener noreferrer">Read the Privacy Policy</a>.</p>
        <p className={styles.copy} role="status">
          {status === 'disabled' ? 'Optional analytics are not enabled on this website.'
            : status === 'blocked' ? 'Analytics are off because your browser sends a Do Not Track or Global Privacy Control signal.'
            : status === 'accepted' ? 'Optional analytics are currently on.'
            : 'Optional analytics are currently off.'}
        </p>
        {status !== 'disabled' && status !== 'loading' && (
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => choose('rejected')}>{status === 'accepted' ? 'Turn analytics off' : 'Keep analytics off'}</button>
            <button type="button" className={styles.button} disabled={status === 'blocked'} onClick={() => choose('accepted')}>Allow analytics</button>
          </div>
        )}
        <p className={styles.note}>We remember your choice in this browser for up to 180 days. Hosting and security requests are necessary to serve the website.</p>
      </LegalDialog>
    </>
  )
}
