import type { PostHog, CaptureResult } from 'posthog-js'
import { analyticsAllowed, subscribePrivacyChanges } from './privacy-preferences'

/**
 * Privacy-friendly usage analytics (PostHog): counts downloads, docs visits and
 * form submissions. No SDK initialisation or events before explicit consent.
 *
 * Never put personal data (emails, names, message text) in event properties.
 * The privacy policy promises we don't.
 */
let client: PostHog | undefined
let loading: Promise<void> | undefined
let active = false
let started = false
let lastPage: string | undefined

// Drop SDK URL, referrer, campaign and person-property fields, which can carry
// arbitrary text. Only known technical and explicitly named event fields leave.
const EVENT_PROPERTIES = new Set([
  'token', 'distinct_id', '$device_id', '$session_id', '$window_id', '$lib', '$lib_version',
  '$browser', '$browser_version', '$os', '$os_version', '$device_type', '$pathname',
  'file', 'location', 'host', 'section', 'result', 'position', 'topic', 'from_app', 'method',
])

export function filterAnalyticsEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event || !analyticsAllowed()) return null
  event.properties = Object.fromEntries(
    Object.entries(event.properties).filter(([key]) => EVENT_PROPERTIES.has(key)),
  )
  event.properties.$process_person_profile = false
  return event
}

export function trackPageview(pathname: string): void {
  if (!active || !client || !analyticsAllowed() || lastPage === pathname) return
  lastPage = pathname
  client.capture('$pageview', { $pathname: pathname })
}

async function syncAnalytics(): Promise<void> {
  if (!analyticsAllowed()) {
    if (active) client?.opt_out_capturing()
    active = false
    lastPage = undefined
    return
  }
  if (active) return
  if (!client) {
    if (loading) return loading
    loading = import('posthog-js').then(({ default: sdk }) => {
      // Consent may have been withdrawn while the module was loading.
      if (!analyticsAllowed()) return
      const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === 'us' ? 'us' : 'eu'
      sdk.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
        api_host: '/relay',
        ui_host: `https://${region}.posthog.com`,
        defaults: '2026-05-30',
        persistence: 'memory',
        disable_persistence: true,
        person_profiles: 'never',
        opt_out_capturing_by_default: true,
        opt_out_capturing_persistence_type: 'localStorage',
        consent_persistence_name: 'mischi-analytics-sdk-choice',
        respect_dnt: true,
        capture_pageview: false,
        capture_pageleave: false,
        autocapture: false,
        capture_performance: false,
        disable_session_recording: true,
        disable_surveys: true,
        capture_dead_clicks: false,
        capture_heatmaps: false,
        capture_exceptions: false,
        advanced_disable_flags: true,
        // No buffered events to flush after consent is withdrawn.
        request_batching: false,
        before_send: filterAnalyticsEvent,
      })
      client = sdk
    }).catch(() => {
      // Optional analytics must never break the website.
    }).finally(() => { loading = undefined })
    await loading
  }
  if (!client || !analyticsAllowed() || active) return
  client.opt_in_capturing({ captureEventName: false })
  active = true
  trackPageview(window.location.pathname)
}

export function startAnalytics(): void {
  if (started) return
  started = true
  installLinkTracking()
  subscribePrivacyChanges(() => { void syncAnalytics() })
  void syncAnalytics()
}

export type AnalyticsEvent =
  | 'download_clicked'
  | 'download_cta_clicked'
  | 'docs_link_clicked'
  | 'docs_search_result_opened'
  | 'outbound_link_clicked'
  | 'email_link_clicked'
  | 'newsletter_subscribed'
  | 'contact_message_sent'
  | 'contact_fallback_used'
  | 'contact_draft_restored'

type Properties = Record<string, string | number | boolean | undefined>

export function track(event: AnalyticsEvent, properties?: Properties) {
  if (!active || !client || typeof window === 'undefined' || !analyticsAllowed()) return
  client.capture(event, properties)
}

/** Where a link sits on the page: its section, or the nav, footer or pet. */
function placeOf(el: Element): string {
  if (el.closest('header')) return 'nav'
  if (el.closest('footer')) return 'footer'
  if (el.closest('.pet-bubble')) return 'pet_bubble'
  return el.closest('section[id]')?.id ?? 'page'
}

/**
 * One document-level listener that classifies link clicks by where they point,
 * so components don't need tracking attributes: any .dmg link is a download,
 * any link to /docs from another page is a docs visit, and so on. Only the
 * destination type and the link's position are recorded — never the URL of a
 * mailto link, which can carry a message body.
 */
export function installLinkTracking() {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!link) return

      let url: URL
      try {
        url = new URL(link.href, window.location.href)
      } catch {
        return
      }
      const location = placeOf(link)

      if (url.protocol === 'mailto:') {
        track('email_link_clicked', { location })
      } else if (url.origin !== window.location.origin) {
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          track('outbound_link_clicked', { host: url.hostname, location })
        }
      } else if (url.pathname.endsWith('.dmg')) {
        track('download_clicked', { file: url.pathname.split('/').pop(), location })
      } else if (url.pathname === '/docs' && window.location.pathname !== '/docs') {
        track('docs_link_clicked', { section: url.hash.slice(1) || undefined, location })
      } else if (url.hash === '#download') {
        track('download_cta_clicked', { location })
      }
    },
    { capture: true },
  )
}
