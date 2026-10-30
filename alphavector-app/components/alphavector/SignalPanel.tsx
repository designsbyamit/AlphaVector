'use client'
import { useMemo } from 'react'
import { X } from 'lucide-react'
import { computeStrengths } from '@/lib/alphavector/strengths'
import { evidence } from '@/lib/alphavector/progress'
import { isFilled, type ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'

function Ring({ pct }: { pct: number }) {
  const r = 34
  const c = 2 * Math.PI * r
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" role="img" aria-label={`Evidence ${pct} out of 100`} className="shrink-0">
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--border-ws)" strokeWidth="7" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="var(--neon)" strokeWidth="7" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 44 44)" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x="44" y="50" textAnchor="middle" fontSize="20" fontWeight="700" fill="var(--text-primary)">{pct}</text>
    </svg>
  )
}

/** Shows what the log can already prove. Strengths appear as the person types, which is the reward for the effort. */
export function SignalPanel({ rows, dismissed, onDismiss, onUndo }: {
  rows: ProjectRow[]; dismissed: string[]; onDismiss: (id: string) => void; onUndo: () => void
}) {
  const ev = useMemo(() => evidence(rows.filter((r) => !r.sample || isFilled(r))), [rows])
  const all = useMemo(() => computeStrengths(rows.filter(isFilled)), [rows])
  const shown = all.filter((s) => !dismissed.includes(s.id)).slice(0, 5)
  const hidden = all.filter((s) => dismissed.includes(s.id)).length

  return (
    <aside aria-label="What your projects show so far" className="rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-5 lg:sticky lg:top-20">
      <div className="flex items-center gap-4">
        <Ring pct={ev.pct} />
        <div>
          <p className="text-[17px] font-semibold text-[var(--text-primary)]">{ev.label}</p>
          <p className="mt-0.5 text-[13px] leading-snug text-[var(--text-secondary)]" aria-live="polite">{ev.next ?? 'This is plenty to work with.'}</p>
        </div>
      </div>

      <div className="mt-5 border-t border-[var(--border-dim)] pt-4">
        <h3 className="text-[13px] font-semibold text-[var(--text-secondary)]">Your strengths, so far</h3>
        {shown.length === 0 ? (
          <p className="mt-2 text-[13px] leading-snug text-[var(--text-muted)]">Describe a project and your first strengths appear here.</p>
        ) : (
          <ul className="mt-3 flex flex-col gap-3">
            {shown.map((s) => (
              <li key={s.id} className="av-rise">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[14px] leading-snug text-[var(--text-primary)]">{s.label}</span>
                  <button type="button" onClick={() => onDismiss(s.id)} aria-label={`Not really me: ${s.label}`} title="Not really me"
                    className={cx('shrink-0 rounded-full p-0.5 text-[var(--text-dim)] hover:text-red-400', focusRing)}><X size={14} aria-hidden /></button>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--surface-dim)]" role="img" aria-label={`${s.projects} ${s.projects === 1 ? 'project' : 'projects'}`}>
                  <div className="h-full rounded-full bg-[var(--neon)]" style={{ width: `${Math.max(8, s.score)}%`, transition: 'width 0.6s ease' }} />
                </div>
                <span className="mt-0.5 block text-[12px] text-[var(--text-muted)]">{s.projects === 1 ? 'Seen in 1 project' : `Seen in ${s.projects} projects`}</span>
              </li>
            ))}
          </ul>
        )}
        {hidden > 0 && (
          <button type="button" onClick={onUndo} className={cx('mt-3 text-[12px] text-[var(--text-muted)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>Bring back {hidden} hidden</button>
        )}
      </div>
    </aside>
  )
}
