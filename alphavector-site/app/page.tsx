import Link from 'next/link'
import { FixDiagram } from '@/components/FixDiagram'
import { Pictogram, type PictogramKind, type FieldTone } from '@/components/Pictogram'
import { Disclosure } from '@/components/Disclosure'
import { SIGNALS } from '@/lib/signals'
import { START_URL } from '@/lib/config'
import { TESTIMONIALS } from '@/lib/testimonials'

// Each signal sits on one of the portfolio's field tones, with a one-word label in the cover style.
const PICTO: Record<string, { kind: PictogramKind; tone: FieldTone; label: string }> = {
  strengths: { kind: 'strengths', tone: 'teal', label: 'Evidence' },
  passion: { kind: 'passion', tone: 'plum', label: 'Pull' },
  market: { kind: 'market', tone: 'graphite', label: 'Demand' },
}

const ROUTES = [
  ['Safe', 'A step you could take now. Strong evidence, small gap.'],
  ['Growth', 'A real stretch, with a clear bridge of skills and projects.'],
  ['Bold', 'The highest upside and the longest road. Worth it only if pull and demand are both real.'],
]

const STAGES = [
  ['Studying or just starting', 'Your evidence is thin, and AlphaVector says so. Routes stay close to what you have actually done.'],
  ['Early career', 'Your first real choice of direction, with the skills and projects that turn a first role into a second.'],
  ['Mid career', 'Pivots get risky. You see how far a new field really is from your work, so a bold move is a decision, not a leap of faith.'],
  ['Senior and leading', 'The question shifts from skills to position. Your history, scope and recognition anchor where you can credibly go next.'],
]

const h2 = 'text-[clamp(1.9rem,3.6vw,2.9rem)] font-light'
const eyebrow = 'font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted'

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div>
          <p className="status mb-6">For designers, for now</p>
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
        <FixDiagram className="mx-auto w-full max-w-[34rem]" />
      </section>

      {/* What it is, in two sentences */}
      <section id="what" className="mx-auto mt-20 grid max-w-6xl items-center gap-8 px-5 sm:px-8 md:grid-cols-[0.6fr_1fr]">
        <Pictogram kind="vector" tone="cobalt" label="Size · direction" className="mx-auto w-full max-w-[20rem]" />
        <div>
          <p className={eyebrow}>What it is</p>
          <h2 className={`mt-3 ${h2}`}>What is AlphaVector?</h2>
          <p className="mt-5 max-w-2xl text-[1.2rem] text-ink">A career-positioning framework and a guided app. It reads your own project history, what pulls you and what the market wants, and tells you where to go next.</p>
          <p className="mt-3 max-w-2xl text-muted">Your evidence sets the size of the vector. The three signals set its direction.</p>
        </div>
      </section>

      {/* The three signals */}
      <section id="signals" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>The parts</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Three signals, because one distance cannot find you.</h2>
        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {SIGNALS.map((s) => (
            <article key={s.key} className={`border-t-[3px] ${s.rule} pt-5`}>
              <Pictogram kind={PICTO[s.key].kind} tone={PICTO[s.key].tone} label={PICTO[s.key].label} className="w-full" />
              <h3 className={`mt-4 text-[1.7rem] font-medium ${s.text}`}>{s.name}</h3>
              <p className="mt-1 font-display text-[1.02rem] font-medium">{s.short}</p>
              <p className="mt-3 text-[1.02rem] text-ink-soft">{s.measures}</p>
              <Disclosure title="Why it needs the other two" className="mt-3">
                <p><span className="font-display font-medium text-ink">On its own: </span>{s.alone}</p>
                <p className="text-muted">{s.read}</p>
              </Disclosure>
            </article>
          ))}
        </div>
      </section>

      {/* Where it points you */}
      <section id="alpha" className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-5 sm:px-8 md:grid-cols-[0.6fr_1fr]">
        <Pictogram kind="routes" tone="cobalt" label="Three routes" className="mx-auto w-full max-w-[20rem]" />
        <div>
          <p className={eyebrow}>Your alpha, in the right direction</p>
          <h2 className={`mt-3 ${h2}`}>Three routes, not one answer.</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">Your alpha is the edge that is yours: work you have proven you can do, want to keep doing, and that someone needs done. Each route sits at a different distance from the work you already do, so you choose how far to stretch.</p>
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {ROUTES.map(([n, d]) => (
              <div key={n} className="grid gap-1 py-3 sm:grid-cols-[6rem_1fr] sm:gap-6">
                <dt className="font-display text-[1.05rem] font-medium">{n}</dt>
                <dd className="text-ink-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Why it lasts */}
      <section id="career" className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-5 sm:px-8 md:grid-cols-[0.6fr_1fr]">
        <Pictogram kind="loop" tone="plum" label="Recalibrate" className="mx-auto w-full max-w-[20rem]" />
        <div>
          <p className={eyebrow}>Why it works throughout your career</p>
          <h2 className={`mt-3 ${h2}`}>A fix is not forever. Check it again.</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">Your strengths grow with every project, your pull shifts, and the market moves on its own schedule. Three clocks, so your position is re-fixed whenever one of them changes.</p>
          <p className="mt-5 font-display text-[1.05rem] font-medium">Log · Fix · Follow · Recalibrate</p>
          <Disclosure title="Where you are in your career" className="mt-4">
            <dl className="space-y-4">
              {STAGES.map(([t, d]) => (
                <div key={t}><dt className="font-display font-medium text-ink">{t}</dt><dd className="mt-0.5">{d}</dd></div>
              ))}
            </dl>
          </Disclosure>
        </div>
      </section>

      {/* Go deeper: closed by default */}
      <section id="deeper" className="mx-auto mt-24 max-w-3xl px-5 sm:px-8">
        <p className={eyebrow}>Go deeper</p>
        <h2 className={`mt-3 ${h2}`}>The thinking behind it.</h2>
        <div className="mt-6 border-t border-rule">
          <Disclosure title="The philosophy: purpose is a position">
            <p>Purpose is easier to locate than to discover in a flash. The old idea, ikigai, puts it where what you are good at, what you love and what the world needs overlap. The trouble is that each circle is usually filled in by guessing.</p>
            <p>AlphaVector keeps the idea and changes the instrument. Strengths come from what you have done, passion from how that work felt, demand from dated, cited research. When the three disagree, the disagreement is the most useful thing it can tell you.</p>
          </Disclosure>
          <Disclosure title="The science, in plain words">
            <p><span className="font-display font-medium text-strength">Strengths</span> are scored from evidence, not self-description. Every skill is tied to a project, an impact and the feedback you received, and a thin log lowers confidence rather than pretending to certainty.</p>
            <p><span className="font-display font-medium text-passion">Passion</span> separates intrinsic from extrinsic motivation. How work felt and what you would do unasked count as passion; praise and recognition count as evidence of strength, not of passion.</p>
            <p><span className="font-display font-medium text-market">Market demand</span> comes from dated, cited observations from named sources, scored by fixed rules, so the same inputs always give the same result.</p>
            <p className="text-muted">The weights, formulas and sources are shared with schools, institutes and partners on request.</p>
            <p><Link href="/method#request" className="link">Request the technical note</Link></p>
          </Disclosure>
          <Disclosure title="What you leave with">
            <ul className="list-disc space-y-1.5 pl-5 marker:text-muted">
              <li>Your position, with a ranked strengths profile.</li>
              <li>Three routes (Safe, Growth, Bold), each with a plain-language risk assessment.</li>
              <li>The gaps between you and each route, and how long they usually take to close.</li>
              <li>A roadmap through 30 days, 90 days and the year ahead, with matched learning for every gap.</li>
              <li>Progress tracking, and a way to recalibrate.</li>
            </ul>
          </Disclosure>
        </div>
      </section>

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

      <section id="start" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <div className="border-t border-rule pt-10">
          <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">Bring your projects. Leave with a position.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For you</h3>
              <p className="text-ink-soft">Run the analysis on your own projects. Open to designers for now. No sign-in needed, about 20 minutes.</p>
              <a href={START_URL} className="btn btn-primary mt-auto">Find your fix</a>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For your cohort</h3>
              <p className="text-ink-soft">Institutes, training centres and schools can run AlphaVector with a whole group, guided by a facilitator.</p>
              <Link href="/workshop" className="btn btn-secondary mt-auto">See the workshop</Link>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For the detail</h3>
              <p className="text-ink-soft">Want the weights, formulas and sources behind the scores? Ask and we will send the technical note.</p>
              <Link href="/method#request" className="btn btn-secondary mt-auto">Request the technical note</Link>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
