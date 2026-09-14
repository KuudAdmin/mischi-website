import type { Metadata } from 'next'
import { preload } from 'react-dom'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import ContactExperience from '../components/contact/ContactExperience'
import './contact.css'

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
  // The pet perched on the compose window.
  preload('/spritesheet.webp', { as: 'image' })

  return (
    <>
      <Nav />
      <main className="ct-main">
        <div aria-hidden="true" className="ct-backdrop" />
        <ContactExperience />
      </main>
      <Footer />
    </>
  )
}
