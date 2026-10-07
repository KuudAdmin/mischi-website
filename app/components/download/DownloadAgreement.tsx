'use client'

import { useId } from 'react'
import { RELEASE } from '@/lib/release'
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal'
import { track } from '@/lib/analytics'
import styles from '../legal/legal-controls.module.css'

export default function DownloadAgreement() {
  const checkboxId = useId()
  return (
    <form action="/api/download" method="post" onSubmit={() => track('download_clicked', { file: RELEASE.dmgFileName, location: 'download_agreement' })}>
      <p className={styles.copy}>Mischi is free beta software for {RELEASE.minMacOS} and later. Review the terms and privacy information before downloading.</p>
      <input type="hidden" name="termsVersion" value={TERMS_VERSION} />
      <input type="hidden" name="privacyVersion" value={PRIVACY_VERSION} />
      <label className={styles.check} htmlFor={checkboxId}>
        <input id={checkboxId} type="checkbox" name="agreement" value="yes" required />
        <span>I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Use</a> and acknowledge the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span>
      </label>
      <button type="submit" className={`${styles.button} ${styles.primary} ${styles.wide}`}>Agree &amp; download for Mac</button>
      <p className={styles.note}>v{RELEASE.version} · {RELEASE.size} · Apple Silicon &amp; Intel<br />This does not subscribe you to emails or enable website analytics.</p>
    </form>
  )
}
