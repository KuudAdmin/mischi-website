/**
 * The current public build of the Mac app.
 *
 * Bump this — and drop the new DMG into public/downloads/ — for every release.
 * The download section, nav, docs, JSON-LD and contact page all read from here.
 */
export const RELEASE = {
  version: '0.9.11',
  channel: 'Beta',
  date: 'September 14, 2026',
  dmgUrl: '/downloads/Mischi-0.9.11.dmg',
  dmgFileName: 'Mischi-0.9.11.dmg',
  size: '5.9 MB',
  sha256: 'f7f197464798c4ee5cf7970fd30c92c38d8d4bf1cdee041615f652c684a459ed',
  minMacOS: 'macOS 13 Ventura',
} as const

export const CONTACT_EMAIL = 'hello@kuud.in'
