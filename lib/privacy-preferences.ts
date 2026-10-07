export const ANALYTICS_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)
export const ANALYTICS_CHOICE_KEY = 'mischi-analytics-choice-v1'
export const ANALYTICS_CHOICE_EVENT = 'mischi:analytics-choice'
export const PRIVACY_SETTINGS_EVENT = 'mischi:privacy-settings'
export const ANALYTICS_CHOICE_TTL = 180 * 24 * 60 * 60 * 1000

type Choice = 'accepted' | 'rejected'
type RecordOfChoice = { version: 1; choice: Choice; updatedAt: number }
export type PrivacyStatus = Choice | 'unknown' | 'blocked' | 'disabled' | 'loading'
let memoryChoice: RecordOfChoice | undefined

export function browserPrivacySignal(): boolean {
  if (typeof navigator === 'undefined') return false
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true
    || navigator.doNotTrack === '1'
}

export function readAnalyticsChoice(): Choice | 'unknown' {
  if (typeof window === 'undefined') return 'unknown'
  let record: unknown = memoryChoice
  try {
    const stored = window.localStorage.getItem(ANALYTICS_CHOICE_KEY)
    record = memoryChoice ?? (stored ? JSON.parse(stored) : undefined)
  } catch {
    // A visitor can still choose for this page when browser storage is blocked.
  }
  if (!record || typeof record !== 'object') return 'unknown'
  const value = record as Partial<RecordOfChoice>
  if (value.version !== 1 || (value.choice !== 'accepted' && value.choice !== 'rejected')
    || typeof value.updatedAt !== 'number' || !Number.isFinite(value.updatedAt)
    || value.updatedAt > Date.now() || Date.now() - value.updatedAt >= ANALYTICS_CHOICE_TTL) return 'unknown'
  return value.choice
}

export function privacyStatus(): PrivacyStatus {
  if (!ANALYTICS_CONFIGURED) return 'disabled'
  if (browserPrivacySignal()) return 'blocked'
  return readAnalyticsChoice()
}

export function analyticsAllowed(): boolean {
  return privacyStatus() === 'accepted'
}

export function saveAnalyticsChoice(choice: Choice): void {
  const record: RecordOfChoice = { version: 1, choice, updatedAt: Date.now() }
  memoryChoice = record
  try {
    window.localStorage.setItem(ANALYTICS_CHOICE_KEY, JSON.stringify(record))
    memoryChoice = undefined
  } catch {}
  window.dispatchEvent(new Event(ANALYTICS_CHOICE_EVENT))
}

export function subscribePrivacyChanges(listener: () => void): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === ANALYTICS_CHOICE_KEY || event.key === null) listener()
  }
  window.addEventListener(ANALYTICS_CHOICE_EVENT, listener)
  window.addEventListener('storage', onStorage)
  window.addEventListener('focus', listener)
  return () => {
    window.removeEventListener(ANALYTICS_CHOICE_EVENT, listener)
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('focus', listener)
  }
}
