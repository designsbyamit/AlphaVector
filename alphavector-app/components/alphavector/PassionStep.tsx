'use client'
import { useMemo } from 'react'
import { Check, Plus } from 'lucide-react'
import { INTEREST_GROUPS, INTERESTS, MAX_INTERESTS, MIN_INTERESTS, suggestInterests } from '@/lib/interests'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { isFilled, type Energy, type Inputs, type ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'

const ENERGY: Array<{ v: Exclude<Energy, ''>; label: string }> = [
  { v: 'energising', label: 'Energised me' },
  { v: 'neutral', label: 'Neutral' },
  { v: 'draining', label: 'Drained me' },
]

export function PassionStep({ inputs, onPatchRow, onPassions }: {
  inputs: Inputs; onPatchRow: (id: string, p: Partial<ProjectRow>) => void; onPassions: (p: string[]) => void
}) {
  const filled = inputs.rows.filter(isFilled)
  const suggestions = useMemo(() => suggestInterests(buildExtractedData(inputs), 6), [inputs])
  const picked = inputs.passions
  const atMax = picked.length >= MAX_INTERESTS
  const toggle = (label: string) => {
    if (picked.includes(label)) onPassions(picked.filter((x) => x !== label))
    else if (!atMax) onPassions([...picked, label])
  }

  const Chip = ({ label, hint }: { label: string; hint: string }) => {
    const on = picked.includes(label)
    const blocked = !on && atMax
    return (
      <button type="button" aria-pressed={on} aria-disabled={blocked || undefined} title={hint} onClick={() => toggle(label)}
        className={cx('inline-flex min-h-[34px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors', focusRing,
          on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
            : blocked ? 'cursor-not-allowed border-[var(--border-ws)] text-[var(--text-dim)]'
            : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)] hover:text-[var(--text-primary)]')}>
        {on ? <Check size={13} className="text-[var(--neon)]" aria-hidden /> : <Plus size={13} className="opacity-60" aria-hidden />}
        {label}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <section aria-labelledby="energy-h">
        <h2 id="energy-h" className="text-[15px] font-semibold text-[var(--text-primary)]">Which projects gave you energy?</h2>
        <p className="mt-1 max-w-2xl text-[13px] text-[var(--text-secondary)]">Passion shows up in how work felt, not just what it was. Be honest: the projects that drained you matter as much as the ones that lit you up.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {filled.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[var(--border-ws)] bg-[var(--surface)] px-4 py-3">
              <span className="text-[14px] font-medium text-[var(--text-primary)]">{r.name}{r.client ? <span className="text-[var(--text-muted)]"> · {r.client}</span> : null}</span>
              <div role="radiogroup" aria-label={`How ${r.name} felt`} className="inline-flex rounded-[10px] border border-[var(--border-ws)] p-0.5">
                {ENERGY.map((e) => (
                  <button key={e.v} type="button" role="radio" aria-checked={r.energy === e.v} onClick={() => onPatchRow(r.id, { energy: r.energy === e.v ? '' : e.v })}
                    className={cx('rounded-[8px] px-3 py-1 text-[12px] font-semibold', focusRing, r.energy === e.v ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')}>
                    {e.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="int-h">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="int-h" className="text-[15px] font-semibold text-[var(--text-primary)]">What pulls you forward?</h2>
          <p className="text-[12px] text-[var(--text-muted)]" aria-live="polite">{picked.length} of {MIN_INTERESTS}–{MAX_INTERESTS} chosen</p>
        </div>
        <p className="mt-1 max-w-2xl text-[13px] text-[var(--text-secondary)]">Choose {MIN_INTERESTS} to {MAX_INTERESTS} areas you would work on even without being asked. These tilt your Blueprint toward what you want, never away from what you can do.</p>

        {suggestions.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">Suggested from your projects</p>
            <div className="flex flex-wrap gap-2">{suggestions.map((s) => <Chip key={s.interest.id} label={s.interest.label} hint={s.reason} />)}</div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-5">
          {INTEREST_GROUPS.map((g) => (
            <div key={g.id}>
              <p className="text-[13px] font-semibold text-[var(--text-primary)]">{g.label} <span className="font-normal text-[var(--text-muted)]">· {g.description}</span></p>
              <div className="mt-2 flex flex-wrap gap-2">{INTERESTS.filter((i) => i.group === g.id).map((i) => <Chip key={i.id} label={i.label} hint={i.hint} />)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
