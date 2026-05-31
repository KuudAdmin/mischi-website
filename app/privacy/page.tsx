import type { Metadata } from 'next'
import LegalPage from '../components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'The Mischi app collects no personal data and runs entirely offline. The only data we collect is the email you provide if you join the launch waitlist.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Mischi',
    description:
      'The Mischi app collects no personal data and runs entirely offline. The only data we collect is the email you provide if you join the launch waitlist.',
    url: '/privacy',
    type: 'article',
  },
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 31, 2026"
      intro="Mischi is built offline-first. The app runs entirely on your Mac: no telemetry, no phoning home, nothing stored about you. The only personal data we ever collect lives on this website, and only if you opt in to the launch waitlist by giving us your email. The details are below."
    >
      <h2>The short version</h2>
      <ul>
        <li><strong>No accounts.</strong> You don’t sign up for anything to use Mischi.</li>
        <li><strong>No telemetry.</strong> The app does not transmit usage data, crash reports, or analytics.</li>
        <li><strong>No cloud sync.</strong> Your pets, preferences, and assets stay on your device.</li>
        <li><strong>BYOK for AI.</strong> Mischi ships with Groq. If you enable AI features, you supply your own Groq API key and requests go directly from your Mac to Groq. We are not in the middle.</li>
        <li><strong>Waitlist is opt-in.</strong> If you join the launch waitlist, we collect only your email to notify you when Mischi ships, and you can unsubscribe at any time.</li>
      </ul>

      <h2>What Mischi stores locally</h2>
      <p>
        Mischi reads and writes the following on your Mac. None of it leaves your device:
      </p>
      <ul>
        <li>Imported pet packs, spritesheets, and <code>pet.json</code> files you add.</li>
        <li>Preferences (selected pet, behavior mode, menu-bar settings).</li>
        <li>If you enable AI chat: a local copy of your Groq API key (in macOS Keychain) and your chat history.</li>
      </ul>
      <p>
        You can delete any of this at any time by removing the Mischi app or clearing the corresponding files in <code>~/Library/Application Support/Mischi</code>.
      </p>

      <h2>Third-party services</h2>
      <p>
        Mischi does not bundle any third-party analytics, advertising, or crash-reporting SDKs.
      </p>
      <p>
        If you opt in to AI chat, requests are sent directly to Groq using the API key you configured. Groq’s own privacy policy governs how they handle the contents of your prompts. Mischi does not log, store, or proxy these requests.
      </p>

      <h2>This website</h2>
      <p>
        The marketing site you’re reading does not use cookies for tracking or set any analytics identifiers. Standard server logs from our hosting provider may record IP addresses and request paths for security and operational purposes, retained for a short period.
      </p>

      <h2>The launch waitlist</h2>
      <p>
        Mischi isn’t released yet. If you’d like to know when it launches, you can join the waitlist by entering your email address. This is entirely optional, and nothing else on the site requires it.
      </p>
      <ul>
        <li><strong>What we collect:</strong> only the email address you enter. We don’t ask for your name or anything else, and the form sets no tracking cookies.</li>
        <li><strong>Why:</strong> so we can email you when Mischi is available, plus the occasional progress update before then. Nothing else.</li>
        <li><strong>Who processes it:</strong> your email is sent to and stored by Kit (ConvertKit), our email provider, acting on our behalf. Their handling is governed by <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer">Kit’s privacy policy</a>.</li>
        <li><strong>Spam protection:</strong> when you submit the form, our server briefly uses your IP address to limit abuse. It is not stored alongside your email or used to identify you.</li>
        <li><strong>How long we keep it:</strong> until Mischi launches and we’ve notified you, or until you unsubscribe, whichever comes first.</li>
        <li><strong>Your choices:</strong> every email includes a one-click unsubscribe link, and you can ask us to delete your address at any time by emailing <a href="mailto:kuudstudio@gmail.com">kuudstudio@gmail.com</a>.</li>
      </ul>
      <p>
        You provide your email voluntarily, and submitting the form is your consent to the above. We will never sell it, and we won’t share it beyond the provider named here.
      </p>

      <h2>Children</h2>
      <p>
        Mischi is suitable for general audiences. We do not knowingly collect data from anyone, including children under 13.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we ever change how Mischi handles data, we will update this page and note the date at the top. For material changes, we will surface a notice in the app.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy, or want your waitlist email removed? Email us at <a href="mailto:kuudstudio@gmail.com">kuudstudio@gmail.com</a>.
      </p>
    </LegalPage>
  )
}
