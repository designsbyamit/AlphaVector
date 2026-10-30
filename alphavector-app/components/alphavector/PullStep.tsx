'use client'
import { useMemo } from 'react'
import { Check, Plus } from 'lucide-react'
import { INTEREST_GROUPS, INTERESTS, MAX_INTERESTS, MIN_INTERESTS, suggestInterests } from '@/lib/interests'
import { MAX_NICHES, NICHES } from '@/lib/alphavector/catalog'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { isFilled, type Inputs } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'

function Chip({ label, on, blocked, hint, onClick }: { label: string; on: boolean; blocked: boolean; hint?: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={on} aria-disabled={blocked || undefined} title={hint} onClick={onClick}
      className={cx('inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-medium transition-colors', focusRing,
        on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
          : blocked ? 'cursor-not-allowed border-[var(--border-ws)] text-[var(--text-dim)]'
          : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)] hover:text-[var(--text-primary)]')}>
      {on ? <Check size={14} aria-hidden className="text-[var(--neon)]" /> : <Plus size={14} aria-hidden className="opacity-50" />}
      {label}
    </button>
  )
}

/** One screen for everything that is about wanting rather than doing: what pulls you, and (optionally) where. */
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
    <div className="flex flex-col gap-12">
      <section aria-labelledby="pull-h">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="pull-h" className="text-[22px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sora)' }}>Pick {MIN_INTERESTS} that pull you most</h2>
          <p className="text-[14px] text-[var(--text-muted)]" aria-live="polite">{picked.length} of {MIN_INTERESTS} to {MAX_INTERESTS}</p>
        </div>
        {loved.length > 0 && (
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">You lit up on {loved.slice(0, 3).join(', ')}{loved.length > 3 ? ' and more' : ''}. Think about what they had in common.</p>
        )}
        {suggestions.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-[13px] font-semibold text-[var(--text-secondary)]">From your projects</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => {
                const on = picked.includes(s.interest.label)
                return <Chip key={s.interest.id} label={s.interest.label} on={on} blocked={!on && atMax} hint={s.reason} onClick={() => toggle(s.interest.label)} />
              })}
            </div>
          </div>
        )}
        <details className="mt-5" open={suggestions.length === 0}>
          <summary className={cx('cursor-pointer text-[14px] font-semibold text-[var(--neon)]', focusRing)}>Browse everything</summary>
          <div className="mt-4 flex flex-col gap-5">
            {INTEREST_GROUPS.map((g) => (
              <div key={g.id}>
                <p className="text-[13px] font-semibold text-[var(--text-secondary)]">{g.label}</p>
                <div className="mt-2 flex flex-wrap gap-2">
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

      <section aria-labelledby="niche-h">
        <h2 id="niche-h" className="text-[22px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sora)' }}>
          Anywhere you&apos;d love to work? <span className="text-[16px] font-normal text-[var(--text-muted)]">optional</span>
        </h2>
        <p className="mt-2 text-[15px] text-[var(--text-secondary)]">Skip this and the market data decides. Pick up to {MAX_NICHES} to aim the search.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {NICHES.map((n) => {
            const on = inputs.niches.includes(n)
            return <Chip key={n} label={n} on={on} blocked={!on && nicheMax} onClick={() => onNiches(on ? inputs.niches.filter((x) => x !== n) : nicheMax ? inputs.niches : [...inputs.niches, n])} />
          })}
        </div>
      </section>
    </div>
  )
}
