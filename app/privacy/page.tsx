import type { Metadata } from 'next'
import LegalPage from '../components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Privacy Policy — Mischi',
  description:
    'Mischi is offline-first and does not collect, transmit, or store any personal data.',
}

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="May 27, 2026"
      intro="Mischi is built offline-first. The app runs entirely on your Mac. We don’t collect telemetry, we don’t phone home, and we don’t store anything about you on our servers — because we don’t have any."
    >
      <h2>The short version</h2>
      <ul>
        <li><strong>No accounts.</strong> You don’t sign up for anything to use Mischi.</li>
        <li><strong>No telemetry.</strong> The app does not transmit usage data, crash reports, or analytics.</li>
        <li><strong>No cloud sync.</strong> Your pets, preferences, and assets stay on your device.</li>
        <li><strong>BYOK for AI.</strong> If you enable AI features, you supply your own API key and the request goes directly from your Mac to the provider you chose. We are not in the middle.</li>
      </ul>

      <h2>What Mischi stores locally</h2>
      <p>
        Mischi reads and writes the following on your Mac. None of it leaves your device:
      </p>
      <ul>
        <li>Imported pet packs, spritesheets, and <code>pet.json</code> files you add.</li>
        <li>Preferences (selected pet, behavior mode, menu-bar settings).</li>
        <li>If you enable AI chat: a local copy of your API key (in macOS Keychain) and your chat history.</li>
      </ul>
      <p>
        You can delete any of this at any time by removing the Mischi app or clearing the corresponding files in <code>~/Library/Application Support/Mischi</code>.
      </p>

      <h2>Third-party services</h2>
      <p>
        Mischi does not bundle any third-party analytics, advertising, or crash-reporting SDKs.
      </p>
      <p>
        If you opt in to AI chat, requests are sent directly to the LLM provider whose key you configured (for example, Anthropic, OpenAI, or a local model). That provider’s own privacy policy governs how they handle the contents of your prompts. Mischi does not log, store, or proxy these requests.
      </p>

      <h2>This website</h2>
      <p>
        The marketing site you’re reading does not use cookies for tracking or set any analytics identifiers. Standard server logs from our hosting provider may record IP addresses and request paths for security and operational purposes, retained for a short period.
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
        Questions about privacy? Reach out via the project’s GitHub issue tracker.
      </p>
    </LegalPage>
  )
}
