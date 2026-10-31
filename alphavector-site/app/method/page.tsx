import type { Metadata } from 'next'
import { EnquiryForm } from '@/components/EnquiryForm'
import { CONTACT_EMAIL, START_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'The method',
  description: 'How to use the AlphaVector framework, the philosophy behind it, and how the scores are built. The technical note is available on request.',
}

const STEPS = [
  { name: 'Log your projects', does: 'Fill one table. For each project: name, client, industry, the hard-skill and soft-skill processes you personally did (tick boxes), the feedback you received, the impact, and any remarks.', gets: 'The evidence everything else stands on.' },
  { name: 'See your strengths', does: 'AlphaVector looks at how often, how well documented and how widely you have applied each skill you picked. You can mark any result as not really you.', gets: 'A ranked strengths profile with a confidence level for each.' },
  { name: 'Specify your passion', does: 'Mark each project as energising, neutral or draining, then choose three to five areas that pull you forward.', gets: 'A passion signal that tilts the result toward what you want.' },
  { name: 'Pick a market niche (optional)', does: 'Choose up to three niches to focus the demand analysis, or skip and let the market data decide.', gets: 'A market view aimed where you want to look.' },
  { name: 'Get your Future Blueprint', does: 'AlphaVector reads your evidence against the market picture and shapes it into three directions.', gets: 'Next roles with risk assessments, the gaps to close, and a full roadmap.' },
  { name: 'Choose a roadmap and follow it', does: 'Pick the route you want. Each gap comes with matched resources, and you tick off actions as you go.', gets: 'A clear record of progress on the route you chose.' },
  { name: 'Recalibrate', does: 'Once you reach a goal, add the new projects and fix your position again. Your earlier entries are kept.', gets: 'A fresh fix from a new starting point.' },
]

export default function Method() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h1 className="max-w-4xl text-[clamp(2.4rem,5.4vw,4.4rem)] font-light">The method</h1>
        <p className="mt-6 max-w-2xl text-[1.25rem] text-ink-soft">How to use the framework, why it is built the way it is, and how the scores are made.</p>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-display text-[1rem]">
          <a className="underline underline-offset-6" href="#process">The process</a>
          <a className="underline underline-offset-6" href="#philosophy">The philosophy</a>
          <a className="underline underline-offset-6" href="#scores">How scores are built</a>
          <a className="underline underline-offset-6" href="#request">The technical note</a>
        </nav>
      </section>

      <section id="process" className="mx-auto mt-16 max-w-6xl scroll-mt-6 px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">The process</h2>
        <ol className="mt-8 divide-y divide-rule border-y border-rule">
          {STEPS.map((s, i) => (
            <li key={s.name} className="grid gap-3 py-7 md:grid-cols-[3.5rem_1fr_1fr] md:gap-8">
              <span className="font-display text-[1.6rem] font-medium text-muted">{i + 1}</span>
              <div>
                <h3 className="text-[1.35rem] font-medium">{s.name}</h3>
                <p className="mt-2 text-[1.02rem] text-ink-soft">{s.does}</p>
              </div>
              <p className="text-[1.02rem]"><span className="font-display font-medium">You get: </span>{s.gets}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="philosophy" className="mx-auto mt-24 grid max-w-6xl scroll-mt-6 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">The philosophy: purpose is a position</h2>
        <div className="max-w-2xl space-y-5 text-ink-soft">
          <p>People often talk about life&apos;s purpose as something to be discovered in a flash. It is easier to treat it as something to be located. The old idea, with ikigai as its best-known form, is that purpose sits where what you are good at, what you love and what the world needs overlap.</p>
          <p>The idea is sound. The trouble is that each circle is usually filled in by guessing. We guess our strengths, flatter our passions and rarely look at the market at all. AlphaVector keeps the idea and changes the instrument. Strengths come from what you have actually done. Passion comes from how that work felt. Demand comes from dated, cited research.</p>
          <p>Navigators fix a position from three independent distances because any one of them can be wrong. When strengths, passion and demand agree, you can act with confidence. When they disagree, the disagreement is the most useful thing the framework can tell you, because it shows what to build, what to test or what to let go.</p>
        </div>
      </section>

      <section id="scores" className="mx-auto mt-24 grid max-w-6xl scroll-mt-6 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">How the scores are built</h2>
        <div className="max-w-2xl space-y-5 text-ink-soft">
          <p>Each signal is scored on its own. Strengths are scored from how well your project history proves a skill. Passion is read from how your work felt and the areas you choose. Market demand is scored from dated, cited research.</p>
          <p>The three are combined into one fit for every possible direction. Strengths and market demand carry the most weight. Passion tilts the answer toward what you want, but it cannot outvote what you can prove or what the market needs. A confidence reading lowers every score a little when your evidence is thin.</p>
          <p>The three routes are chosen by how far each direction sits from the work you already do, and near-duplicates are rejected so you never get three versions of the same job.</p>
          <p>The rules are fixed, so the same inputs always give the same scores. Some component scores, such as how strong a direction&apos;s current demand is, are estimates made by AI agents from your evidence and the cited briefing. The Blueprint shows them so you can question them.</p>
        </div>
      </section>

      <section id="request" className="mx-auto mt-24 grid max-w-6xl scroll-mt-6 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Want the detail?</h2>
          <p className="mt-4 max-w-sm text-ink-soft">The weights, formulas and market sources are shared with schools, institutes and partners on request. Tell us what you would like to know and we will send the technical note.</p>
        </div>
        <div className="relative max-w-3xl"><EnquiryForm contactEmail={CONTACT_EMAIL} mode="details" /></div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <a href={START_URL} className="btn btn-primary">Find your direction</a>
      </section>
    </>
  )
}
