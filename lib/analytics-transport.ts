import type { PostHog } from 'posthog-js'
import { analyticsAllowed } from './privacy-preferences'

/**
 * PostHog's opt-out stops capture but intentionally permits retries of older
 * events. Mischi promises a stricter stop, so analytics requests are best-effort.
 *
 * These SDK internals are covered by the real-SDK transport tests. Keep the SDK
 * pinned and review this adapter before upgrading. Install before sdk.init().
 */
export function installAnalyticsTransport(sdk: PostHog): void {
  if (typeof sdk._send_request !== 'function' || typeof sdk._send_retriable_request !== 'function') {
    throw new Error('Unsupported analytics transport')
  }

  const send = sdk._send_request.bind(sdk)
  sdk._send_request = (options) => {
    if (!analyticsAllowed()) return
    send(options)
  }
  // Do not enter RetryQueue at all. In particular, a failure response arriving
  // after withdrawal (or after a later opt-in) must not recreate pending work.
  sdk._send_retriable_request = (options) => sdk._send_request(options)
}
