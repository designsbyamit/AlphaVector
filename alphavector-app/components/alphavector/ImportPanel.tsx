'use client'
import { useId, useMemo, useRef, useState } from 'react'
import { AlertCircle, ClipboardPaste, FileSpreadsheet, FileText, Globe, Loader2, Sparkles } from 'lucide-react'
import type { ExtractedCareerData } from '@/types/wingspan'
import { readJson } from '@/lib/safe-json'
import { rowsFromExtracted } from '@/lib/alphavector/importMap'
import { parsePasted, sampleRows } from '@/lib/alphavector/samples'
import type { ProjectRow } from '@/lib/alphavector/types'
import { cx, focusRing } from '@/components/onboarding/ui'
import { field, hint, primary, secondary } from './ui'

export type ImportMode = 'resume' | 'sheet' | 'portfolio' | 'paste' | 'example'

const MODES: Array<{ id: ImportMode; label: string; Icon: typeof FileText }> = [
  { id: 'resume', label: 'Resume', Icon: FileText },
  { id: 'sheet', label: 'Spreadsheet', Icon: FileSpreadsheet },
  { id: 'portfolio', label: 'Portfolio link', Icon: Globe },
  { id: 'paste', label: 'Paste a list', Icon: ClipboardPaste },
  { id: 'example', label: 'See examples', Icon: Sparkles },
]

const FILE_COPY = {
  resume: { help: 'Choose a PDF or Word file. We read it and fill your projects. You check every one afterwards.', accept: '.pdf,.doc,.docx', button: 'Read my resume', reading: 'Reading your resume', source: 'your resume' },
  sheet: { help: 'One project per row, in Excel or CSV. Use our template or your own.', accept: '.xlsx,.xls,.csv', button: 'Read my spreadsheet', reading: 'Reading your spreadsheet', source: 'your spreadsheet' },
} as const

export interface Person { name: string; role: string }

/** Every other way to add projects, in one place: a resume, a spreadsheet, a portfolio link, a pasted list, or examples. */
export function ImportPanel({ initial = 'resume', onRows, onClose }: {
  initial?: ImportMode
  onRows: (rows: ProjectRow[], note: string, person?: Person) => void
  onClose: () => void
}) {
  const [mode, setMode] = useState<ImportMode>(initial)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)
  const id = useId()
  const parsed = useMemo(() => parsePasted(text), [text])

  const read = async () => {
    setBusy(true)
    setError(null)
    const ctl = (abort.current = new AbortController())
    try {
      const form = new FormData()
      if (file && (mode === 'resume' || mode === 'sheet')) form.append('files', file)
      form.append('urls', JSON.stringify(mode === 'portfolio' ? { portfolio: url.trim() } : {}))
      const res = await fetch('/api/extract', { method: 'POST', body: form, signal: ctl.signal })
      const body = await readJson(res)
      if (res.status === 413) throw new Error('That file is too large. Try one under 4 MB.')
      if (!res.ok) throw new Error(body?.error || 'We could not read that.')
      const result = rowsFromExtracted(body as ExtractedCareerData)
      if (result.rows.length === 0) throw new Error('We could not find any projects or roles in that. Try another file, or add them by hand.')
      const source = mode === 'portfolio' ? 'your portfolio' : FILE_COPY[mode as 'resume' | 'sheet'].source
      onRows(result.rows, `Added ${result.rows.length} ${result.rows.length === 1 ? 'project' : 'projects'} from ${source}${result.fromRoles ? ` (${result.fromRoles} from your roles)` : ''}. Check each one and fix anything that is off.`, result.person)
    } catch (e) {
      if (ctl.signal.aborted) return
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const fileMode = mode === 'resume' || mode === 'sheet'
  const ready = fileMode ? !!file : mode === 'portfolio' ? /^https?:\/\/\S+\.\S+/i.test(url.trim()) : false

  return (
    <section aria-label="Add projects another way" className="av-rise rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">Add projects another way</h2>
        <button type="button" onClick={() => { abort.current?.abort(); onClose() }} className={cx('text-[14px] text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>Close</button>
      </div>

      <div role="tablist" aria-label="Choose a way" className="mt-4 flex flex-wrap gap-2">
        {MODES.map(({ id: m, label, Icon }) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} disabled={busy}
            onClick={() => { setMode(m); setError(null); setFile(null) }}
            className={cx('inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] font-medium transition-colors', focusRing,
              mode === m ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
                : 'border-[color-mix(in_srgb,var(--text-primary)_26%,transparent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]')}>
            <Icon size={15} aria-hidden />{label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {fileMode && (
          <>
            <p className={hint}>{FILE_COPY[mode as 'resume' | 'sheet'].help}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label htmlFor={`${id}-file`} className={cx(secondary, 'cursor-pointer', 'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--neon)]')}>
                {file ? file.name : 'Choose a file'}
                <input id={`${id}-file`} type="file" accept={FILE_COPY[mode as 'resume' | 'sheet'].accept} disabled={busy} className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null) }} />
              </label>
              {mode === 'sheet' && <a href="/api/template" className="text-[14px] text-[var(--neon)] underline underline-offset-4">Download the template</a>}
            </div>
          </>
        )}
        {mode === 'portfolio' && (
          <>
            <label htmlFor={`${id}-url`} className="mb-1.5 block text-[15px] font-semibold text-[var(--text-primary)]">Your portfolio link</label>
            <input id={`${id}-url`} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-portfolio.com" inputMode="url" disabled={busy} className={cx(field, 'max-w-md')} />
            <p className={`${hint} mt-2`}>We read the projects on the page.</p>
          </>
        )}
        {mode === 'paste' && (
          <>
            <label htmlFor={`${id}-paste`} className="mb-1.5 block text-[15px] font-semibold text-[var(--text-primary)]">Paste your projects</label>
            <textarea id={`${id}-paste`} rows={5} value={text} onChange={(e) => setText(e.target.value)} className={field}
              placeholder={'Campus food app - ran interviews, built a prototype\nBank sign-up redesign\nHospital design system'} />
            <p className={`${hint} mt-2`}>One project per line. Add what you did after a dash if you like. Rows copied from Excel or Sheets work too.</p>
          </>
        )}
        {mode === 'example' && <p className={hint}>Loads three sample projects so you can see what good looks like. Change any of them to make it yours, or clear them.</p>}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {mode === 'paste' ? (
          <button type="button" disabled={!parsed.length} onClick={() => onRows(parsed, `Added ${parsed.length} ${parsed.length === 1 ? 'project' : 'projects'} from your list. Open each one to say more about it.`)} className={primary}>
            {parsed.length ? `Add ${parsed.length} ${parsed.length === 1 ? 'project' : 'projects'}` : 'Add these'}
          </button>
        ) : mode === 'example' ? (
          <button type="button" onClick={() => onRows(sampleRows(), 'These are examples. Change any one to make it yours, or clear them and add your own.')} className={primary}>Load three examples</button>
        ) : (
          <button type="button" disabled={!ready || busy} onClick={read} className={primary}>
            {busy && <Loader2 size={15} aria-hidden className="animate-spin motion-reduce:animate-none" />}
            {busy ? `${FILE_COPY[mode as 'resume' | 'sheet']?.reading ?? 'Reading your portfolio'}…` : mode === 'portfolio' ? 'Read my portfolio' : FILE_COPY[mode as 'resume' | 'sheet'].button}
          </button>
        )}
        {busy && <span className={hint} role="status">This can take up to a minute.</span>}
      </div>

      {error && (
        <p role="alert" className="mt-4 flex items-start gap-2 text-[15px] text-red-400">
          <AlertCircle size={17} aria-hidden className="mt-0.5 shrink-0" />
          <span>{error} You can also type or paste your projects instead.</span>
        </p>
      )}
      {(fileMode || mode === 'portfolio') && <p className={`${hint} mt-5`}>Your file is read to fill your projects. Nothing is saved unless you sign in.</p>}
    </section>
  )
}
