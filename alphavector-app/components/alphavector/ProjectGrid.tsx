'use client'
import { Fragment, useId, useMemo, useState } from 'react'
import { Check, ClipboardPaste, FileSpreadsheet, FileText, Frown, Globe, Meh, Plus, Search, Smile, Sparkles, ThumbsDown, ThumbsUp, Scale, Upload, X } from 'lucide-react'
import { HARD_PROCESSES, SOFT_PROCESSES, labelOf, shortOf } from '@/lib/alphavector/catalog'
import { toggleProcess } from '@/lib/alphavector/infer'
import { acceptSuggestion, addCustom, extraLabel, removeExtra, skipSuggestions, suggestionsFor } from '@/lib/alphavector/suggest'
import { INDUSTRIES, parsePasted, sampleRows } from '@/lib/alphavector/samples'
import { isBlank, isDescribed, isFilled, type Energy, type Feedback, type ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing, quietButton } from '@/components/onboarding/ui'
import { ImportPanel, type ImportMode } from './ImportPanel'

const cell = cx(
  'w-full rounded-lg bg-transparent px-2.5 py-2 text-[15px] leading-snug text-[var(--text-primary)]',
  'placeholder:text-[var(--text-dim)] hover:bg-[var(--surface-dim)] focus:bg-[var(--surface-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]',
)
const head = 'px-3 pb-3 pt-4 text-left text-[13px] font-semibold text-[var(--text-secondary)]'
const mobileLabel = 'mb-1 block text-[12px] font-semibold text-[var(--text-muted)] md:hidden'

const FEEDBACK: Array<{ v: Exclude<Feedback, ''>; Icon: typeof ThumbsUp; hint: string }> = [
  { v: 'Praised', Icon: ThumbsUp, hint: 'People were happy with it' },
  { v: 'Mixed', Icon: Scale, hint: 'Some liked it, some did not' },
  { v: 'Critical', Icon: ThumbsDown, hint: 'People were critical' },
]
const FELT: Array<{ v: Exclude<Energy, ''>; Icon: typeof Smile; label: string }> = [
  { v: 'energising', Icon: Smile, label: 'Loved doing it' },
  { v: 'neutral', Icon: Meh, label: 'It was fine' },
  { v: 'draining', Icon: Frown, label: 'It drained me' },
]

function ProcessPicker({ row, onToggle, onAddCustom, onClose }: { row: ProjectRow; onToggle: (id: string) => void; onAddCustom: (label: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [own, setOwn] = useState('')
  const id = useId()
  const match = (l: string) => l.toLowerCase().includes(q.trim().toLowerCase())
  const picked = new Set([...row.hard, ...row.soft])
  const group = (title: string, list: typeof HARD_PROCESSES) => (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[13px] font-semibold text-[var(--text-secondary)]">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {list.filter((p) => match(p.label)).map((p) => {
          const on = picked.has(p.id)
          return (
            <label key={p.id} className={cx('flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-[13px] transition-colors',
              on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]' : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)]',
              'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--neon)]')}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(p.id)} />
              {on && <Check size={12} aria-hidden className="text-[var(--neon)]" />}
              {p.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
  return (
    <div className="av-rise rounded-xl border border-[var(--border-ws)] bg-[var(--surface-dim)] p-4">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={id} className="relative block w-full max-w-xs">
          <Search size={14} aria-hidden className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills" className={cx(cell, 'border border-[var(--border-ws)] pl-9')} />
        </label>
        <button type="button" onClick={onClose} className={cx(quietButton, '!px-3 !py-1.5 !text-[13px]')}>Done</button>
      </div>
      <p className="mt-3 text-[13px] text-[var(--text-muted)]">We pick these up from what you write. Add or remove anything we missed.</p>
      <div className="mt-4 grid gap-5 lg:grid-cols-2">
        {group('Craft skills', HARD_PROCESSES)}
        {group('Working with people', SOFT_PROCESSES)}
      </div>
      <form className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--border-dim)] pt-4"
        onSubmit={(e) => { e.preventDefault(); if (own.trim()) { onAddCustom(own); setOwn('') } }}>
        <label className="text-[13px] font-semibold text-[var(--text-secondary)]" htmlFor={`${id}-own`}>Something we missed?</label>
        <input id={`${id}-own`} value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Type a skill" maxLength={40} className={cx(cell, 'max-w-[16rem] border border-[var(--border-ws)]')} />
        <button type="submit" disabled={own.trim().length < 2} className={cx(quietButton, '!px-3 !py-1.5 !text-[13px] disabled:opacity-40')}>Add</button>
      </form>
    </div>
  )
}

/** The pills that keep offering the next most relevant skill. Standard skills first, suggestive ones once those are covered. */
function SuggestionPills({ row, others, onPatch, onOpenAll, allOpen }: {
  row: ProjectRow; others: ProjectRow[]; onPatch: (p: Partial<ProjectRow>) => void; onOpenAll: () => void; allOpen: boolean
}) {
  const sug = suggestionsFor(row, others)
  const extra = sug.tier === 'extra'
  return (
    <div className="mt-2 px-1">
      {sug.items.length > 0 && (
        <>
          <p className="mb-1.5 text-[12px] text-[var(--text-muted)]">{extra ? 'Other things people do' : 'Tap anything you also did'}</p>
          <div className="flex flex-wrap gap-1.5">
            {sug.items.map((s) => (
              <span key={s.id} className={cx('av-rise inline-flex items-center rounded-full border text-[13px] md:text-[12px]',
                extra ? 'border-dashed border-[var(--neon-border)]' : 'border-[var(--border-ws)]')}>
                <button type="button" onClick={() => onPatch(acceptSuggestion(row, s))} aria-label={`Add skill: ${s.full ?? s.label}`} title={s.full ?? s.label}
                  className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-l-full py-1.5 pl-2.5 pr-1.5 text-[var(--text-secondary)] hover:bg-[var(--neon-surface)] hover:text-[var(--text-primary)] md:py-1', focusRing)}>
                  {extra ? <Sparkles size={11} aria-hidden className="text-[var(--neon)]" /> : <Plus size={11} aria-hidden className="text-[var(--neon)]" />}
                  {s.label}
                </button>
                <button type="button" onClick={() => onPatch(skipSuggestions(row, [s.id]))} aria-label={`Skip: ${s.full ?? s.label}`} title="Not this one"
                  className={cx('rounded-r-full px-1.5 py-1.5 text-[var(--text-dim)] hover:text-red-400 md:py-1', focusRing)}><X size={11} aria-hidden /></button>
              </span>
            ))}
          </div>
        </>
      )}
      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-muted)]">
        {sug.items.length > 0 && (
          <button type="button" onClick={() => onPatch(skipSuggestions(row, sug.items.map((i) => i.id)))}
            className={cx('underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>None of these</button>
        )}
        <button type="button" aria-expanded={allOpen} onClick={onOpenAll} className={cx('underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>
          Search all or type your own
        </button>
      </div>
    </div>
  )
}

/** Selected skills as chips, then the pills offering the next ones. Shared by the desktop strip and the mobile card. */
function SkillsArea({ row: r, others, onPatch, onOpenAll, allOpen }: {
  row: ProjectRow; others: ProjectRow[]; onPatch: (p: Partial<ProjectRow>) => void; onOpenAll: () => void; allOpen: boolean
}) {
  const chips = [...r.hard, ...r.soft]
  return (
    <>
      {(chips.length > 0 || r.extra.length > 0) && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 px-1">
          {chips.map((id) => (
            <button key={id} type="button" onClick={() => onPatch(toggleProcess(r, id))} aria-label={`Remove skill: ${labelOf(id)}`} title={labelOf(id)}
              className={cx('group av-rise inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--neon-border)] bg-[var(--neon-surface)] py-0.5 pl-2.5 pr-1.5 text-[12px] text-[var(--text-primary)] hover:border-red-400/60', focusRing)}>
              <span aria-hidden className={cx('h-1.5 w-1.5 rounded-full', r.hard.includes(id) ? 'bg-teal-400' : 'bg-pink-400')} />
              {shortOf(id)}
              <X size={11} aria-hidden className="opacity-40 group-hover:opacity-100" />
            </button>
          ))}
          {r.extra.map((id) => (
            <button key={id} type="button" onClick={() => onPatch(removeExtra(r, id))} aria-label={`Remove skill: ${extraLabel(id)}`}
              className={cx('group av-rise inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--neon-border)] bg-[var(--neon-surface)] py-0.5 pl-2.5 pr-1.5 text-[12px] text-[var(--text-primary)] hover:border-red-400/60', focusRing)}>
              <Sparkles size={10} aria-hidden className="text-[var(--neon)]" />
              {extraLabel(id)}
              <X size={11} aria-hidden className="opacity-40 group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
      <SuggestionPills row={r} others={others} onPatch={onPatch} allOpen={allOpen} onOpenAll={onOpenAll} />
    </>
  )
}

export function ProjectGrid({ rows, onPatch, onAdd, onRemove, onAddRows, onClearSamples, onPerson }: {
  rows: ProjectRow[]
  onPatch: (id: string, p: Partial<ProjectRow>) => void
  onAdd: () => string
  onRemove: (id: string) => void
  onAddRows: (r: ProjectRow[]) => void
  onClearSamples: () => void
  /** Name and latest role found by an import, used to fill the intro if it is still blank. */
  onPerson: (p: { name: string; role: string }) => void
}) {
  const [picker, setPicker] = useState<string | null>(null)
  const [notes, setNotes] = useState<Set<string>>(new Set())
  const [focusId, setFocusId] = useState<string | null>(null)
  const [pasteOpen, setPasteOpen] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [importMode, setImportMode] = useState<ImportMode | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const listId = useId()
  const empty = rows.every(isBlank)
  const hasSample = rows.some((r) => r.sample)
  const last = rows[rows.length - 1]?.id
  const parsed = useMemo(() => parsePasted(pasteText), [pasteText])

  const addNext = () => setFocusId(onAdd())
  const onEnter = (r: ProjectRow) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && r.id === last && isFilled(r)) { e.preventDefault(); addNext() }
  }
  const importPasted = (text: string) => {
    const incoming = parsePasted(text)
    if (incoming.length) onAddRows(incoming)
  }

  return (
    <section aria-labelledby="grid-h">
      <h2 id="grid-h" className="sr-only">Your projects</h2>

      {empty && !pasteOpen && !importMode && (
        <div className="av-rise mb-6 grid gap-3 sm:grid-cols-2">
          {[
            { Icon: Upload, title: 'Import from a file', body: 'A resume, a project spreadsheet or a portfolio link. You check the rows after.', go: () => setImportMode('resume') },
            { Icon: Sparkles, title: 'See an example', body: 'Three sample projects to show what good looks like.', go: () => onAddRows(sampleRows()) },
            { Icon: ClipboardPaste, title: 'Paste a list', body: 'One project per line, or rows copied from Excel or Sheets.', go: () => setPasteOpen(true) },
            { Icon: Plus, title: 'Start typing', body: 'Just fill in the first row below. Rough is fine.', go: () => setFocusId(rows[0].id) },
          ].map(({ Icon, title, body, go }) => (
            <button key={title} type="button" onClick={go}
              className={cx('rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 text-left transition-colors hover:border-[var(--neon)]', focusRing)}>
              <Icon size={18} aria-hidden className="text-[var(--neon)]" />
              <span className="mt-2 block text-[15px] font-semibold text-[var(--text-primary)]">{title}</span>
              <span className="mt-0.5 block text-[13px] leading-snug text-[var(--text-secondary)]">{body}</span>
            </button>
          ))}
        </div>
      )}

      {pasteOpen && (
        <div className="av-rise mb-6 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4">
          <label className="block text-[15px] font-semibold text-[var(--text-primary)]" htmlFor="paste-box">Paste your projects</label>
          <p className="mt-1 text-[13px] text-[var(--text-secondary)]">One per line. Add what you did after a dash if you like: &ldquo;Campus app - ran interviews, built a prototype&rdquo;.</p>
          <textarea id="paste-box" rows={5} value={pasteText} onChange={(e) => setPasteText(e.target.value)} className={cx(cell, 'mt-3 border border-[var(--border-ws)]')} placeholder={'Campus food app - ran interviews, built a prototype\nBank sign-up redesign\nHospital design system'} />
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[13px] text-[var(--text-muted)]">{parsed.length ? `${parsed.length} ${parsed.length === 1 ? 'project' : 'projects'} found` : 'Nothing yet'}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setPasteOpen(false); setPasteText('') }} className={cx(quietButton, '!px-3 !py-1.5 !text-[13px]')}>Cancel</button>
              <button type="button" disabled={!parsed.length} onClick={() => { importPasted(pasteText); setPasteOpen(false); setPasteText('') }}
                className={cx('rounded-lg bg-[var(--neon)] px-4 py-1.5 text-[13px] font-bold text-[#0a0a0a] disabled:opacity-40', focusRing)}>Make rows</button>
            </div>
          </div>
        </div>
      )}

      {!empty && !importMode && !pasteOpen && (
        <p className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 px-1 text-[13px] text-[var(--text-muted)]">
          <span>Add faster from</span>
          {([['resume', 'a resume', FileText], ['sheet', 'a spreadsheet', FileSpreadsheet], ['portfolio', 'a portfolio link', Globe]] as const).map(([m, label, Icon]) => (
            <button key={m} type="button" onClick={() => setImportMode(m)} className={cx('inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>
              <Icon size={13} aria-hidden />{label}
            </button>
          ))}
          <button type="button" onClick={() => setPasteOpen(true)} className={cx('inline-flex items-center gap-1.5 font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>
            <ClipboardPaste size={13} aria-hidden />a pasted list
          </button>
        </p>
      )}

      {importMode && (
        <ImportPanel key={importMode} initial={importMode} onClose={() => setImportMode(null)}
          onImported={(r, source) => {
            onAddRows(r.rows)
            onPerson(r.person)
            const n = r.rows.length
            setNotice(`Added ${n} ${n === 1 ? 'row' : 'rows'} from ${source}${r.fromRoles ? ` (${r.fromRoles} from your roles)` : ''}. Check them and fix anything that is off.`)
            setImportMode(null)
          }} />
      )}

      {notice && (
        <div role="status" className="av-rise mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--neon-border)] bg-[var(--neon-surface)] px-4 py-3 text-[14px] text-[var(--text-primary)]">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice(null)} className={cx('font-semibold underline underline-offset-4', focusRing)}>Got it</button>
        </div>
      )}

      {hasSample && (
        <div className="av-rise mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--neon-border)] bg-[var(--neon-surface)] px-4 py-3 text-[14px] text-[var(--text-primary)]">
          <span>These are examples. Change any row to make it yours, or clear them and add your own.</span>
          <button type="button" onClick={onClearSamples} className={cx('font-semibold underline underline-offset-4', focusRing)}>Clear examples</button>
        </div>
      )}

      <datalist id={listId}>{INDUSTRIES.map((i) => <option key={i} value={i} />)}</datalist>

      <div className="rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)]">
        <table className="block w-full border-collapse md:table">
          <caption className="sr-only">Your projects: one row each. Skills are picked up from what you write.</caption>
          <thead className="hidden md:table-header-group">
            <tr className="border-b border-[var(--border-dim)]">
              <th scope="col" className={cx(head, 'w-[34%]')}>The project</th>
              <th scope="col" className={cx(head, 'w-[29%]')}>What you did</th>
              <th scope="col" className={cx(head, 'w-[25%]')}>What came of it</th>
              <th scope="col" className={cx(head, 'w-[12%]')}>How it felt</th>
            </tr>
          </thead>
          <tbody className="block md:table-row-group">
            {rows.map((r, i) => {
              const done = isDescribed(r)
              const noteOpen = notes.has(r.id) || r.remarks.trim().length > 0
              return (
                <Fragment key={r.id}>
                  <tr className="relative block border-b border-[var(--border-dim)] p-4 md:table-row md:border-b-0 md:p-0">
                    {/* Project */}
                    <td className="block md:table-cell md:px-3 md:py-3 md:align-top">
                      <span className={mobileLabel}>The project</span>
                      <div className="flex items-start gap-2">
                        <span aria-hidden className={cx('mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold',
                          done ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'border border-[var(--border-ws)] text-[var(--text-muted)]')}>
                          {done ? <Check key="c" size={13} strokeWidth={3} className="av-pop" /> : i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="group/name relative">
                            <input aria-label={`Project ${i + 1} name`} className={cx(cell, 'pr-8 font-semibold')} placeholder={i === 0 ? 'Name it, e.g. Campus food app' : 'Another project'}
                            value={r.name} autoFocus={focusId === r.id} onChange={(e) => onPatch(r.id, { name: e.target.value })} onKeyDown={onEnter(r)}
                            onPaste={(e) => {
                              const t = e.clipboardData.getData('text')
                              if (/[\n\t]/.test(t.trim())) { e.preventDefault(); importPasted(t) }
                            }} />
                            <button type="button" onClick={() => onRemove(r.id)} aria-label={`Remove project ${i + 1}`}
                              className={cx('absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-[var(--text-muted)] opacity-60 hover:text-red-400 hover:opacity-100 md:opacity-0 md:group-hover/name:opacity-100 md:focus:opacity-100', focusRing)}><X size={15} aria-hidden /></button>
                          </div>
                          <div className="mt-1 grid grid-cols-1 gap-1 xl:grid-cols-2">
                            <input aria-label={`Project ${i + 1} client`} className={cx(cell, '!text-[13px] !text-[var(--text-secondary)]')} placeholder="For whom?" value={r.client} onChange={(e) => onPatch(r.id, { client: e.target.value })} />
                            <input aria-label={`Project ${i + 1} industry`} list={listId} className={cx(cell, '!text-[13px] !text-[var(--text-secondary)]')} placeholder="Industry" value={r.industry} onChange={(e) => onPatch(r.id, { industry: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* What you did, with inferred skills */}
                    <td className="mt-3 block md:table-cell md:px-3 md:py-3 md:align-top">
                      <span className={mobileLabel}>What you did</span>
                      <textarea aria-label={`Project ${i + 1}: what you did`} rows={3} className={cx(cell, 'resize-none')}
                        placeholder={i === 0 ? 'e.g. interviewed 12 students, built a prototype, presented it' : 'In a sentence or two'}
                        value={r.did} onChange={(e) => onPatch(r.id, { did: e.target.value })} />
                      <div className="md:hidden">
                        <SkillsArea row={r} others={rows.filter((o) => o.id !== r.id && isFilled(o))} onPatch={(p) => onPatch(r.id, p)}
                          allOpen={picker === r.id} onOpenAll={() => setPicker(picker === r.id ? null : r.id)} />
                      </div>
                    </td>

                    {/* Result */}
                    <td className="mt-3 block md:table-cell md:px-3 md:py-3 md:align-top">
                      <span className={mobileLabel}>What came of it</span>
                      <input aria-label={`Project ${i + 1}: what came of it`} className={cx(cell)} placeholder="What changed? A number helps" value={r.impact}
                        onChange={(e) => onPatch(r.id, { impact: e.target.value })} onKeyDown={onEnter(r)} />
                      <div role="radiogroup" aria-label={`Project ${i + 1}: what people said`} className="mt-1.5 flex flex-wrap items-center gap-1 px-1">
                        {FEEDBACK.map(({ v, Icon, hint }) => (
                          <button key={v} type="button" role="radio" aria-checked={r.feedback === v} title={hint}
                            onClick={() => onPatch(r.id, { feedback: r.feedback === v ? '' : v })}
                            className={cx('inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px] transition-colors', focusRing,
                              r.feedback === v ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]' : 'border-[var(--border-ws)] text-[var(--text-muted)] hover:text-[var(--text-primary)]')}>
                            <Icon size={12} aria-hidden />{v}
                          </button>
                        ))}
                        {!noteOpen && (
                          <button type="button" onClick={() => setNotes(new Set(notes).add(r.id))} className={cx('ml-1 text-[12px] text-[var(--text-muted)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>Add a note</button>
                        )}
                      </div>
                      {noteOpen && (
                        <input aria-label={`Project ${i + 1}: note`} className={cx(cell, 'mt-1 !text-[13px]')} placeholder="Anything else worth knowing" value={r.remarks} onChange={(e) => onPatch(r.id, { remarks: e.target.value })} />
                      )}
                    </td>

                    {/* Felt */}
                    <td className="mt-3 block md:table-cell md:px-3 md:py-3 md:align-top">
                      <span className={mobileLabel}>How it felt</span>
                      <div role="radiogroup" aria-label={`Project ${i + 1}: how it felt`} className="flex items-center gap-1 pt-1">
                        {FELT.map(({ v, Icon, label }) => (
                          <button key={v} type="button" role="radio" aria-checked={r.energy === v} aria-label={label} title={label}
                            onClick={() => onPatch(r.id, { energy: r.energy === v ? '' : v })}
                            className={cx('flex h-9 w-9 items-center justify-center rounded-full border transition-colors', focusRing,
                              r.energy === v ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--neon)]' : 'border-transparent text-[var(--text-dim)] hover:bg-[var(--surface-dim)] hover:text-[var(--text-primary)]')}>
                            <Icon size={20} aria-hidden />
                          </button>
                        ))}
                      </div>
                    </td>

                  </tr>
                  <tr className={cx('hidden border-b border-[var(--border-dim)] md:table-row', picker === r.id && 'border-b-0')}>
                    <td colSpan={4} className="px-3 pb-4 md:pl-[36%]">
                      <SkillsArea row={r} others={rows.filter((o) => o.id !== r.id && isFilled(o))} onPatch={(p) => onPatch(r.id, p)}
                        allOpen={picker === r.id} onOpenAll={() => setPicker(picker === r.id ? null : r.id)} />
                    </td>
                  </tr>
                  {picker === r.id && (
                    <tr className="block border-b border-[var(--border-dim)] px-4 pb-4 md:table-row md:px-0">
                      <td colSpan={4} className="block md:table-cell md:px-3 md:pb-4">
                        <ProcessPicker row={r} onToggle={(id) => onPatch(r.id, toggleProcess(r, id))} onAddCustom={(label) => onPatch(r.id, addCustom(r, label))} onClose={() => setPicker(null)} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <button type="button" onClick={addNext} className={cx('inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[14px] font-semibold text-[var(--neon)] hover:bg-[var(--neon-surface)]', focusRing)}>
            <Plus size={16} aria-hidden /> Add another project
          </button>
          <span className="hidden text-[13px] text-[var(--text-muted)] md:inline">Press Enter in the last row to start the next one</span>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-4 px-1 text-[12px] text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-teal-400" aria-hidden />craft skill</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-pink-400" aria-hidden />working with people</span>
      </p>
    </section>
  )
}
