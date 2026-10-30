import type { Metadata } from 'next'
import { WeightTable } from '@/components/WeightTable'
import { START_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'The method',
  description: 'How to use the AlphaVector framework, the philosophy behind it, and the mathematics and data under every score.',
}

const STEPS = [
  { name: 'Log your projects', does: 'Fill one table. For each project: name, client, industry, the hard-skill and soft-skill processes you personally did (tick boxes), the feedback you received, the impact, and any remarks.', gets: 'The evidence everything else stands on.' },
  { name: 'Assess your strengths', does: 'AlphaVector scores every process you ticked by how often, how well documented and how widely you have applied it. You can mark any result as not really you.', gets: 'A ranked strengths profile with a confidence level for each.' },
  { name: 'Specify your passion', does: 'Mark each project as energising, neutral or draining, then choose three to five areas that pull you forward.', gets: 'A passion signal that tilts the result toward what you want.' },
  { name: 'Pick a market niche (optional)', does: 'Choose up to three niches to focus the demand analysis, or skip and let the market data decide.', gets: 'A market view aimed where you want to look.' },
  { name: 'Get your Future Blueprint', does: 'Specialist analysis agents read your evidence and the market briefing. Scoring combines them into three directions.', gets: 'Next roles with risk assessments, the gaps to close, and a full roadmap.' },
  { name: 'Choose a roadmap and follow it', does: 'Pick the route you want. Each gap comes with matched resources, and you tick off actions as you go.', gets: 'A clear record of progress on the route you chose.' },
  { name: 'Recalibrate', does: 'Once you reach a goal, add the new projects and fix your position again. Your earlier entries are kept.', gets: 'A fresh fix from a new starting point.' },
]

const SOURCES = [
  { name: 'Indeed Hiring Lab, postings index by sector', gives: 'Job-posting trends by sector for the US, UK, Germany, France, Canada and Australia. It does not cover India.', w: '0.95', href: 'https://github.com/hiring-lab/job_postings_tracker' },
  { name: 'World Bank labour indicators', gives: 'Unemployment and services-employment statistics by country.', w: '0.90', href: 'https://api.worldbank.org/v2' },
  { name: 'Indeed Hiring Lab, articles', gives: 'Research on hiring, pay and AI exposure.', w: '0.90', href: 'https://hiringlab.indeed.com' },
  { name: 'Nasscom and Zinnov, India GCC Landscape 2026', gives: 'Global capability centres in India: growth, hiring and skills.', w: '0.85', href: 'https://media.zinnov.com/wp-content/uploads/2026/05/zinnov-nasscom-india-gcc-landscape-2026-report.pdf' },
  { name: 'LinkedIn Economic Graph research', gives: 'Skills and hiring research. Many pages are script-rendered, so coverage is partial.', w: '0.85', href: 'https://economicgraph.linkedin.com' },
  { name: 'Secondary reports with unsourced figures', gives: 'Used only when nothing better exists, and held at a low score so they count for little.', w: '0.30 to 0.45', href: '' },
]

export default function Method() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h1 className="max-w-4xl text-[clamp(2.4rem,5.4vw,4.4rem)] font-bold">The method</h1>
        <p className="mt-6 max-w-2xl text-[1.25rem] text-ink-soft">How to use the framework, why it is built the way it is, and the arithmetic and data under every score.</p>
        <nav aria-label="On this page" className="mt-8 flex flex-wrap gap-x-7 gap-y-2 font-display text-[1rem]">
          <a className="underline underline-offset-6" href="#process">The process</a>
          <a className="underline underline-offset-6" href="#philosophy">The philosophy</a>
          <a className="underline underline-offset-6" href="#maths">The mathematics</a>
          <a className="underline underline-offset-6" href="#data">The market data</a>
        </nav>
      </section>

      <section id="process" className="mx-auto mt-16 max-w-6xl scroll-mt-6 px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">The process</h2>
        <ol className="mt-8 divide-y divide-rule border-y border-rule">
          {STEPS.map((s, i) => (
            <li key={s.name} className="grid gap-3 py-7 md:grid-cols-[3.5rem_1fr_1fr] md:gap-8">
              <span className="font-display text-[1.6rem] font-bold text-muted">{i + 1}</span>
              <div>
                <h3 className="text-[1.35rem] font-bold">{s.name}</h3>
                <p className="mt-2 text-[1.02rem] text-ink-soft">{s.does}</p>
              </div>
              <p className="text-[1.02rem]"><span className="font-display font-semibold">You get: </span>{s.gets}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="philosophy" className="mx-auto mt-24 grid max-w-6xl scroll-mt-6 gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">The philosophy: purpose is a position</h2>
        <div className="max-w-2xl space-y-5 text-ink-soft">
          <p>People often talk about life&apos;s purpose as something to be discovered in a flash. It is easier to treat it as something to be located. The old idea, with ikigai as its best-known form, is that purpose sits where what you are good at, what you love and what the world needs overlap.</p>
          <p>The idea is sound. The trouble is that each circle is usually filled in by guessing. We guess our strengths, flatter our passions and rarely look at the market at all. AlphaVector keeps the idea and changes the instrument. Strengths come from what you have actually done. Passion comes from how that work felt. Demand comes from dated, cited research.</p>
          <p>Navigators fix a position from three independent distances because any one of them can be wrong. When strengths, passion and demand agree, you can act with confidence. When they disagree, the disagreement is the most useful thing the framework can tell you, because it shows what to build, what to test or what to let go.</p>
        </div>
      </section>

      <section id="maths" className="mx-auto mt-24 max-w-6xl scroll-mt-6 px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">The mathematics</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">Everything below is fixed and reproducible: the same inputs always give the same scores.</p>

        <div className="mt-8 border-y border-ink py-7">
          <p className="font-display text-[clamp(1.15rem,2.4vw,1.7rem)] font-semibold leading-snug">
            Fit = (0.40 × <span className="text-strength">Strengths</span> + 0.40 × <span className="text-market">Market</span> + 0.20 × <span className="text-passion">Passion</span>) × (0.75 + 0.25 × Confidence)
          </p>
          <p className="mt-3 text-[1rem] text-muted">Confidence runs from 0 to 1 and reflects how much evidence you gave. Weak evidence lowers the multiplier but never below 0.75, so thin data lowers confidence without ruling out a direction.</p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <WeightTable title="Strengths (Experience)" signal="strength" rows={[['Capability', 0.3], ['Project evidence', 0.25], ['Transferable skills', 0.2], ['Context fit', 0.15], ['Recency', 0.1]]} />
          <WeightTable title="Market demand" signal="market" rows={[['Current demand', 0.25], ['Growth', 0.2], ['Future potential', 0.2], ['Adjacency', 0.15], ['Relevance', 0.1], ['Safety (100 minus risk)', 0.1]]} />
          <WeightTable title="Passion (Interest)" signal="passion" rows={[['Direct interest', 0.3], ['Behavioural signals', 0.25], ['Stated interest', 0.2], ['Curiosity', 0.15], ['Adjacency', 0.1]]} />
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h3 className="text-[1.4rem] font-bold">The proof score behind your strengths</h3>
            <p className="mt-3 text-ink-soft">For each process you tick, the app scores how well your history proves it:</p>
            <p className="mt-3 font-display text-[1.1rem] font-semibold">Proof = 100 × (0.40 × coverage + 0.35 × depth + 0.25 × breadth)</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-[1.02rem] text-ink-soft marker:text-ink">
              <li>Coverage: projects using it divided by three, capped at one. Three projects earns full marks, so long histories are not penalised.</li>
              <li>Depth: the average richness of those projects. A project starts at 0.4, plus 0.3 if you wrote an impact and 0.3 if you recorded feedback.</li>
              <li>Breadth: distinct industries it appeared in divided by three, capped at one.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-[1.4rem] font-bold">How the three routes are chosen</h3>
            <p className="mt-3 text-ink-soft">Every candidate direction gets a capability distance from 0 (you already do it) to 100 (a different field). The three routes are then picked by distance:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-[1.02rem] text-ink-soft marker:text-ink">
              <li>Safe: no further than 35.</li>
              <li>Growth: between 20 and 60.</li>
              <li>Bold: between 45 and 85. Anything beyond 85 is not credible and is not offered.</li>
            </ul>
            <p className="mt-4 text-[1.02rem] text-ink-soft">The highest-scoring candidate in each band is chosen, and picks that are near-duplicates of each other are rejected, so you never get three versions of the same job.</p>
          </div>
        </div>

        <aside className="mt-14 max-w-3xl border-l-[5px] border-ink pl-6">
          <h3 className="text-[1.3rem] font-bold">What is arithmetic and what is judgment</h3>
          <p className="mt-2 text-ink-soft">The weights, the formulas and the selection rules are fixed. The component scores they combine, such as how strong a direction&apos;s current demand is, are judgments made by AI agents working from your evidence and the cited market briefing. They are grounded in what you entered and what the sources say, but they are estimates, and the Blueprint shows the scores so you can question them.</p>
        </aside>
      </section>

      <section id="data" className="mx-auto mt-24 max-w-6xl scroll-mt-6 px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-bold">The market data</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Market facts are stored as dated, cited observations: a metric, a region, a value, a period and the document it came from. Sources are checked on a schedule and re-read only when they change. When a fact disappears from a source it is marked superseded and kept, not deleted. Each source carries a reliability score from 0 to 1, and weaker sources are held at lower scores.
        </p>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-[1rem]">
            <thead>
              <tr className="border-b border-ink text-left font-display">
                <th scope="col" className="py-2 pr-4 font-semibold">Source</th>
                <th scope="col" className="py-2 pr-4 font-semibold">What it gives</th>
                <th scope="col" className="py-2 text-right font-semibold">Reliability</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map((s) => (
                <tr key={s.name} className="border-b border-rule align-top">
                  <th scope="row" className="py-3 pr-4 text-left font-medium">
                    {s.href ? <a className="underline underline-offset-4" href={s.href} rel="noopener noreferrer" target="_blank">{s.name}</a> : s.name}
                  </th>
                  <td className="py-3 pr-4 text-ink-soft">{s.gives}</td>
                  <td className="py-3 text-right font-display font-semibold tabular-nums">{s.w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 max-w-2xl text-[1rem] text-muted">Some publishers block automated reading or serve their data only through scripts. Those are not used, and the list above only grows with sources that permit it.</p>
        <div className="mt-12">
          <a href={START_URL} className="inline-block rounded-full bg-ink px-7 py-3.5 font-display text-[1.05rem] font-semibold text-paper hover:bg-ink-soft">Find your fix</a>
        </div>
      </section>
    </>
  )
}
