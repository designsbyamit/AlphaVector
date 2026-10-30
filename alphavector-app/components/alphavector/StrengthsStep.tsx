'use client'
import { useMemo, useState } from 'react'
import { EyeOff, Eye } from 'lucide-react'
import { computeStrengths, STRENGTH_WEIGHTS, type StrengthScore } from '@/lib/alphavector/strengths'
import type { ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing, linkButton } from '@/components/onboarding/ui'

const CONF: Record<StrengthScore['confidence'], string> = {
  high: 'Confirmed across 3+ projects', medium: 'Seen in 2 projects', low: 'Seen in 1 project',
}

export function StrengthsStep({ rows, dismissed, onToggleDismiss, onBack }: {
  rows: ProjectRow[]; dismissed: string[]; onToggleDismiss: (id: string) => void; onBack: () => void
}) {
  const all = useMemo(() => computeStrengths(rows), [rows])
  const [tab, setTab] = useState<'all' | 'hard' | 'soft'>('all')
  const shown = all.filter((s) => tab === 'all' || s.kind === tab)
  const kept = all.filter((s) => !dismissed.includes(s.id))

  if (!all.length) {
    return (
      <div className="rounded-[14px] border border-[var(--border-ws)] bg-[var(--surface)] p-6 text-center">
        <p className="text-[15px] font-semibold text-[var(--text-primary)]">No strengths yet</p>
        <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Strengths are calculated from the processes you tick on your projects. Add a project name and tick what you did.</p>
        <button type="button" onClick={onBack} className={cx(linkButton, 'mt-4')}>Back to projects</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Top strengths">
        {kept.slice(0, 3).map((s, i) => (
          <div key={s.id} className="rounded-[14px] border border-[var(--neon-border)] bg-[var(--neon-surface)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--neon)]">Strength {i + 1}</p>
            <p className="mt-1 text-[15px] font-semibold text-[var(--text-primary)]">{s.label}</p>
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">Proof score {Math.round(s.score)} · {CONF[s.confidence]}</p>
          </div>
        ))}
      </section>

      <section aria-labelledby="all-str">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="all-str" className="text-[15px] font-semibold text-[var(--text-primary)]">Everything your projects prove</h2>
          <div role="tablist" aria-label="Filter strengths" className="inline-flex rounded-[10px] border border-[var(--border-ws)] p-0.5">
            {(['all', 'hard', 'soft'] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
                className={cx('rounded-[8px] px-3 py-1 text-[12px] font-semibold capitalize', focusRing, tab === t ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'text-[var(--text-secondary)]')}>
                {t === 'all' ? 'All' : t}
              </button>
            ))}
          </div>
        </div>
        <ul className="mt-3 flex flex-col gap-2">
          {shown.map((s) => {
            const off = dismissed.includes(s.id)
            return (
              <li key={s.id} className={cx('rounded-[12px] border border-[var(--border-ws)] bg-[var(--surface)] p-3.5', off && 'opacity-50')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[var(--text-primary)]">{s.label} <span className="ml-1 rounded-full border border-[var(--border-ws)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">{s.kind}</span></p>
                    <p className="mt-0.5 text-[12px] text-[var(--text-secondary)]">
                      {s.projects} project{s.projects > 1 ? 's' : ''} · {s.industries} industr{s.industries === 1 ? 'y' : 'ies'} · {s.withImpact} with impact · {s.withFeedback} with feedback
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-[18px] font-bold tabular-nums text-[var(--text-primary)]">{Math.round(s.score)}</span>
                    <button type="button" onClick={() => onToggleDismiss(s.id)} aria-pressed={off}
                      className={cx('inline-flex items-center gap-1 rounded-[8px] border border-[var(--border-ws)] px-2 py-1 text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]', focusRing)}>
                      {off ? <><Eye size={12} aria-hidden /> Include</> : <><EyeOff size={12} aria-hidden /> Not really me</>}
                    </button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--surface-dim)]" role="img" aria-label={`Proof score ${Math.round(s.score)} out of 100`}>
                  <div className="h-full rounded-full bg-[var(--neon)]" style={{ width: `${s.score}%` }} />
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <details className="rounded-[12px] border border-[var(--border-ws)] bg-[var(--surface)] p-4 text-[13px] text-[var(--text-secondary)]">
        <summary className={cx('cursor-pointer font-semibold text-[var(--text-primary)]', focusRing)}>How the proof score works</summary>
        <p className="mt-2">
          Each process gets a score out of 100: {Math.round(STRENGTH_WEIGHTS.coverage * 100)}% coverage (how many projects used it, full marks at three),{' '}
          {Math.round(STRENGTH_WEIGHTS.depth * 100)}% depth (how well documented those projects are with impact and feedback), and{' '}
          {Math.round(STRENGTH_WEIGHTS.breadth * 100)}% breadth (how many industries you applied it in, full marks at three). It measures how well your history proves a strength, not how good you are. Mark anything that doesn&apos;t feel like you as &quot;Not really me&quot; and it is left out of the analysis.
        </p>
      </details>
    </div>
  )
}
