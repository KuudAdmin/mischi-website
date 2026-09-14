import posthog from 'posthog-js'

/**
 * Privacy-friendly usage analytics (PostHog): counts downloads, docs visits and
 * form submissions. It's off unless NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is set,
 * so local builds and previews send nothing by default.
 *
 * Never put personal data (emails, names, message text) in event properties.
 * The privacy policy promises we don't.
 */
export const ANALYTICS_ENABLED = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN)

export type AnalyticsEvent =
  | 'download_clicked'
  | 'download_cta_clicked'
  | 'docs_link_clicked'
  | 'docs_search_result_opened'
  | 'outbound_link_clicked'
  | 'email_link_clicked'
  | 'newsletter_subscribed'
  | 'contact_message_sent'

type Properties = Record<string, string | number | boolean | undefined>

export function track(event: AnalyticsEvent, properties?: Properties) {
  if (!ANALYTICS_ENABLED || typeof window === 'undefined') return
  posthog.capture(event, properties)
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
