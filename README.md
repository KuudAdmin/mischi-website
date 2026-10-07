<p align="center">
  <img src="docs/og.png" alt="Mischi: animated desktop pets for macOS" width="640" />
</p>

<h1 align="center">Mischi</h1>

<p align="center">
  The marketing and support site for <strong>Mischi</strong>, animated desktop pets for macOS.<br/>
  Free, offline-first, Codex-compatible, and optionally powered by your own Groq key.
</p>

<p align="center">
  <a href="https://mischi.app"><strong>mischi.app</strong></a>
</p>

---

## What's here

This repo is the public Mischi website, built with the Next.js App Router. It
ships the landing page, product docs, support/contact flow, legal pages,
download metadata, SEO assets, analytics wiring, and the newsletter endpoint.

- **Next.js 16 App Router**, React 19, TypeScript, and Tailwind v4.
- A refreshed homepage with a MacBook desktop-scene hero, trust band, animated
  setup timeline, tabbed feature-video player, under-the-hood bento, creator
  section, signed-DMG download band, FAQ, newsletter, footer, and a draggable
  desktop pet.
- A full `/docs` manual with client-side search, sections for install/update,
  everyday use, pets, behavior, reminders, window settings, Groq AI, Ask
  Mischi, pet creation, troubleshooting, uninstall/reset, and support.
- A redesigned `/contact` experience for bug reports, feature ideas, questions,
  and pet showcases. App links can prefill `?v=<version>&os=<macOS build>`,
  drafts are restored locally, and failed sends fall back to email/copy.
- Dynamic metadata and machine-readable surfaces: Open Graph image route,
  sitemap, robots, web manifest, JSON-LD, custom 404, and `/llms.txt`.
- Server routes for newsletter signups and contact messages, with honeypots,
  validation, rate limits, same-origin checks where appropriate, and provider
  keys kept server-side.
- Cookieless PostHog analytics, proxied through `/relay/*`, disabled unless a
  public project token is configured and skipped for DNT/GPC visitors.

## Recent changes reflected here

- Current public app release is **Mischi 0.9.12 Beta**, released October 7,
  2026, with a 6.0 MB Universal DMG for macOS 13 Ventura and later.
- Version 0.9.12 adds in-app update notices, manual update checks, and hidden
  scrollbars throughout Preferences while preserving scrolling.
- The homepage hero now uses the MacBook mockup scene and coordinated reveal for
  the laptop, cat, and controls.
- The feature showcase is now a single accessible tabbed player covering
  desktop chat, bring-your-own Groq AI, scripted animations/chat lines, and pet
  switching.
- New product sections cover offline behavior, reminders, voice mode, no app
  telemetry, Codex-compatible pets, and native Universal Mac builds.
- The creator section now explains the Codex pet format and links to both the
  local creator guide and the Codex pets guide.
- The download section now includes install steps, a SHA-256 reveal, signed and
  notarised DMG messaging, and a Buy Me a Coffee link.
- FAQ and footer were expanded with more product/support links, clearer beta
  answers, and the refreshed coffee/support affordance.
- Docs and contact are now product-grade flows rather than placeholder pages:
  docs search is built from the rendered manual, and contact messages can be
  sent through Resend or recovered as pre-filled email text.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npm run build
```

Local secrets live in `.env.local`; create it with the variables you need from
the sections below.

## Shipping a new app version

1. Build the signed and notarised DMG in the app repo.
2. Copy it into `public/downloads/`.
3. Update `lib/release.ts`: version, channel, date, file name, size, minimum
   macOS version (both `minMacOS` and numeric `minMacOSVersion`), SHA-256,
   and the short `updateMessage` shown inside the app.

```bash
shasum -a 256 public/downloads/Mischi-x.y.z.dmg
```

The hero, nav, download section, docs, footer, JSON-LD, and `/llms.txt` all read
from `lib/release.ts`, so a release bump should happen there first. If the
homepage visuals change, refresh `docs/og.png` too; it is the social-card
snapshot shown at the top of this README.

## In-app update checks

`GET /updates/latest.json` is the public update feed for Mischi 0.9.12 and later.
It reads `lib/release.ts`, so updating that record and deploying the website
updates the download page and the app's announcement together. Upload and verify
the signed, notarised DMG before advertising its version. The feed currently
advertises 0.9.12, matching `public/downloads/Mischi-0.9.12.dmg`.

The JSON contract is `version`, `minimumMacOS` (numeric, such as `13.0`),
`downloadURL` (the HTTPS website download section), and `message`. Use stable
numeric release versions such as `0.9.12`; prerelease suffixes are not accepted
by the app. Shared caches expire within five minutes. This route serves JSON
directly without running browser analytics or requiring an account.

Verify after deploying:

```bash
curl -i https://mischi.app/updates/latest.json
```

The app checks daily while running, retries failed checks after an hour, and
provides **Check for Updates…** in its menu and **Preferences → About**. It opens
the website when the user chooses to download; it does not install updates.
Users on older builds must manually install the first version with the checker.

## Environment variables

Server-only:

- `RESEND_API_KEY`: required for the contact form in production.
- `CONTACT_FROM_EMAIL`: sender address on a Resend-verified domain, for example
  `Mischi <contact@mail.mischi.app>`.
- `CONTACT_TO_EMAIL`: optional recipient override; defaults to `hello@kuud.in`
  via `CONTACT_EMAIL` in `lib/release.ts`.
- `KIT_API_KEY` and `KIT_FORM_ID`: optional Kit newsletter backend.
- `NEWSLETTER_SHEET_ENDPOINT`: optional Google Sheet/Web App mirror for
  newsletter signups.
- `WAITLIST_SHEET_ENDPOINT`: legacy name still supported for existing deploys.

Public:

- `NEXT_PUBLIC_SITE_URL`: canonical base URL for previews/staging; production
  defaults to `https://mischi.app`.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: enables the analytics consent prompt;
  analytics start only after an explicit opt-in.
- `NEXT_PUBLIC_POSTHOG_REGION`: `eu` by default, or `us` for a US PostHog
  project.

Never send personal data such as names, emails, or message text in analytics
event properties. The privacy policy promises the site does not collect that.

## Contact flow

`/contact` is where the app's **Preferences > About > Report it** button lands.
The app can append `?v=<version>&os=<macOS build>`, which switches the form to a
bug-report topic and carries that system info into the message.

The form posts to `app/api/contact/route.ts`, which validates the message,
drops honeypot submissions, checks same-origin requests, rate-limits by IP, and
sends through Resend with the sender as Reply-To. If Resend is unavailable, the
UI offers the same message as a mailto link or clipboard copy.

## Newsletter flow

The newsletter form posts to `app/api/subscribe/route.ts`. The endpoint keeps
provider keys server-side, rate-limits signups, drops honeypot submissions, and
accepts a signup if at least one configured backend succeeds:

- Kit via `KIT_API_KEY` and `KIT_FORM_ID`.
- Google Sheets via `NEWSLETTER_SHEET_ENDPOINT` or the legacy
  `WAITLIST_SHEET_ENDPOINT`.

In development, if no newsletter backend is configured, signups are accepted so
the UI can be tested locally.

## Analytics

`instrumentation-client.ts` observes privacy choices. `lib/analytics.ts` loads
PostHog only when `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is present, the visitor has
explicitly opted in, and neither Do Not Track nor Global Privacy Control is on.
The consent prompt, settings links and dialog are hidden when no token is
configured. They become available when a token is configured and the site is rebuilt.

- Visitors can allow or reject with equally prominent buttons, and withdraw
  through **Privacy settings** in the footer or privacy policy. A versioned
  browser-local choice is valid for 180 days. Blocked storage falls back to a
  page-session choice; no analytics events are queued before consent.
- PostHog uses memory-only identifiers, with person profiles, autocapture,
  session recording, heatmaps, surveys, flags and exception capture disabled.
  Its consent flag may use local storage. Requests are not batched; withdrawal
  stops capture, and the outgoing-event filter also checks current consent.
- An allowlist removes full URLs, referrers, query strings, campaign fields and
  person fields. Docs search text and contact/newsletter fields are not sent.
- Link tracking in `lib/analytics.ts` classifies downloads, docs links,
  outbound links, email links, contact fallback use, docs-search result opens,
  and successful newsletter/contact submissions.
- Events go through `/relay/*` on this domain using the rewrites in
  `next.config.ts`.

## Download agreement and privacy operations

App download links open an accessible native dialog. The unchecked box agrees
to the Terms of Use and acknowledges the Privacy Policy; it does not grant
analytics or newsletter consent. `/download` provides the same form without
requiring JavaScript. `POST /api/download` validates the acknowledgement and
document versions from `lib/legal.ts`, then redirects to the current DMG.
The public versioned DMG is still directly addressable. There is no separate
acceptance database or identity-linked proof of agreement.

The operator is ARJUN NV, publishing under the project name Mischi. Privacy and
terms use `lib/legal.ts` for the operator and revision details. Update document
versions when changing them so stale download forms require another review.

Repository checks cover consent gating, event minimisation, rate-limit expiry,
and form validation. Run `node --test tests/privacy.test.mjs`, `npm run lint`,
and `npx tsc --noEmit` after changing these behaviours.

Production account facts are not stored in this repository. Before relying on
the notice as a complete operational record, check the actual Vercel/PostHog
plans and retention settings, the enabled newsletter/contact backends, the
email inbox provider, and the applicable provider data-processing and transfer
agreements. For PostHog, verify the project's IP-data setting and deletion
process; memory persistence does not control server-side IP storage. Public
provider documentation or a configured API key does not prove an account's
settings or that a required agreement has been completed. Keep actual periods
and transfer mechanisms in the policy aligned with those records.

## Project structure

```text
app/
  page.tsx                  Home page composition
  layout.tsx                Metadata, fonts, JSON-LD
  api/contact/              Resend-backed contact endpoint
  api/subscribe/            Newsletter endpoint for Kit/Sheets
  components/
    hero/                   MacBook scene and hero copy
    demo/                   Sprite-sheet pet canvas and draggable pet
    features/               Feature tabs and under-the-hood grid
    creator/                Codex-compatible pet creator section
    download/               DMG CTA, install steps, checksum reveal
    docs/                   Client-side docs search
    contact/                Compose-style contact experience
    faq/, footer/, nav/     Shared product chrome
  docs/                     Product manual
  contact/                  Support page and contact styling
  privacy/, terms/          Legal pages
  llms.txt/                 Plain-text site map for language models
  opengraph-image.tsx       Dynamic social card
  manifest.ts, sitemap.ts,
  robots.ts, not-found.tsx  Platform metadata and fallbacks
lib/
  release.ts                Current app version and download details
  seo.ts                    Canonical site metadata/config
  analytics.ts              Privacy-friendly event helpers
  rate-limit.ts             In-memory route rate limiter
public/
  downloads/                Versioned DMGs
  features/                 Feature recordings and posters
  hero/                     Hero mockup assets
  *.png, *.svg, *.webp      Brand marks, pet sheets, illustrations
docs/
  og.png                    README/social snapshot
```

## Deploying

Deploys to [Vercel](https://vercel.com). Before shipping, run `npm run lint` and
`npm run build`, then add the server-only and public environment variables under
**Project > Settings > Environment Variables**.

---

<p align="center"><sub>Built with care for a tiny desktop companion with an opinion.</sub></p>
