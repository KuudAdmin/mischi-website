import { RELEASE } from '@/lib/release'

// The app and download page must advertise the same published release.
// A fresh deployment picks up release.ts; shared caches expire within 5 minutes.
export const dynamic = 'force-static'
export const revalidate = 300

export function GET() {
  return Response.json(
    {
      version: RELEASE.version,
      minimumMacOS: RELEASE.minMacOSVersion,
      downloadURL: 'https://mischi.app/#download',
      message: RELEASE.updateMessage,
    },
    {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=300, must-revalidate',
      },
    },
  )
}
