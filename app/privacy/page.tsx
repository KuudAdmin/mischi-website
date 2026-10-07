import type { Metadata } from 'next'
import Link from 'next/link'
import LegalPage from '../components/legal/LegalPage'
import { CONTACT_EMAIL } from '@/lib/release'
import { PRIVACY_UPDATED, OPERATOR_NAME } from '@/lib/legal'
import { ANALYTICS_CONFIGURED } from '@/lib/privacy-preferences'
import { PrivacySettingsButton } from '../components/legal/PrivacyControls'

const DESCRIPTION =
  'The Mischi app has no telemetry. This policy explains local data, optional AI, release checks, and the data the website handles.'

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
      updated={PRIVACY_UPDATED}
      intro="Mischi is built offline-first. The app runs on your Mac with no account and no telemetry. This policy explains what stays on your Mac, what goes to Groq if you choose to use AI, how release checks work, and the data this website handles."
    >
      <h2>The short version</h2>
      <ul>
        <li><strong>No accounts.</strong> You don’t sign up for anything to use Mischi.</li>
        <li><strong>No telemetry.</strong> The app sends no analytics, usage data or crash reports, to us or anyone else.</li>
        <li><strong>Local storage.</strong> Pets, settings, reminders and notes are stored on your Mac. Content used by optional AI features may be sent to Groq as explained below.</li>
        <li><strong>AI is optional.</strong> Only if you add your own Groq API key does the app contact Groq, directly from your Mac. We are never in the middle.</li>
        <li><strong>Website data.</strong> The website processes connection information and information you choose to send through the newsletter or contact form. Optional usage analytics run only after you allow them. Contact drafts and privacy choices are saved in your browser.</li>
        <li><strong>No sale or advertising use.</strong> We do not sell personal data or share it for targeted advertising.</li>
      </ul>

      <h2>Who we are</h2>
      <p>
        Mischi is an independent project operated by <strong>{OPERATOR_NAME}</strong> (<a href="https://x.com/ajjuism" target="_blank" rel="noopener noreferrer">@ajjuism</a>), based in Kerala, India (<strong>we</strong>, <strong>us</strong>). Mischi is a project name, not an incorporated company. {OPERATOR_NAME} is responsible for deciding how the personal data described in this policy is used (the data controller, where that term applies). For privacy questions, requests or grievances, use the <Link href="/contact">contact page</Link> or email {email}.
      </p>

      <h2>The Mischi app</h2>

      <h3>What stays on your Mac</h3>
      <p>Mischi stores the following locally. The app does not upload these files to us, although optional AI features can send relevant content directly to Groq:</p>
      <ul>
        <li>Pets you import, copied into <code>~/Library/Application Support/mischi/Pets</code>. Your original files are never changed.</li>
        <li>Your settings, reminders, animation names, chat lines and pet characters, in Mischi’s standard macOS preferences.</li>
        <li>Notes you ask Mischi to remember, in <code>~/Library/Application Support/Standalone Codex Pets/notes.json</code>.</li>
        <li>Your Groq API key, if you add one, in the macOS Keychain.</li>
        <li>Screenshots you ask for, saved to your clipboard or your Desktop.</li>
      </ul>
      <p>
        Ask Mischi doesn’t save a conversation history in the app: each question is handled on its own. This does not determine how Groq handles requests sent to its service. The <Link href="/docs#uninstall">docs</Link> explain how to remove Mischi’s local data. Copies you make or retain in device backups are controlled by you and your backup provider.
      </p>

      <h3>Network access</h3>
      <p>
        From version 0.9.12, Mischi requests a small release file from mischi.app over HTTPS to check
        for updates. Automatic checks are enabled by default and run daily while the app is open;
        failed checks may retry after an hour. You can disable automatic checks in Preferences → About
        or check manually at any time. The request includes no pets, notes, settings, API keys, account
        identifiers or installed-version query parameters. Like any website request, it exposes your
        IP address and standard connection metadata to our hosting provider and may appear in its
        server logs. The update endpoint does not run website analytics or use cookies.
      </p>
      <p>
        Earlier versions do not check for updates. With automatic checks disabled and no manual check
        or AI feature in use, the base pet experience works offline. Mischi has no analytics,
        advertising or crash-reporting code. macOS itself may collect diagnostics according to your
        Apple settings and policies.
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
        Groq handles these requests under its own <a href="https://groq.com/privacy-policy" target="_blank" rel="noopener noreferrer">privacy policy</a>, terms and your account settings. They do not pass through our servers. Groq’s retention and processing practices are separate from the app’s local storage; deleting data on your Mac does not delete copies held by Groq. Avoid including passwords, sensitive information or other people’s personal data in AI requests. If you ask Mischi to search the web or open a website, it hands off to your default browser, and that site’s own policies apply.
      </p>

      <h2>This website</h2>

      <h3>Browsing and downloads</h3>
      <p>
        Our website code does not set advertising cookies or use advertising trackers. Fonts, images and videos are served from our own domain. Our hosting provider, Vercel, processes connection information such as IP address, browser information, request time and the pages or files requested, including app downloads and release checks. This information may appear in hosting and security logs used to deliver the service, diagnose problems and prevent abuse. See <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel’s privacy policy</a>.
      </p>

      <h3 id="analytics">Usage analytics and your choice</h3>
      <p>
        PostHog helps us understand use of the website, such as visits, downloads, docs usage and successful form submissions. It is optional: we do not initialise PostHog or send analytics events before you choose Allow analytics. Choosing No thanks, ignoring the prompt or withdrawing consent leaves analytics off without affecting downloads or use of the website. {ANALYTICS_CONFIGURED
          ? <>You can change your choice at any time using <PrivacySettingsButton /> in the footer or here.</>
          : 'Optional website analytics are currently disabled.'}
      </p>
      <ul>
        <li><strong>Memory-only identifiers.</strong> The analytics integration keeps temporary identifiers in memory rather than saving them in cookies or browser storage. These identifiers can associate events during a visit. Person profiles and session recording are disabled.</li>
        <li><strong>Usage and technical information.</strong> Events can include page paths, browser and device details, temporary identifiers, link categories, docs results opened, contact-topic categories and form-success events. We remove full page URLs, referring URLs, query strings, campaign properties and person-property fields from outgoing events. Analytics requests still expose connection information, including IP addresses, to the hosting and analytics providers. IP addresses may be used to derive approximate location.</li>
        <li><strong>Limited event content.</strong> We do not include contact-form names, email addresses or message contents, newsletter email addresses, or the text you type into docs search in our analytics events. Automatic capture of form interactions is disabled.</li>
        <li><strong>Browser privacy signals.</strong> If your browser exposes an enabled Do Not Track or Global Privacy Control signal to the website, we do not initialise PostHog or send website analytics events.</li>
      </ul>
      <p>
        Events are sent through our own domain to PostHog for processing on our behalf. Using memory-only identifiers does not make all event or connection information anonymous. See <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">PostHog’s privacy policy</a>. Our own analytics configuration does not control the separate hosting and security logs described above.
      </p>
      <p>
        We store your analytics choice, the choice version and its date in your browser’s local storage. A choice is valid for up to 180 days, after which analytics require a new opt-in. PostHog may also store a consent flag in local storage; this is a preference, not a persistent visitor identifier. Clearing site data removes these preferences. If storage is unavailable, your choice applies only to the current page session. Withdrawing consent stops new analytics capture and requests. We do not automatically retry failed analytics requests. Withdrawal cannot recall a request already in flight or erase events already received by the provider.
      </p>

      <h3>Download acknowledgement</h3>
      <p>
        The website download form asks you to agree to the Terms of Use and acknowledge this Privacy Policy. It sends that acknowledgement and the document versions to our server to start the download. We do not maintain a separate acceptance database or ask for your name or email to download the app. This acknowledgement does not give consent to analytics, subscribe you to the newsletter or waive your privacy rights. Standard hosting and security logs may still record the request.
      </p>

      <h3>Contacting us</h3>
      <p>
        When you submit the <Link href="/contact">contact form</Link>, our server processes your email address and the details you provide, such as your name, topic, subject, message, links, and Mischi or macOS version. When email delivery is configured, our server sends this information through Resend to our inbox. The website does not maintain a separate message database, but our email providers process and may retain messages and delivery records. See <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend’s privacy policy</a>. Your email address and a message are required to use the form; other details are optional.
      </p>
      <p>
        The contact page saves an unsent draft, including any name and email you have entered, in your browser’s local storage so you can return to it. Saving a draft does not send its contents to us. The saved draft is removed after a successful form submission, when you choose Start fresh, or when you clear the site’s browser data. Opening your email app or copying the fallback message does not automatically clear that draft.
      </p>
      <p>
        We use messages to respond to enquiries, provide support, investigate reported issues and improve Mischi. Sending a message does not subscribe you to the newsletter. You can also email us directly at {email}.
      </p>

      <h3>The newsletter</h3>
      <p>Subscribing is optional, and nothing else on the site or in the app requires it.</p>
      <ul>
        <li><strong>What we collect:</strong> the email address you enter and a label identifying the signup form. Newsletter providers may also maintain subscription status, consent and delivery records. The signup form does not ask for your name.</li>
        <li><strong>Why:</strong> to send you news about new versions and occasional updates about Mischi.</li>
        <li><strong>Who processes it:</strong> Kit (ConvertKit), and a private Google Sheet if our optional list backup is enabled. See <a href="https://kit.com/privacy" target="_blank" rel="noopener noreferrer">Kit’s privacy policy</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google’s privacy policy</a>.</li>
        <li><strong>Unsubscribing:</strong> use the unsubscribe link in a newsletter email or contact us to stop receiving newsletters. You can also request deletion of your subscription data. Limited records may be retained to honour your opt-out or meet legal obligations.</li>
      </ul>

      <h3>Preventing repeated submissions</h3>
      <p>
        The contact and newsletter endpoints use IP addresses in server memory to limit repeated submissions. Inactive rate-limit records are scheduled for removal about one minute after the last newsletter attempt or ten minutes after the last contact-form attempt. These rate-limit records are not added to your newsletter subscription or contact email. Separate hosting and security logs may retain connection information as described above.
      </p>

      <h2>Legal bases</h2>
      <p>Where the EU or UK GDPR applies to our processing, the relevant legal bases are:</p>
      <ul>
        <li><strong>Consent</strong> for the newsletter and optional website analytics. Withdraw newsletter consent by unsubscribing and analytics consent through Privacy settings.</li>
        <li><strong>Legitimate interests</strong> in operating and securing the website, preventing abuse, responding to enquiries and investigating support issues, subject to your rights and interests.</li>
        <li><strong>Contract</strong> where processing is necessary to provide a download you request under the Terms of Use.</li>
        <li><strong>Legal obligations</strong> where we need to comply with applicable law, including responding to valid privacy requests.</li>
      </ul>
      <p>Newsletter signup and contact-form submission are voluntary. Without an email address, we cannot deliver newsletters or reply by email. Neither is required to download or use the base app. Withdrawing consent does not affect the lawfulness of processing based on consent before its withdrawal.</p>

      <h2>Who we share data with</h2>
      <p>
        We use hosting, analytics, newsletter, email-delivery and email-inbox providers for the purposes described above. The integrations include Vercel, PostHog, Kit, Resend and, when enabled, Google Sheets. These providers may use their own subprocessors to deliver their services. We do not sell personal data or share it for cross-context behavioural advertising. We may also disclose information where required by law or where lawfully necessary to prevent abuse or establish, exercise or defend legal claims.
      </p>
      <p>
        We are based in India, and our service providers may process data in the United States, the European Economic Area and other countries. The location depends on the service and its configuration. Where applicable law requires safeguards for an international transfer, those requirements apply to our use of the provider. You can contact us for information about the providers, processing locations and transfer arrangements relevant to your data.
      </p>

      <h2>How long we keep data</h2>
      <p>Retention depends on why the information is needed, the service involved and any legal obligations. We keep personal data only for as long as needed for those purposes. The criteria we use are:</p>
      <ul>
        <li><strong>Newsletter:</strong> while you remain subscribed, with limited records afterwards where needed to record consent, respect an unsubscribe request or comply with law. Unsubscribing stops newsletters; it does not necessarily erase every provider record or backup immediately.</li>
        <li><strong>Support correspondence:</strong> for handling the enquiry and related follow-up, and where necessary to investigate an unresolved issue or meet legal obligations.</li>
        <li><strong>Hosting and security logs:</strong> according to the provider’s applicable retention settings and any need to investigate security incidents.</li>
        <li><strong>Analytics:</strong> we use event history to compare website usage and evaluate improvements over time. Our current PostHog plan provides a one-year reporting window. This limits which events are available in reports; it is not a guarantee that older events are deleted. Deletion is handled separately through the provider’s deletion processes, subject to the ability to locate the relevant records and any applicable legal exceptions. See <a href="https://posthog.com/docs/data/events-retention" target="_blank" rel="noopener noreferrer">PostHog’s event-retention explanation</a>. You can contact us about retention or deletion of your data.</li>
        <li><strong>Contact drafts and app data:</strong> on your device until removed as described above. Device backups may retain separate copies.</li>
        <li><strong>Analytics choices:</strong> we rely on a stored choice for up to 180 days. Stored preference records remain in your browser until replaced or cleared; an expired choice does not permit analytics.</li>
      </ul>
      <p>Deletion requests are subject to applicable legal exceptions. Providers may retain limited backup, security or compliance records under their own retention arrangements. Contact us for details about a particular record or service.</p>

      <h2>Your rights</h2>
      <p>
        Depending on the law that applies to you and our processing, you may have rights to access, correct or delete personal data, receive a portable copy, restrict or object to processing, and withdraw consent. These rights have conditions and exceptions; not every right applies to every situation or jurisdiction. We do not discriminate against you for exercising applicable privacy rights.
      </p>
      <p>
        To make a privacy request or raise a concern, contact {email}. We may ask for information reasonably needed to verify your identity and locate the relevant records. We will respond in accordance with applicable law, including any required response period and permitted extensions.
      </p>
      <p>
        Where applicable law provides this right, you may lodge a complaint with the competent data protection authority. For the EEA, see the <a href="https://www.edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer">list of supervisory authorities</a>; in the UK, see the <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">Information Commissioner’s Office</a>. Contacting us does not limit that right.
      </p>
      <p>
        You can remove local app data using the <Link href="/docs#uninstall">uninstall instructions</Link>. We cannot access or remotely delete data stored only on your Mac. Requests about data held by Groq under your own account should also be directed to Groq.
      </p>

      <h2>Security</h2>
      <p>
        We use safeguards appropriate to the information we handle, including HTTPS for the public website and encrypted connections for requests to Groq. The app stores your Groq API key in the macOS Keychain. These measures reduce risk but cannot guarantee absolute security. To report a security concern, email {email}. This statement does not limit our obligations under applicable data protection law.
      </p>

      <h2>Children</h2>
      <p>
        The newsletter and contact service are not directed at children under 13. Where local law requires a higher age or parental authorisation for a particular use of personal data, those requirements also apply. We do not knowingly collect children’s personal data through these services without any authorisation required by law. If you believe a child has provided personal data that we should not hold, contact {email} so we can investigate and take appropriate action, including deletion where required.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy to reflect changes in the app, website or applicable requirements. The date at the top identifies the latest revision. Where required by law, we will provide additional notice of material changes and obtain consent before using personal data for a new purpose that requires it.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about privacy, or want your data removed? Use the <Link href="/contact">contact page</Link> or email {email}.
      </p>
    </LegalPage>
  )
}
