import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)

// Run the real TypeScript modules with isolated browser/provider dependencies.
// No test sends analytics, email, subscriptions or downloads to a provider.
function load(file, globals = {}, modules = {}) {
  const exports = {}
  const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  vm.runInNewContext(outputText, {
    exports, URL, Date, Event,
    require(name) {
      if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`)
      return typeof modules[name] === 'function' ? modules[name]() : modules[name]
    },
    ...globals,
  }, { filename: file })
  return exports
}

function browser({ configured = true, navigator = {} } = {}) {
  const storage = new Map()
  const window = new EventTarget()
  window.location = new URL('https://mischi.test/docs?private=secret')
  window.localStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }
  const globals = {
    window, navigator, document: new EventTarget(),
    process: { env: { NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN: configured ? 'test-token' : '' } },
  }
  const preferences = load('lib/privacy-preferences.ts', globals)
  return { globals, preferences, storage, window, navigator }
}

function analytics(environment = browser(), suppliedSdk) {
  const calls = { imports: 0, init: 0, optIn: 0, optOut: 0, events: [] }
  let config
  const sdk = suppliedSdk ?? {
    _send_request() {},
    _send_retriable_request() {},
    init(_token, options) { calls.init++; config = options },
    opt_in_capturing() { calls.optIn++ },
    opt_out_capturing() { calls.optOut++ },
    capture(event, properties = {}) {
      const filtered = config.before_send({ event, properties })
      if (filtered) calls.events.push(filtered)
    },
  }
  const transport = load('lib/analytics-transport.ts', environment.globals, {
    './privacy-preferences': environment.preferences,
  })
  const api = load('lib/analytics.ts', environment.globals, {
    './privacy-preferences': environment.preferences,
    './analytics-transport': transport,
    'posthog-js': () => { calls.imports++; return { default: sdk } },
  })
  return { ...environment, api, calls, sdk, config: () => config }
}

const settled = () => new Promise(resolve => setImmediate(resolve))

test('analytics stays unloaded before consent; refusal does not queue events', async () => {
  const { api, preferences, calls } = analytics()
  api.startAnalytics()
  api.track('download_clicked')
  preferences.saveAnalyticsChoice('rejected')
  await settled()
  assert.equal(calls.imports, 0)
  assert.equal(calls.events.length, 0)
})

test('opt-in starts a pageview; withdrawal stops new capture', async () => {
  const { api, preferences, calls, config } = analytics()
  api.startAnalytics()
  preferences.saveAnalyticsChoice('accepted')
  await settled()
  assert.equal(calls.init, 1)
  assert.equal(calls.events[0].event, '$pageview')
  assert.equal(calls.events[0].properties.$pathname, '/docs')
  assert.equal(config().persistence, 'memory')
  assert.equal(config().autocapture, false)
  assert.equal(config().disable_session_recording, true)
  assert.equal(config().request_batching, false)
  assert.equal(config().disable_compression, true)
  assert.equal(config().disable_external_dependency_loading, true)
  const beforeWithdrawal = calls.events.length
  preferences.saveAnalyticsChoice('rejected')
  api.track('download_clicked')
  await settled()
  assert.equal(calls.optOut, 1)
  assert.equal(calls.events.length, beforeWithdrawal)
  assert.equal(api.filterAnalyticsEvent({ event: 'late', properties: {} }), null)
})

// Exercise actual capture, consent, request dispatch and RetryQueue. Only the
// final HTTP transport is replaced; no test contacts a live PostHog project.
function realAnalytics(t) {
  t.mock.timers.enable({ apis: ['setTimeout', 'setInterval'] })
  const originalNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { onLine: true } })
  t.after(() => {
    if (originalNavigator) Object.defineProperty(globalThis, 'navigator', originalNavigator)
    else delete globalThis.navigator
  })
  const { PostHog } = require('posthog-js/lib/src/posthog-core.js')
  const requests = []
  t.mock.method(require('posthog-js/lib/src/request.js'), 'request', options => {
    requests.push(options)
    if (options.data?.event === '$pageview') options.callback?.({ statusCode: 200 })
  })
  const sdk = new PostHog()
  t.after(() => sdk.shutdown())
  return { ...analytics(browser(), sdk), requests }
}

test('real SDK sends opted-in events but never queues failed requests for retry', async t => {
  const { api, preferences, sdk, requests } = realAnalytics(t)
  api.startAnalytics()
  await settled()
  assert.equal(requests.length, 0)
  preferences.saveAnalyticsChoice('accepted')
  await settled()
  assert.equal(requests[0].data.event, '$pageview')
  for (const statusCode of [0, 500]) {
    api.track('download_clicked')
    assert.equal(requests.at(-1).data.event, 'download_clicked')
    requests.at(-1).callback({ statusCode })
    assert.equal(sdk._retryQueue.length, 0)
  }
  const count = requests.length
  t.mock.timers.tick(60_000)
  assert.equal(requests.length, count)
  preferences.saveAnalyticsChoice('rejected')
  // Exercise both capture-time and final dispatch guards, including unload.
  api.track('download_clicked')
  sdk._send_request({ method: 'POST', url: '/relay/e/', data: { event: 'late' } })
  sdk._handle_unload()
  assert.equal(requests.length, count)
})

for (const regrantBeforeFailure of [false, true]) {
  test(`real SDK drops late failures after withdrawal (regrant first: ${regrantBeforeFailure})`, async t => {
    const { api, preferences, sdk, requests } = realAnalytics(t)
    api.startAnalytics()
    preferences.saveAnalyticsChoice('accepted')
    await settled()
    api.track('download_clicked')
    const pending = requests.at(-1)
    preferences.saveAnalyticsChoice('rejected')
    if (regrantBeforeFailure) {
      preferences.saveAnalyticsChoice('accepted')
      await settled()
    }
    const count = requests.length
    pending.callback({ statusCode: 500 })
    assert.equal(sdk._retryQueue.length, 0)
    t.mock.timers.tick(60_000)
    sdk._retryQueue.unload()
    assert.equal(requests.length, count)
    if (!regrantBeforeFailure) {
      preferences.saveAnalyticsChoice('accepted')
      await settled()
    }
    api.track('docs_link_clicked')
    assert.equal(requests.at(-1).data.event, 'docs_link_clicked')
    assert.equal(requests.filter(request => request.data?.event === 'download_clicked').length, 1)
  })
}

test('withdrawing while the SDK imports prevents initialisation', async () => {
  const { api, preferences, calls } = analytics()
  api.startAnalytics()
  preferences.saveAnalyticsChoice('accepted')
  preferences.saveAnalyticsChoice('rejected')
  await settled()
  assert.equal(calls.init, 0)
  assert.equal(calls.optIn, 0)
})

test('DNT, GPC and missing configuration override saved consent', async () => {
  for (const options of [{ navigator: { doNotTrack: '1' } }, { navigator: { globalPrivacyControl: true } }, { configured: false }]) {
    const { api, preferences, calls } = analytics(browser(options))
    preferences.saveAnalyticsChoice('accepted')
    api.startAnalytics()
    await settled()
    assert.equal(preferences.analyticsAllowed(), false)
    assert.equal(calls.imports, 0)
  }
})

test('corrupt, expired, future and wrong-version consent fails closed', () => {
  const { preferences, storage } = browser()
  const now = Date.now()
  for (const value of [
    'broken json', 'null',
    JSON.stringify({ version: 1, choice: 'accepted', updatedAt: now - preferences.ANALYTICS_CHOICE_TTL }),
    JSON.stringify({ version: 1, choice: 'accepted', updatedAt: now + 60000 }),
    JSON.stringify({ version: 2, choice: 'accepted', updatedAt: now }),
  ]) {
    storage.set(preferences.ANALYTICS_CHOICE_KEY, value)
    assert.equal(preferences.analyticsAllowed(), false)
  }
})

test('revocation wins even when writing over old saved consent fails', () => {
  const { preferences, window } = browser()
  preferences.saveAnalyticsChoice('accepted')
  assert.equal(preferences.analyticsAllowed(), true)
  window.localStorage.setItem = () => { throw new Error('Storage unavailable') }
  preferences.saveAnalyticsChoice('rejected')
  assert.equal(preferences.analyticsAllowed(), false)
  window.localStorage.getItem = () => { throw new Error('Storage unavailable') }
  preferences.saveAnalyticsChoice('accepted')
  assert.equal(preferences.analyticsAllowed(), true)
  preferences.saveAnalyticsChoice('rejected')
  assert.equal(preferences.analyticsAllowed(), false)
})

test('another tab revoking consent stops the active SDK', async () => {
  const { api, preferences, window, storage, calls } = analytics()
  preferences.saveAnalyticsChoice('accepted')
  api.startAnalytics()
  await settled()
  storage.delete(preferences.ANALYTICS_CHOICE_KEY)
  const event = new Event('storage')
  event.key = preferences.ANALYTICS_CHOICE_KEY
  window.dispatchEvent(event)
  await settled()
  assert.equal(calls.optOut, 1)
  assert.equal(preferences.analyticsAllowed(), false)
})

test('event minimisation removes personal/URL fields and retains ingestion token', () => {
  const { api, preferences } = analytics()
  preferences.saveAnalyticsChoice('accepted')
  const event = api.filterAnalyticsEvent({ event: '$pageview', properties: {
    token: 'test-token', $pathname: '/docs', distinct_id: 'temporary',
    $current_url: 'https://mischi.test/?email=private', $referrer: 'private',
    $set: { email: 'private' }, email: 'private', query: 'private',
    message: 'private', utm_source: 'private',
  } })
  assert.deepEqual(Object.keys(event.properties).sort(), ['$pathname', '$process_person_profile', 'distinct_id', 'token'])
  assert.equal(event.properties.$process_person_profile, false)
})

test('download route rejects missing/stale acknowledgement and foreign origins', async () => {
  const legal = load('lib/legal.ts')
  const { RELEASE } = load('lib/release.ts')
  const { POST } = load('app/api/download/route.ts', {}, {
    'next/server': require('next/server'), '@/lib/legal': legal, '@/lib/release': { RELEASE },
  })
  const valid = { agreement: 'yes', termsVersion: legal.TERMS_VERSION, privacyVersion: legal.PRIVACY_VERSION }
  const request = (fields, origin = 'https://mischi.test') => new Request('https://mischi.test/api/download', {
    method: 'POST', headers: { origin }, body: new URLSearchParams(fields),
  })
  for (const fields of [{}, { ...valid, agreement: 'no' }, { ...valid, termsVersion: 'old' }, { ...valid, privacyVersion: 'old' }]) {
    const response = await POST(request(fields))
    assert.equal(response.status, 303)
    assert.equal(response.headers.get('location'), 'https://mischi.test/download')
  }
  assert.equal((await POST(request(valid, 'https://other.test'))).status, 403)
  const malformed = await POST(new Request('https://mischi.test/api/download', { method: 'POST', body: 'not a form' }))
  assert.equal(malformed.headers.get('location'), 'https://mischi.test/download')
  const response = await POST(request(valid))
  assert.equal(response.status, 303)
  assert.equal(response.headers.get('location'), `https://mischi.test${RELEASE.dmgUrl}`)
  assert.equal(response.headers.get('cache-control'), 'no-store')
})

test('rate limiting expires inactive IP records without another request', () => {
  const maps = []
  let now = 0
  const timers = new Map()
  const { createRateLimit } = load('lib/rate-limit.ts', {
    Date: { now: () => now },
    Map: class extends Map { constructor() { super(); maps.push(this) } },
    setTimeout(callback, delay) {
      const timer = { unref() {} }
      timers.set(timer, { callback, at: now + delay })
      return timer
    },
    clearTimeout(timer) { timers.delete(timer) },
  })
  const limited = createRateLimit({ windowMs: 1000, max: 2 })
  const records = maps[0]
  assert.equal(limited('test-ip'), false)
  assert.equal(limited('test-ip'), false)
  assert.equal(limited('test-ip'), true)
  assert.equal(timers.size, 1)
  assert.equal(records.size, 1)
  now = 1000
  for (const { callback, at } of timers.values()) if (at <= now) callback()
  assert.equal(records.size, 0)
  assert.equal(limited('test-ip'), false)
})
