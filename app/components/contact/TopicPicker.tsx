'use client'

import { Danger, LampCharge, MessageQuestion, Messages, Pet, type Icon as IconsaxIcon } from 'iconsax-react'

export type Topic = 'bug' | 'idea' | 'question' | 'pet' | 'other'

export interface TopicInfo {
  id: Topic
  /** Full name, used for screen readers and the subject line. */
  label: string
  /** What the chip shows. The window title spells the topic out in full. */
  short: string
  /** Shown in the compose window's title bar: "New Bug Report". */
  windowTitle: string
  /** Prompt and placeholder for the single message field (not used by bug reports). */
  prompt: string
  placeholder: string
  /** An Iconsax icon: Outline when idle, Bold when the chip is selected. Bulk
      (half-opacity fills) looked washed out at chip size. */
  Icon: IconsaxIcon
}

export const TOPICS: TopicInfo[] = [
  {
    id: 'bug',
    label: 'Bug report',
    short: 'Bug',
    windowTitle: 'Bug Report',
    prompt: 'What happened?',
    placeholder: '',
    Icon: Danger,
  },
  {
    id: 'idea',
    label: 'Feature idea',
    short: 'Idea',
    windowTitle: 'Feature Idea',
    prompt: 'Your idea',
    placeholder: 'It would be lovely if my pet could…',
    Icon: LampCharge,
  },
  {
    id: 'question',
    label: 'Question',
    short: 'Question',
    windowTitle: 'Question',
    prompt: 'Your question',
    placeholder: 'How do I…',
    Icon: MessageQuestion,
  },
  {
    id: 'pet',
    label: 'Show us a pet',
    short: 'Pet',
    windowTitle: 'Pet Showcase',
    prompt: 'Tell us about your pet',
    placeholder: 'This is Biscuit. She supervises my commits…',
    Icon: Pet,
  },
  {
    id: 'other',
    label: 'Something else',
    short: 'Other',
    windowTitle: 'Message',
    prompt: 'Your message',
    placeholder: 'Hi! I wanted to say…',
    Icon: Messages,
  },
]

export const TOPIC_IDS = new Set<Topic>(TOPICS.map((t) => t.id))

/** A row of chips across the top of the compose window. */
export default function TopicPicker({
  value,
  onChange,
}: {
  value: Topic
  onChange: (topic: Topic) => void
}) {
  return (
    <div className="ct-topicbar">
      <span id="ct-topic-label" className="ct-topicbar-label">What’s this about?</span>
      <div className="ct-topic-list" role="radiogroup" aria-labelledby="ct-topic-label">
        {TOPICS.map(({ id, label, short, Icon }) => (
          <label key={id} className="ct-topic" data-active={value === id}>
            <input
              type="radio"
              name="ct-topic"
              value={id}
              checked={value === id}
              onChange={() => onChange(id)}
              className="ct-topic-input"
              aria-label={label}
              // Stops the browser restoring the last-picked topic on reload,
              // which React would then apply over the topic chosen from ?v=.
              autoComplete="off"
            />
            <Icon
              size={16}
              variant={value === id ? 'Bold' : 'Outline'}
              color="currentColor"
              aria-hidden="true"
              focusable="false"
            />
            <span aria-hidden="true">{short}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
