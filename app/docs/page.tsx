import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import DocsSearch from '../components/docs/DocsSearch'
import { RELEASE } from '@/lib/release'

const DESCRIPTION =
  'Install Mischi, learn every setting, set up AI with Groq, and create your own Codex-compatible desktop pets.'

export const metadata: Metadata = {
  title: 'Docs',
  description: DESCRIPTION,
  alternates: { canonical: '/docs' },
  openGraph: {
    title: 'Docs | Mischi',
    description: DESCRIPTION,
    url: '/docs',
    type: 'article',
  },
}

const CODEX_PETS_GUIDE = 'https://learn.chatgpt.com/docs/pets'
const HATCH_PET_SKILL = 'https://github.com/openai/skills/tree/main/skills/.curated/hatch-pet'

const TOC = [
  { id: 'install', label: 'Install' },
  { id: 'basics', label: 'Everyday use' },
  { id: 'pets', label: 'Pets & library' },
  { id: 'behavior', label: 'Behavior & animations' },
  { id: 'reminders', label: 'Reminders' },
  { id: 'window', label: 'Window & startup' },
  { id: 'ai', label: 'AI with Groq' },
  { id: 'ask', label: 'Ask Mischi' },
  { id: 'create-pets', label: 'Create your own pet' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
  { id: 'uninstall', label: 'Uninstall & reset' },
  { id: 'help', label: 'Get help' },
]

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="docs-main">
        <div aria-hidden="true" className="docs-backdrop" />

        <header className="docs-header">
          <p className="docs-eyebrow">Docs</p>
          <h1>Everything about Mischi</h1>
          <p className="docs-lede">
            How to install it, what every setting does, how to set up AI, and how to make pets of your own.
          </p>
          <p className="docs-meta">
            <span className="docs-beta">{RELEASE.channel}</span>
            Written for Mischi {RELEASE.version} on {RELEASE.minMacOS} or later
          </p>
          <DocsSearch />
        </header>

        <div className="docs-layout">
          <nav className="docs-toc" aria-label="On this page">
            <p>On this page</p>
            <ol>
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className="docs-body">
            {/* ── Install ─────────────────────────────────────────────── */}
            <section id="install" aria-labelledby="install-h">
              <h2 id="install-h">Install</h2>
              <p>
                Mischi is a free, native Mac app. It&apos;s in public beta, so expect frequent updates and the
                occasional rough edge.
              </p>
              <Table
                head={['Requirement', 'Details']}
                rows={[
                  ['macOS', '13 Ventura or later'],
                  ['Mac', 'Apple Silicon or Intel. One Universal download covers both.'],
                  ['Download', `${RELEASE.size} disk image`],
                  ['Groq API key', 'Optional. Only needed for chat, voice and generated chatter.'],
                  ['Microphone', 'Optional. Only needed for voice mode.'],
                ]}
              />

              <h3>Download and install</h3>
              <ol className="docs-steps">
                <li>
                  <a href={RELEASE.dmgUrl} download>Download {RELEASE.dmgFileName}</a> ({RELEASE.size}).
                </li>
                <li>Open it from your Downloads folder. A window shows Mischi next to your Applications folder.</li>
                <li>Drag <strong>Mischi</strong> onto <strong>Applications</strong>.</li>
                <li>Open Mischi from Applications, Launchpad or Spotlight.</li>
              </ol>
              <Callout title="Why Applications?">
                Mischi is signed with a Developer ID and notarised by Apple, so it opens without Gatekeeper
                warnings. Run it from Applications, not from the disk image or your Downloads folder: macOS only
                handles <strong>Launch at login</strong> reliably for apps installed there.
              </Callout>

              <h3>First launch</h3>
              <p>
                A short welcome tour covers the basics, and your pet appears on the desktop. Mischi comes with a
                pet built in, so there&apos;s nothing to set up before you can play.
              </p>
              <p>
                Mischi is a menu bar app. Look for its icon at the top right of your screen. It stays out of the
                Dock unless you turn on <strong>Preferences → Advanced → Show Dock icon</strong>. To watch the tour
                again, go to <strong>Preferences → About → Welcome tour</strong>.
              </p>

              <h3>Updating</h3>
              <p>
                Download the latest version from the <Link href="/#download">download page</Link>, quit Mischi,
                and drag the new copy into Applications, replacing the old one. Your pets, settings, reminders
                and API key are kept. <Link href="/#newsletter">Join the newsletter</Link> to hear when a new
                version is out.
              </p>
            </section>

            {/* ── Everyday use ────────────────────────────────────────── */}
            <section id="basics" aria-labelledby="basics-h">
              <h2 id="basics-h">Everyday use</h2>
              <p>
                Your pet lives in a transparent window above your other apps. It follows you to every Space and
                over full-screen apps, and it never steals focus from what you&apos;re doing.
              </p>
              <Table
                head={['Do this', 'To']}
                rows={[
                  ['Click the pet', <>Run its click action, set in <strong>Preferences → Behavior → On click</strong></>],
                  ['Double-click', 'Play a random animation'],
                  [<><Kbd>⌘</Kbd> + double-click</>, 'Open Ask Mischi'],
                  [<><Kbd>⌘</Kbd> <Kbd>K</Kbd> in any app</>, 'Open Ask Mischi'],
                  ['Drag', 'Move it. Mischi remembers the spot, even across displays.'],
                  ['Right-click', 'Open the Mischi menu'],
                  ['Click the menu bar icon', 'Open the same menu'],
                ]}
              />

              <h3>The Mischi menu</h3>
              <p>
                The menu is the same wherever you open it: on the pet, in the menu bar, or on the Dock icon if
                you&apos;ve turned it on.
              </p>
              <ul>
                <li><strong>Show / hide</strong> the pet.</li>
                <li><strong>Animation</strong>: play any animation you&apos;ve named, or go back to the default loop.</li>
                <li><strong>Speed</strong>, <strong>Scale</strong> and <strong>Behavior</strong>: quick versions of the settings below.</li>
                <li><strong>Library</strong>: switch pets, reveal one in Finder, or delete it.</li>
                <li><strong>Import Pet Folder…</strong> and <strong>Import Pet .zip…</strong></li>
                <li><strong>Preferences…</strong> and <strong>Quit Mischi</strong>.</li>
              </ul>
              <p>
                Preferences has seven tabs: Pet, Behavior, Animations, Reminders, Window, Advanced and About. The
                sections below cover them.
              </p>
            </section>

            {/* ── Pets & library ──────────────────────────────────────── */}
            <section id="pets" aria-labelledby="pets-h">
              <h2 id="pets-h">Pets &amp; library</h2>
              <p>
                A pet is a folder containing a <code>pet.json</code> and a <code>spritesheet.webp</code>. It&apos;s
                the same format OpenAI Codex uses, so every Codex pet works in Mischi.
              </p>

              <h3>Add pets</h3>
              <Table
                head={['Method', 'Use it when']}
                rows={[
                  ['Scan Codex', <>You already have pets in <code>~/.codex/pets/</code>. Mischi adds any that aren&apos;t in your library yet.</>],
                  ['Import Folder', 'You have a pet folder somewhere on your Mac.'],
                  ['Import .zip', 'You downloaded a pet as a .zip file.'],
                ]}
              />
              <p>
                All three live in <strong>Preferences → Pet</strong>, and folder and .zip imports are in the Mischi
                menu too. Mischi copies each pet into its own library and never changes the original.
              </p>

              <h3>Switch and manage</h3>
              <p>
                Pick a pet in <strong>Preferences → Pet</strong>, or use <strong>Library → Switch to…</strong> in
                the menu. Deleting a pet only removes Mischi&apos;s copy.
              </p>
              <p>
                Your library is in <code>~/Library/Application Support/mischi/Pets/</code>. To open it, go to{' '}
                <strong>Preferences → Advanced → Pet library folder → Reveal in Finder</strong>.
              </p>

              <h3>If an import fails</h3>
              <Table
                head={['Message', 'What to check']}
                rows={[
                  ['This folder does not contain pet.json.', 'Pick the folder that holds pet.json directly, not the folder above it.'],
                  ['This folder does not contain spritesheet.webp.', <>The sheet must sit next to pet.json, named <code>spritesheet.webp</code> or whatever <code>spritesheetPath</code> says.</>],
                  ['spritesheet.webp could not be decoded.', 'The file is damaged or in an unsupported format. Re-export it as a transparent WebP or PNG.'],
                  ['No animation states were found.', <>Check the sheet follows the <a href="#create-pets">8 × 9 atlas layout</a>.</>],
                ]}
              />
            </section>

            {/* ── Behavior & animations ───────────────────────────────── */}
            <section id="behavior" aria-labelledby="behavior-h">
              <h2 id="behavior-h">Behavior &amp; animations</h2>

              <h3>Modes</h3>
              <p>
                <strong>Preferences → Behavior → Mode</strong> sets what your pet does when you leave it alone.
                No mode plays the same animation twice in a row.
              </p>
              <Table
                head={['Mode', 'What it does']}
                rows={[
                  ['Still', 'Never animates on its own.'],
                  ['Friendly', 'Plays an expressive animation every 8–18 seconds, with longer pauses now and then.'],
                  ['Busy', 'The same idea at a quicker pace, every 3–8 seconds.'],
                  ['Wander', 'Strolls a short way across your screen every few seconds and turns around at the edges.'],
                ]}
              />

              <h3>Other behavior settings</h3>
              <ul>
                <li><strong>On click</strong>: No action, Random animation, Toggle running, or any animation you&apos;ve named.</li>
                <li><strong>Playback speed</strong>: 0.5×, 0.75×, 1× or 1.5× for every animation.</li>
                <li><strong>Idle chatter</strong>: the occasional speech bubble while you&apos;re inactive, using the chat lines you&apos;ve written.</li>
                <li><strong>Ask input</strong>: whether Ask Mischi opens in Text or Voice mode.</li>
              </ul>

              <h3>Character</h3>
              <p>
                At the top of the Behavior tab, each pet gets its own character: a <strong>name</strong>, a{' '}
                <strong>tone</strong> and a <strong>personality</strong>. The character shapes Ask Mischi&apos;s
                replies and any chatter Groq writes. <strong>✨ Enhance</strong> turns a quick sketch into a fuller
                description, and <strong>When you&apos;re talking to it</strong> picks an animation to loop while
                the Ask prompt is open.
              </p>

              <h3>Animations</h3>
              <p>Mischi finds every row of a pet&apos;s spritesheet that has frames. In <strong>Preferences → Animations</strong> you can:</p>
              <ul>
                <li>
                  <strong>Name each row</strong>, like “Wave” or “Drink water”. Names show up in the menu, the click
                  action, reminders, and Ask Mischi (“wave hello”).
                </li>
                <li><strong>Add chat lines</strong>, one per line. When the animation plays, the pet says one at random.</li>
                <li>
                  <strong>Generate chatter with Groq</strong>: one request writes in-character lines for every named
                  animation. <em>Replace</em> overwrites existing lines and <em>Append</em> adds to them. It needs a
                  personality to write from.
                </li>
                <li><strong>Swap left / right movement</strong>: turn this on if your pet runs backwards while wandering or being dragged.</li>
              </ul>
            </section>

            {/* ── Reminders ───────────────────────────────────────────── */}
            <section id="reminders" aria-labelledby="reminders-h">
              <h2 id="reminders-h">Reminders</h2>
              <p>
                Mischi can nudge you to stretch, drink water or join a call. When a reminder fires, your pet says
                it in a chat bubble and can play an animation.
              </p>
              <p>In <strong>Preferences → Reminders</strong>, a reminder has:</p>
              <ul>
                <li><strong>What</strong>: the words your pet will say.</li>
                <li><strong>When</strong>: the date and time it first goes off.</li>
                <li><strong>Repeats</strong>: Once, Every minute, Hourly, Daily, Weekly, or Custom (every so many seconds, minutes, hours, days or weeks).</li>
                <li><strong>Animation</strong>: optional, played when it fires.</li>
              </ul>
              <p>
                You can edit or delete reminders at any time. With a <a href="#ai">Groq key</a> you can also just
                ask: “remind me in 20 minutes to stretch”.
              </p>
              <Callout title="Keep Mischi running">
                Reminders come from the app itself, so they only fire while Mischi is open. Turn on{' '}
                <strong>Launch at login</strong> in Preferences → Advanced so none get missed.
              </Callout>
            </section>

            {/* ── Window & startup ────────────────────────────────────── */}
            <section id="window" aria-labelledby="window-h">
              <h2 id="window-h">Window &amp; startup</h2>
              <Table
                head={['Setting', 'Tab', 'What it does']}
                rows={[
                  ['Scale', 'Window', 'Pet size, from 25% to 200%. Pixel art stays crisp at every size.'],
                  ['Window level', 'Window', 'Floating and Always on Top keep the pet above your apps. Desktop tucks it behind every window.'],
                  ['Click-through', 'Window', 'Clicks pass through the pet to whatever is underneath. Reach Mischi from the menu bar icon while it’s on.'],
                  ['Start hidden', 'Window', 'Launch without showing the pet. Show it from the menu.'],
                  ['Launch at login', 'Advanced', 'Open Mischi automatically when you sign in.'],
                  ['Show Dock icon', 'Advanced', 'Put Mischi in the Dock and the ⌘-Tab switcher.'],
                ]}
              />
            </section>

            {/* ── AI with Groq ────────────────────────────────────────── */}
            <section id="ai" aria-labelledby="ai-h">
              <h2 id="ai-h">AI with Groq</h2>
              <p>
                Mischi&apos;s AI features are optional, and you bring your own key. Your pet, animations and
                reminders all work without them. A Groq key adds:
              </p>
              <ul>
                <li><a href="#ask"><strong>Ask Mischi</strong></a>, an assistant that can take actions on your Mac</li>
                <li><strong>Voice mode</strong>, so you can talk instead of type</li>
                <li><strong>Generated chatter</strong> and <strong>✨ Enhance</strong> for your pet&apos;s character</li>
              </ul>

              <h3>Set up your key</h3>
              <ol className="docs-steps">
                <li>
                  Create a free API key at{' '}
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer">console.groq.com</a>.
                </li>
                <li>Open <strong>Preferences → Advanced → Groq · BYOK</strong>, then paste and save the key.</li>
                <li>
                  Choose a <strong>Model</strong>. Mischi fetches the current list from Groq and only offers models
                  that can use its tools.
                </li>
                <li>Click <strong>Test</strong> next to Connection to check everything works.</li>
              </ol>
              <Callout title="Where your key goes">
                Your key is stored in the macOS Keychain. It&apos;s only ever sent to Groq, and requests go straight
                from your Mac to Groq with no Mischi servers in between. Usage counts against your own Groq account.
              </Callout>
              <p>
                Seeing “too many requests”? You&apos;ve hit your Groq plan&apos;s rate limit. Wait a minute or pick a
                smaller, faster model. Groq retires models from time to time, so if one stops working, choose
                another from the same list.
              </p>
            </section>

            {/* ── Ask Mischi ──────────────────────────────────────────── */}
            <section id="ask" aria-labelledby="ask-h">
              <h2 id="ask-h">Ask Mischi</h2>
              <p>
                Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> in any app, or hold <Kbd>⌘</Kbd> and double-click your pet. A prompt
                opens above the pet. Type your question and press <Kbd>⏎</Kbd>, and Mischi answers in character.
              </p>
              <p>Mischi decides by itself when to use one of its tools:</p>
              <Table
                head={['Tool', 'Try saying']}
                rows={[
                  ['Take a screenshot', '“Screenshot my screen to the clipboard”'],
                  ['Add a reminder', '“Remind me in 20 minutes to stretch”'],
                  ['Read the clipboard', '“Summarise what’s on my clipboard”'],
                  ['Play an animation', '“Wave hello”'],
                  ['Save a note', '“Remember I parked on level 3”'],
                  ['Recall notes', '“Where did I park?”'],
                  ['Open an app or website', '“Open Spotify” or “Go to news.ycombinator.com”'],
                  ['Search the web', '“Search for pizza near me” opens the results in your browser'],
                ]}
              />
              <p>
                Notes are saved on your Mac in{' '}
                <code>~/Library/Application Support/Standalone Codex Pets/notes.json</code>.
              </p>

              <h3>Voice mode</h3>
              <p>
                Switch between text and voice with the badge on the prompt, or set the default in{' '}
                <strong>Preferences → Behavior → Ask input</strong>. In voice mode, just talk and pause when
                you&apos;re done. Groq&apos;s Whisper model transcribes the recording and Mischi sends your
                question. The audio is thrown away afterwards.
              </p>
              <p>
                The first time, macOS asks for microphone access. If you declined, turn it on in{' '}
                <strong>System Settings → Privacy &amp; Security → Microphone</strong>.
              </p>
              <Callout title="⌘K already taken?">
                If another app uses ⌘K, the shortcut may not reach Mischi. ⌘-double-clicking your pet always
                works.
              </Callout>
            </section>

            {/* ── Create your own pet ─────────────────────────────────── */}
            <section id="create-pets" aria-labelledby="create-pets-h">
              <h2 id="create-pets-h">Create your own pet</h2>
              <p>
                Mischi uses the Codex pet format, so a pet you make works in both Mischi and Codex. It&apos;s a
                folder with two files:
              </p>
              <pre className="docs-pre"><code>{`biscuit/
├── pet.json
└── spritesheet.webp`}</code></pre>

              <h3>Hatch one with Codex</h3>
              <p>
                The quickest way to a new pet is to let Codex draw it. OpenAI&apos;s{' '}
                <a href={HATCH_PET_SKILL} target="_blank" rel="noopener noreferrer">hatch-pet skill</a> turns a
                description or a reference image into a finished pet with every animation.
              </p>
              <ol className="docs-steps">
                <li>
                  In the Codex app, open <strong>Settings → Pets</strong> and choose <strong>Create pet</strong>.
                  Codex installs the hatch-pet skill and starts a new chat.
                </li>
                <li>
                  Describe your pet, or attach a picture: your cat, a mascot, a doodle. You can ask for a style too,
                  like pixel, plush, clay or sticker.
                </li>
                <li>Codex draws every animation and saves the pet to <code>{'~/.codex/pets/<name>/'}</code>.</li>
                <li>In Mischi, open <strong>Preferences → Pet</strong> and click <strong>Scan Codex</strong>.</li>
              </ol>
              <p>
                OpenAI&apos;s <a href={CODEX_PETS_GUIDE} target="_blank" rel="noopener noreferrer">Codex pets guide</a>{' '}
                has the details, including the sprite sheet rules Codex checks.
              </p>

              <h3>The spritesheet</h3>
              <p>To draw a pet yourself, or to check one before sharing it, here&apos;s the layout:</p>
              <Table
                head={['Property', 'Value']}
                rows={[
                  ['Size', 'Exactly 1536 × 1872 pixels'],
                  ['Grid', '8 columns × 9 rows'],
                  ['Cell', '192 × 208 pixels per frame'],
                  ['Format', 'WebP or PNG with a transparent background, up to 20 MB'],
                  ['Unused cells', 'Fully transparent'],
                ]}
              />
              <p>Each row is one animation, with frames running left to right. Codex orders the rows like this:</p>
              <Table
                head={['Row', 'State', 'Shows']}
                rows={[
                  ['0', <code key="s">idle</code>, 'Resting: a gentle breath or blink'],
                  ['1', <code key="s">running-right</code>, 'Moving to the right'],
                  ['2', <code key="s">running-left</code>, 'Moving to the left'],
                  ['3', <code key="s">waving</code>, 'A wave'],
                  ['4', <code key="s">jumping</code>, 'A hop'],
                  ['5', <code key="s">failed</code>, 'Something went wrong'],
                  ['6', <code key="s">waiting</code>, 'Waiting for you'],
                  ['7', <code key="s">running</code>, 'Busy working'],
                  ['8', <code key="s">review</code>, 'Leaning in to take a close look'],
                ]}
              />
              <p>
                Mischi doesn&apos;t rely on that exact order. It plays row 0 as the default loop, works out how many
                frames each row has, and lets you name every row in <a href="#behavior">Preferences → Animations</a>.
              </p>

              <h3>pet.json</h3>
              <p>A Codex pet needs only a few fields:</p>
              <pre className="docs-pre"><code>{`{
  "id": "biscuit",
  "displayName": "Biscuit",
  "description": "A sleepy corgi who supervises your commits.",
  "spritesheetPath": "spritesheet.webp"
}`}</code></pre>
              <Table
                head={['Field', 'Notes']}
                rows={[
                  [<code key="f">id</code>, 'Unique, lowercase with hyphens. If it’s missing, the folder name is used.'],
                  [<code key="f">displayName</code>, 'The name shown in menus and Preferences.'],
                  [<code key="f">description</code>, 'An optional one-liner.'],
                  [<code key="f">spritesheetPath</code>, <>The sheet&apos;s file name. Defaults to <code>spritesheet.webp</code>.</>],
                ]}
              />
              <p>
                For finer control, Mischi also reads <code>frameWidth</code>, <code>frameHeight</code>,{' '}
                <code>columns</code> and an <code>animations</code> map. Each entry takes a <code>row</code>,{' '}
                <code>frameCount</code>, <code>fps</code> and <code>loop</code>, keyed by <code>idle</code>,{' '}
                <code>waving</code>, <code>jumping</code>, <code>failed</code>, <code>review</code>,{' '}
                <code>running</code>, <code>running-right</code> or <code>running-left</code>. Mischi ignores
                fields it doesn&apos;t know, so the file still works in Codex.
              </p>
              <pre className="docs-pre"><code>{`"animations": {
  "idle":   { "row": 0, "frameCount": 6, "fps": 8,  "loop": true },
  "waving": { "row": 3, "frameCount": 4, "fps": 10, "loop": false }
}`}</code></pre>

              <h3>Draw one by hand</h3>
              <p>
                Any pixel art or animation tool works, such as Aseprite, Pixelorama or Photoshop. Set up a
                1536 × 1872 canvas with a 192 × 208 grid, draw each animation left to right in its own row, and
                export a transparent WebP or PNG. Write a <code>pet.json</code> next to it, then import the folder.
              </p>
              <Callout title="Tips for a smooth pet">
                <ul>
                  <li>Keep a little space around your pet inside each cell. Anything past the cell edge gets cut off.</li>
                  <li>If an animation flickers at the end, there are blank cells after its last frame. Set its <code>frameCount</code> in pet.json.</li>
                  <li>If your pet runs the wrong way, turn on <strong>Swap left / right movement</strong> instead of redrawing it.</li>
                  <li>To share a pet, zip its folder. People can add it with <strong>Import .zip</strong> in Mischi, or unzip it into <code>~/.codex/pets/</code> for Codex.</li>
                </ul>
              </Callout>
            </section>

            {/* ── Troubleshooting ─────────────────────────────────────── */}
            <section id="troubleshooting" aria-labelledby="troubleshooting-h">
              <h2 id="troubleshooting-h">Troubleshooting</h2>
              <Table
                head={['Problem', 'Try this']}
                rows={[
                  ['I can’t see my pet', <>Choose <strong>Show</strong> from the menu bar icon. Check that <strong>Start hidden</strong> is off and <strong>Window level</strong> isn’t set to Desktop.</>],
                  ['There’s no menu bar icon', 'Open Mischi from Applications. On a crowded menu bar, the icon can hide behind the notch.'],
                  ['⌘K does nothing', 'Another app may have the shortcut. ⌘-double-click your pet instead.'],
                  ['“Asking Mischi needs a Groq API key”', <>Add a key in Preferences → Advanced. See <a href="#ai">AI with Groq</a>.</>],
                  ['“Groq rejected your API key”', 'The key was revoked or pasted incompletely. Paste a fresh one from console.groq.com.'],
                  ['A model “can’t take actions” or stopped working', 'Groq retires models, and some can’t use tools. Pick another model in Preferences → Advanced.'],
                  ['“Too many requests”', 'You’ve hit your Groq rate limit. Wait a moment or choose a smaller model.'],
                  ['Voice mode fails straight away', 'Allow Mischi in System Settings → Privacy & Security → Microphone.'],
                  ['Screenshots fail or only show the wallpaper', 'Allow Mischi in System Settings → Privacy & Security → Screen & System Audio Recording, then quit and reopen Mischi.'],
                  ['My pet runs backwards', 'Turn on Swap left / right movement in Preferences → Animations.'],
                  ['My pet is a black box', 'The spritesheet has no transparency. Re-export it with an alpha channel.'],
                  ['An animation flickers', <>There are blank cells after the last frame. Set that state’s <code>frameCount</code> in pet.json.</>],
                  ['Launch at login won’t stay on', 'Move Mischi into your Applications folder and try again.'],
                ]}
              />
              <p>
                Still stuck? <Link href="/contact">Tell us what&apos;s happening</Link>.
              </p>
            </section>

            {/* ── Uninstall ───────────────────────────────────────────── */}
            <section id="uninstall" aria-labelledby="uninstall-h">
              <h2 id="uninstall-h">Uninstall &amp; reset</h2>
              <p>Choose <strong>Quit Mischi</strong> from the menu, then drag Mischi from Applications to the Trash.</p>
              <p>
                Your pets and settings stay on your Mac in case you reinstall. To remove everything, quit Mischi
                first and run this in Terminal:
              </p>
              <pre className="docs-pre"><code>{`rm -rf ~/Library/Application\\ Support/mischi
rm -rf ~/Library/Application\\ Support/Standalone\\ Codex\\ Pets
defaults delete app.mischi.mac`}</code></pre>
              <p>
                If you added a Groq key, open Keychain Access, search for <code>app.mischi.mac</code> and delete
                the entry.
              </p>
            </section>

            {/* ── Help ────────────────────────────────────────────────── */}
            <section id="help" aria-labelledby="help-h">
              <h2 id="help-h">Get help</h2>
              <p>
                Found a bug or have an idea? In Mischi, go to <strong>Preferences → About → Found a bug?</strong>{' '}
                and click <strong>Report it</strong>. It opens our <Link href="/contact">contact page</Link> with
                your app and macOS versions already filled in.
              </p>
              <p>
                You can also <Link href="/contact">write to us directly</Link>, or check the{' '}
                <Link href="/#faq">FAQ</Link> for quick answers.
              </p>
            </section>
          </article>
        </div>
      </main>
      <Footer />

      <style>{`
        .docs-main {
          position: relative;
          padding-top: 120px;
          padding-bottom: 96px;
          padding-inline: 24px;
        }
        .docs-backdrop {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 70% 360px at 50% 0%, rgba(81, 139, 112, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        .docs-header { position: relative; max-width: 1080px; margin: 0 auto 56px; }
        .docs-eyebrow {
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-accent);
          margin-bottom: 14px;
        }
        .docs-header h1 {
          font-size: clamp(2rem, 1rem + 3vw, 3rem);
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.1;
          color: var(--color-text);
          margin-bottom: 16px;
        }
        .docs-lede { font-size: var(--text-lg); color: var(--color-text-muted); line-height: 1.65; max-width: 620px; }
        .docs-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
          font-size: 0.8125rem;
          color: var(--color-text-dim);
        }
        .docs-beta {
          font-size: 0.625rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sage-800);
          background: var(--color-accent-dim);
          border: 1px solid rgba(81, 139, 112, 0.25);
          border-radius: 9999px;
          padding: 2px 8px;
          line-height: 1.4;
        }
        .docs-layout {
          position: relative;
          display: grid;
          grid-template-columns: 200px minmax(0, 1fr);
          gap: 64px;
          max-width: 1080px;
          margin: 0 auto;
        }
        .docs-toc { position: sticky; top: 92px; align-self: start; }
        .docs-toc p {
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: 12px;
        }
        .docs-toc ol {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--color-border);
        }
        .docs-toc a {
          display: block;
          margin-left: -1px;
          padding: 5px 0 5px 14px;
          border-left: 1px solid transparent;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
          text-decoration: none;
          transition: color var(--dur-fast), border-color var(--dur-fast);
        }
        .docs-toc a:hover { color: var(--color-text); border-left-color: var(--sage-600); }

        .docs-body { min-width: 0; max-width: 760px; color: var(--color-text-muted); font-size: 1rem; line-height: 1.7; }
        .docs-body section {
          scroll-margin-top: 88px;
          padding-bottom: 48px;
          margin-bottom: 48px;
          border-bottom: 1px solid var(--color-border);
        }
        .docs-body section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
        .docs-body h2 {
          font-size: 1.625rem;
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-text);
          margin-bottom: 16px;
        }
        .docs-body h3 {
          scroll-margin-top: 96px;
          font-size: 1.0625rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--color-text);
          margin: 32px 0 10px;
        }
        .docs-body p { margin-bottom: 16px; }
        .docs-body ul, .docs-body ol { margin: 0 0 18px; padding-left: 22px; }
        .docs-body li { margin-bottom: 8px; }
        .docs-body li::marker { color: var(--color-text-dim); }
        .docs-body strong { color: var(--color-text); font-weight: 600; }
        .docs-body a {
          color: var(--sage-800);
          text-decoration: none;
          border-bottom: 1px solid rgba(81, 139, 112, 0.35);
          transition: border-color var(--dur-fast);
        }
        .docs-body a:hover { border-bottom-color: var(--color-accent); }
        .docs-body code {
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.8125em;
          padding: 2px 6px;
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text);
          overflow-wrap: anywhere;
        }
        .docs-pre {
          margin: 0 0 20px;
          padding: 16px 18px;
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow-x: auto;
          font-size: 0.8125rem;
          line-height: 1.6;
        }
        .docs-body .docs-pre code {
          padding: 0;
          background: none;
          border: none;
          font-size: inherit;
          white-space: pre;
          overflow-wrap: normal;
        }
        .docs-kbd {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 1.7em;
          padding: 0 6px;
          font-family: inherit;
          font-size: 0.8125em;
          line-height: 1.5;
          color: var(--color-text);
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-strong);
          border-bottom-width: 2px;
          border-radius: 5px;
        }
        .docs-table {
          margin: 4px 0 20px;
          overflow-x: auto;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        .docs-table table { width: 100%; border-collapse: collapse; font-size: 0.875rem; line-height: 1.55; }
        .docs-table th {
          padding: 10px 14px;
          text-align: left;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          color: var(--color-text-muted);
          background: var(--color-surface-sunken);
          border-bottom: 1px solid var(--color-border);
        }
        .docs-table td { padding: 11px 14px; vertical-align: top; border-bottom: 1px solid var(--color-border); }
        .docs-table tr:last-child td { border-bottom: none; }
        .docs-table td:first-child { color: var(--color-text); font-weight: 500; }
        .docs-body ol.docs-steps { list-style: none; padding-left: 0; counter-reset: docs-step; }
        .docs-steps li { position: relative; padding-left: 38px; margin-bottom: 12px; counter-increment: docs-step; }
        .docs-steps li::before {
          content: counter(docs-step);
          position: absolute;
          left: 0;
          top: 1px;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--color-accent-dim);
          color: var(--sage-800);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.75rem;
          font-weight: 600;
        }
        .docs-callout {
          margin: 4px 0 20px;
          padding: 14px 18px;
          border-radius: var(--radius-md);
          background: rgba(81, 139, 112, 0.06);
          border: 1px solid rgba(81, 139, 112, 0.22);
          font-size: 0.9375rem;
        }
        .docs-callout-title { display: block; margin-bottom: 4px; font-size: 0.875rem; font-weight: 600; color: var(--sage-800); }
        .docs-callout ul { margin-bottom: 0; }
        .docs-callout li:last-child { margin-bottom: 0; }

        @media (max-width: 900px) {
          .docs-layout { grid-template-columns: minmax(0, 1fr); gap: 36px; }
          .docs-toc { position: static; }
          .docs-toc ol { flex-direction: row; flex-wrap: wrap; gap: 6px; border-left: none; }
          .docs-toc a {
            margin-left: 0;
            padding: 6px 12px;
            border: 1px solid var(--color-border);
            border-radius: 9999px;
            background: var(--color-surface);
          }
          .docs-toc a:hover { border-color: rgba(81, 139, 112, 0.35); }
        }
      `}</style>
    </>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="docs-kbd">{children}</kbd>
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="docs-callout">
      <strong className="docs-callout-title">{title}</strong>
      {children}
    </div>
  )
}

function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="docs-table">
      <table>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
