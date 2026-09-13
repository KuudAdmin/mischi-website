import type { Metadata } from 'next'
import { Suspense } from 'react'
import LegalPage from '../components/legal/LegalPage'
import ContactForm from '../components/contact/ContactForm'

const DESCRIPTION =
  'Report a bug, suggest a feature or ask a question about Mischi, the desktop pet app for macOS.'

export const metadata: Metadata = {
  title: 'Contact',
  description: DESCRIPTION,
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact | Mischi',
    description: DESCRIPTION,
    url: '/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Contact"
      title="Get in touch"
      intro="Found a bug, have an idea, or made a pet you're proud of? Tell us. Mischi is made by a tiny team, and every message gets read."
    >
      {/* The form reads ?v= and ?os= (sent by the app's Report it button), so
          it renders on the client inside a Suspense boundary. */}
      <Suspense fallback={<div style={{ minHeight: '640px' }} />}>
        <ContactForm />
      </Suspense>
    </LegalPage>
  )
}
