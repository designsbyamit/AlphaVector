'use client'
import { Fragment, useState } from 'react'
import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { HARD_PROCESSES, SOFT_PROCESSES, type Process } from '@/lib/alphavector/catalog'
import type { About, ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing, quietButton } from '@/components/onboarding/ui'

const field = cx(
  'w-full rounded-[8px] border border-[var(--border-ws)] bg-[var(--surface)] px-2.5 py-2 text-[13px] text-[var(--text-primary)]',
  'placeholder:text-[var(--text-dim)] hover:border-[var(--text-dim)]', focusRing,
)
const th = 'px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]'

function AboutCard({ about, onChange }: { about: About; onChange: (a: About) => void }) {
  const set = (k: keyof About) => (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...about, [k]: e.target.value })
  const items: Array<[keyof About, string, string, string?]> = [
    ['name', 'Your name', 'Asha Rao'],
    ['currentRole', 'Current role or field', 'Senior Product Designer'],
    ['organisation', 'Where (optional)', 'Company, studio or college'],
    ['years', 'Years of experience', '8', 'number'],
    ['location', 'City (optional)', 'Pune'],
  ]
  return (
    <section aria-labelledby="about-h" className="rounded-[14px] border border-[var(--border-ws)] bg-[var(--surface)] p-4 sm:p-5">
      <h2 id="about-h" className="text-[15px] font-semibold text-[var(--text-primary)]">About you</h2>
      <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Just enough to place your projects on a timeline. Years of experience sets how senior the roles we suggest can be.</p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {items.map(([k, label, ph, type]) => (
          <label key={k} className="flex flex-col gap-1 text-[12px] font-medium text-[var(--text-secondary)]">
            {label}
            <input className={field} placeholder={ph} value={about[k]} onChange={set(k)} type={type ?? 'text'} min={type ? 0 : undefined} max={type ? 50 : undefined} inputMode={type ? 'numeric' : undefined} />
          </label>
        ))}
      </div>
    </section>
  )
}

function Checklist({ title, list, picked, onToggle, name }: { title: string; list: Process[]; picked: string[]; onToggle: (id: string) => void; name: string }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">{title}</legend>
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {list.map((p) => {
          const on = picked.includes(p.id)
          return (
            <label key={p.id} className={cx(
              'flex cursor-pointer items-start gap-2 rounded-[8px] border px-2.5 py-1.5 text-[13px] transition-colors',
              on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]' : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)]',
              'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--neon)]',
            )}>
              <input type="checkbox" className="mt-0.5 accent-[var(--neon)]" checked={on} onChange={() => onToggle(p.id)} aria-label={`${name}: ${p.label}`} />
              <span>{p.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export function ProjectsStep({ about, rows, onAbout, onPatch, onAdd, onRemove }: {
  about: About; rows: ProjectRow[]
  onAbout: (a: About) => void
  onPatch: (id: string, p: Partial<ProjectRow>) => void
  onAdd: () => string
  onRemove: (id: string) => void
}) {
  const [open, setOpen] = useState<string | null>(rows[0]?.id ?? null)
  const toggle = (r: ProjectRow, k: 'hard' | 'soft', id: string) =>
    onPatch(r.id, { [k]: r[k].includes(id) ? r[k].filter((x) => x !== id) : [...r[k], id] } as Partial<ProjectRow>)

  return (
    <div className="flex flex-col gap-6">
      <AboutCard about={about} onChange={onAbout} />

      <section aria-labelledby="proj-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="proj-h" className="text-[15px] font-semibold text-[var(--text-primary)]">Your projects</h2>
            <p className="mt-1 max-w-2xl text-[13px] text-[var(--text-secondary)]">
              One row per project. Tick the processes you personally did, in both columns. The more specific your impact and feedback, the more reliable your strengths. Five or more projects works best.
            </p>
          </div>
          <button type="button" onClick={() => setOpen(onAdd())} className={quietButton}><Plus size={14} aria-hidden /> Add project</button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-[14px] border border-[var(--border-ws)] bg-[var(--surface)]">
          <table className="w-full min-w-[1080px] border-collapse text-[13px]">
            <caption className="sr-only">Project log: one row per project</caption>
            <thead>
              <tr className="border-b border-[var(--border-ws)]">
                <th className={th} scope="col">#</th>
                <th className={th} scope="col">Project name</th>
                <th className={th} scope="col">Client</th>
                <th className={th} scope="col">Industry</th>
                <th className={th} scope="col">Hard-skill processes</th>
                <th className={th} scope="col">Soft-skill processes</th>
                <th className={th} scope="col">Feedback</th>
                <th className={th} scope="col">Impact</th>
                <th className={th} scope="col">Remarks</th>
                <th className={th} scope="col"><span className="sr-only">Remove</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const isOpen = open === r.id
                return (
                  <Fragment key={r.id}>
                    <tr className="border-b border-[var(--border-dim)] align-top">
                      <td className="px-2 py-2 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} name`} placeholder="e.g. Checkout redesign" value={r.name} onChange={(e) => onPatch(r.id, { name: e.target.value })} /></td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} client`} placeholder="Client or team" value={r.client} onChange={(e) => onPatch(r.id, { client: e.target.value })} /></td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} industry`} placeholder="e.g. Fintech" value={r.industry} onChange={(e) => onPatch(r.id, { industry: e.target.value })} /></td>
                      <td className="px-1.5 py-2">
                        <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)} className={cx(quietButton, 'w-full !justify-between !px-2.5 !py-2 !text-[13px]')}>
                          <span>{r.hard.length ? `${r.hard.length} ticked` : 'Tick'}</span><ChevronDown size={14} className={cx('transition-transform', isOpen && 'rotate-180')} aria-hidden />
                        </button>
                      </td>
                      <td className="px-1.5 py-2">
                        <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)} className={cx(quietButton, 'w-full !justify-between !px-2.5 !py-2 !text-[13px]')}>
                          <span>{r.soft.length ? `${r.soft.length} ticked` : 'Tick'}</span><ChevronDown size={14} className={cx('transition-transform', isOpen && 'rotate-180')} aria-hidden />
                        </button>
                      </td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} feedback`} placeholder="What people said" value={r.feedback} onChange={(e) => onPatch(r.id, { feedback: e.target.value })} /></td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} impact`} placeholder="Result, ideally a number" value={r.impact} onChange={(e) => onPatch(r.id, { impact: e.target.value })} /></td>
                      <td className="px-1.5 py-2"><input className={field} aria-label={`Project ${i + 1} remarks`} placeholder="Optional" value={r.remarks} onChange={(e) => onPatch(r.id, { remarks: e.target.value })} /></td>
                      <td className="px-1.5 py-2">
                        <button type="button" onClick={() => onRemove(r.id)} aria-label={`Remove project ${i + 1}`} className={cx('rounded-[8px] p-2 text-[var(--text-muted)] hover:text-red-400', focusRing)}><Trash2 size={15} aria-hidden /></button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-[var(--border-ws)] bg-[var(--surface-dim)]">
                        <td colSpan={10} className="p-0">
                         <div className="sticky left-0 box-border w-[min(100%,calc(100vw-2.5rem))] max-w-[960px] px-4 py-4">
                          <p className="mb-3 text-[12px] text-[var(--text-secondary)]">Tick what <em>you</em> did on {r.name.trim() ? <strong className="text-[var(--text-primary)]">{r.name.trim()}</strong> : 'this project'}. Not what the team did.</p>
                          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Checklist title="Hard-skill processes" name="Hard" list={HARD_PROCESSES} picked={r.hard} onToggle={(id) => toggle(r, 'hard', id)} />
                            <Checklist title="Soft-skill processes" name="Soft" list={SOFT_PROCESSES} picked={r.soft} onToggle={(id) => toggle(r, 'soft', id)} />
                          </div>
                         </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
