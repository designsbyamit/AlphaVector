'use client'
import { useId, useRef, useState } from 'react'
import { AlertCircle, FileSpreadsheet, FileText, Globe, Loader2 } from 'lucide-react'
import type { ExtractedCareerData } from '@/types/wingspan'
import { readJson } from '@/lib/safe-json'
import { rowsFromExtracted, type ImportResult } from '@/lib/alphavector/importMap'
import { cx, focusRing, quietButton } from '@/components/onboarding/ui'

export type ImportMode = 'resume' | 'sheet' | 'portfolio'

const MODES: Array<{ id: ImportMode; label: string; Icon: typeof FileText }> = [
  { id: 'resume', label: 'Resume', Icon: FileText },
  { id: 'sheet', label: 'Spreadsheet', Icon: FileSpreadsheet },
  { id: 'portfolio', label: 'Portfolio link', Icon: Globe },
]

const COPY: Record<ImportMode, { help: string; accept?: string; button: string; reading: string }> = {
  resume: { help: 'A PDF or Word file. We read it and fill the table. You check every row afterwards.', accept: '.pdf,.doc,.docx', button: 'Read my resume', reading: 'Reading your resume' },
  sheet: { help: 'One project per row, in Excel or CSV. Use our template or your own.', accept: '.xlsx,.xls,.csv', button: 'Read my spreadsheet', reading: 'Reading your spreadsheet' },
  portfolio: { help: 'Link to your portfolio site. We read the projects on it.', button: 'Read my portfolio', reading: 'Reading your portfolio' },
}

/** Brings WingSpan's other ways in (resume, project spreadsheet, portfolio link) into the table. Same reader, same rows to check. */
export function ImportPanel({ initial = 'resume', onImported, onClose }: {
  initial?: ImportMode
  onImported: (r: ImportResult, source: string) => void
  onClose: () => void
}) {
  const [mode, setMode] = useState<ImportMode>(initial)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abort = useRef<AbortController | null>(null)
  const id = useId()
  const c = COPY[mode]
  const ready = mode === 'portfolio' ? /^https?:\/\/\S+\.\S+/i.test(url.trim()) : !!file

  const run = async () => {
    setBusy(true)
    setError(null)
    const ctl = (abort.current = new AbortController())
    try {
      const form = new FormData()
      if (file && mode !== 'portfolio') form.append('files', file)
      form.append('urls', JSON.stringify(mode === 'portfolio' ? { portfolio: url.trim() } : {}))
      const res = await fetch('/api/extract', { method: 'POST', body: form, signal: ctl.signal })
      const body = await readJson(res)
      if (res.status === 413) throw new Error('That file is too large. Try one under 4 MB.')
      if (!res.ok) throw new Error(body?.error || 'We could not read that.')
      const result = rowsFromExtracted(body as ExtractedCareerData)
      if (result.rows.length === 0) throw new Error('We could not find any projects or roles in that. Try another file, or add them by hand.')
      onImported(result, mode === 'portfolio' ? 'your portfolio' : mode === 'sheet' ? 'your spreadsheet' : 'your resume')
    } catch (e) {
      if (ctl.signal.aborted) return
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="av-rise mb-6 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 sm:p-5">
      <div role="tablist" aria-label="What to read" className="inline-flex flex-wrap gap-1 rounded-xl border border-[var(--border-ws)] p-1">
        {MODES.map(({ id: m, label, Icon }) => (
          <button key={m} type="button" role="tab" aria-selected={mode === m} disabled={busy}
            onClick={() => { setMode(m); setError(null); setFile(null) }}
            className={cx('inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[14px] font-medium', focusRing,
              mode === m ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]')}>
            <Icon size={14} aria-hidden />{label}
          </button>
        ))}
      </div>

      <p className="mt-4 text-[14px] text-[var(--text-secondary)]">{c.help}</p>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {mode === 'portfolio' ? (
          <input aria-label="Portfolio link" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://your-portfolio.com" inputMode="url" disabled={busy}
            className={cx('w-full max-w-md rounded-lg border border-[var(--border-ws)] bg-transparent px-3 py-2 text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--neon)]')} />
        ) : (
          <>
            <label htmlFor={`${id}-file`} className={cx('cursor-pointer rounded-lg border border-dashed border-[var(--text-dim)] px-4 py-2 text-[14px] text-[var(--text-primary)] hover:border-[var(--neon)]', 'focus-within:outline focus-within:outline-2 focus-within:outline-[var(--neon)]')}>
              {file ? file.name : 'Choose a file'}
              <input id={`${id}-file`} type="file" accept={c.accept} disabled={busy} className="sr-only" onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null) }} />
            </label>
            {mode === 'sheet' && (
              <a href="/api/template" className={cx('text-[13px] text-[var(--neon)] underline underline-offset-4', focusRing)}>Download the template</a>
            )}
          </>
        )}
        <button type="button" disabled={!ready || busy} onClick={run}
          className={cx('inline-flex items-center gap-2 rounded-lg bg-[var(--neon)] px-4 py-2 text-[14px] font-bold text-[#0a0a0a] disabled:opacity-40', focusRing)}>
          {busy && <Loader2 size={14} aria-hidden className="animate-spin motion-reduce:animate-none" />}
          {busy ? `${c.reading}…` : c.button}
        </button>
        <button type="button" onClick={() => { abort.current?.abort(); onClose() }} className={cx(quietButton, '!px-3 !py-2 !text-[13px]')}>Cancel</button>
      </div>

      {busy && <p className="mt-3 text-[13px] text-[var(--text-muted)]" role="status">This can take up to a minute.</p>}
      {error && (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[14px] text-red-400">
          <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0" />
          <span>{error} You can also type or paste your projects instead.</span>
        </p>
      )}
      <p className="mt-4 text-[12px] text-[var(--text-muted)]">Your file is read to fill this table. Nothing is saved unless you sign in.</p>
    </div>
  )
}
