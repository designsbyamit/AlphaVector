'use client'
import { useCallback, useEffect, useState } from 'react'
import { resolveRow } from '@/lib/alphavector/infer'
import { emptyInputs, isBlank, newRow, type About, type Inputs, type ProjectRow } from '@/lib/alphavector/types'

const KEY = 'alphavector-inputs-v2'

function load(): Inputs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyInputs()
    const p = JSON.parse(raw) as Partial<Inputs>
    const base = emptyInputs()
    return {
      about: { ...base.about, ...(p.about ?? {}) },
      rows: Array.isArray(p.rows) && p.rows.length ? p.rows.map((r) => resolveRow({ ...newRow(), ...r })) : base.rows,
      dismissed: Array.isArray(p.dismissed) ? p.dismissed : [],
      passions: Array.isArray(p.passions) ? p.passions : [],
      niches: Array.isArray(p.niches) ? p.niches : [],
    }
  } catch { return emptyInputs() }
}

/** The person's entries, kept in this browser so a refresh (or a later recalibration) never starts from zero. */
export function useInputs() {
  const [inputs, setInputs] = useState<Inputs>(load)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(inputs)) } catch { /* storage unavailable */ } }, [inputs])

  /** Edit a row. Editing an example row makes it the person's own. Ticks are re-inferred from what they wrote. */
  const patchRow = useCallback((id: string, patch: Partial<ProjectRow>) =>
    setInputs((s) => ({ ...s, rows: s.rows.map((r) => (r.id === id ? resolveRow({ ...r, sample: false, ...patch }) : r)) })), [])

  const addRow = useCallback((): string => {
    const r = newRow()
    setInputs((s) => ({ ...s, rows: [...s.rows, r] }))
    return r.id
  }, [])

  const removeRow = useCallback((id: string) =>
    setInputs((s) => { const rows = s.rows.filter((r) => r.id !== id); return { ...s, rows: rows.length ? rows : [newRow()] } }), [])

  /** Add several rows at once (paste, examples), replacing any rows that are still completely blank. */
  const addRows = useCallback((incoming: ProjectRow[]) =>
    setInputs((s) => ({ ...s, rows: [...s.rows.filter((r) => !isBlank(r)), ...incoming] })), [])

  const clearSamples = useCallback(() =>
    setInputs((s) => { const rows = s.rows.filter((r) => !r.sample); return { ...s, rows: rows.length ? rows : [newRow()] } }), [])

  const setAbout = useCallback((patch: Partial<About>) => setInputs((s) => ({ ...s, about: { ...s.about, ...patch } })), [])
  const reset = useCallback(() => setInputs(emptyInputs()), [])

  return { inputs, setInputs, patchRow, addRow, removeRow, addRows, clearSamples, setAbout, reset }
}
