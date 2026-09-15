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

- Current public app release is **Mischi 0.9.11 Beta**, released September 14,
  2026, with a 5.9 MB Universal DMG for macOS 13 Ventura and later.
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
   macOS version, and SHA-256.

```bash
shasum -a 256 public/downloads/Mischi-x.y.z.dmg
```

The hero, nav, download section, docs, footer, JSON-LD, and `/llms.txt` all read
from `lib/release.ts`, so a release bump should happen there first. If the
homepage visuals change, refresh `docs/og.png` too; it is the social-card
snapshot shown at the top of this README.

## Environment variables

Server-only:

- `RESEND_API_KEY`: required for the contact form in production.
- `CONTACT_FROM_EMAIL`: sender address on a Resend-verified domain, for example
  `Mischi <contact@mail.mischi.app>`.
- `CONTACT_TO_EMAIL`: optional recipient override; defaults to `CONTACT_EMAIL`
  in `lib/release.ts`.
- `KIT_API_KEY` and `KIT_FORM_ID`: optional Kit newsletter backend.
- `NEWSLETTER_SHEET_ENDPOINT`: optional Google Sheet/Web App mirror for
  newsletter signups.
- `WAITLIST_SHEET_ENDPOINT`: legacy name still supported for existing deploys.

Public:

- `NEXT_PUBLIC_SITE_URL`: canonical base URL for previews/staging; production
  defaults to `https://mischi.app`.
- `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`: enables analytics when set.
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

`instrumentation-client.ts` starts PostHog only when
`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` is present and the visitor has not enabled
Do Not Track or Global Privacy Control.

- PostHog uses memory persistence, no autocapture, no session recording, no
  heatmaps, no surveys, and no exception capture.
- Link tracking in `lib/analytics.ts` classifies downloads, docs links,
  outbound links, email links, contact fallback use, docs-search result opens,
  and successful newsletter/contact submissions.
- Events go through `/relay/*` on this domain using the rewrites in
  `next.config.ts`.

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
