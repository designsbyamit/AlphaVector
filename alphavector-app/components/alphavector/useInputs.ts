'use client'
import { useCallback, useEffect, useState } from 'react'
import { emptyInputs, newRow, type Inputs, type ProjectRow } from '@/lib/alphavector/types'

const KEY = 'alphavector-inputs-v1'

function load(): Inputs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyInputs()
    const p = JSON.parse(raw) as Partial<Inputs>
    const base = emptyInputs()
    return {
      about: { ...base.about, ...(p.about ?? {}) },
      rows: Array.isArray(p.rows) && p.rows.length ? p.rows.map((r) => ({ ...newRow(), ...r })) : base.rows,
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

  const patchRow = useCallback((id: string, patch: Partial<ProjectRow>) =>
    setInputs((s) => ({ ...s, rows: s.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) })), [])
  const addRow = useCallback((): string => {
    const r = newRow()
    setInputs((s) => ({ ...s, rows: [...s.rows, r] }))
    return r.id
  }, [])
  const removeRow = useCallback((id: string) =>
    setInputs((s) => { const rows = s.rows.filter((r) => r.id !== id); return { ...s, rows: rows.length ? rows : [newRow()] } }), [])
  const clear = useCallback(() => setInputs(emptyInputs()), [])
  return { inputs, setInputs, patchRow, addRow, removeRow, clear }
}
