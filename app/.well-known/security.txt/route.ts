import { SITE_URL } from '@/lib/seo'
import { CONTACT_EMAIL } from '@/lib/release'

// RFC 9116 security contact. "Expires" is required and must be within a year;
// it's computed at build time, so every deploy pushes it forward.
export const dynamic = 'force-static'

export function GET() {
  const expires = new Date()
  expires.setUTCFullYear(expires.getUTCFullYear() + 1)

  const body = [
    `Contact: mailto:${CONTACT_EMAIL}`,
    `Contact: ${SITE_URL}/contact`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en',
    `Canonical: ${SITE_URL}/.well-known/security.txt`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
