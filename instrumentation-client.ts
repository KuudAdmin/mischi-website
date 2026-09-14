import posthog from 'posthog-js'
import { installLinkTracking } from '@/lib/analytics'

// Runs after the HTML loads but before React hydrates, so the first pageview
// and early download clicks are counted.

type PrivacyNavigator = Navigator & { globalPrivacyControl?: boolean }

// The privacy policy promises analytics don't load at all for visitors who
// send Global Privacy Control or Do Not Track.
function visitorOptedOut(): boolean {
  const nav = navigator as PrivacyNavigator
  return nav.globalPrivacyControl === true || nav.doNotTrack === '1'
}

const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN

if (token && !visitorOptedOut()) {
  const region = process.env.NEXT_PUBLIC_POSTHOG_REGION === 'us' ? 'us' : 'eu'

  posthog.init(token, {
    // Proxied through our own domain by the rewrites in next.config.ts.
    api_host: '/relay',
    ui_host: `https://${region}.posthog.com`,
    defaults: '2026-05-30',
    // Count client-side navigations (e.g. home → docs) as pageviews too.
    capture_pageview: 'history_change',
    // Cookieless: nothing is written to the visitor's browser, so there's no
    // consent banner to show and returning visitors aren't recognised.
    persistence: 'memory',
    person_profiles: 'identified_only',
    // Only pageviews plus the named events in lib/analytics.ts.
    autocapture: false,
    disable_session_recording: true,
    disable_surveys: true,
    capture_dead_clicks: false,
    capture_heatmaps: false,
    capture_exceptions: false,
  })

  installLinkTracking()
}
