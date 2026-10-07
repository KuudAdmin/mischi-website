'use client'

import { useEffect, useRef, useState } from 'react'
import { track } from '@/lib/analytics'

interface Entry {
  sectionId: string
  section: string
  heading: string
  text: string
  el: HTMLElement
}

interface Result {
  entry: Entry
  snippet: string
  score: number
}

const MAX_RESULTS = 6
const SNIPPET_LENGTH = 90

// The index is read from the rendered docs the first time someone searches, so
// it always matches what's on the page — there's no second copy to maintain.
function buildIndex(): Entry[] {
  const entries: Entry[] = []
  document.querySelectorAll<HTMLElement>('.docs-body section[id]').forEach((section) => {
    const h2 = section.querySelector('h2')
    const title = h2?.textContent?.trim() ?? ''
    let current: Entry = { sectionId: section.id, section: title, heading: title, text: '', el: section }
    entries.push(current)
    for (const child of Array.from(section.children) as HTMLElement[]) {
      if (child === h2) continue
      if (child.tagName === 'H3') {
        current = {
          sectionId: section.id,
          section: title,
          heading: child.textContent?.trim() ?? '',
          text: '',
          el: child,
        }
        entries.push(current)
      } else {
        // innerText keeps table cells and list items apart. Column headings
        // ("Message", "What to check") aren't content, so leave them out.
        let text = child.innerText
        child.querySelectorAll<HTMLElement>('thead').forEach((head) => {
          text = text.replace(head.innerText, '')
        })
        current.text += ` ${text}`
      }
    }
  })
  for (const entry of entries) entry.text = entry.text.replace(/\s+/g, ' ').trim()
  return entries
}

// Terms need two characters and a letter or digit, so a stray "/" or "." doesn't
// match every file path on the page.
function termsOf(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2 && /[\p{L}\p{N}]/u.test(t))
}

// A short excerpt that starts on a word boundary just before the first match.
function snippetOf(text: string, terms: string[]): string {
  const lower = text.toLowerCase()
  const first = terms
    .map((t) => lower.indexOf(t))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0]
  if (first === undefined) return text.slice(0, SNIPPET_LENGTH)
  let start = Math.max(0, first - 24)
  if (start > 0) {
    const space = text.lastIndexOf(' ', start)
    start = space >= 0 && first - space < 40 ? space + 1 : start
  }
  let end = Math.min(text.length, start + SNIPPET_LENGTH)
  if (end < text.length) {
    const space = text.lastIndexOf(' ', end)
    if (space > first) end = space
  }
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`
}

function search(index: Entry[], terms: string[]): Result[] {
  if (terms.length === 0) return []
  const results: Result[] = []
  for (const entry of index) {
    const heading = entry.heading.toLowerCase()
    const section = entry.section.toLowerCase()
    const text = entry.text.toLowerCase()
    let score = 0
    let matchesAll = true
    for (const term of terms) {
      if (heading.includes(term)) score += 10
      else if (section.includes(term)) score += 4
      else if (text.includes(term)) score += 1
      else {
        matchesAll = false
        break
      }
    }
    if (matchesAll) results.push({ entry, score, snippet: snippetOf(entry.text, terms) })
  }
  return results.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS)
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const parts = text.split(new RegExp(`(${escaped.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
    </>
  )
}

function SectionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14.5 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7.5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  )
}

function HeadingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16" />
    </svg>
  )
}

export default function DocsSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const indexRef = useRef<Entry[] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // "/" or ⌘K / Ctrl+K focuses the search from anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const typing = !!target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        inputRef.current?.focus()
        inputRef.current?.select()
      }
    }
    function onPointerDown(e: PointerEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  // /docs?search (linked from the contact page) opens with the search focused.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('search')) inputRef.current?.focus()
  }, [])

  function update(value: string) {
    if (!indexRef.current) indexRef.current = buildIndex()
    setQuery(value)
    setResults(search(indexRef.current, termsOf(value)))
    setActive(0)
    setOpen(true)
  }

  function moveActive(next: number) {
    setActive(next)
    listRef.current
      ?.querySelector(`#docs-search-result-${next}`)
      ?.scrollIntoView({ block: 'nearest' })
  }

  function go(result: Result) {
    const { el, sectionId } = result.entry
    // Count useful results without sending free text that may contain personal data.
    track('docs_search_result_opened', {
      result: result.entry.heading,
      section: result.entry.section,
      position: results.indexOf(result) + 1,
    })
    setOpen(false)
    inputRef.current?.blur()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${sectionId}`)
    el.classList.remove('docs-search-hit')
    // Restart the flash even when jumping to the same heading twice.
    void el.offsetWidth
    el.classList.add('docs-search-hit')
    window.setTimeout(() => el.classList.remove('docs-search-hit'), 1800)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault()
      setOpen(true)
      moveActive((active + 1) % results.length)
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault()
      moveActive((active - 1 + results.length) % results.length)
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault()
      go(results[active])
    } else if (e.key === 'Escape') {
      if (query) update('')
      else inputRef.current?.blur()
      setOpen(false)
    }
  }

  const terms = termsOf(query)
  const showPanel = open && query.trim() !== ''

  return (
    <div ref={boxRef} className="docs-search" role="search">
      <label htmlFor="docs-search-input" className="docs-search-label">
        Search the docs
      </label>
      <svg className="docs-search-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
        <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        ref={inputRef}
        id="docs-search-input"
        type="search"
        className="docs-search-input"
        placeholder="Search the docs"
        value={query}
        onChange={(e) => update(e.target.value)}
        onFocus={() => { if (query.trim()) setOpen(true) }}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="docs-search-results"
        aria-autocomplete="list"
        aria-activedescendant={showPanel && results[active] ? `docs-search-result-${active}` : undefined}
      />
      <kbd className="docs-search-kbd" aria-hidden="true">⌘K</kbd>

      <p className="docs-search-status" aria-live="polite">
        {terms.length ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : ''}
      </p>

      {showPanel && (
        <div className="docs-search-panel">
          {terms.length === 0 ? (
            <p className="docs-search-empty">Keep typing to search…</p>
          ) : results.length === 0 ? (
            <p className="docs-search-empty">
              No results for “{query.trim()}”. <a href="/contact">Ask us instead</a>
            </p>
          ) : (
            <div ref={listRef} id="docs-search-results" role="listbox" aria-label="Search results" className="docs-search-list">
              {results.map((result, i) => {
                const isSection = result.entry.heading === result.entry.section
                return (
                  <div
                    key={`${result.entry.sectionId}-${result.entry.heading}`}
                    id={`docs-search-result-${i}`}
                    role="option"
                    aria-selected={i === active}
                    className="docs-search-result"
                    data-active={i === active}
                    onPointerEnter={() => setActive(i)}
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => go(result)}
                  >
                    <span className="docs-search-result-icon">
                      {isSection ? <SectionIcon /> : <HeadingIcon />}
                    </span>
                    <span className="docs-search-result-main">
                      <span className="docs-search-result-top">
                        <span className="docs-search-title">
                          <Highlight text={result.entry.heading} terms={terms} />
                        </span>
                        {!isSection && <span className="docs-search-crumb">{result.entry.section}</span>}
                      </span>
                      {result.snippet && (
                        <span className="docs-search-snippet">
                          <Highlight text={result.snippet} terms={terms} />
                        </span>
                      )}
                    </span>
                    <svg className="docs-search-enter" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 5v7a3 3 0 0 1-3 3H5" />
                      <path d="m9 11-4 4 4 4" />
                    </svg>
                  </div>
                )
              })}
            </div>
          )}
          <div className="docs-search-foot" aria-hidden="true">
            <span><kbd>↑</kbd><kbd>↓</kbd> to move</span>
            <span><kbd>↵</kbd> to open</span>
            <span><kbd>esc</kbd> to close</span>
          </div>
        </div>
      )}

      <style>{`
        .docs-search {
          position: relative;
          z-index: 20;
          max-width: 520px;
          margin-top: 28px;
        }
        .docs-search-label,
        .docs-search-status {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
        }
        .docs-search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-dim);
          pointer-events: none;
        }
        .docs-search-input {
          width: 100%;
          padding: 11px 56px 11px 42px;
          border-radius: 9999px;
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
          color: var(--color-text);
          font: inherit;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color var(--dur-fast), background var(--dur-fast);
        }
        .docs-search-input::placeholder { color: var(--color-text-dim); }
        .docs-search-input::-webkit-search-cancel-button { display: none; }
        .docs-search-input:focus { border-color: var(--color-accent); background: var(--color-surface-raised); }
        .docs-search-kbd {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          padding: 0 6px;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          line-height: 20px;
          color: var(--color-text-dim);
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
          border-radius: 5px;
          pointer-events: none;
          transition: opacity var(--dur-fast);
        }
        .docs-search-input:focus ~ .docs-search-kbd,
        .docs-search-input:not(:placeholder-shown) ~ .docs-search-kbd { opacity: 0; }

        .docs-search-panel {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          overflow: hidden;
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-card);
        }
        .docs-search-list {
          max-height: 340px;
          overflow-y: auto;
          padding: 6px;
        }
        .docs-search-result {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
        }
        .docs-search-result[data-active='true'] { background: var(--color-accent-dim); }
        .docs-search-result-icon {
          flex: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: var(--color-surface-sunken);
          color: var(--color-text-muted);
        }
        .docs-search-result[data-active='true'] .docs-search-result-icon {
          background: var(--color-surface-raised);
          color: var(--sage-800);
        }
        .docs-search-result-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
        .docs-search-result-top { display: flex; align-items: baseline; gap: 8px; min-width: 0; }
        .docs-search-title {
          flex: none;
          max-width: 70%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text);
        }
        .docs-search-crumb {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.75rem;
          color: var(--color-text-dim);
        }
        .docs-search-snippet {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.8125rem;
          color: var(--color-text-muted);
        }
        .docs-search-result mark {
          background: rgba(81, 139, 112, 0.18);
          color: inherit;
          border-radius: 3px;
          padding: 0 1px;
        }
        .docs-search-enter { flex: none; color: var(--sage-700); opacity: 0; }
        .docs-search-result[data-active='true'] .docs-search-enter { opacity: 1; }
        .docs-search-empty {
          margin: 0;
          padding: 16px 16px 14px;
          font-size: 0.875rem;
          color: var(--color-text-muted);
        }
        .docs-search-empty a {
          color: var(--sage-800);
          text-decoration: none;
          border-bottom: 1px solid rgba(81, 139, 112, 0.35);
        }
        .docs-search-foot {
          display: flex;
          gap: 16px;
          padding: 8px 14px;
          border-top: 1px solid var(--color-border);
          background: var(--color-surface);
          font-size: 0.75rem;
          color: var(--color-text-dim);
        }
        .docs-search-foot kbd {
          display: inline-block;
          min-width: 18px;
          margin-right: 3px;
          padding: 0 4px;
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          line-height: 17px;
          text-align: center;
          color: var(--color-text-muted);
          background: var(--color-surface-raised);
          border: 1px solid var(--color-border-strong);
          border-radius: 4px;
        }
        @keyframes docs-search-flash {
          from { background-color: rgba(81, 139, 112, 0.16); }
          to   { background-color: transparent; }
        }
        .docs-search-hit {
          animation: docs-search-flash 1.8s var(--ease-expo);
          border-radius: 6px;
        }
        @media (max-width: 640px) {
          .docs-search-foot { display: none; }
          .docs-search-kbd { display: none; }
          .docs-search-input { padding-right: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .docs-search-hit { animation: none; }
        }
      `}</style>
    </div>
  )
}
