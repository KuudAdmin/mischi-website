/**
 * The current public build of the Mac app.
 *
 * Bump this — and drop the new DMG into public/downloads/ — for every release.
 * The download section, nav, docs, JSON-LD, contact page and app update feed all read from here.
 */
export const RELEASE = {
  version: '0.9.12',
  channel: 'Beta',
  date: 'October 7, 2026',
  dmgUrl: '/downloads/Mischi-0.9.12.dmg',
  dmgFileName: 'Mischi-0.9.12.dmg',
  size: '6.0 MB',
  sha256: '6cd10aa4d369d4dd0e05278c16e0ebac2a585971502c5f98c9cd5cae96198895',
  minMacOS: 'macOS 13 Ventura',
  // Numeric value for the Mac app's compatibility check. Keep in sync with minMacOS.
  minMacOSVersion: '13.0',
  updateMessage: 'In-app update notices, a manual update check, and cleaner scrolling throughout Preferences.',
} as const

export const CONTACT_EMAIL = 'hello@kuud.in'
