'use client'

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type KeyboardEvent } from 'react'
import { CONTACT_EMAIL } from '@/lib/release'
import { track } from '@/lib/analytics'
import ContactIntro from './ContactIntro'
import SelfHelpList from './SelfHelpList'
import TopicPicker, { TOPICS, type Topic } from './TopicPicker'
import PerchedPet, { type PetMood } from './PerchedPet'
import {
  AutoTextarea,
  ComposeToolbar,
  ComposeWindow,
  HeaderRow,
  InlineAlert,
  MessageSection,
  SentReceipt,
} from './ComposeWindow'
import { EMPTY_FIELDS, clearDraft, hasBody, loadDraft, saveDraft, type ContactFields } from './drafts'
import { CopyIcon, LinkIcon, MailIcon, PencilIcon } from './icons'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

// Messages go to app/api/contact/route.ts, which sends them through Resend. If
// that fails, the same message is offered as a pre-filled email or a copy.
export default function ContactExperience() {
  const [topic, setTopic] = useState<Topic>('question')
  const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS)
  const [appInfo, setAppInfo] = useState<{ version: string; os: string } | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<{ message: string; fallback: boolean } | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [restored, setRestored] = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [editingSubject, setEditingSubject] = useState(false)
  const [subject, setSubject] = useState('')
  const [company, setCompany] = useState('') // honeypot — stays empty for humans
  const [typing, setTyping] = useState(false)
  const [greeting, setGreeting] = useState(true)
  const [copied, setCopied] = useState(false)
  // False until the arrival effect has read ?v= and any draft. The CSS keeps
  // the topic picker from showing a (possibly wrong) selection before then.
  const [ready, setReady] = useState(false)
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  )

  // On arrival: pick up the app's ?v= and ?os= (sent by Preferences → About →
  // Report it) and any unsent draft. Deferred by a tick so the page can be
  // prerendered as a static file. A timeout rather than requestAnimationFrame:
  // rAF never fires in a background tab, so a link opened behind the current
  // tab would sit on the default topic until someone looked at it.
  useEffect(() => {
    const arrival = setTimeout(() => {
      const params = new URLSearchParams(window.location.search)
      const version = (params.get('v') ?? '').slice(0, 32)
      const os = (params.get('os') ?? '').slice(0, 80)
      if (version) setAppInfo({ version, os })

      const draft = loadDraft()
      if (draft && hasBody(draft.fields)) {
        setFields({ ...draft.fields, version: version || draft.fields.version })
        setTopic(version ? 'bug' : draft.topic)
        setRestored(true)
        setDraftSaved(true)
        track('contact_draft_restored', { topic: draft.topic })
      } else if (version) {
        setTopic('bug')
        setFields((current) => ({ ...current, version }))
      }
      setReady(true)
    }, 0)
    const greetingTimer = setTimeout(() => setGreeting(false), 2200)
    return () => {
      clearTimeout(arrival)
      clearTimeout(greetingTimer)
      if (typingTimer.current) clearTimeout(typingTimer.current)
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  const info = TOPICS.find((t) => t.id === topic) ?? TOPICS[0]
  const isBug = topic === 'bug'
  const version = (appInfo?.version ?? fields.version).trim()
  const autoSubject = `${info.label}${version ? ` · Mischi ${version}` : ''}`
  const finalSubject = editingSubject && subject.trim() ? subject.trim() : autoSubject

  const emailValid = EMAIL_RE.test(fields.email.trim())
  const mainText = isBug ? fields.happened : fields.message
  const missing = [
    !emailValid && 'your email',
    !mainText.trim() && (isBug ? 'what happened' : 'a message'),
  ].filter((item): item is string => Boolean(item))
  const showEmailError = attempted && !emailValid
  const showMainError = attempted && !mainText.trim()

  // The same message as plain text, for the email and copy fallbacks.
  const systemInfo = [version && `Mischi ${version}`, appInfo?.os && `macOS ${appInfo.os}`]
    .filter(Boolean)
    .join('\n')
  const bodyParts = isBug
    ? [
        `What happened:\n${fields.happened.trim()}`,
        `What I expected:\n${fields.expected.trim()}`,
        `Steps to reproduce:\n${fields.steps.trim()}`,
      ]
    : [fields.message.trim(), ...(topic === 'pet' && fields.link.trim() ? [`Link: ${fields.link.trim()}`] : [])]
  const mailBody = [...bodyParts, ...(systemInfo ? [`---\n${systemInfo}`] : [])].join('\n\n')
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Mischi: ${finalSubject}`)}&body=${encodeURIComponent(mailBody)}`

  function scheduleSave(nextTopic: Topic, nextFields: ContactFields) {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setDraftSaved(saveDraft({ topic: nextTopic, fields: nextFields })), 700)
  }

  function clearError() {
    if (status === 'error') {
      setStatus('idle')
      setError(null)
    }
  }

  function updateField(key: keyof ContactFields, value: string) {
    const next = { ...fields, [key]: value }
    setFields(next)
    clearError()
    setTyping(true)
    if (typingTimer.current) clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => setTyping(false), 1400)
    scheduleSave(topic, next)
  }

  function changeTopic(next: Topic) {
    setTopic(next)
    setAttempted(false)
    clearError()
    scheduleSave(next, fields)
  }

  function resetMessage() {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    clearDraft()
    setFields((current) => ({ ...EMPTY_FIELDS, name: current.name, email: current.email, version: current.version }))
    setAttempted(false)
    setRestored(false)
    setDraftSaved(false)
    setEditingSubject(false)
    setSubject('')
    setError(null)
    setStatus('idle')
  }

  async function submit() {
    if (status === 'sending') return
    if (missing.length > 0) {
      setAttempted(true)
      document.getElementById(emailValid ? (isBug ? 'ct-happened' : 'ct-message') : 'ct-email')?.focus()
      return
    }
    // Honeypot tripped: pretend it worked and never hit the network.
    if (company) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          name: fields.name,
          email: fields.email,
          happened: isBug ? fields.happened : '',
          expected: isBug ? fields.expected : '',
          steps: isBug ? fields.steps : '',
          message: isBug ? '' : fields.message,
          link: topic === 'pet' ? fields.link : '',
          subject: editingSubject ? subject : '',
          version,
          os: appInfo?.os ?? '',
          company,
        }),
      })
      if (res.ok) {
        if (saveTimer.current) clearTimeout(saveTimer.current)
        clearDraft()
        setDraftSaved(false)
        setRestored(false)
        setStatus('sent')
        track('contact_message_sent', { topic, from_app: Boolean(appInfo) })
        return
      }
      const data = (await res.json().catch(() => null)) as { error?: string; fallback?: boolean } | null
      setError({
        message: data?.error || 'Something went wrong. Please try again.',
        fallback: data?.fallback ?? res.status >= 500,
      })
      setStatus('error')
    } catch {
      setError({ message: 'We couldn’t reach our server.', fallback: true })
      setStatus('error')
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    void submit()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLFormElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      void submit()
    }
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT_EMAIL}\nSubject: Mischi: ${finalSubject}\n\n${mailBody}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track('contact_fallback_used', { method: 'copy' })
    } catch {
      // Clipboard blocked; the email link and address are still there.
    }
  }

  const mood: PetMood = reducedMotion
    ? 'idle'
    : status === 'sent'
      ? 'jump'
      : status === 'sending'
        ? 'waiting'
        : status === 'error'
          ? 'tired'
          : typing
            ? 'review'
            : greeting
              ? 'wave'
              : 'idle'

  return (
    <section id="contact" className="ct-grid" data-ready={ready || undefined}>
      <div className="ct-left">
        <ContactIntro />
        <SelfHelpList />
      </div>

      <div className="ct-right">
        <PerchedPet mood={mood} />
        <ComposeWindow
          title={status === 'sent' ? 'Message Sent' : `New ${info.windowTitle}`}
          draftSaved={draftSaved && status !== 'sent'}
          busy={status === 'sending'}
        >
          {status === 'sent' ? (
            <SentReceipt email={fields.email.trim()} onWriteAnother={resetMessage} />
          ) : (
            <form className="ct-form" noValidate onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
              <TopicPicker value={topic} onChange={changeTopic} />

              {restored && (
                <InlineAlert
                  tone="info"
                  title="Picked up where you left off"
                  actions={
                    <button type="button" className="ct-ghost" onClick={resetMessage}>
                      Start fresh
                    </button>
                  }
                >
                  We restored the message you didn’t send earlier.
                </InlineAlert>
              )}

              <HeaderRow label="To:">
                <span className="ct-to">
                  <span className="ct-to-avatar" aria-hidden="true">M</span>
                  Mischi team
                </span>
              </HeaderRow>

              <HeaderRow
                label="From:"
                error={showEmailError ? 'Add your email so we can reply' : undefined}
                errorId="ct-email-error"
              >
                <div className="ct-from">
                  <input
                    id="ct-name"
                    className="ct-input"
                    aria-label="Your name (optional)"
                    placeholder="Your name"
                    autoComplete="name"
                    maxLength={100}
                    value={fields.name}
                    onChange={(e) => updateField('name', e.target.value)}
                  />
                  <input
                    id="ct-email"
                    className="ct-input"
                    type="email"
                    aria-label="Your email"
                    aria-invalid={showEmailError || undefined}
                    aria-describedby={showEmailError ? 'ct-email-error' : undefined}
                    placeholder="you@example.com"
                    autoComplete="email"
                    maxLength={254}
                    value={fields.email}
                    onChange={(e) => updateField('email', e.target.value)}
                  />
                </div>
              </HeaderRow>

              <HeaderRow label="Subject:" htmlFor={editingSubject ? 'ct-subject' : undefined}>
                {editingSubject ? (
                  <input
                    id="ct-subject"
                    className="ct-input"
                    maxLength={120}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span className="ct-subject">
                    <span className="ct-subject-text">{autoSubject}</span>
                    <span className="ct-auto">auto</span>
                    <button
                      type="button"
                      className="ct-icon-btn"
                      aria-label="Edit subject"
                      onClick={() => {
                        setSubject(autoSubject)
                        setEditingSubject(true)
                      }}
                    >
                      <PencilIcon size={13} />
                    </button>
                  </span>
                )}
              </HeaderRow>

              {/* From the app, the version travels with the message silently; the
                  subject line already shows it. Otherwise it's an optional field. */}
              {isBug && !appInfo && (
                <HeaderRow label="Version:" htmlFor="ct-version">
                  <input
                    id="ct-version"
                    className="ct-input"
                    placeholder="Optional · find it in Preferences → About"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={32}
                    value={fields.version}
                    onChange={(e) => updateField('version', e.target.value)}
                  />
                </HeaderRow>
              )}

              <div className="ct-body">
                {isBug ? (
                  <>
                    <MessageSection
                      id="ct-happened"
                      prompt="What happened?"
                      error={showMainError ? 'Tell us what went wrong' : undefined}
                    >
                      <AutoTextarea
                        id="ct-happened"
                        value={fields.happened}
                        onChange={(e) => updateField('happened', e.target.value)}
                        placeholder="My pet disappeared after I unplugged my second display."
                        aria-invalid={showMainError || undefined}
                        aria-describedby={showMainError ? 'ct-happened-error' : undefined}
                        maxLength={5000}
                      />
                    </MessageSection>
                    <MessageSection id="ct-expected" prompt="What did you expect?" optional>
                      <AutoTextarea
                        id="ct-expected"
                        value={fields.expected}
                        onChange={(e) => updateField('expected', e.target.value)}
                        placeholder="It should have moved back to my main screen."
                        maxLength={5000}
                      />
                    </MessageSection>
                    <MessageSection id="ct-steps" prompt="Steps to reproduce" optional>
                      <AutoTextarea
                        id="ct-steps"
                        value={fields.steps}
                        onChange={(e) => updateField('steps', e.target.value)}
                        placeholder={'1. Drag the pet onto an external display\n2. Unplug the display'}
                        rows={2}
                        maxLength={5000}
                      />
                    </MessageSection>
                  </>
                ) : (
                  <>
                    <MessageSection
                      id="ct-message"
                      prompt={info.prompt}
                      error={showMainError ? 'Add a few words first' : undefined}
                    >
                      <AutoTextarea
                        id="ct-message"
                        value={fields.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        placeholder={info.placeholder}
                        aria-invalid={showMainError || undefined}
                        aria-describedby={showMainError ? 'ct-message-error' : undefined}
                        maxLength={5000}
                        className="ct-textarea-tall"
                      />
                    </MessageSection>
                    {topic === 'pet' && (
                      <MessageSection id="ct-link" prompt="Link" optional>
                        <span className="ct-link">
                          <LinkIcon size={15} />
                          <input
                            id="ct-link"
                            className="ct-input"
                            type="url"
                            inputMode="url"
                            placeholder="A download page, repo or video"
                            maxLength={300}
                            value={fields.link}
                            onChange={(e) => updateField('link', e.target.value)}
                          />
                        </span>
                      </MessageSection>
                    )}
                  </>
                )}
              </div>

              {/* Honeypot — kept off-screen (not display:none, which savvier bots
                  skip), hidden from real users and the tab order. */}
              <div className="ct-honeypot" aria-hidden="true">
                <label htmlFor="ct-company">Company (leave this empty)</label>
                <input
                  id="ct-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              {status === 'error' && error && (
                <InlineAlert
                  tone="error"
                  title={error.message}
                  actions={
                    error.fallback ? (
                      <>
                        <a
                          href={mailto}
                          className="ct-ghost"
                          onClick={() => track('contact_fallback_used', { method: 'mail' })}
                        >
                          <MailIcon size={14} />
                          Open in Mail
                        </a>
                        <button type="button" className="ct-ghost" onClick={copyMessage}>
                          <CopyIcon size={14} />
                          {copied ? 'Copied' : 'Copy message'}
                        </button>
                      </>
                    ) : undefined
                  }
                >
                  {error.fallback
                    ? 'Your message is saved here. Send it from your mail app instead, or try again in a minute.'
                    : undefined}
                </InlineAlert>
              )}

              <ComposeToolbar
                sending={status === 'sending'}
                hint={
                  attempted && missing.length > 0 ? (
                    <span className="ct-missing">Add {missing.join(' and ')} to send</span>
                  ) : (
                    <>
                      <kbd className="ct-kbd">⌘ ↵</kbd>
                      to send
                    </>
                  )
                }
              />
            </form>
          )}
        </ComposeWindow>
      </div>
    </section>
  )
}
