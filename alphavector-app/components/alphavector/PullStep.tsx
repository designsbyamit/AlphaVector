'use client'
import { useMemo } from 'react'
import { Check, Plus } from 'lucide-react'
import { INTEREST_GROUPS, INTERESTS, MAX_INTERESTS, MIN_INTERESTS, suggestInterests } from '@/lib/interests'
import { MAX_NICHES, NICHES } from '@/lib/alphavector/catalog'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { isFilled, type Inputs } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'
import { choice, hint, lead, title } from './ui'

function Chip({ label, on, blocked, hint: tip, onClick }: { label: string; on: boolean; blocked: boolean; hint?: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} aria-disabled={blocked || undefined} title={tip} onClick={onClick} className={choice(on, blocked)}>
      {on ? <Check size={15} aria-hidden className="text-[var(--neon)]" /> : <Plus size={15} aria-hidden className="opacity-50" />}
      {label}
    </button>
  )
}

/** Step 4: what you want more of. One choice that matters, one that is optional and folded away. */
export function PullStep({ inputs, onPassions, onNiches }: { inputs: Inputs; onPassions: (p: string[]) => void; onNiches: (n: string[]) => void }) {
  const picked = inputs.passions
  const atMax = picked.length >= MAX_INTERESTS
  const suggestions = useMemo(() => suggestInterests(buildExtractedData(inputs), 6), [inputs])
  const loved = inputs.rows.filter((r) => isFilled(r) && !r.sample && r.energy === 'energising').map((r) => r.name.trim())
  const toggle = (label: string) => {
    if (picked.includes(label)) onPassions(picked.filter((x) => x !== label))
    else if (!atMax) onPassions([...picked, label])
  }
  const nicheMax = inputs.niches.length >= MAX_NICHES

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className={title} style={{ fontFamily: 'var(--font-sora)' }}>What pulls you?</h1>
      <p className={lead}>Your projects show what you can do. This is about what you want more of.</p>

      <section aria-labelledby="pull-h" className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pull-h" className="text-[20px] font-semibold text-[var(--text-primary)]">Pick {MIN_INTERESTS} that pull you most</h2>
          <p className={hint} aria-live="polite">{picked.length} of {MIN_INTERESTS} to {MAX_INTERESTS} chosen</p>
        </div>
        {loved.length > 0 && <p className="mt-2 text-[16px] text-[var(--text-secondary)]">You loved {loved.slice(0, 3).join(', ')}{loved.length > 3 ? ' and more' : ''}. What did they have in common?</p>}

        {suggestions.length > 0 && (
          <div className="mt-6">
            <p className="mb-2.5 text-[14px] font-semibold text-[var(--text-primary)]">From your projects</p>
            <div className="flex flex-wrap gap-2.5">
              {suggestions.map((s) => {
                const on = picked.includes(s.interest.label)
                return <Chip key={s.interest.id} label={s.interest.label} on={on} blocked={!on && atMax} hint={s.reason} onClick={() => toggle(s.interest.label)} />
              })}
            </div>
          </div>
        )}

        <details className="mt-6" open={suggestions.length === 0}>
          <summary className={cx('cursor-pointer text-[15px] font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>See every area</summary>
          <div className="mt-5 flex flex-col gap-6">
            {INTEREST_GROUPS.map((g) => (
              <div key={g.id}>
                <p className="mb-2.5 text-[14px] font-semibold text-[var(--text-primary)]">{g.label}</p>
                <div className="flex flex-wrap gap-2.5">
                  {INTERESTS.filter((i) => i.group === g.id).map((i) => {
                    const on = picked.includes(i.label)
                    return <Chip key={i.id} label={i.label} on={on} blocked={!on && atMax} hint={i.hint} onClick={() => toggle(i.label)} />
                  })}
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <details className="mt-12 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-5">
        <summary className={cx('cursor-pointer text-[17px] font-semibold text-[var(--text-primary)]', focusRing)}>
          Anywhere you would love to work? <span className="font-normal text-[var(--text-muted)]">optional{inputs.niches.length ? `, ${inputs.niches.length} chosen` : ''}</span>
        </summary>
        <p className={`${hint} mt-3`}>Skip this and the market data decides. Pick up to {MAX_NICHES} to aim the search.</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {NICHES.map((n) => {
            const on = inputs.niches.includes(n)
            return <Chip key={n} label={n} on={on} blocked={!on && nicheMax} onClick={() => onNiches(on ? inputs.niches.filter((x) => x !== n) : nicheMax ? inputs.niches : [...inputs.niches, n])} />
          })}
        </div>
      </details>
    </div>
  )
}
