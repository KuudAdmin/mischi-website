import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SITE_TAGLINE } from '@/lib/seo'

export const alt = 'Mischi — Your Mac Companion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OpengraphImage() {
  const iconData = await readFile(
    join(process.cwd(), 'public/icon-3d.png'),
    'base64',
  )
  const iconSrc = `data:image/png;base64,${iconData}`

  const wordmarkSvg = (
    await readFile(join(process.cwd(), 'public/mischi-typo-dark.svg'), 'utf-8')
  ).replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="#467A62"')
  const wordmarkSrc = `data:image/svg+xml;base64,${Buffer.from(wordmarkSvg).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          background:
            'radial-gradient(900px 700px at 80% 50%, #EDF4F0 0%, #F4EFE6 62%)',
          color: '#1B211D',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Sage glow behind the pet */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: '60px',
            width: 520,
            height: 520,
            transform: 'translateY(-50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(81,139,112,0.22) 0%, rgba(81,139,112,0) 68%)',
            display: 'flex',
          }}
        />

        {/* ── Left: copy ───────────────────────────── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '90px',
            paddingRight: '40px',
            width: 700,
          }}
        >
          {/* Wordmark */}
          <img src={wordmarkSrc} alt="Mischi" width={159} height={44} />

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '28px',
              fontSize: 88,
              fontWeight: 800,
              lineHeight: 1.04,
              letterSpacing: '-0.035em',
            }}
          >
            <span style={{ display: 'flex' }}>
              Your Mac&nbsp;
              <span style={{ color: '#467A62' }}>deserves</span>
            </span>
            <span style={{ display: 'flex' }}>a companion.</span>
          </div>

          {/* Sub */}
          <div
            style={{
              display: 'flex',
              marginTop: '30px',
              maxWidth: '560px',
              fontSize: 30,
              lineHeight: 1.45,
              color: '#6B675B',
            }}
          >
            Run animated desktop pets on macOS. Interactive, expressive,
            offline-first.
          </div>

          {/* Meta pills */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '40px',
            }}
          >
            {['macOS', 'Offline-first'].map((label) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#3D6A56',
                  background: '#FBF8F1',
                  border: '1px solid #D8E9E0',
                  borderRadius: 9999,
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: 3D pet ───────────────────────── */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src={iconSrc}
            alt={SITE_TAGLINE}
            width={420}
            height={420}
            style={{
              filter: 'drop-shadow(0 30px 50px rgba(27,33,29,0.18))',
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  )
}
