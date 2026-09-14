'use client'

import { useEffect, useRef, type ReactNode, type TextareaHTMLAttributes } from 'react'
import Link from 'next/link'
import { AlertIcon, CheckIcon, RestoreIcon, SendIcon } from './icons'

/** The Mail-style window every state of the contact page renders inside. */
export function ComposeWindow({
  title,
  draftSaved,
  busy,
  children,
}: {
  title: string
  draftSaved: boolean
  busy: boolean
  children: ReactNode
}) {
  return (
    <div className="ct-window" aria-busy={busy || undefined}>
      <div className="ct-titlebar">
        <span className="ct-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2 className="ct-window-title">{title}</h2>
        <span className="ct-saved" data-visible={draftSaved} aria-hidden="true">
          <i />
          Draft saved
        </span>
      </div>
      {children}
    </div>
  )
}

/** A To / From / Subject line: muted label on the left, the value on the right. */
export function HeaderRow({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: string
  htmlFor?: string
  error?: string
  errorId?: string
  children: ReactNode
}) {
  return (
    <div className="ct-row" data-invalid={error ? true : undefined}>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="ct-row-label">{label}</label>
      ) : (
        <span className="ct-row-label">{label}</span>
      )}
      <div className="ct-row-value">
        {children}
        {error && (
          <p id={errorId} className="ct-row-error">
            <AlertIcon size={12} />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

/** A prompt written into the message body, like a heading, above its text. */
export function MessageSection({
  id,
  prompt,
  optional,
  error,
  children,
}: {
  id: string
  prompt: string
  optional?: boolean
  error?: string
  children: ReactNode
}) {
  return (
    <div className="ct-section" data-invalid={error ? true : undefined}>
      <label htmlFor={id} className="ct-prompt">
        {prompt}
        {optional && <span className="ct-optional">optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="ct-row-error">
          <AlertIcon size={12} />
          {error}
        </p>
      )}
    </div>
  )
}

function fitToContent(el: HTMLTextAreaElement) {
  // An empty box keeps its CSS height (its rows). Measuring it is what went
  // wrong: scrollHeight taken before layout and fonts settle comes back several
  // lines tall, and the box then visibly shrinks a moment later.
  if (el.value === '') {
    el.style.height = ''
    return
  }
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

/** A borderless textarea that grows with its content instead of scrolling. */
export function AutoTextarea({
  value,
  className,
  ...rest
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Fit on every change of text…
  useEffect(() => {
    const el = ref.current
    if (el) fitToContent(el)
  }, [value])

  // …and whenever the text could re-wrap without the value changing: once
  // layout settles (the observer's first callback), when the web font finishes
  // loading, and on any later width change such as a window resize. A height
  // measured before any of those can leave an empty box several lines tall.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let cancelled = false
    let lastWidth = -1
    const observer = new ResizeObserver(() => {
      if (el.clientWidth === lastWidth) return
      lastWidth = el.clientWidth
      fitToContent(el)
    })
    observer.observe(el)
    document.fonts?.ready.then(() => {
      if (!cancelled) fitToContent(el)
    })
    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return <textarea ref={ref} value={value} rows={1} className={`ct-textarea ${className ?? ''}`} {...rest} />
}

export function ComposeToolbar({ sending, hint }: { sending: boolean; hint: ReactNode }) {
  return (
    <div className="ct-toolbar">
      <p className="ct-toolbar-hint">{hint}</p>
      <button type="submit" className="ct-send" disabled={sending}>
        {sending ? <span className="ct-spinner" aria-hidden="true" /> : <SendIcon size={15} />}
        {sending ? 'Sending…' : 'Send message'}
      </button>
    </div>
  )
}

export function InlineAlert({
  tone,
  title,
  children,
  actions,
}: {
  tone: 'error' | 'info'
  title: string
  children?: ReactNode
  actions?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  // A send error lands below a long message, under the pinned toolbar; bring
  // it into view so it isn't missed.
  useEffect(() => {
    if (tone !== 'error') return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ref.current?.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [tone, title])

  return (
    <div ref={ref} className="ct-alert" data-tone={tone} role={tone === 'error' ? 'alert' : 'status'}>
      {tone === 'error' ? <AlertIcon size={17} /> : <RestoreIcon size={17} />}
      <div>
        <p className="ct-alert-title">{title}</p>
        {children && <p className="ct-alert-body">{children}</p>}
        {actions && <div className="ct-alert-actions">{actions}</div>}
      </div>
    </div>
  )
}

export function SentReceipt({ email, onWriteAnother }: { email: string; onWriteAnother: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Move focus to the confirmation so keyboard and screen reader users land on it.
  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="ct-receipt">
      <span className="ct-receipt-icon" aria-hidden="true">
        <CheckIcon size={22} />
      </span>
      <div>
        <h3 ref={headingRef} tabIndex={-1} className="ct-receipt-title">Message sent. Thank you!</h3>
        {email && (
          <p className="ct-receipt-sub">
            We’ll reply to <strong>{email}</strong>.
          </p>
        )}
      </div>
      <ol className="ct-steps">
        <li>
          <span className="ct-step-n">1</span>
          <span><strong>A person reads it</strong>, usually within a few days.</span>
        </li>
        <li>
          <span className="ct-step-n">2</span>
          <span><strong>We reply by email</strong> if we need more detail.</span>
        </li>
      </ol>
      <div className="ct-receipt-actions">
        <button type="button" className="ct-ghost" onClick={onWriteAnother}>
          Write another
        </button>
        <Link href="/docs" className="ct-ghost">
          Back to the docs
        </Link>
      </div>
    </div>
  )
}
