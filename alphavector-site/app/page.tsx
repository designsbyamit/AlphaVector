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
  passion: { kind: 'passion', tone: 'plum', label: 'Energy' },
  market: { kind: 'market', tone: 'graphite', label: 'Demand' },
}

const QUESTIONS = [
  'Am I developing the right skills?',
  'Am I still relevant as AI reshapes the industry?',
  'Should I stay in UX, move into product strategy, explore AI, or lead?',
  'Am I progressing, or just getting better at the same things?',
]

const OUTCOMES = [
  ['Your design DNA', 'What makes you good at what you do, and what makes you different.'],
  ['Your sweet spot', 'Where your strengths, interests and market opportunities meet.'],
  ['Your career possibilities', 'Three directions worth exploring, from a safe step to a bold one, including ones you may not have considered.'],
  ['Your growth roadmap', 'What to learn, build, explore and do next.'],
]

const STEPS = [
  ['Bring your projects', 'A few lines on each is enough. Rough notes are fine, and you can add a CV or portfolio link instead.'],
  ['See what we see', 'Check the strengths and patterns we pick up, and remove anything that does not sound like you.'],
  ['Choose your direction', 'Explore the possibilities, pick the one that feels right, and get a practical way forward.'],
]

const COME_BACK = ['You finish a significant project', 'You learn a new skill', 'Your interests change', 'A new opportunity appears', 'The industry shifts']

const STAGES = [
  ['Studying or just starting', 'You have less to show so far, and AlphaVector says so. The directions stay close to what you have actually done.'],
  ['Early career', 'Your first real choice of direction, with the skills and projects that turn a first role into a second.'],
  ['Mid career', 'Pivots feel risky. You see how far a new field really is from your work, so a bold move is an informed one.'],
  ['Senior and leading', 'The question moves from skills to position. Your history, scope and recognition show where you can credibly go next.'],
]

const h2 = 'text-[clamp(1.9rem,3.6vw,2.9rem)] font-light'
const eyebrow = 'font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted'

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 pb-10 pt-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pt-16">
        <div>
          <p className="status mb-6">For designers, for now</p>
          <h1 className="text-[clamp(2.4rem,5vw,4.3rem)] font-light leading-[1.02]">
            Your next move deserves more than a guess.
          </h1>
          <p className="mt-6 font-display text-[1.25rem] font-medium text-ink">Your design career. Less guesswork. More direction.</p>
          <p className="mt-4 max-w-[34rem] text-[1.15rem] leading-relaxed text-ink-soft">
            You have built things, solved problems and picked up skills. AlphaVector looks at your work, what drives you and where the industry is heading, so you can see your strengths, explore what could come next and choose your next move.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a href={START_URL} className="btn btn-primary">Find your direction</a>
            <Link href="#clues" className="font-display text-[1.05rem] font-medium underline underline-offset-8 hover:text-ink-soft">How it works</Link>
          </div>
          <p className="mt-5 text-[0.95rem] text-muted">Free to start. No sign-up needed. Around 20 minutes, with your projects to hand.</p>
        </div>
        <FixDiagram className="mx-auto w-full max-w-[34rem]" />
      </section>

      {/* The problem */}
      <section id="problem" className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className={eyebrow}>Sound familiar?</p>
          <h2 className={`mt-3 ${h2}`}>Good at what you do. Unsure what to do next?</h2>
        </div>
        <ul className="divide-y divide-rule border-y border-rule">
          {QUESTIONS.map((q) => (
            <li key={q} className="py-4 font-display text-[1.15rem] font-light text-ink">{q}</li>
          ))}
        </ul>
      </section>

      {/* The discovery */}
      <section id="clues" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>What it looks at</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Your experience holds more clues than you think.</h2>
        <p className="mt-5 max-w-2xl text-ink-soft">
          Your projects tell a story. Your skills reveal patterns. Your interests point towards possibilities. And the industry offers hints about where things are heading. AlphaVector brings all of it together so you can see the bigger picture.
        </p>
        <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {SIGNALS.map((s) => (
            <article key={s.key} className={`border-t-[3px] ${s.rule} pt-5`}>
              <Pictogram kind={PICTO[s.key].kind} tone={PICTO[s.key].tone} label={PICTO[s.key].label} className="w-full" />
              <h3 className={`mt-4 text-[1.6rem] font-medium ${s.text}`}>{s.name}</h3>
              <p className="mt-1 font-display text-[1.02rem] font-medium">{s.short}</p>
              <p className="mt-3 text-[1.02rem] text-ink-soft">{s.measures}</p>
              <Disclosure title="Why you need all three" className="mt-3">
                <p><span className="font-display font-medium text-ink">On its own: </span>{s.alone}</p>
                <p className="text-muted">{s.read}</p>
              </Disclosure>
            </article>
          ))}
        </div>
      </section>

      {/* The outcome */}
      <section id="outcome" className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-5 sm:px-8 md:grid-cols-[0.6fr_1fr]">
        <Pictogram kind="routes" tone="cobalt" label="Directions" className="mx-auto w-full max-w-[20rem]" />
        <div>
          <p className={eyebrow}>What you walk away with</p>
          <h2 className={`mt-3 ${h2}`}>See your strengths, your possibilities and your next moves.</h2>
          <dl className="mt-6 divide-y divide-rule border-y border-rule">
            {OUTCOMES.map(([n, d]) => (
              <div key={n} className="grid gap-1 py-3 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="font-display text-[1.05rem] font-medium">{n}</dt>
                <dd className="text-ink-soft">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto mt-24 max-w-6xl px-5 sm:px-8">
        <p className={eyebrow}>How it works</p>
        <h2 className={`mt-3 max-w-3xl ${h2}`}>Bring your projects. We will connect the dots.</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="border-t border-rule pt-4">
              <p className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-muted">Step {i + 1}</p>
              <h3 className="mt-2 text-[1.4rem] font-medium">{t}</h3>
              <p className="mt-2 text-[1.02rem] text-ink-soft">{d}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 max-w-2xl text-ink-soft">Grounded in your actual experience and in dated research from named sources, so it is not generic advice.</p>
      </section>

      {/* A reason to come back */}
      <section id="career" className="mx-auto mt-24 grid max-w-6xl items-center gap-10 px-5 sm:px-8 md:grid-cols-[0.6fr_1fr]">
        <Pictogram kind="loop" tone="plum" label="Keeps up with you" className="mx-auto w-full max-w-[20rem]" />
        <div>
          <p className={eyebrow}>Your career is not a fixed destination</p>
          <h2 className={`mt-3 ${h2}`}>As you change, your direction can too.</h2>
          <p className="mt-4 max-w-2xl text-ink-soft">AlphaVector helps you keep track of the journey, revisit your choices and make each next move with more confidence. Come back when:</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {COME_BACK.map((c) => <li key={c} className="rounded-full border border-rule-control px-3.5 py-1.5 text-[0.95rem] text-ink-soft">{c}</li>)}
          </ul>
          <Disclosure title="Where you are in your career" className="mt-6">
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
        <p className={eyebrow}>Curious how it works?</p>
        <h2 className={`mt-3 ${h2}`}>The thinking behind it.</h2>
        <div className="mt-6 border-t border-rule">
          <Disclosure title="Why three signals">
            <p>People often talk about finding purpose as a flash of insight. It is easier to treat it as a position you can locate. The old idea, ikigai, puts it where what you are good at, what you love and what the world needs overlap. The trouble is that each circle is usually filled in by guessing.</p>
            <p>AlphaVector keeps the idea and changes the instrument: your strengths come from what you have done, your energy from how that work felt, and the industry picture from dated, cited research. When the three line up, you can move with confidence. When they do not, you know what to build, test or let go of.</p>
          </Disclosure>
          <Disclosure title="How it works behind the scenes">
            <p><span className="font-display font-medium text-strength">Your strengths</span> come from evidence, not self-description. Every skill is tied to a project, what it led to and the feedback you got. A thin history lowers our confidence instead of pretending to certainty.</p>
            <p><span className="font-display font-medium text-passion">What energises you</span> separates intrinsic from extrinsic motivation. How work felt and what you would do unasked count towards passion. Praise and recognition count as evidence of strength, not of passion.</p>
            <p><span className="font-display font-medium text-market">Where the industry is heading</span> comes from dated observations from named sources, read with fixed rules, so the same inputs always give the same result.</p>
            <p className="text-muted">The weights, formulas and sources are shared with schools, institutes and partners on request.</p>
            <p><Link href="/method#request" className="link">Request the technical note</Link></p>
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
          <h2 className="max-w-2xl text-[clamp(1.9rem,3.6vw,2.9rem)] font-light">Your next chapter starts with a little clarity.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For you</h3>
              <p className="text-ink-soft">Bring your projects and see where they could take you. Free to start, no sign-up needed. Open to designers for now.</p>
              <a href={START_URL} className="btn btn-primary mt-auto">Find your direction</a>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For your cohort</h3>
              <p className="text-ink-soft">Institutes, training centres and schools can run AlphaVector with a whole group, guided by a facilitator.</p>
              <Link href="/workshop" className="btn btn-secondary mt-auto">See the workshop</Link>
            </article>
            <article className="card flex flex-col items-start gap-4">
              <h3 className="text-[1.4rem] font-medium">For the detail</h3>
              <p className="text-ink-soft">Want to know exactly how the analysis works? Ask and we will send the technical note.</p>
              <Link href="/method#request" className="btn btn-secondary mt-auto">Request the technical note</Link>
            </article>
          </div>
        </div>
      </section>
    </>
  )
}
