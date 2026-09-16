import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import Link from 'next/link'
import { preload } from 'react-dom'
import { SITE_OG_IMAGE, SITE_TWITTER_IMAGE, TWITTER_HANDLE } from '@/lib/seo'
import Nav from '../components/nav/Nav'
import Footer from '../components/footer/Footer'
import DraggablePet from '../components/demo/DraggablePet'
import PetDownloadButton from '../components/pets/PetDownloadButton'
import PetPreview from '../components/pets/PetPreview'

const DESCRIPTION =
  'Browse and download ready-made Mischi pets, each packaged as a Codex-compatible pet zip.'

export const metadata: Metadata = {
  title: 'Pets',
  description: DESCRIPTION,
  alternates: { canonical: '/pets' },
  openGraph: {
    title: 'Pets | Mischi',
    description: DESCRIPTION,
    url: '/pets',
    type: 'website',
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pets | Mischi',
    description: DESCRIPTION,
    creator: TWITTER_HANDLE,
    site: TWITTER_HANDLE,
    images: [SITE_TWITTER_IMAGE],
  },
}

interface PetManifest {
  id?: string
  displayName?: string
  description?: string
  spritesheetPath?: string
}

interface Pet {
  id: string
  slug: string
  name: string
  description: string
  previewSrc: string
  spritesheetSrc: string
  downloadHref: string
  downloadSize: string | null
}

const PET_ROOT = path.join(process.cwd(), 'public', 'pets', 'library')
const DOWNLOAD_ROOT = path.join(process.cwd(), 'public', 'pets', 'downloads')
const FEATURED_ORDER = [
  'mischi',
  'finder-guy',
  'orbit',
  'moss',
  'tung-tung',
  'mochi',
  'nugget',
  'mimi',
  'pip',
  'greg',
  'yuzu',
  'emberwing',
  'primebot',
]

const INSTALL_STEPS = [
  {
    title: 'Download the zip',
    body: 'Pick a pet from the shelf and keep the zip as-is.',
  },
  {
    title: 'Import in Mischi',
    body: 'Open the Mischi menu and choose Import Pet .zip.',
  },
  {
    title: 'Switch pets',
    body: 'Choose it from the pet library whenever you want a new desk mood.',
  },
]

function readPets(): Pet[] {
  if (!fs.existsSync(PET_ROOT)) return []

  const pets = fs.readdirSync(PET_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => readPet(entry.name))
    .filter((pet): pet is Pet => Boolean(pet))

  const nameCounts = pets.reduce((counts, pet) => {
    counts.set(pet.name, (counts.get(pet.name) ?? 0) + 1)
    return counts
  }, new Map<string, number>())

  return pets
    .map((pet) => ({
      ...pet,
      name: nameCounts.get(pet.name)! > 1 ? titleFromSlug(pet.slug) : pet.name,
    }))
    .sort((a, b) => {
      const aOrder = FEATURED_ORDER.indexOf(a.slug)
      const bOrder = FEATURED_ORDER.indexOf(b.slug)
      if (aOrder !== -1 || bOrder !== -1) {
        return (aOrder === -1 ? Number.MAX_SAFE_INTEGER : aOrder) -
          (bOrder === -1 ? Number.MAX_SAFE_INTEGER : bOrder)
      }
      return a.name.localeCompare(b.name)
    })
}

function readPet(slug: string): Pet | null {
  const petDir = path.join(PET_ROOT, slug)
  const manifestPath = path.join(petDir, 'pet.json')
  if (!fs.existsSync(manifestPath)) return null

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as PetManifest
  const spritesheetFile = manifest.spritesheetPath ?? 'spritesheet.webp'
  const downloadPath = path.join(DOWNLOAD_ROOT, `${slug}.zip`)

  return {
    id: manifest.id ?? slug,
    slug,
    name: manifest.displayName ?? titleFromSlug(slug),
    description: manifest.description ?? 'A Codex-compatible Mischi pet.',
    previewSrc: `/pets/library/${slug}/preview.webp`,
    spritesheetSrc: `/pets/library/${slug}/${spritesheetFile}`,
    downloadHref: `/pets/downloads/${slug}.zip`,
    downloadSize: fs.existsSync(downloadPath) ? formatBytes(fs.statSync(downloadPath).size) : null,
  }
}

function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function PetsPage() {
  const pets = readPets()

  for (const pet of pets.slice(0, 6)) {
    preload(pet.previewSrc, { as: 'image' })
  }

  return (
    <>
      <Nav />
      <main className="pets-main">
        <section className="pets-hero" aria-labelledby="pets-heading">
          <div className="pets-hero-copy">
            <p className="pets-eyebrow">Pet library</p>
            <h1 id="pets-heading">Download a new desktop companion</h1>
            <p className="pets-lede">
              A shelf of ready-made Mischi pets, packaged as Codex-compatible zips. Download one, import it in
              Mischi, and swap your desktop mood whenever you like.
            </p>
            <div className="pets-hero-actions">
              <a href="#pet-gallery" className="pets-primary-action">Browse pets</a>
              <Link href="/docs#pets" className="pets-secondary-action">Import guide</Link>
            </div>
          </div>
          <aside className="pets-hero-aside" aria-label="Share a pet">
            <p className="pets-aside-kicker">Growing library</p>
            <h2>More pets are on the way</h2>
            <p>
              We&apos;re building this shelf over time. If you&apos;ve made something you&apos;re proud of and want to
              share it with other Mischi users, <Link href="/contact">send it over</Link>.
            </p>
          </aside>
        </section>

        <section id="pet-gallery" className="pets-gallery" aria-labelledby="pet-gallery-heading">
          <div className="pets-gallery-head">
            <div>
              <p className="pets-eyebrow">Choose one</p>
              <h2 id="pet-gallery-heading">Pet shelf</h2>
            </div>
            <p>Preview the roster, then download the ones you want to keep around.</p>
          </div>

          {pets.length > 0 ? (
            <div className="pets-grid">
              {pets.map((pet, index) => (
                <article className="pet-card" key={pet.slug}>
                  <div className="pet-card-visual">
                    <PetPreview
                      name={pet.name}
                      previewSrc={pet.previewSrc}
                      spritesheetSrc={pet.spritesheetSrc}
                      eager={index < 4}
                    />
                  </div>
                  <div className="pet-card-body">
                    <div className="pet-card-title-row">
                      <h3>{pet.name}</h3>
                      <span>{pet.id}</span>
                    </div>
                    <p>{pet.description}</p>
                    {pet.downloadSize ? (
                      <PetDownloadButton href={pet.downloadHref} name={pet.name} size={pet.downloadSize} />
                    ) : (
                      <span className="pet-download pet-download-disabled">Package missing</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="pets-empty">
              <p>No pets are published yet.</p>
            </div>
          )}
        </section>

        <section className="pets-install" aria-labelledby="pets-install-heading">
          <div className="pets-install-copy">
            <p className="pets-eyebrow">Add one to Mischi</p>
            <h2 id="pets-install-heading">Import a pet in three clicks</h2>
            <p>
              Mischi copies the pet into its own library, so your downloaded zip stays untouched and easy to share.
            </p>
            <Link href="/docs#pets" className="pets-install-link">Open the full guide</Link>
          </div>
          <ol className="pets-install-steps">
            {INSTALL_STEPS.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
      <DraggablePet />

      <style>{`
        .pets-main {
          padding-top: 92px;
          padding-bottom: 96px;
          color: var(--color-text);
          background:
            linear-gradient(180deg, rgba(253, 251, 246, 0.68) 0%, rgba(248, 244, 236, 0) 360px),
            var(--color-bg);
        }
        .pets-hero,
        .pets-gallery,
        .pets-install {
          max-width: 1120px;
          margin: 0 auto;
          padding-inline: 24px;
        }
        .pets-hero {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(280px, 360px);
          gap: clamp(32px, 6vw, 76px);
          align-items: end;
          padding-top: 64px;
          padding-bottom: 56px;
        }
        .pets-hero-copy {
          max-width: 720px;
        }
        .pets-eyebrow {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0;
          text-transform: uppercase;
          color: var(--color-accent);
        }
        .pets-hero h1,
        .pets-gallery h2,
        .pets-install h2 {
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: 0;
          color: var(--color-text);
        }
        .pets-hero h1 {
          max-width: 720px;
          font-size: clamp(2.35rem, 1.5rem + 3vw, 4rem);
        }
        .pets-lede {
          max-width: 650px;
          margin-top: 18px;
          font-size: var(--text-lg);
          line-height: 1.65;
          color: var(--color-text-muted);
        }
        .pets-hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
        }
        .pets-hero-aside {
          border-left: 1px solid var(--color-border);
          padding-left: clamp(22px, 3vw, 34px);
          padding-bottom: 4px;
        }
        .pets-aside-kicker {
          margin-bottom: 12px;
          font-size: 0.71875rem;
          font-weight: 600;
          letter-spacing: 0;
          text-transform: uppercase;
          color: var(--clay-ink);
        }
        .pets-hero-aside h2 {
          max-width: 12ch;
          font-size: clamp(1.35rem, 1rem + 1.1vw, 1.95rem);
          font-weight: 700;
          line-height: 1.12;
          letter-spacing: 0;
          color: var(--color-text);
        }
        .pets-hero-aside p:not(.pets-aside-kicker) {
          margin-top: 14px;
          font-size: 0.9375rem;
          line-height: 1.7;
          color: var(--color-text-muted);
        }
        .pets-hero-aside a {
          color: var(--sage-800);
          font-weight: 600;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
        }
        .pets-hero-aside a:hover {
          color: var(--sage-900);
        }
        .pets-primary-action,
        .pets-secondary-action,
        .pet-download,
        .pets-install-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 40px;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 600;
          text-decoration: none;
          transition: transform var(--dur-fast), background var(--dur-fast), border-color var(--dur-fast), color var(--dur-fast);
        }
        .pets-primary-action {
          padding: 10px 18px;
          background: var(--cta);
          color: var(--cta-ink);
        }
        .pets-primary-action:hover { background: var(--cta-hover); transform: translateY(-1px); }
        .pets-secondary-action {
          padding: 10px 18px;
          color: var(--color-text);
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
        }
        .pets-secondary-action:hover { border-color: var(--sage-700); transform: translateY(-1px); }
        .pets-primary-action:focus-visible,
        .pets-secondary-action:focus-visible,
        .pet-download:focus-visible,
        .pets-install-link:focus-visible,
        .pets-hero-aside a:focus-visible {
          outline: 2px solid var(--sage-600);
          outline-offset: 3px;
        }
        .pets-gallery {
          padding-top: 32px;
        }
        .pets-gallery-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 24px;
        }
        .pets-gallery h2,
        .pets-install h2 {
          font-size: clamp(1.7rem, 1.2rem + 1.6vw, 2.35rem);
        }
        .pets-gallery-head > p {
          max-width: 330px;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          line-height: 1.55;
          text-align: right;
        }
        .pets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
          gap: 18px;
        }
        .pet-card {
          position: relative;
          overflow: hidden;
          display: flex;
          min-height: 100%;
          flex-direction: column;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: var(--color-surface);
          box-shadow: var(--shadow-soft);
          transition: transform var(--dur-fast), border-color var(--dur-fast), box-shadow var(--dur-fast);
        }
        .pet-card::before {
          content: '';
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: var(--sage-600);
          opacity: 0.72;
        }
        .pet-card:nth-child(4n + 2)::before { background: var(--clay); }
        .pet-card:nth-child(4n + 3)::before { background: var(--desk-b); }
        .pet-card:nth-child(4n + 4)::before { background: var(--sage-800); }
        .pet-card:hover {
          transform: translateY(-2px);
          border-color: var(--color-border-strong);
          box-shadow: var(--shadow-card);
        }
        .pet-card-visual {
          display: flex;
          min-height: 206px;
          align-items: center;
          justify-content: center;
          padding: 22px 16px 14px;
          background:
            linear-gradient(180deg, rgba(81, 139, 112, 0.09), rgba(253, 251, 246, 0.56)),
            var(--color-surface-sunken);
          border-bottom: 1px solid var(--color-border);
        }
        .pets-preview {
          display: flex;
          position: relative;
          width: 150px;
          height: 164px;
          align-items: center;
          justify-content: center;
        }
        .pets-preview-image {
          width: 150px;
          height: auto;
          image-rendering: pixelated;
          transition: opacity var(--dur-normal) var(--ease-expo);
        }
        .pets-preview-motion {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity var(--dur-normal) var(--ease-expo);
        }
        .pets-preview[data-animated='true'] .pets-preview-image {
          opacity: 0;
        }
        .pets-preview[data-animated='true'] .pets-preview-motion {
          opacity: 1;
        }
        .pet-card-body {
          display: flex;
          flex: 1;
          flex-direction: column;
          gap: 13px;
          padding: 17px;
        }
        .pet-card-title-row {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }
        .pet-card h3 {
          font-size: 1.0625rem;
          line-height: 1.2;
          letter-spacing: 0;
          color: var(--color-text);
        }
        .pet-card-title-row span {
          max-width: 46%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          border: 1px solid var(--color-border);
          border-radius: 999px;
          padding: 2px 7px;
          font-family: var(--font-mono);
          font-size: 0.625rem;
          color: var(--color-text-dim);
          background: var(--color-surface-sunken);
        }
        .pet-card p {
          flex: 1;
          font-size: 0.875rem;
          line-height: 1.6;
          color: var(--color-text-muted);
        }
        .pet-download {
          width: 100%;
          margin-top: 2px;
          padding: 9px 12px;
          color: var(--cta-ink);
          background: var(--cta);
        }
        .pet-download:hover { background: var(--cta-hover); }
        .pet-download[data-loading='true'] {
          cursor: progress;
          background: var(--cta-hover);
        }
        .pet-download-size {
          font-family: var(--font-mono);
          font-size: 0.6875rem;
          font-weight: 500;
          color: rgba(247, 243, 234, 0.78);
        }
        .pet-download-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(247, 243, 234, 0.34);
          border-top-color: currentColor;
          border-radius: 999px;
          animation: pet-download-spin 0.7s linear infinite;
        }
        .pet-download-disabled {
          color: var(--color-text-dim);
          background: var(--color-surface-sunken);
          border: 1px solid var(--color-border);
        }
        .pets-empty {
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 28px;
          background: var(--color-surface);
          color: var(--color-text-muted);
        }
        .pets-install {
          display: grid;
          grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
          gap: clamp(24px, 5vw, 56px);
          align-items: center;
          margin-top: 78px;
          padding-block: clamp(28px, 5vw, 48px);
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background:
            linear-gradient(135deg, rgba(63, 138, 102, 0.11), rgba(246, 235, 224, 0.8)),
            var(--color-surface);
          box-shadow: var(--shadow-card);
        }
        .pets-install-copy p:not(.pets-eyebrow) {
          max-width: 36ch;
          margin-top: 12px;
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          line-height: 1.65;
        }
        .pets-install-link {
          width: fit-content;
          margin-top: 20px;
          padding: 9px 14px;
          color: var(--color-text);
          background: var(--color-surface);
          border: 1px solid var(--color-border-strong);
        }
        .pets-install-link:hover {
          border-color: var(--sage-700);
          transform: translateY(-1px);
        }
        .pets-install-steps {
          display: grid;
          gap: 10px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .pets-install-steps li {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          gap: 14px;
          align-items: start;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          padding: 15px;
          background: rgba(253, 251, 246, 0.78);
          color: var(--color-text-muted);
          font-size: 0.9375rem;
          line-height: 1.55;
        }
        .pets-install-steps li span {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: var(--sage-600);
          color: var(--cta-ink);
          font-family: var(--font-mono);
          font-size: 0.875rem;
        }
        .pets-install-steps h3 {
          font-size: 0.98rem;
          line-height: 1.25;
          letter-spacing: 0;
          color: var(--color-text);
        }
        .pets-install-steps p {
          margin-top: 4px;
        }
        @media (max-width: 860px) {
          .pets-hero,
          .pets-install {
            grid-template-columns: minmax(0, 1fr);
          }
          .pets-hero-aside {
            border-left: 0;
            border-top: 1px solid var(--color-border);
            padding-left: 0;
            padding-top: 24px;
          }
          .pets-hero-aside h2 {
            max-width: none;
          }
        }
        @media (max-width: 640px) {
          .pets-main {
            padding-top: 80px;
          }
          .pets-hero {
            padding-top: 32px;
          }
          .pets-gallery-head {
            align-items: start;
            flex-direction: column;
          }
          .pets-gallery-head > p {
            flex: 1;
            text-align: left;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .pet-card,
          .pets-primary-action,
          .pets-secondary-action,
          .pets-preview-image,
          .pets-preview-motion {
            transition: none;
          }
          .pet-card:hover,
          .pets-primary-action:hover,
          .pets-secondary-action:hover {
            transform: none;
          }
          .pet-download-spinner {
            animation: none;
          }
        }
        @keyframes pet-download-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
