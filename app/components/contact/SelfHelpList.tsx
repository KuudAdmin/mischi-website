import Link from 'next/link'
import { CONTACT_EMAIL } from '@/lib/release'
import { BookIcon, BuoyIcon, ChevronIcon, SearchIcon } from './icons'

export default function SelfHelpList() {
  return (
    <nav className="ct-help" aria-labelledby="ct-help-label">
      <p id="ct-help-label" className="ct-label">Before you write</p>
      <ul className="ct-help-list">
        <li>
          <Link href="/docs#troubleshooting" className="ct-help-link">
            <BuoyIcon size={17} />
            <span>Troubleshooting</span>
            <span className="ct-help-meta">Common fixes<ChevronIcon size={14} /></span>
          </Link>
        </li>
        <li>
          <Link href="/docs?search" className="ct-help-link">
            <SearchIcon size={17} />
            <span>Search the docs</span>
            <span className="ct-help-meta"><kbd className="ct-kbd">⌘K</kbd></span>
          </Link>
        </li>
        <li>
          <Link href="/#faq" className="ct-help-link">
            <BookIcon size={17} />
            <span>FAQ</span>
            <span className="ct-help-meta">Quick answers<ChevronIcon size={14} /></span>
          </Link>
        </li>
      </ul>
      <p className="ct-help-email">
        Prefer email? Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </nav>
  )
}
