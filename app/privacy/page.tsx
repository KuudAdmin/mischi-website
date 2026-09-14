import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '../components/legal/LegalPage'
import { CONTACT_EMAIL } from '@/lib/release'

const DESCRIPTION =
  'The Mischi app has no telemetry and sends nothing to us. This policy explains what stays on your Mac, what goes to Groq if you use AI, and the little the website collects.'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: DESCRIPTION,
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy Policy | Mischi',
    description: DESCRIPTION,
    url: '/privacy',
    type: 'article',
  },
}

export default function PrivacyPage() {
  const email = <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>

  return (
    <LegalPage
      title="Privacy Policy"
      updated="September 14, 2026"
      intro="Mischi is built offline-first. The app runs on your Mac with no account and no telemetry, and it never sends anything to us. This policy explains exactly what stays on your Mac, what goes to Groq if you choose to use AI, and the small amount of data this website handles."
    >
      <h2>The short version</h2>
      <ul>
        <li><strong>No accounts.</strong> You don’t sign up for anything to use Mischi.</li>
        <li><strong>No telemetry.</strong> The app sends no analytics, usage data or crash reports, to us or anyone else.</li>
        <li><strong>Your data stays on your Mac.</strong> Pets, settings, reminders and notes are stored locally and never uploaded.</li>
        <li><strong>AI is optional.</strong> Only if you add your own Groq API key does the app contact Groq, directly from your Mac. We are never in the middle.</li>
        <li><strong>The website counts visits, it doesn’t track you.</strong> Cookieless, anonymous analytics tell us things like how many people download Mischi. No cookies, no profiles, no advertising. We only get your email if you subscribe to the newsletter or write to us.</li>
        <li><strong>We never sell your data</strong> or share it for advertising.</li>
      </ul>

      <h2>Who we are</h2>
      <p>
        Mischi is made by Kuud, based in Kerala, India (<strong>we</strong>, <strong>us</strong>). We’re responsible for the personal data described in this policy. You can reach us through the <Link href="/contact">contact page</Link> or at {email}.
      </p>

      <h2>The Mischi app</h2>

      <h3>What stays on your Mac</h3>
      <p>Mischi stores the following locally. None of it is sent to us:</p>
      <ul>
        <li>Pets you import, copied into <code>~/Library/Application Support/mischi/Pets</code>. Your original files are never changed.</li>
        <li>Your settings, reminders, animation names, chat lines and pet characters, in Mischi’s standard macOS preferences.</li>
        <li>Notes you ask Mischi to remember, in <code>~/Library/Application Support/Standalone Codex Pets/notes.json</code>.</li>
        <li>Your Groq API key, if you add one, in the macOS Keychain.</li>
        <li>Screenshots you ask for, saved to your clipboard or your Desktop.</li>
      </ul>
      <p>
        Ask Mischi doesn’t keep a conversation history: each question is handled on its own and isn’t saved to disk. The <Link href="/docs#uninstall">docs</Link> explain how to delete everything above.
      </p>

      <h3>Network access</h3>
      <p>
        Without a Groq API key, Mischi makes no network requests at all. It has no analytics, advertising or crash-reporting code, and it doesn’t check for updates in the background. macOS itself may collect diagnostics according to your Apple settings; that’s between you and Apple, and we don’t receive it.
      </p>

      <h3>macOS permissions</h3>
      <p>Mischi asks for these only when you first use the feature that needs them, and works without them:</p>
      <ul>
        <li><strong>Microphone</strong>, for voice mode in Ask Mischi.</li>
        <li><strong>Screen Recording</strong>, for Ask Mischi’s screenshot tool.</li>
      </ul>
      <p>You can turn either off at any time in System Settings → Privacy &amp; Security.</p>

      <h3>AI features and Groq</h3>
      <p>
        If you add a Groq API key, Mischi sends requests straight from your Mac to Groq, over an encrypted connection, only when you use an AI feature:
      </p>
      <ul>
        <li><strong>Ask Mischi:</strong> your question, your pet’s character, and the results of any tools used to answer it. For example, if you ask about your clipboard, its text is included; if you ask about your notes, the matching notes are included. Screenshots are not sent.</li>
        <li><strong>Voice mode:</strong> your recording, for transcription. The audio file is deleted from your Mac once it’s been transcribed.</li>
        <li><strong>Generated chatter and Enhance:</strong> your pet’s character description and animation names.</li>
        <li><strong>Model list and connection test:</strong> a request made with your key, containing no personal content.</li>
      </ul>
      <p>
        Groq handles this data under its own <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>. We never see these requests, and we don’t log, store or proxy them. If you ask Mischi to search the web or open a website, it hands off to your default browser, and that site’s own policies apply.
      </p>

      <h2>This website</h2>

      <h3>Browsing and downloads</h3>
      <p>
        mischi.app sets no cookies and uses no advertising or cross-site tracking. Fonts, images and videos are served from our own domain. Our hosting provider, Vercel, keeps standard server logs, such as IP address, browser type and the pages or files requested (including app downloads), to deliver the site and protect it from abuse. These logs are kept for a short period under Vercel’s retention settings, and we don’t use them to identify you.
      </p>

      <h3>Usage analytics</h3>
      <p>
        To understand how the site is used, such as how many people download Mischi, read the docs or send us a message, we use PostHog, set up to be as private as possible:
      </p>
      <ul>
        <li><strong>No cookies or browser storage.</strong> Nothing is saved on your device, so we can’t recognise you between visits or follow you across other sites, and no profile is built about you.</li>
        <li><strong>What’s recorded:</strong> the pages you view, which kinds of links you click (for example download, docs or external links), words you search for in the docs, and that a form was sent. Also basic technical details: browser, device type, the referring site, and an approximate location worked out from your IP address. The IP address itself is discarded and never stored.</li>
        <li><strong>What isn’t:</strong> your email address, name or message text, anything you type into forms, and screen recordings.</li>
        <li><strong>Your choice is respected:</strong> if your browser sends a Do Not Track or Global Privacy Control signal, analytics don’t load at all.</li>
      </ul>
      <p>
        Events are sent through our own domain to PostHog, which processes them for us under its <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">privacy policy</a>.
      </p>

      <h3>Contacting us</h3>
      <p>
        When you send a message through the <Link href="/contact">contact page</Link>, we receive your email address, your name if you give it, your message, and your Mischi and macOS versions if they’re included. Our server passes the message to our email delivery provider, Resend, which delivers it to our inbox; the website itself doesn’t store it. Resend handles it under its own <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>. As with the newsletter form, your IP address is held in memory briefly to limit repeated submissions.
      </p>
      <p>
        We use your message only to reply and to fix what you reported, and we never add you to the newsletter. You can also email us directly at {email}.
      </p>

      <h3>The newsletter</h3>
      <p>Subscribing is optional, and nothing else on the site or in the app requires it.</p>
      <ul>
        <li><strong>What we collect:</strong> only the email address you enter. No name, and the form sets no cookies.</li>
        <li><strong>Why:</strong> to send you news about new versions and occasional updates about Mischi.</li>
        <li><strong>Who stores it:</strong> our email provider, Kit (ConvertKit), and possibly a private Google Sheet we use as a backup of the list. See <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer">Kit’s privacy policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.</li>
        <li><strong>Spam protection:</strong> when you submit the form, our server holds your IP address in memory for about a minute to limit repeated attempts. It isn’t stored with your email.</li>
        <li><strong>Unsubscribing:</strong> every email has a one-click unsubscribe link, or you can ask us to delete your address at any time.</li>
      </ul>

      <h2>Legal bases</h2>
      <p>If you’re in the European Economic Area or the United Kingdom, we rely on:</p>
      <ul>
        <li><strong>Consent</strong> for the newsletter. You can withdraw it at any time by unsubscribing.</li>
        <li><strong>Legitimate interests</strong> for server logs that keep the website running and secure, for anonymous usage analytics that help us improve it, and for replying to messages you send us.</li>
      </ul>

      <h2>Who we share data with</h2>
      <p>
        We only share personal data with the service providers named in this policy (Vercel, PostHog, Kit, Google, Resend, and the provider that hosts our email inbox), and only so they can provide their service to us. We don’t sell personal data, and we don’t share it for cross-context behavioural advertising. We may disclose data if the law requires it.
      </p>
      <p>
        Some of these providers are based in the United States or elsewhere outside your country. Where required, they protect transfers with safeguards such as the European Commission’s Standard Contractual Clauses.
      </p>

      <h2>How long we keep data</h2>
      <ul>
        <li><strong>Newsletter:</strong> until you unsubscribe or ask us to delete your address.</li>
        <li><strong>Emails you send us:</strong> as long as we need them to handle your message, and then for a reasonable period in case you follow up.</li>
        <li><strong>Server logs:</strong> for the short period set by our hosting provider.</li>
        <li><strong>Analytics events:</strong> for up to a year. They’re never linked to your name or email.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, for example under India’s Digital Personal Data Protection Act, 2023 or the EU and UK GDPR, you may have the right to access, correct, delete or export your personal data, to object to or restrict how we use it, and to withdraw consent. Residents of California and other US states have similar rights, and we don’t discriminate against anyone for using them. Our analytics set no cookies and build no profiles, and they don’t load at all when your browser sends a Global Privacy Control or Do Not Track signal.
      </p>
      <p>
        To use any of these rights, contact us at {email}. We’ll respond within the time the law requires. You can also complain to your local data protection authority.
      </p>
      <p>
        Everything the app stores is already under your control on your Mac, and you can delete it yourself at any time.
      </p>

      <h2>Security</h2>
      <p>
        The website is served only over HTTPS, the app keeps your API key in the macOS Keychain, and requests to Groq are encrypted in transit. No method of storage or transmission is completely secure, but we keep the data we hold to a minimum. To report a security issue, see our <a href="/.well-known/security.txt">security.txt</a> or email {email}.
      </p>

      <h2>Children</h2>
      <p>
        Mischi is suitable for general audiences, but the newsletter and website aren’t directed at children under 13, or under 16 in the EEA and UK. We don’t knowingly collect their personal data. If you think a child has given us their email, contact us and we’ll delete it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change how Mischi or this website handles data, we’ll update this page and the date at the top. For significant changes, we’ll post a notice on this website before they take effect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy, or want your data removed? Use the <Link href="/contact">contact page</Link> or email {email}.
      </p>
    </LegalPage>
  )
}
