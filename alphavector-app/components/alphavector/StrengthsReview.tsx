'use client'
import { useMemo } from 'react'
import { computeStrengths } from '@/lib/alphavector/strengths'
import { evidence } from '@/lib/alphavector/progress'
import { isFilled, type ProjectRow } from '@/lib/alphavector/types'
import { hint, lead, secondary, title } from './ui'

function Ring({ pct }: { pct: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`Evidence ${pct} out of 100`} className="shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--border-ws)" strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--neon)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      <text x="44" y="50" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--text-primary)">{pct}</text>
    </svg>
  )
}

/** Step 3: the reward. What the projects already prove, a way to remove what is not you, and how solid it is. */
export function StrengthsReview({ rows, dismissed, onDismiss, onUndo, onEdit }: {
  rows: ProjectRow[]; dismissed: string[]; onDismiss: (id: string) => void; onUndo: () => void; onEdit: () => void
}) {
  const real = useMemo(() => rows.filter((r) => isFilled(r) && !r.sample), [rows])
  const all = useMemo(() => computeStrengths(real), [real])
  const shown = all.filter((s) => !dismissed.includes(s.id)).slice(0, 8)
  const hidden = all.filter((s) => dismissed.includes(s.id)).length
  const ev = useMemo(() => evidence(real), [real])

  return (
    <div className="mx-auto w-full max-w-2xl">
      <h1 className={title} style={{ fontFamily: 'var(--font-sora)' }}>Here is what your projects show</h1>
      <p className={lead}>Does this sound like you? Remove anything that does not.</p>

      {shown.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-6">
          <p className="text-[17px] font-semibold text-[var(--text-primary)]">No strengths to show yet</p>
          <p className={`${hint} mt-1`}>Strengths come from the skills in your projects. Go back and describe what you did.</p>
          <button type="button" onClick={onEdit} className={`${secondary} mt-4`}>Back to my projects</button>
        </div>
      ) : (
        <ul className="mt-9 flex flex-col gap-3" aria-label="Your strengths">
          {shown.map((s) => (
            <li key={s.id} className="av-rise rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[18px] font-semibold leading-snug text-[var(--text-primary)]">{s.label}</p>
                  <p className={hint}>{s.projects === 1 ? 'Seen in 1 project' : `Seen in ${s.projects} projects`}</p>
                </div>
                <button type="button" onClick={() => onDismiss(s.id)} aria-label={`Not me: ${s.label}`} className={`${secondary} shrink-0 !px-3 !py-1.5 !text-[13px]`}>Not me</button>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--surface-dim)]" role="img" aria-label={`Strength ${Math.round(s.score)} out of 100`}>
                <div className="h-full rounded-full bg-[var(--neon)]" style={{ width: `${Math.max(8, s.score)}%`, transition: 'width 0.8s ease' }} />
              </div>
            </li>
          ))}
        </ul>
      )}
      {hidden > 0 && <button type="button" onClick={onUndo} className="mt-3 text-[14px] text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]">Bring back {hidden} removed</button>}

      <section aria-label="How solid this is" className="mt-12 flex items-center gap-5 rounded-2xl border border-[var(--border-dim)] bg-[var(--surface-dim)] p-5">
        <Ring pct={ev.pct} />
        <div className="min-w-0">
          <p className="text-[13px] text-[var(--text-muted)]">How solid is this?</p>
          <p className="text-[20px] font-semibold text-[var(--text-primary)]">{ev.label}</p>
          <p className={hint}>{ev.next ?? 'Plenty to work with.'}</p>
          {ev.next && <button type="button" onClick={onEdit} className="mt-2 text-[14px] font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]">Add detail to my projects</button>}
        </div>
      </section>
    </div>
  )
}
