'use client'

import PetCanvas from '../demo/PetCanvas'

export type PetMood = 'idle' | 'wave' | 'review' | 'waiting' | 'jump' | 'tired'

// What the pet "says" for each mood. Decorative, so hidden from screen
// readers; the form announces the real status itself.
const LINES: Record<PetMood, string> = {
  idle: 'Hi! What’s up?',
  wave: 'Oh, hello!',
  review: 'Tell me everything.',
  waiting: 'Sending…',
  jump: 'Got it!',
  tired: 'Oh no…',
}

export default function PerchedPet({ mood }: { mood: PetMood }) {
  return (
    <div className="ct-pet" aria-hidden="true">
      {/* Keyed by mood so the bubble pops again whenever the line changes. */}
      <span key={mood} className="ct-pet-bubble">{LINES[mood]}</span>
      <span className="ct-pet-sprite">
        <PetCanvas state={mood} interactive={false} autoAnimate={false} scale={0.42} />
      </span>
    </div>
  )
}
