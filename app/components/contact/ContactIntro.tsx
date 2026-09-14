import { CONTACT_EMAIL } from '@/lib/release'

export default function ContactIntro() {
  return (
    <div className="ct-intro">
      <p className="ct-eyebrow">Contact</p>
      <h1 className="ct-title">Talk to the people who make Mischi</h1>
      <p className="ct-lede">
        Bug reports, ideas, questions, or a pet you’re proud of. Every message is read by a real person, and
        replies come from <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </div>
  )
}
