import { NextResponse } from 'next/server'
import { PRIVACY_VERSION, TERMS_VERSION } from '@/lib/legal'
import { RELEASE } from '@/lib/release'

function redirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url), {
    status: 303,
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return new NextResponse('Please start the download from this website.', { status: 403 })
  }
  try {
    const form = await request.formData()
    if (form.get('agreement') !== 'yes'
      || form.get('termsVersion') !== TERMS_VERSION
      || form.get('privacyVersion') !== PRIVACY_VERSION) return redirect(request, '/download')
  } catch {
    return redirect(request, '/download')
  }
  // Validate the acknowledgement without creating an identity or acceptance
  // database. The versioned public DMG remains directly addressable.
  return redirect(request, RELEASE.dmgUrl)
}
