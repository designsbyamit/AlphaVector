'use client'
import { useId, useState } from 'react'
import { Check, ChevronDown, Frown, Meh, Plus, Scale, Smile, ThumbsDown, ThumbsUp } from 'lucide-react'
import { INDUSTRIES } from '@/lib/alphavector/samples'
import { MIN_PROJECTS } from '@/lib/alphavector/progress'
import { isDescribed, isFilled, type Energy, type Feedback, type ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'
import { ImportPanel, type Person } from './ImportPanel'
import { SkillsArea } from './SkillPills'
import { card, choice, field, hint, label, primary, secondary, textAction } from './ui'

const FEEDBACK: Array<{ v: Exclude<Feedback, ''>; Icon: typeof ThumbsUp; text: string }> = [
  { v: 'Praised', Icon: ThumbsUp, text: 'Praised' },
  { v: 'Mixed', Icon: Scale, text: 'Mixed' },
  { v: 'Critical', Icon: ThumbsDown, text: 'Critical' },
]
const FELT: Array<{ v: Exclude<Energy, ''>; Icon: typeof Smile; text: string }> = [
  { v: 'energising', Icon: Smile, text: 'Loved it' },
  { v: 'neutral', Icon: Meh, text: 'It was fine' },
  { v: 'draining', Icon: Frown, text: 'It drained me' },
]

const skillCount = (r: ProjectRow) => r.hard.length + r.soft.length + r.extra.length

function summary(r: ProjectRow): string {
  if (!isFilled(r) && !r.did.trim()) return 'Not started'
  const parts: string[] = []
  const n = skillCount(r)
  parts.push(n ? `${n} ${n === 1 ? 'skill' : 'skills'}` : 'No skills yet')
  if (r.impact.trim() || r.feedback) parts.push('result added')
  return parts.join(' · ')
}

/**
 * Projects as a list you can scan like a table. One project is open at a time, so there is always one place to focus:
 * the name, what you did, what came of it, how it felt. The rest are one line each.
 */
export function ProjectList({ rows, onPatch, onAdd, onRemove, onAddRows, onClearSamples, onPerson }: {
  rows: ProjectRow[]
  onPatch: (id: string, p: Partial<ProjectRow>) => void
  onAdd: () => string
  onRemove: (id: string) => void
  onAddRows: (r: ProjectRow[]) => void
  onClearSamples: () => void
  onPerson: (p: Person) => void
}) {
  const [openId, setOpenId] = useState<string | null>(() => rows.find((r) => !isDescribed(r))?.id ?? null)
  const [importOpen, setImportOpen] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const listId = useId()
  const hasSample = rows.some((r) => r.sample)

  const addNew = () => { const id = onAdd(); setOpenId(id) }
  const done = (i: number) => {
    const last = i === rows.length - 1
    // Keep going until there are enough projects, then just fold the card away.
    if (last && rows.filter(isDescribed).length < MIN_PROJECTS && rows.length < 12) addNew()
    else setOpenId(null)
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">Your projects</h2>
        {!importOpen && <button type="button" onClick={() => setImportOpen(true)} className={textAction}>Add them another way</button>}
      </div>

      {importOpen && (
        <div className="mt-4">
          <ImportPanel onClose={() => setImportOpen(false)}
            onRows={(incoming, note, person) => {
              onAddRows(incoming)
              if (person) onPerson(person)
              setNotice(note)
              setImportOpen(false)
              setOpenId(null)
            }} />
        </div>
      )}

      {notice && (
        <div role="status" className="av-rise mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--neon-border)] bg-[var(--neon-surface)] px-4 py-3 text-[15px] text-[var(--text-primary)]">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className={textAction}>Got it</button>
        </div>
      )}
      {hasSample && (
        <div className="av-rise mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--neon-border)] bg-[var(--neon-surface)] px-4 py-3 text-[15px] text-[var(--text-primary)]">
          <span>These are examples. Open one and change it to make it yours, or clear them.</span>
          <button type="button" onClick={onClearSamples} className={textAction}>Clear examples</button>
        </div>
      )}

      <datalist id={listId}>{INDUSTRIES.map((i) => <option key={i} value={i} />)}</datalist>

      <ol className="mt-4 flex flex-col gap-3">
        {rows.map((r, i) => {
          const open = openId === r.id
          const described = isDescribed(r)
          const others = rows.filter((o) => o.id !== r.id && isFilled(o))
          return (
            <li key={r.id}>
              {!open ? (
                <button type="button" aria-expanded={false} onClick={() => setOpenId(r.id)}
                  className={cx('flex w-full items-center gap-4 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 text-left transition-colors hover:border-[var(--text-dim)]', focusRing)}>
                  <span aria-hidden className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold',
                    described ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'border border-[var(--text-dim)] text-[var(--text-secondary)]')}>
                    {described ? <Check size={16} strokeWidth={3} className="av-pop" /> : i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cx('block truncate text-[17px] font-semibold', r.name.trim() ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]')}>{r.name.trim() || `Project ${i + 1}`}</span>
                    <span className="block text-[14px] text-[var(--text-muted)]">{summary(r)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1 text-[14px] font-medium text-[var(--text-secondary)]">{described ? 'Edit' : 'Fill in'}<ChevronDown size={16} aria-hidden /></span>
                </button>
              ) : (
                <div className="flex flex-col gap-7 rounded-2xl border border-[var(--neon)] bg-[var(--surface)] p-5 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[var(--neon)]">Project {i + 1}</span>
                    {isFilled(r) || rows.length > 1 ? <button type="button" onClick={() => { onRemove(r.id); setOpenId(null) }} className={cx(textAction, 'hover:!text-red-400')}>Remove</button> : null}
                  </div>

                  <div>
                    <label htmlFor={`${r.id}-name`} className={label}>Project name</label>
                    <input id={`${r.id}-name`} className={field} value={r.name} placeholder="e.g. Campus food app" autoFocus={!r.name}
                      onChange={(e) => onPatch(r.id, { name: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); document.getElementById(`${r.id}-did`)?.focus() } }}
                      onPaste={(e) => {
                        const t = e.clipboardData.getData('text')
                        if (/[\n\t]/.test(t.trim())) { e.preventDefault(); setImportOpen(true) }
                      }} />
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor={`${r.id}-client`} className="mb-1.5 block text-[14px] font-medium text-[var(--text-secondary)]">For whom? <span className="text-[var(--text-muted)]">optional</span></label>
                        <input id={`${r.id}-client`} className={field} value={r.client} placeholder="Client, team or college" onChange={(e) => onPatch(r.id, { client: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor={`${r.id}-industry`} className="mb-1.5 block text-[14px] font-medium text-[var(--text-secondary)]">Industry <span className="text-[var(--text-muted)]">optional</span></label>
                        <input id={`${r.id}-industry`} list={listId} className={field} value={r.industry} placeholder="e.g. Fintech" onChange={(e) => onPatch(r.id, { industry: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${r.id}-did`} className={label}>What did you do?</label>
                    <p className={`${hint} mb-2`}>In plain words. We pick up the skills from what you write.</p>
                    <textarea id={`${r.id}-did`} rows={3} className={cx(field, 'resize-y')} value={r.did}
                      placeholder="e.g. Interviewed 12 students, built a prototype in Figma and presented it to the head"
                      onChange={(e) => onPatch(r.id, { did: e.target.value })} />
                    <div className="mt-5"><SkillsArea row={r} others={others} onPatch={(p) => onPatch(r.id, p)} /></div>
                  </div>

                  <div>
                    <label htmlFor={`${r.id}-impact`} className={label}>What came of it? <span className="font-normal text-[var(--text-muted)]">optional</span></label>
                    <p className={`${hint} mb-2`}>A number or a result helps most.</p>
                    <input id={`${r.id}-impact`} className={field} value={r.impact} placeholder="e.g. Queue time fell by a third" onChange={(e) => onPatch(r.id, { impact: e.target.value })} />
                    <div role="radiogroup" aria-label="What people said" className="mt-4 flex flex-wrap items-center gap-2">
                      <span className="mr-1 text-[14px] text-[var(--text-secondary)]">What people said</span>
                      {FEEDBACK.map(({ v, Icon, text }) => (
                        <button key={v} type="button" role="radio" aria-checked={r.feedback === v} onClick={() => onPatch(r.id, { feedback: r.feedback === v ? '' : v })} className={choice(r.feedback === v)}>
                          <Icon size={15} aria-hidden />{text}
                        </button>
                      ))}
                    </div>
                  </div>

                  <fieldset>
                    <legend className={label}>How did it feel? <span className="font-normal text-[var(--text-muted)]">optional</span></legend>
                    <div role="radiogroup" aria-label="How it felt" className="mt-2 grid gap-2.5 sm:grid-cols-3">
                      {FELT.map(({ v, Icon, text }) => (
                        <button key={v} type="button" role="radio" aria-checked={r.energy === v} onClick={() => onPatch(r.id, { energy: r.energy === v ? '' : v })} className={card(r.energy === v)}>
                          <span className="flex items-center gap-2.5 text-[16px] font-semibold text-[var(--text-primary)]"><Icon size={20} aria-hidden className={r.energy === v ? 'text-[var(--neon)]' : 'text-[var(--text-muted)]'} />{text}</span>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-dim)] pt-5">
                    <p className={hint}>{described ? 'This one counts.' : 'Add a name and a line about what you did.'}</p>
                    <button type="button" onClick={() => done(i)} className={primary}>Done</button>
                  </div>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <button type="button" onClick={addNew} className={cx(secondary, 'mt-4 w-full sm:w-auto')}><Plus size={16} aria-hidden />Add another project</button>
    </div>
  )
}
