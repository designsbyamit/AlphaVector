'use client'
import { useId, useState } from 'react'
import { Check, Plus, Search, Sparkles, X } from 'lucide-react'
import { HARD_PROCESSES, SOFT_PROCESSES, labelOf, shortOf } from '@/lib/alphavector/catalog'
import { toggleProcess } from '@/lib/alphavector/infer'
import { acceptSuggestion, addCustom, extraLabel, removeExtra, skipSuggestions, suggestionsFor } from '@/lib/alphavector/suggest'
import type { ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'
import { field, hint, secondary, textAction } from './ui'

function ProcessPicker({ row, onToggle, onAddCustom, onClose }: { row: ProjectRow; onToggle: (id: string) => void; onAddCustom: (label: string) => void; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [own, setOwn] = useState('')
  const id = useId()
  const match = (l: string) => l.toLowerCase().includes(q.trim().toLowerCase())
  const picked = new Set([...row.hard, ...row.soft])
  const group = (title: string, list: typeof HARD_PROCESSES) => (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">{title}</legend>
      <div className="flex flex-wrap gap-1.5">
        {list.filter((p) => match(p.label)).map((p) => {
          const on = picked.has(p.id)
          return (
            <label key={p.id} className={cx('flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[14px] transition-colors',
              on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]' : 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:border-[var(--text-dim)]',
              'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--neon)]')}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(p.id)} />
              {on && <Check size={13} aria-hidden className="text-[var(--neon)]" />}
              {p.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
  return (
    <div className="av-rise rounded-2xl border border-[var(--border-ws)] bg-[var(--surface-dim)] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label htmlFor={id} className="relative block w-full max-w-xs">
          <span className="sr-only">Search skills</span>
          <Search size={15} aria-hidden className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills" className={cx(field, '!py-2 pl-10 !text-[15px]')} />
        </label>
        <button type="button" onClick={onClose} className={cx(secondary, '!px-4 !py-2 !text-[14px]')}>Done</button>
      </div>
      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        {group('Craft skills', HARD_PROCESSES)}
        {group('Working with people', SOFT_PROCESSES)}
      </div>
      <form className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--border-dim)] pt-4"
        onSubmit={(e) => { e.preventDefault(); if (own.trim()) { onAddCustom(own); setOwn('') } }}>
        <label className="text-[14px] font-semibold text-[var(--text-primary)]" htmlFor={`${id}-own`}>Something we missed?</label>
        <input id={`${id}-own`} value={own} onChange={(e) => setOwn(e.target.value)} placeholder="Type a skill" maxLength={40} className={cx(field, '!py-2 max-w-[16rem] !text-[15px]')} />
        <button type="submit" disabled={own.trim().length < 2} className={cx(secondary, '!px-4 !py-2 !text-[14px] disabled:opacity-40')}>Add</button>
      </form>
    </div>
  )
}

/** The pills that keep offering the next most relevant skill. Standard skills first, suggestive ones once those are covered. */
function Suggestions({ row, others, onPatch, onOpenAll, allOpen }: {
  row: ProjectRow; others: ProjectRow[]; onPatch: (p: Partial<ProjectRow>) => void; onOpenAll: () => void; allOpen: boolean
}) {
  const sug = suggestionsFor(row, others)
  const extra = sug.tier === 'extra'
  return (
    <div>
      {sug.items.length > 0 && (
        <>
          <p className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">{extra ? 'Other things people do' : 'Tap anything else you did'}</p>
          <div className="flex flex-wrap gap-2">
            {sug.items.map((s) => (
              <span key={s.id} className={cx('av-rise inline-flex items-center rounded-full border text-[14px] border-[color-mix(in_srgb,var(--text-primary)_26%,transparent)]', extra && 'border-dashed')}>
                <button type="button" onClick={() => onPatch(acceptSuggestion(row, s))} aria-label={`Add skill: ${s.full ?? s.label}`} title={s.full ?? s.label}
                  className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-l-full py-2 pl-3 pr-2 text-[var(--text-secondary)] hover:bg-[var(--neon-surface)] hover:text-[var(--text-primary)]', focusRing)}>
                  {extra ? <Sparkles size={13} aria-hidden className="text-[var(--neon)]" /> : <Plus size={13} aria-hidden className="text-[var(--neon)]" />}
                  {s.label}
                </button>
                <button type="button" onClick={() => onPatch(skipSuggestions(row, [s.id]))} aria-label={`Skip: ${s.full ?? s.label}`} title="Not this one"
                  className={cx('rounded-r-full px-2 py-2 text-[var(--text-dim)] hover:text-red-400', focusRing)}><X size={13} aria-hidden /></button>
              </span>
            ))}
          </div>
        </>
      )}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        {sug.items.length > 0 && <button type="button" onClick={() => onPatch(skipSuggestions(row, sug.items.map((i) => i.id)))} className={textAction}>None of these</button>}
        <button type="button" aria-expanded={allOpen} onClick={onOpenAll} className={textAction}>See every skill or type your own</button>
      </div>
    </div>
  )
}

/** What we picked up, then what else to tap. */
export function SkillsArea({ row: r, others, onPatch }: { row: ProjectRow; others: ProjectRow[]; onPatch: (p: Partial<ProjectRow>) => void }) {
  const [open, setOpen] = useState(false)
  const chips = [...r.hard, ...r.soft]
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-[14px] font-semibold text-[var(--text-primary)]">Skills we picked up</p>
        {chips.length + r.extra.length === 0 ? (
          <p className={hint}>None yet. Describe what you did above, or tap some below.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chips.map((id) => (
              <button key={id} type="button" onClick={() => onPatch(toggleProcess(r, id))} aria-label={`Remove skill: ${labelOf(id)}`} title={`${labelOf(id)}. Tap to remove.`}
                className={cx('group av-rise inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--neon-border)] bg-[var(--neon-surface)] py-1.5 pl-3 pr-2 text-[14px] text-[var(--text-primary)] hover:border-red-400/60', focusRing)}>
                <span aria-hidden className={cx('h-2 w-2 rounded-full', r.hard.includes(id) ? 'bg-teal-400' : 'bg-pink-400')} />
                {shortOf(id)}
                <X size={13} aria-hidden className="opacity-40 group-hover:opacity-100" />
              </button>
            ))}
            {r.extra.map((id) => (
              <button key={id} type="button" onClick={() => onPatch(removeExtra(r, id))} aria-label={`Remove skill: ${extraLabel(id)}`} title="Tap to remove"
                className={cx('group av-rise inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--neon-border)] bg-[var(--neon-surface)] py-1.5 pl-3 pr-2 text-[14px] text-[var(--text-primary)] hover:border-red-400/60', focusRing)}>
                <Sparkles size={12} aria-hidden className="text-[var(--neon)]" />
                {extraLabel(id)}
                <X size={13} aria-hidden className="opacity-40 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
        <p className="mt-2 flex items-center gap-4 text-[12px] text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal-400" aria-hidden />craft</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-pink-400" aria-hidden />working with people</span>
        </p>
      </div>
      <Suggestions row={r} others={others} onPatch={onPatch} allOpen={open} onOpenAll={() => setOpen((v) => !v)} />
      {open && <ProcessPicker row={r} onToggle={(id) => onPatch(toggleProcess(r, id))} onAddCustom={(l) => onPatch(addCustom(r, l))} onClose={() => setOpen(false)} />}
    </div>
  )
}
