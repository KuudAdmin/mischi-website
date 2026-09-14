import { TOPIC_IDS, type Topic } from './TopicPicker'

// Unsent messages are kept in this browser's localStorage so nobody loses a
// long bug report by switching to the app to reproduce it. Drafts never leave
// the device; the privacy policy says so.

export interface ContactFields {
  name: string
  email: string
  happened: string
  expected: string
  steps: string
  message: string
  link: string
  version: string
}

export const EMPTY_FIELDS: ContactFields = {
  name: '',
  email: '',
  happened: '',
  expected: '',
  steps: '',
  message: '',
  link: '',
  version: '',
}

export interface Draft {
  topic: Topic
  fields: ContactFields
}

const KEY = 'mischi-contact-draft-v1'
const BODY_KEYS = ['happened', 'expected', 'steps', 'message', 'link'] as const

/** Only the message itself counts: a remembered name and email aren't a draft. */
export function hasBody(fields: ContactFields): boolean {
  return BODY_KEYS.some((key) => fields[key].trim() !== '')
}

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    const { topic, fields } = parsed as { topic?: unknown; fields?: Record<string, unknown> }
    if (!fields || typeof fields !== 'object') return null
    const clean = { ...EMPTY_FIELDS }
    for (const key of Object.keys(EMPTY_FIELDS) as (keyof ContactFields)[]) {
      const value = fields[key]
      if (typeof value === 'string') clean[key] = value.slice(0, 5000)
    }
    return {
      topic: typeof topic === 'string' && TOPIC_IDS.has(topic as Topic) ? (topic as Topic) : 'question',
      fields: clean,
    }
  } catch {
    return null
  }
}

/** Saves the draft, or removes it when there's nothing worth keeping. Returns whether a draft is stored. */
export function saveDraft(draft: Draft): boolean {
  try {
    if (!hasBody(draft.fields)) {
      localStorage.removeItem(KEY)
      return false
    }
    localStorage.setItem(KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // Storage unavailable (private mode, blocked): nothing to clear.
  }
}
