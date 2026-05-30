import type { Metadata } from 'next'
import LegalPage from '../components/legal/LegalPage'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing your use of the Mischi macOS application and website.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms of Use — Mischi',
    description: 'Terms governing your use of the Mischi macOS application and website.',
    url: '/terms',
    type: 'article',
  },
}

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="May 27, 2026"
      intro="By installing or using Mischi, you agree to the terms below. They’re short on purpose — Mischi is a small desktop utility, not a service."
    >
      <h2>The software</h2>
      <p>
        Mischi is a macOS application that runs animated desktop pets on your Mac. It runs entirely on your device. You install it, you own your copy of it, and you decide what to do with it.
      </p>

      <h2>License</h2>
      <p>
        You are granted a non-exclusive, non-transferable, revocable license to install and use Mischi on Macs you own or control, for personal or internal business use. You may not redistribute, resell, or sublicense the application binary itself.
      </p>
      <p>
        Pet packs, spritesheets, and other assets you create or import are <strong>yours</strong>. Mischi makes no claim over them.
      </p>

      <h2>No warranty</h2>
      <p>
        Mischi is provided <strong>as-is</strong>, without warranty of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement. We don’t guarantee the app will work on every macOS version, with every accessory, or that it will be free of bugs.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, the authors of Mischi will not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of (or inability to use) the application — including but not limited to lost productivity, hurt feelings from a sleepy desktop pet, or anything else.
      </p>

      <h2>AI chat features (BYOK)</h2>
      <p>
        If you enable AI chat, you provide your own API key for the model of your choice. You are responsible for:
      </p>
      <ul>
        <li>Complying with the terms and acceptable use policy of the LLM provider you use.</li>
        <li>Any usage charges incurred against your API key.</li>
        <li>The content of the prompts you send and the responses you receive.</li>
      </ul>
      <p>
        Mischi does not relay, log, or modify these requests. They go directly from your Mac to the provider you chose.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don’t use Mischi for anything illegal, harmful, or that infringes someone else’s rights. Don’t reverse-engineer the binary to extract bundled assets you don’t have a license for.
      </p>

      <h2>Third-party content</h2>
      <p>
        If you import pet packs or spritesheets from third parties, you are responsible for ensuring you have the right to use them. Mischi does not vet imported assets.
      </p>

      <h2>Updates</h2>
      <p>
        We may release updates to fix bugs, add features, or change behavior. Updates are optional. If a future version changes how the app behaves in a way that matters, we will mention it in the release notes.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may revise these terms occasionally. When we do, we update the date at the top of this page. Continued use of Mischi after a revision means you accept the revised terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions or concerns about these terms? Reach out via the project’s GitHub issue tracker.
      </p>
    </LegalPage>
  )
}
