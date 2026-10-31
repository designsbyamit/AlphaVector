import Link from 'next/link'
import { FixDiagram } from '@/components/FixDiagram'
import { SIGNALS } from '@/lib/signals'
import { START_URL } from '@/lib/config'
import { TESTIMONIALS } from '@/lib/testimonials'

const ROUTES = [
  { name: 'Safe', reach: 'Closest to the work you already do', body: 'A step you could take now. The evidence is strong and the gap is small.', band: 'Distance 35 or less' },
  { name: 'Growth', reach: 'A real stretch, with a bridge', body: 'A meaningful step up in ambition, reachable in a clear sequence of skills and projects.', band: 'Distance 20 to 60' },
  { name: 'Bold', reach: 'The highest upside, the longest road', body: 'A different field or a leap in scope. Worth it only if the pull and the demand are both real.', band: 'Distance 45 to 85' },
]

const PRINCIPLES = [
  ['Evidence before opinion', 'Every strength is tied to a project, an impact and what people said. Adjectives do not count.'],
  ['Passion tilts, it never replaces', 'What pulls you moves the result toward work you would sustain. It carries 20 percent of the fit, not all of it.'],
  ['The market is dated and cited', 'Demand comes from named sources with a date and a reliability score, not from a hunch.'],
  ['Three routes, never one answer', 'You get a Safe, a Growth and a Bold route, each with its risk. The choice stays yours.'],
  ['Fixed rules, visible scores', 'The same inputs always give the same scores. Where an AI judgment is involved, the score is shown so you can question it.'],
]

const STAGES = [
  ['Studying or just starting', 'Your evidence is thin, and AlphaVector says so. A confidence reading keeps early guesses honest, and the routes stay close to what you have actually done.'],
  ['Early career', 'Your first real choice of direction. The Growth route shows which skills turn a first role into a second one, and which projects prove them.'],
  ['Mid career', 'Pivots get risky. Capability distance shows how far a new field really is from your work, so a bold move is a decision, not a leap of faith.'],
  ['Senior and leading', 'The question shifts from skills to position and leverage. Your project history, scope and recognition anchor where you can credibly go next.'],
]

const LOOP = [
  { name: 'Log', body: 'Enter your projects in one table: what you did, the impact, the feedback.' },
  { name: 'Fix', body: 'AlphaVector scores your strengths, reads your passion and weighs the market, then gives you a position and a route.' },
  { name: 'Follow', body: 'Pick a roadmap, close the gaps with matched resources and track each step.' },
  { name: 'Recalibrate', body: 'Reached a goal? Add what is new and fix your position again.' },
]

const h2 = 'text-[clamp(1.9rem,3.6vw,2.9rem)] font-light'
const eyebrow = 'font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted'

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
            <Link href="#what" className="font-display text-[1.05rem] font-medium underline underline-offset-8 hover:text-ink-soft">What is AlphaVector?</Link>
          </div>
          <p className="mt-5 text-[0.95rem] text-muted">No sign-in needed to run the analysis. Takes about 20 minutes with your projects to hand.</p>
        </div>
        <FixDiagram className="mx-auto h-auto w-full max-w-[34rem]" />
      </section>

      {/* 1. What is it */}
      <section id="what" className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className={eyebrow}>What it is</p>
          <h2 className={`mt-3 ${h2}`}>What is AlphaVector?</h2>
        </div>
        <div className="space-y-5 text-ink-soft">
          <p className="text-[1.2rem] text-ink">A career-positioning framework and a guided app. It answers one question: given what you have actually done, what pulls you and what the market wants, where should you go next?</p>
          <p>In physics a vector has a size and a direction. Your career has both. The size is how much you can credibly claim, which depends on the evidence you hold. The direction is where that evidence, your interest and the demand point. Most advice gives you one without the other.</p>
          <p>AlphaVector works from your own project history rather than a personality quiz. You enter your projects in a table, and it returns a position, three routes from it, the gaps between you and each route, and a roadmap to follow.</p>
          <p className="text-muted">It is not a job board, a personality test or a prediction. It is a structured, repeatable way to read your own record against the market.</p>
        </div>
      </section>

      {/* 2. The parts */}
      <section id="parts" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>The parts</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Three signals, because one distance cannot find you.</h2>
        <p className="mt-5 max-w-2xl text-ink-soft">
          A navigator fixes a position from three independent distances, because any one of them can be wrong. Most career advice listens to a single signal. Follow your strengths alone and you may master something nobody needs. Follow passion alone and you may chase work you cannot yet do. Follow the market alone and you may end up somewhere that drains you.
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
        <p className="mt-10 max-w-2xl text-ink-soft">The three signals combine into a fix, the fix opens into a Blueprint, and the Blueprint is meant to be checked again. <Link href="/framework" className="link">The framework page covers each part in full.</Link></p>
      </section>

      {/* 3. How it finds your alpha */}
      <section id="alpha" className="mx-auto mt-24 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className={eyebrow}>Your alpha, in the right direction</p>
          <h2 className={`mt-3 ${h2}`}>Where your alpha powers actually point</h2>
          <p className="mt-5 max-w-md text-ink-soft">
            Alpha is the edge that is yours: work you have proven you can do, that you want to keep doing, and that someone needs done. Where the three overlap is where your effort compounds.
          </p>
          <p className="mt-4 max-w-md text-ink-soft">
            Direction matters as much as the edge. The same strength points toward very different careers depending on how close the new role is to the work you already do. AlphaVector measures that capability distance from 0 (you already do it) to 100 (a different field) and offers one route in each band.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-3 lg:self-start">
          {ROUTES.map((r) => (
            <article key={r.name} className="card">
              <p className={eyebrow}>{r.band}</p>
              <h3 className="mt-3 text-[1.6rem] font-medium">{r.name}</h3>
              <p className="mt-1 font-display text-[1rem] font-medium">{r.reach}</p>
              <p className="mt-3 text-[1rem] text-ink-soft">{r.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className={h2}>What you leave with</h2>
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

      {/* 4. Philosophy */}
      <section id="philosophy" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>The philosophy</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Purpose is not a flash of insight. It is a position.</h2>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5 text-ink-soft">
            <p>People often talk about life&apos;s purpose as something to be discovered all at once. It is easier to treat it as something to be located. The old idea, with ikigai as its best-known form, is that purpose sits where what you are good at, what you love and what the world needs overlap.</p>
            <p>The idea is sound. The trouble is that each circle is usually filled in by guessing. We guess our strengths, flatter our passions and rarely look at the market at all. AlphaVector keeps the idea and changes the instrument. Strengths come from what you have actually done. Passion comes from how that work felt. Demand comes from dated, cited research.</p>
            <p>When the three agree, you can act with confidence. When they disagree, the disagreement is the most useful thing the framework can tell you, because it shows what to build, what to test or what to let go.</p>
          </div>
          <dl className="divide-y divide-rule border-y border-rule">
            {PRINCIPLES.map(([t, d]) => (
              <div key={t} className="py-4">
                <dt className="font-display text-[1.05rem] font-medium">{t}</dt>
                <dd className="mt-1 text-[1rem] text-ink-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 5. Science */}
      <section id="science" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>The science of the framework</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Evidence for strengths. Intrinsic pull for passion. Algorithms for demand.</h2>
        <p className="mt-5 max-w-2xl text-ink-soft">Each signal is measured the way it deserves to be measured. The weights and formulas are fixed and published, so the same inputs always give the same scores.</p>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="card">
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-strength">Strengths</p>
            <h3 className="mt-2 text-[1.5rem] font-medium">Evidence-based strength analysis</h3>
            <p className="mt-3 text-ink-soft">Self-description is easy to inflate and hard to compare. A project record is neither. Every skill you tick is tied to a project, an industry, an impact and the feedback you received.</p>
            <p className="mt-4 font-mono text-[0.9rem] text-ink">Proof = 100 × (0.40 coverage + 0.35 depth + 0.25 breadth)</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.98rem] text-ink-soft marker:text-muted">
              <li><span className="text-ink">Coverage:</span> how many projects used it, capped at three.</li>
              <li><span className="text-ink">Depth:</span> starts at 0.4, plus 0.3 for a stated impact and 0.3 for feedback.</li>
              <li><span className="text-ink">Breadth:</span> how many industries it appeared in, capped at three.</li>
            </ul>
            <p className="mt-4 text-[0.98rem] text-muted">A thin project log lowers a confidence reading that scales every score a little, instead of pretending to certainty.</p>
          </article>

          <article className="card">
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-passion">Passion</p>
            <h3 className="mt-2 text-[1.5rem] font-medium">The power of passion: intrinsic and extrinsic</h3>
            <p className="mt-3 text-ink-soft">Motivation research, notably self-determination theory, separates doing work because it is satisfying (intrinsic) from doing it for what it brings from outside (pay, praise, status: extrinsic). Both are real. They do different jobs, and mixing them up is how people mistake a reward for a calling.</p>
            <p className="mt-4 text-ink-soft">AlphaVector keeps them apart.</p>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[0.98rem] text-ink-soft marker:text-muted">
              <li><span className="text-ink">Intrinsic signals</span> feed passion: how each project felt (energised, neutral or drained), the areas you would pursue unasked, and your curiosity.</li>
              <li><span className="text-ink">Extrinsic signals</span> such as feedback and recognition count as evidence for strengths. They are not counted as passion.</li>
            </ul>
            <p className="mt-4 text-[0.98rem] text-ink-soft">The passion worksheet puts the test plainly: which work would you do for a year without a pay rise?</p>
            <p className="mt-4 text-[0.98rem] text-muted">Passion carries 20 percent of the fit. It tilts the result toward work you would sustain, and it never overrides the evidence.</p>
          </article>

          <article className="card">
            <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-market">Market demand</p>
            <h3 className="mt-2 text-[1.5rem] font-medium">An algorithmic approach to demand</h3>
            <p className="mt-3 text-ink-soft">Demand is stored as dated observations: a metric, a region, a value, a period and the document it came from. Each direction is scored on six components with fixed weights.</p>
            <ul className="mt-3 space-y-1.5 text-[0.98rem] text-ink-soft">
              <li className="flex justify-between gap-4"><span>Current demand</span><span className="font-mono text-ink">25%</span></li>
              <li className="flex justify-between gap-4"><span>Growth</span><span className="font-mono text-ink">20%</span></li>
              <li className="flex justify-between gap-4"><span>Future potential</span><span className="font-mono text-ink">20%</span></li>
              <li className="flex justify-between gap-4"><span>Adjacency to your work</span><span className="font-mono text-ink">15%</span></li>
              <li className="flex justify-between gap-4"><span>Relevance</span><span className="font-mono text-ink">10%</span></li>
              <li className="flex justify-between gap-4"><span>Safety (100 minus risk)</span><span className="font-mono text-ink">10%</span></li>
            </ul>
            <p className="mt-4 text-[0.98rem] text-muted">Sources are re-read on a schedule, each carries a reliability score from 0 to 1, and weaker sources are held at lower weight.</p>
          </article>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="card">
            <p className={eyebrow}>How the three combine</p>
            <p className="mt-3 font-mono text-[1.05rem] text-ink">Fit = (0.40 Strengths + 0.40 Market + 0.20 Passion) × (0.75 + 0.25 Confidence)</p>
            <p className="mt-3 text-[0.98rem] text-ink-soft">Confidence runs from 0 to 1 and reflects how much evidence you gave. Weak evidence lowers the multiplier but never below 0.75, so thin data lowers confidence without ruling a direction out.</p>
          </div>
          <div className="card">
            <p className={eyebrow}>What we do not claim</p>
            <p className="mt-3 text-[0.98rem] text-ink-soft">The component scores are estimates grounded in your evidence and the cited briefing, not predictions of your future. The Blueprint shows them so you can question them.</p>
          </div>
        </div>
        <p className="mt-8"><Link href="/method" className="link">Read the full method, with every weight and source.</Link></p>
      </section>

      {/* 6. Why it works throughout a career */}
      <section id="career" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>Why it works throughout your career</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Three signals move at three different speeds.</h2>
        <p className="mt-5 max-w-2xl text-ink-soft">
          Your strengths grow with every project. Your passion shifts as your life does. The market moves on its own schedule. A one-time quiz goes stale, because only one of those clocks was read. A position can be fixed again whenever any of them moves, which is why AlphaVector is built to be recalibrated.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {STAGES.map(([t, d]) => (
            <article key={t} className="border-t border-rule pt-4">
              <h3 className="text-[1.25rem] font-medium">{t}</h3>
              <p className="mt-2 text-[1rem] text-ink-soft">{d}</p>
            </article>
          ))}
        </div>

        <h3 className="mt-20 max-w-2xl text-[clamp(1.5rem,2.6vw,2.1rem)] font-light">A fix is not forever. Check it again.</h3>
        <ol className="mt-8 grid gap-8 md:grid-cols-4">
          {LOOP.map((l, i) => (
            <li key={l.name} className="border-t border-rule pt-4">
              <p className="font-display text-[0.95rem] font-medium text-muted">Step {i + 1}</p>
              <h3 className="mt-1 text-[1.5rem] font-medium">{l.name}</h3>
              <p className="mt-2 text-[1.02rem] text-ink-soft">{l.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 7. Testimonials: only real, consented quotes; hidden while the list is empty */}
      {TESTIMONIALS.length > 0 && (
        <section id="voices" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
          <p className={eyebrow}>In their words</p>
          <h2 className={`mt-3 max-w-3xl ${h2}`}>What changed for the people who used it</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name + t.quote.slice(0, 12)} className="card flex flex-col justify-between gap-6">
                <blockquote className="text-[1.1rem] leading-relaxed text-ink">{t.quote}</blockquote>
                <figcaption className="text-[0.95rem] text-muted">
                  <span className="font-display font-medium text-ink">{t.name}</span>, {t.role}{t.context ? `, ${t.context}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* 8. Calls to action */}
      <section id="start" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="border-t border-rule pt-10">
          <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">Bring your projects. Leave with a position.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For you</h3>
              <p className="text-ink-soft">Run the analysis on your own projects. No sign-in needed, about 20 minutes.</p>
              <a href={START_URL} className="btn btn-primary mt-auto">Find your fix</a>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For your cohort</h3>
              <p className="text-ink-soft">Institutes, training centres and schools can run AlphaVector with a whole group, guided by a facilitator.</p>
              <Link href="/workshop" className="btn btn-secondary mt-auto">See the workshop</Link>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">Prepare first</h3>
              <p className="text-ink-soft">Gather your projects before you start, or run the framework on paper with the printable worksheets.</p>
              <Link href="/resources" className="btn btn-secondary mt-auto">Get the resources</Link>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
