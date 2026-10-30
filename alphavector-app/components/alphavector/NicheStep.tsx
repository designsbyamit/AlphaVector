'use client'
import { Check, Plus } from 'lucide-react'
import { MAX_NICHES, NICHES } from '@/lib/alphavector/catalog'
import { cx, focusRing } from '@/components/onboarding/ui'

export function NicheStep({ niches, onChange }: { niches: string[]; onChange: (n: string[]) => void }) {
  const atMax = niches.length >= MAX_NICHES
  return (
    <section aria-labelledby="niche-h" className="flex flex-col gap-4">
      <div>
        <h2 id="niche-h" className="text-[15px] font-semibold text-[var(--text-primary)]">Where do you want to work? <span className="font-normal text-[var(--text-muted)]">(optional)</span></h2>
        <p className="mt-1 max-w-2xl text-[13px] text-[var(--text-secondary)]">
          Pick up to {MAX_NICHES} market niches to tilt the demand analysis toward them. Skip this and the market data alone decides where your skills are most wanted.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {NICHES.map((n) => {
          const on = niches.includes(n)
          const blocked = !on && atMax
          return (
            <button key={n} type="button" aria-pressed={on} aria-disabled={blocked || undefined}
              onClick={() => onChange(on ? niches.filter((x) => x !== n) : blocked ? niches : [...niches, n])}
              className={cx('inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors', focusRing,
                on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
                  : blocked ? 'cursor-not-allowed border-[var(--border-ws)] text-[var(--text-dim)]'
                  : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)] hover:text-[var(--text-primary)]')}>
              {on ? <Check size={13} className="text-[var(--neon)]" aria-hidden /> : <Plus size={13} className="opacity-60" aria-hidden />}
              {n}
            </button>
          )
        })}
      </div>
    </section>
  )
}
