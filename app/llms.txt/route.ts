import { SITE_URL } from '@/lib/seo'
import { RELEASE, CONTACT_EMAIL } from '@/lib/release'

// A plain-text map of the site for language models (https://llmstxt.org).
// Built from the same release constants as the pages, so it never goes stale.
export const dynamic = 'force-static'

export function GET() {
  const body = `# Mischi

> Mischi is a free macOS menu bar app that puts animated pets on your desktop. It uses the OpenAI Codex pet format, runs offline, needs no account, and has optional bring-your-own-key AI features powered by Groq.

- Current version: ${RELEASE.version} (public beta), released ${RELEASE.date}
- Requirements: ${RELEASE.minMacOS} or later; Apple Silicon or Intel (Universal)
- Price: free. No accounts, no subscriptions, no telemetry
- Distribution: a DMG signed with a Developer ID and notarised by Apple, downloaded from ${SITE_URL}. Not on the Mac App Store
- Not available for Windows, Linux or iOS
- Pet format: a folder with pet.json and spritesheet.webp (1536 x 1872 px, 8 columns x 9 rows of 192 x 208 px frames), compatible with OpenAI Codex pets
- AI (optional): with the user's own Groq API key, "Ask Mischi" (Cmd+K) answers in character and can take screenshots, add reminders, read the clipboard, play animations, save and recall notes, open apps or websites, and search the web. Voice input uses Groq Whisper. The key is stored in the macOS Keychain and requests go directly from the Mac to Groq
- Mischi is not affiliated with OpenAI, Groq or Apple

## Docs

- [Install](${SITE_URL}/docs#install): download, install, first launch and updating
- [Everyday use](${SITE_URL}/docs#basics): clicks, shortcuts and the Mischi menu
- [Pets & library](${SITE_URL}/docs#pets): importing folders, .zip files and Codex pets
- [Behavior & animations](${SITE_URL}/docs#behavior): modes, click actions, character and chat lines
- [Reminders](${SITE_URL}/docs#reminders): scheduled reminders delivered by the pet
- [Window & startup](${SITE_URL}/docs#window): scale, window level, click-through, launch at login
- [AI with Groq](${SITE_URL}/docs#ai): setting up a Groq API key and choosing a model
- [Ask Mischi](${SITE_URL}/docs#ask): the assistant's tools and voice mode
- [Create your own pet](${SITE_URL}/docs#create-pets): spritesheet layout, pet.json fields, and hatching a pet with Codex
- [Troubleshooting](${SITE_URL}/docs#troubleshooting): fixes for common problems
- [Uninstall & reset](${SITE_URL}/docs#uninstall): removing the app and all of its data

## Product

- [Home](${SITE_URL}/): overview and features
- [Download](${SITE_URL}/download): review terms and download ${RELEASE.dmgFileName}, ${RELEASE.size}, SHA-256 ${RELEASE.sha256}
- [FAQ](${SITE_URL}/#faq): common questions

## Support

- [Contact](${SITE_URL}/contact): bug reports, feature ideas and questions (email: ${CONTACT_EMAIL})

## Legal

- [Privacy Policy](${SITE_URL}/privacy)
- [Terms of Use](${SITE_URL}/terms)

## Optional

- [Codex pets guide](https://learn.chatgpt.com/docs/pets): OpenAI's documentation for Codex pets and sprite sheet requirements
- [hatch-pet skill](https://github.com/openai/skills/tree/main/skills/.curated/hatch-pet): OpenAI's skill for generating a Codex-compatible pet from a description or image
`

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
