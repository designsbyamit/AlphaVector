import type { Metadata } from 'next'
import { SIGNALS } from '@/lib/signals'
import { START_URL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'The framework',
  description: 'AlphaVector fixes your career position from three dimensions: Strengths, Passion and Market demand.',
}

const BETS = [
  { name: 'Safe', range: 'Within 35 of what you already do', body: 'The most natural next step from your current work. High confidence, lowest risk, and the one you could start applying for now.' },
  { name: 'Growth', range: '20 to 60 from what you already do', body: 'An adjacent step up that stretches you into a neighbouring discipline or a bigger scope. Real gaps to close, with a clear route.' },
  { name: 'Bold', range: '45 to 85 from what you already do', body: 'An emerging direction that is still credible for someone with exactly your history. Higher risk and higher upside. Beyond 85 away, a direction is not offered at all.' },
]

export default function Framework() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h1 className="max-w-4xl text-[clamp(2.4rem,5.4vw,4.4rem)] font-light">The AlphaVector framework</h1>
        <p className="mt-6 max-w-2xl text-[1.25rem] text-ink-soft">
          A career roadmap is only as reliable as the data under it. This framework builds yours on three dimensions, each measured from evidence rather than self-description, and then looks for where they agree. The technique is trilateration: the way GPS finds you from three distances, because any single one can be wrong.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">The three dimensions</h2>
        <div className="mt-8 divide-y divide-rule border-y border-rule">
          {SIGNALS.map((s) => (
            <article key={s.key} className="grid gap-6 py-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
              <div className={`border-t-[3px] ${s.rule} pt-5`}>
                <h3 className={`text-[2rem] font-medium ${s.text}`}>{s.name}</h3>
                <p className="mt-1 font-display text-[1.1rem] font-medium">{s.short}</p>
              </div>
              <dl className="space-y-5 text-[1.05rem]">
                <div><dt className="font-display font-medium">What it measures</dt><dd className="mt-1 text-ink-soft">{s.measures}</dd></div>
                <div><dt className="font-display font-medium">How AlphaVector reads it</dt><dd className="mt-1 text-ink-soft">{s.read}</dd></div>
                <div><dt className="font-display font-medium">What goes wrong without the other two</dt><dd className="mt-1 text-ink-soft">{s.alone}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Where the signals meet</h2>
        </div>
        <div className="space-y-5 text-ink-soft">
          <p>Every possible direction gets a score on each dimension. Strengths and market demand carry 40 percent each. Passion carries 20 percent. That ordering is deliberate: passion tilts the answer toward what you want, but it cannot outvote what you can prove or what the world will hire for.</p>
          <p>The result is then scaled by confidence in the evidence. A thin project log lowers confidence, which lowers every score a little, instead of pretending to certainty. The full arithmetic is on the <a className="font-medium text-ink underline underline-offset-4" href="/method#maths">method page</a>.</p>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Three routes from your fix</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">The Future Blueprint never gives you one answer. It gives you three, spaced by how far each sits from the work you already do.</p>
        <div className="mt-10 grid gap-x-10 gap-y-10 md:grid-cols-3">
          {BETS.map((b) => (
            <article key={b.name} className="border-t border-rule pt-5">
              <h3 className="text-[1.7rem] font-medium">{b.name}</h3>
              <p className="mt-1 font-display text-[0.98rem] font-medium text-muted">{b.range}</p>
              <p className="mt-4 text-[1.02rem] text-ink-soft">{b.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">What the framework does not claim</h2>
        <ul className="mt-6 max-w-2xl list-disc space-y-3 pl-6 text-ink-soft marker:text-ink">
          <li>It does not predict your future. It estimates where your evidence and the current market agree.</li>
          <li>It is only as good as your project log. Vague entries produce vague strengths, and the app tells you when evidence is thin.</li>
          <li>Market figures come from dated public sources of differing reliability, and coverage of some regions is thinner than others. Each source is listed with its weight.</li>
        </ul>
        <div className="mt-12">
          <a href={START_URL} className="btn btn-primary">Find your fix</a>
        </div>
      </section>
    </>
  )
}
