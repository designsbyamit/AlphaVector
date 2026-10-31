'use client'
import { Check } from 'lucide-react'
import type { About, Stage } from '@/lib/alphavector/types'
import { STAGES } from '@/lib/alphavector/types'
import { card, field, hint, label, lead, title } from './ui'

const STAGE_TEXT: Record<Exclude<Stage, ''>, { name: string; sub: string }> = {
  student: { name: 'Still studying', sub: 'School, college or a course' },
  '0-2': { name: '0 to 2 years', sub: 'Early in my working life' },
  '3-5': { name: '3 to 5 years', sub: 'Finding my feet' },
  '6-10': { name: '6 to 10 years', sub: 'Experienced' },
  '10+': { name: 'More than 10 years', sub: 'Senior' },
}

/** Step 1: the only two questions about you. Everything after this is about your work. */
export function AboutStep({ about, onChange }: { about: About; onChange: (p: Partial<About>) => void }) {
  const student = about.stage === 'student'
  return (
    <div className="mx-auto w-full max-w-xl">
      <h1 className={title} style={{ fontFamily: 'var(--font-sora)' }}>Let&apos;s start with you</h1>
      <p className={lead}>Two quick things. Everything after this is about your work.</p>

      <div className="mt-10 flex flex-col gap-9">
        <div>
          <label htmlFor="av-name" className={label}>What should we call you? <span className="font-normal text-[var(--text-muted)]">optional</span></label>
          <input id="av-name" className={field} value={about.name} autoComplete="given-name" placeholder="Your first name" onChange={(e) => onChange({ name: e.target.value })} />
        </div>

        <fieldset>
          <legend className={label}>Where are you right now?</legend>
          <p className={`${hint} mb-3`}>This sets how senior the roles we suggest can be.</p>
          <div role="radiogroup" aria-label="Where you are right now" className="grid gap-2.5 sm:grid-cols-2">
            {STAGES.map((s) => {
              const on = about.stage === s.id
              return (
                <button key={s.id} type="button" role="radio" aria-checked={on} onClick={() => onChange({ stage: s.id, years: String(s.years) })} className={card(on)}>
                  <span className="flex w-full items-center justify-between text-[16px] font-semibold text-[var(--text-primary)]">
                    {STAGE_TEXT[s.id].name}
                    {on && <Check size={16} strokeWidth={3} aria-hidden className="text-[var(--neon)]" />}
                  </span>
                  <span className="text-[14px] text-[var(--text-muted)]">{STAGE_TEXT[s.id].sub}</span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {about.stage && (
          <div className="av-rise">
            <label htmlFor="av-role" className={label}>{student ? 'What are you studying?' : 'What is your role?'} <span className="font-normal text-[var(--text-muted)]">optional</span></label>
            <input id="av-role" className={field} value={about.currentRole} placeholder={student ? 'e.g. B.Des, Visual Communication' : 'e.g. Product designer'} onChange={(e) => onChange({ currentRole: e.target.value })} />
          </div>
        )}
      </div>
    </div>
  )
}
