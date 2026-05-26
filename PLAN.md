# Assets

## App Icons

Available in `public/`:

| File                 | Format | Use                     |
| -------------------- | ------ | ----------------------- |
| `app-icon.png`       | PNG    | Primary app icon        |
| `icon-3d.png`        | PNG    | 3D version of the icon  |
| `mischi-icon-01.png` | PNG    | Icon variant 1          |
| `mischi-icon-02.png` | PNG    | Icon variant 2          |
| `mischi-icon-02.svg` | SVG    | Icon variant 2 (vector) |
| `mischi-icon-03.png` | PNG    | Icon variant 3          |

## Animation Spritesheet

`public/spritesheet.webp` — example animation frames for use in guided workout mode or UI motion. Use CSS `background-position` animation or a canvas-based player to step through frames. (192x208px per frame, 9 rows)

---

# Mischi — Product & Website Plan

## Vision

Mischi is a playful macOS desktop pet platform that lets users run animated companions directly on their desktop without requiring Codex or any cloud services.

The experience should feel:

- native to macOS
- emotionally warm
- lightweight
- delightful
- creator-friendly
- offline-first

The website should immediately communicate:

> “This tiny companion lives on your desktop.”

The highest-leverage element is the **interactive live pet demo**.

---

# Product Goals

## Core Goals

- Run animated desktop pets on macOS
- Import existing Codex pets
- Support custom pet creation
- Make pets interactive and expressive
- Keep everything local and offline

## Emotional Goals

- Make users smile within 10 seconds
- Create attachment to the pet
- Encourage collection/customization
- Feel magical but minimal

---

# Target Audience

## Primary

- Developers
- Designers
- Mac power users
- Indie hacker community
- Terminal / productivity users

## Secondary

- Pixel artists
- VTuber / mascot creators
- Cozy software enthusiasts
- Customization communities

---

# Brand Direction

## Keywords

- playful
- cozy
- premium
- magical
- calm
- expressive
- mac-native

## Visual Style

- dark glassmorphism
- warm highlights
- floating UI
- soft shadows
- rounded corners
- subtle animations

## Mascot Personality

Mischi should feel:

- curious
- calm
- slightly mischievous
- emotionally intelligent
- non-intrusive

---

# Website Structure

## Priority Order (v1)

1. Hero
2. Live Demo
3. Download
4. How It Works
5. FAQ

Secondary:

- Features
- Gallery
- Creator Docs
- Changelog

---

# Website Sections

---

# 1. Hero Section

## Goal

Communicate value instantly.

## Requirements

- Large animated pet
- Floating macOS-style window
- Strong emotional headline
- Download CTA
- Apple Silicon + Intel support badges

## Headline Ideas

- Your desktop pet. Alive on your Mac.
- Run your Codex pets without Codex.
- A tiny companion for your desktop.
- Your Mac deserves a creature.

## CTA

Primary:

- Download for macOS

Secondary:

- Try Live Demo

---

# 2. Live Pet Demo

## Goal

Let users experience the product instantly.

## Features

- Interactive sprite player
- Click → wave
- Double-click → jump
- Hover → react
- Idle animations
- State switching

## States

- idle
- wave
- jump
- run
- sleep
- busy

## Technical Direction

### Option A — CSS Spritesheet

Pros:

- lightweight
- easy to maintain

### Option B — Canvas Renderer

Pros:

- smoother animation
- future extensibility
- physics support

Recommended:
→ Canvas renderer

## Future Enhancements

- drag pet
- throw toy
- multiple pets
- sound effects

---

# 3. Download Section

## Requirements

- Direct .dmg download
- Homebrew install command
- Release notes
- Version number
- Notarized badge
- SHA checksum

## Example

```bash
brew install --cask mischi
```

---

# 4. How It Works

## Goal

Reduce onboarding friction.

## Flow

1. Import pet
2. Pet appears on desktop
3. Customize behavior

## Visual Direction

- large screenshots
- animated arrows
- floating panels
- lightweight motion

---

# 5. Feature Showcase

## Core Features

- Transparent rendering
- Always-on-top mode
- Menu bar controls
- Offline-first
- No telemetry
- Multiple behavior modes
- Import from folders/zips

## Future Features

- AI-generated pets
- Marketplace
- Community pet sharing
- Personality engine
- Scheduled behaviors

---

# 6. Pet Gallery

## Goal

Show creativity + community potential.

## Requirements

- animated previews
- downloadable pet packs
- categories
- creator attribution

## Example Categories

- cozy
- cyberpunk
- pixel
- fantasy
- productivity pets

---

# 7. Creator Docs

## Must Include

- pet.json schema
- spritesheet format
- atlas layout
- animation definitions

## Example Structure

```json
{
  "name": "Mochi",
  "animations": {
    "idle": [],
    "wave": [],
    "jump": []
  }
}
```

## Future

- visual pet editor
- live previewer
- validation tool

---

# 8. FAQ

## Questions

- Does Mischi require Codex?
- Does it need internet?
- Apple Silicon supported?
- Where are pets stored?
- How do I create a pet?
- Can I import existing Codex pets?

---

# 9. Footer

## Include

- GitHub
- Changelog
- Privacy
- Issue tracker
- Creator docs

---

# Technical Architecture

# Frontend

## Stack

- Next.js
- TailwindCSS
- Framer Motion

## Animation

- Canvas renderer
- requestAnimationFrame loop
- sprite atlas animation system

## Hosting

- Vercel
  or
- Cloudflare Pages

---

# Desktop App

## Stack Options

### Option A — SwiftUI

Pros:

- native
- best performance
- mac-native feel

### Option B — Tauri

Pros:

- easier web integration

Recommended:
→ SwiftUI

---

# Pet Engine Architecture

## Components

- animation manager
- behavior engine
- state machine
- collision detection
- desktop bounds manager

## States

- idle
- wander
- interact
- sleep
- drag
- react

---

# File Format Plan

## Structure

```txt
pet/
 ├── pet.json
 ├── atlas.png
 ├── idle/
 ├── wave/
 └── jump/
```

## pet.json

Contains:

- metadata
- animation definitions
- FPS
- hitboxes
- behavior preferences

---

# Roadmap

# v1

- single pet
- sprite animations
- import/export
- menu bar controls
- live demo website

# v1.5

- sound
- drag interaction
- multi-monitor support
- behavior modes

# v2

- AI-generated pets
- pet marketplace
- creator ecosystem
- cloud sync (optional)

---

# Marketing Strategy

## Launch Platforms

- Product Hunt
- Hacker News
- Reddit
- X/Twitter
- Indie Hackers

## Viral Loops

- share custom pets
- downloadable pet packs
- creator spotlight
- desktop screenshots

---

# Design Notes

## Avoid

- generic AI aesthetics
- corporate SaaS visuals
- bright neon overload
- overly cartoonish mascots

## Focus On

- emotional attachment
- tactile UI
- cozy interactions
- premium simplicity

---

# Success Metrics

## Website

- live demo engagement
- download conversion rate
- average session time

## Product

- imported pets per user
- daily active users
- creator uploads
- retention after 7 days

---

# Final Product Feeling

Mischi should feel like:

- a tiny spirit living on your Mac
- a modern Tamagotchi for developers
- a premium desktop companion
- something users become emotionally attached to

The product should feel:

> calm, playful, magical, and alive.

```

```
