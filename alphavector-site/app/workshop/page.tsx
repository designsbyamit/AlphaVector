import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/EnquiryForm'
import { CONTACT_EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Workshops',
  description: 'Bring AlphaVector to a cohort at your institute, training centre or school. Everyone leaves with their own Future Blueprint.',
}

const AGENDA = [
  ['Framing', 'Why three signals, and how a fix differs from advice.'],
  ['Log your projects', 'Everyone fills their own project table, with the facilitator coaching specifics.'],
  ['Strengths and passion', 'Read your proof scores, mark what energised you and choose your areas.'],
  ['Market and niche', 'Look at the demand picture and pick where to aim, or leave it to the data.'],
  ['Your Future Blueprint', 'Read your three routes, their risks and gaps, and choose one.'],
  ['Your first ninety days', 'Turn the chosen roadmap into the next three concrete actions.'],
]

const AUDIENCES = [
  ['Institutes and colleges', 'Final-year students and recent graduates who have studio, internship or live-brief projects but no language for what those projects prove.'],
  ['Training centres', 'Career changers and upskillers choosing between directions, who need evidence of fit rather than another course list.'],
  ['Schools', 'Older students exploring streams and early directions. Run with teacher or guardian consent. The analysis works without sign-in, so no student account is needed.'],
]

export default function Workshop() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h1 className="max-w-4xl text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold">Run AlphaVector with a room</h1>
        <p className="mt-6 max-w-2xl text-[1.25rem] text-ink-soft">
          A facilitated session for a whole cohort. Everyone logs their own projects, and everyone leaves with their own Future Blueprint and a plan for the next ninety days.
        </p>
        <a href="#enquire" className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 font-display text-[1.05rem] font-semibold text-paper hover:bg-ink-soft">Enquire about a workshop</a>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">Who it is for</h2>
        <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {AUDIENCES.map(([t, d]) => (
            <article key={t} className="border-t-[5px] border-ink pt-4">
              <h3 className="text-[1.35rem] font-bold">{t}</h3>
              <p className="mt-2 text-[1.02rem] text-ink-soft">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">A session in six parts</h2>
          <p className="mt-4 max-w-md text-ink-soft">A typical session runs three to four hours. Length, pacing and emphasis are shaped with you for your cohort.</p>
        </div>
        <ol className="divide-y divide-rule border-y border-rule">
          {AGENDA.map(([t, d], i) => (
            <li key={t} className="grid gap-1 py-5 sm:grid-cols-[3rem_12rem_1fr] sm:gap-4">
              <span className="font-display text-[1.2rem] font-bold text-muted">{i + 1}</span>
              <span className="font-display text-[1.1rem] font-semibold">{t}</span>
              <span className="text-ink-soft">{d}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 md:grid-cols-2">
        <div>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">Each participant leaves with</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6 text-ink-soft marker:text-ink">
            <li>A project log in their own words</li>
            <li>A ranked strengths profile built from it</li>
            <li>Their Future Blueprint: three routes, risks, gaps and a roadmap</li>
            <li>One chosen route and the first actions on it</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">What the room needs</h2>
          <ul className="mt-5 list-disc space-y-2 pl-6 text-ink-soft marker:text-ink">
            <li>A laptop or phone per person, with internet</li>
            <li>Participants to bring at least three projects each, ideally five</li>
            <li>Groups of up to about thirty at a time</li>
          </ul>
        </div>
      </section>

      <section id="enquire" className="mx-auto mt-24 max-w-6xl scroll-mt-6 px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">Enquire</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">Tell us about your group. We reply to the email address you give.</p>
        <div className="relative mt-8 max-w-3xl"><EnquiryForm contactEmail={CONTACT_EMAIL} /></div>
      </section>
    </>
  )
}
