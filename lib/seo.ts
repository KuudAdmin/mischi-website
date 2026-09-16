/**
 * Central site/SEO config.
 *
 * Production domain is https://mischi.app — canonical URLs, OG image URLs,
 * the sitemap, robots, and JSON-LD all derive from SITE_URL. Override via the
 * NEXT_PUBLIC_SITE_URL env var for preview/staging deployments (e.g. to point
 * at a Vercel preview URL); production falls back to the canonical domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mischi.app'
).replace(/\/$/, '')

export const SITE_NAME = 'Mischi'

export const SITE_TITLE = 'Mischi: Your Mac Companion'

export const SITE_DESCRIPTION =
  'Run animated desktop pets on macOS. Interactive, offline-first, no cloud and no account. Your pet lives on your actual desktop, not inside a window.'

export const SITE_TAGLINE = 'Your Mac deserves a companion.'

export const SITE_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: SITE_TITLE,
}

export const SITE_TWITTER_IMAGE = {
  url: '/opengraph-image',
  alt: SITE_TITLE,
}

/** X/Twitter handle for card attribution — the one the footer and the app's About pane link to. */
export const TWITTER_HANDLE = '@ajjuism'

export const SITE_KEYWORDS = [
  'Mischi',
  'desktop pet',
  'macOS desktop pet',
  'animated desktop pet',
  'Mac companion',
  'desktop buddy',
  'desktop widget',
  'menu bar app',
  'offline-first Mac app',
  'spritesheet pet',
  'desktop cat',
  'Mac utility',
]
