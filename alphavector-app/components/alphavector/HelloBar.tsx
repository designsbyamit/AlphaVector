'use client'
import { STAGES, type About } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'

const blank = cx(
  'min-w-[8ch] border-0 border-b-2 border-[var(--border-ws)] bg-transparent px-1 pb-0.5 text-[var(--text-primary)]',
  'placeholder:text-[var(--text-dim)] hover:border-[var(--text-dim)] focus:border-[var(--neon)] focus:outline-none',
)

/** The only two questions before the projects, asked as a sentence: who you are and roughly how far in. */
export function HelloBar({ about, onChange }: { about: About; onChange: (p: Partial<About>) => void }) {
  const student = about.stage === 'student'
  return (
    <section aria-label="About you" className="text-[20px] leading-[2.4rem] text-[var(--text-secondary)] sm:text-[22px]">
      <p>
        Hi, I&apos;m{' '}
        <input aria-label="Your name" className={cx(blank, 'w-[11ch]')} placeholder="your name" value={about.name} autoComplete="given-name"
          onChange={(e) => onChange({ name: e.target.value })} />{' '}
        and I&apos;m
      </p>
      <div role="radiogroup" aria-label="Where you are right now" className="mt-1 flex flex-wrap gap-2">
        {STAGES.map((s) => {
          const on = about.stage === s.id
          return (
            <button key={s.id} type="button" role="radio" aria-checked={on}
              onClick={() => onChange({ stage: s.id, years: String(s.years) })}
              className={cx('rounded-full border px-4 py-1.5 text-[16px] font-medium leading-normal transition-colors', focusRing,
                on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
                  : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)] hover:text-[var(--text-primary)]')}>
              {s.label}
            </button>
          )
        })}
      </div>
      {about.stage && (
        <p className="av-rise mt-2 text-[17px]">
          {student ? 'Studying' : 'Working as'}{' '}
          <input aria-label={student ? 'What you study (optional)' : 'Your role (optional)'} className={cx(blank, 'w-[22ch]')}
            placeholder={student ? 'e.g. B.Des, Visual Communication' : 'e.g. Product designer'} value={about.currentRole}
            onChange={(e) => onChange({ currentRole: e.target.value })} />{' '}
          <span className="text-[14px] text-[var(--text-muted)]">optional</span>
        </p>
      )}
    </section>
  )
}
