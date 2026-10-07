import type { Metadata } from 'next'
import LegalPage from '../components/legal/LegalPage'
import DownloadAgreement from '../components/download/DownloadAgreement'

export const metadata: Metadata = {
  title: 'Download Mischi',
  description: 'Review the terms and download Mischi for macOS.',
  alternates: { canonical: '/download' },
}

export default function DownloadPage() {
  return (
    <LegalPage eyebrow="Download" title="Bring Mischi home">
      <DownloadAgreement />
    </LegalPage>
  )
}
