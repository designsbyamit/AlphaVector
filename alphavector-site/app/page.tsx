import Link from 'next/link'
import { FixDiagram } from '@/components/FixDiagram'
import { SIGNALS } from '@/lib/signals'
import { START_URL } from '@/lib/config'

const LOOP = [
  { name: 'Log', body: 'Enter your projects in one table: what you did, the impact, the feedback.' },
  { name: 'Fix', body: 'AlphaVector scores your strengths, reads your passion and weighs the market, then gives you a position and a route.' },
  { name: 'Follow', body: 'Pick a roadmap, close the gaps with matched resources and track each step.' },
  { name: 'Recalibrate', body: 'Reached a goal? Add what is new and fix your position again.' },
]

export default function Home() {
  return (
    <>
      {/* The most characteristic thing in this subject's world: a position fix. */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div>
          <h1 className="text-[clamp(2.6rem,5.4vw,4.7rem)] font-light leading-[1]">
            Three signals.<br />One fix on your calling.
          </h1>
          <p className="mt-7 max-w-[34rem] text-[1.25rem] leading-relaxed text-ink-soft">
            A vector has a size and a direction. So does a career. AlphaVector reads your project history, your pull toward certain work and the market&apos;s demand, then hands you a position, a route and a way to check you are still on it.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href={START_URL} className="btn btn-primary">Find your fix</a>
            <Link href="/method" className="font-display text-[1.05rem] font-medium underline underline-offset-8 hover:text-ink-soft">Read how it works</Link>
          </div>
          <p className="mt-5 text-[0.95rem] text-muted">No sign-in needed to run the analysis. Takes about 20 minutes with your projects to hand.</p>
        </div>
        <FixDiagram className="mx-auto h-auto w-full max-w-[34rem]" />
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-3xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">GPS cannot find you from one distance. Career advice shouldn&apos;t try either.</h2>
        <p className="mt-5 max-w-2xl text-ink-soft">
          Most advice listens to one signal. Follow your strengths alone and you may master something nobody needs. Follow passion alone and you may chase work you cannot yet do. Follow the market alone and you may end up somewhere that drains you. AlphaVector asks all three and trusts the place where they agree.
        </p>
        <div className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {SIGNALS.map((s) => (
            <article key={s.key} className={`border-t-[3px] ${s.rule} pt-5`}>
              <h3 className={`text-[1.7rem] font-medium ${s.text}`}>{s.name}</h3>
              <p className="mt-1 font-display text-[1.02rem] font-medium">{s.short}</p>
              <p className="mt-4 text-[1.02rem] text-ink-soft">{s.measures}</p>
              <p className="mt-4 text-[1.02rem]"><span className="font-display font-medium">On its own: </span>{s.alone}</p>
              <p className="mt-3 text-[1.02rem] text-muted">{s.read}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">What you leave with</h2>
          <p className="mt-4 max-w-md text-ink-soft">Your Future Blueprint: a position, three routes from it, and the work to get there.</p>
        </div>
        <dl className="divide-y divide-rule border-y border-rule">
          {[
            ['Next roles', 'Three directions: a Safe step, a Growth step and a Bold step, each with its score and a plain-language risk assessment.'],
            ['Gaps', 'What stands between you and each role, how big each gap is and how long closing it usually takes.'],
            ['Roadmap', 'Actions from today through 30 days, 90 days, 6, 12 and 18 months.'],
            ['Resources', 'Matched learning for every gap, so you are never searching from scratch.'],
            ['Progress', 'Tick off actions and gaps as you close them, and see how far along each route you are.'],
          ].map(([t, d]) => (
            <div key={t} className="grid gap-1 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
              <dt className="font-display text-[1.1rem] font-medium">{t}</dt>
              <dd className="text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">A fix is not forever. Check it again.</h2>
        <ol className="mt-10 grid gap-8 md:grid-cols-4">
          {LOOP.map((l, i) => (
            <li key={l.name} className="border-t border-rule pt-4">
              <p className="font-display text-[0.95rem] font-medium text-muted">Step {i + 1}</p>
              <h3 className="mt-1 text-[1.5rem] font-medium">{l.name}</h3>
              <p className="mt-2 text-[1.02rem] text-ink-soft">{l.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24 border-y border-rule bg-paper-deep text-ink">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr] md:items-end">
          <div>
            <h2 className="text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">Run it with a room</h2>
            <p className="mt-4 max-w-xl text-[1.12rem] text-ink-soft">
              Institutes, training centres and schools can bring AlphaVector to a whole cohort. Everyone logs their own projects and leaves with their own Future Blueprint, guided by a facilitator.
            </p>
          </div>
          <div className="md:text-right">
            <Link href="/workshop" className="btn btn-secondary">See the workshop</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6 border-t border-rule pt-8">
          <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">Bring your projects. Leave with a position.</h2>
          <a href={START_URL} className="btn btn-primary">Find your fix</a>
        </div>
      </section>
    </>
  )
}
