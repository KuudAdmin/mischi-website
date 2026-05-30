import { ImageResponse } from 'next/og'
import { SITE_DESCRIPTION } from '@/lib/seo'

export const alt = 'Mischi — Your Mac Companion'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background:
            'radial-gradient(1100px 600px at 78% 18%, #EDF4F0 0%, #F4EFE6 60%)',
          color: '#1B211D',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '0.16em',
            color: '#518B70',
            textTransform: 'uppercase',
          }}
        >
          <span>Mischi</span>
          <div
            style={{
              width: 22,
              height: 22,
              background: '#518B70',
              transform: 'rotate(45deg)',
              borderRadius: 4,
            }}
          />
        </div>

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            marginTop: '26px',
            fontSize: 104,
            fontWeight: 800,
            lineHeight: 1.02,
            letterSpacing: '-0.03em',
          }}
        >
          Your Mac deserves
          <br />a companion.
        </div>

        {/* Sub */}
        <div
          style={{
            display: 'flex',
            marginTop: '34px',
            maxWidth: '820px',
            fontSize: 34,
            lineHeight: 1.4,
            color: '#6B675B',
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size },
  )
}
