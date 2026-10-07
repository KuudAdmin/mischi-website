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
app and pet downloads, the update feed, SEO assets, optional analytics, and
the newsletter endpoint. The native macOS app is maintained separately.

- **Next.js 16 App Router**, React 19, TypeScript, and Tailwind v4.
- A refreshed homepage with a MacBook desktop-scene hero, trust band, animated
  setup timeline, tabbed feature-video player, under-the-hood bento, creator
  section, signed-DMG download band, FAQ, newsletter, footer, and a draggable
  desktop pet.
- A full `/docs` manual with client-side search, sections for install/update,
  everyday use, pets, behavior, reminders, window settings, Groq AI, Ask
  Mischi, pet creation, troubleshooting, uninstall/reset, and support.
- A `/pets` library with animated previews and downloadable pet packages.
- A redesigned `/contact` experience for bug reports, feature ideas, questions,
  and pet showcases. App links can prefill `?v=<version>&os=<macOS build>`,
  drafts are restored locally, and failed sends fall back to email/copy.
- Dynamic metadata and machine-readable surfaces: Open Graph image route,
  sitemap, robots, web manifest, JSON-LD, custom 404, and `/llms.txt`.
- Server routes for newsletter signups and contact messages, with honeypots,
  validation, rate limits, same-origin checks where appropriate, and provider
  keys kept server-side.
- A terms-and-privacy acknowledgement before app downloads, with a dialog and
  a standalone `/download` form that also works without JavaScript.
- Optional PostHog analytics through `/relay/*`, using temporary in-memory
  identifiers. Capture requires a configured token and explicit consent, and
  respects DNT/GPC. Privacy controls are hidden when analytics is unconfigured.

## Recent changes reflected here

- Current public app release is **Mischi 0.9.12 Beta**, released October 7,
  2026, with a 6.0 MB Universal DMG for macOS 13 Ventura and later.
- Version 0.9.12 adds in-app update notices, manual update checks, and hidden
  scrollbars throughout Preferences while preserving scrolling.
- `/updates/latest.json` advertises the current release, and the docs, FAQ and
  privacy policy explain automatic and manual update checks.
- Privacy and terms identify **ARJUN NV** as the independent operator of
  Mischi. The public contact address remains **hello@kuud.in**.
- The app download form starts with an unchecked box for accepting the terms
  and acknowledging the privacy policy. Visitors must check it to submit;
  this does not enable analytics or subscribe them to the newsletter.
- Optional analytics require consent. The footer settings link, policy-page
  control and preference dialog appear only when PostHog is configured.
- Docs search text is excluded from analytics, provider failures no longer log
  response bodies or raw exceptions, and inactive IP rate-limit records expire.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run lint
npx tsc --noEmit
node --test tests/privacy.test.mjs
npm run build
```

Local secrets live in `.env.local`; create it with the variables you need from
the sections below. Without a PostHog token, local development sends no
analytics and shows no analytics preference controls. The privacy tests use
isolated browser/provider dependencies and do not send data to external services.

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
event properties. The privacy policy promises the site does not include those
fields in analytics events; contact and newsletter submissions are separate.

## Contact flow

`/contact` is where the app's **Preferences > About > Report it** button lands.
The app can append `?v=<version>&os=<macOS build>`, which switches the form to a
bug-report topic and carries that system info into the message.

The form posts to `app/api/contact/route.ts`, which validates the message,
drops honeypot submissions, checks same-origin requests, rate-limits by IP, and
sends through Resend with the sender as Reply-To. If Resend is unavailable, the
UI offers the same message as a mailto link or clipboard copy.

The public email address is centralised in `lib/release.ts`. Contact links,
email/copy fallbacks, legal pages, `/llms.txt`, and `/.well-known/security.txt`
use that value. A deployment's `CONTACT_TO_EMAIL` can override where form
messages are delivered; it does not change the public address.

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
configured. They become available when a token is configured and the site is
rebuilt and deployed. These controls govern website analytics, independently
of the download agreement, newsletter subscription and native app settings.

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
  api/download/             Versioned agreement validation and DMG redirect
  api/subscribe/            Newsletter endpoint for Kit/Sheets
  components/
    hero/                   MacBook scene and hero copy
    demo/                   Sprite-sheet pet canvas and draggable pet
    features/               Feature tabs and under-the-hood grid
    creator/                Codex-compatible pet creator section
    download/               DMG CTA, agreement dialog/form, install steps, checksum
    docs/                   Client-side docs search
    contact/                Compose-style contact experience
    legal/                  Legal layout, shared dialog and privacy controls
    pets/                   Pet previews and download controls
    faq/, footer/, nav/     Shared product chrome
  docs/                     Product manual
  contact/                  Support page and contact styling
  download/                 Standalone app download agreement
  pets/                     Downloadable pet library
  privacy/, terms/          Legal pages
  updates/latest.json/      App update feed
  .well-known/security.txt/ Security contact information
  llms.txt/                 Plain-text site map for language models
  opengraph-image.tsx       Dynamic social card
  manifest.ts, sitemap.ts,
  robots.ts, not-found.tsx  Platform metadata and fallbacks
lib/
  release.ts                Current app version and download details
  seo.ts                    Canonical site metadata/config
  analytics.ts              Privacy-friendly event helpers
  privacy-preferences.ts    Consent storage, expiry and browser privacy signals
  legal.ts                  Operator name and legal document versions
  rate-limit.ts             In-memory route rate limiter
public/
  downloads/                Versioned DMGs
  pets/                     Pet previews and downloadable packages
  features/                 Feature recordings and posters
  hero/                     Hero mockup assets
  *.png, *.svg, *.webp      Brand marks, pet sheets, illustrations
docs/
  og.png                    README/social snapshot
tests/
  privacy.test.mjs           Consent, event filtering, downloads and IP expiry
instrumentation-client.ts   Starts consent-aware analytics observation
```

## Deploying

Deploys to [Vercel](https://vercel.com). Configure the required variables under
**Project > Settings > Environment Variables** before building. Public
`NEXT_PUBLIC_*` values are part of the browser build, so changing the analytics
token or region requires a new deployment.

Run the checks in Getting started before shipping code changes. After deployment,
verify the contact address, `/download`, `/privacy`, and `/updates/latest.json`.
Leave `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` unset to keep optional analytics and
its controls disabled. With analytics configured, confirm that the prompt
offers both choices and Privacy settings allows withdrawal.

---

<p align="center"><sub>Built with care for a tiny desktop companion with an opinion.</sub></p>
