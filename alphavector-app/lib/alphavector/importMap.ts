import type { ExtractedCareerData } from '@/types/wingspan'
import { resolveRow } from './infer'
import { newRow, type ProjectRow } from './types'

// Turns what the resume, spreadsheet or portfolio reader found into table rows, so every way of adding
// projects ends in the same place: rows the person can check and edit.

export interface ImportResult {
  rows: ProjectRow[]
  person: { name: string; role: string }
  /** How many rows came from roles rather than named projects (when a resume has few explicit projects). */
  fromRoles: number
}

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export function rowsFromExtracted(d: Partial<ExtractedCareerData> | null | undefined, max = 12): ImportResult {
  const seen = new Set<string>()
  const rows: ProjectRow[] = []
  let fromRoles = 0

  const push = (r: Partial<ProjectRow>, role = false) => {
    const name = clip(r.name, 90)
    const key = name.toLowerCase()
    if (!name || seen.has(key) || rows.length >= max) return
    seen.add(key)
    rows.push(resolveRow({ ...newRow(), ...r, name }))
    if (role) fromRoles++
  }

  for (const p of d?.projects ?? []) {
    push({ name: p?.name, client: clip(p?.company, 80), industry: clip(p?.industry, 60), did: clip(p?.summary, 400), impact: clip(p?.impact, 200) })
  }
  // Many resumes describe projects inside roles. When there are few named projects, roles fill the gap.
  if (rows.length < 3) {
    for (const t of d?.timeline ?? []) {
      push({ name: t?.role, client: clip(t?.company, 80), did: clip(t?.description, 400) }, true)
    }
  }

  return {
    rows,
    person: { name: clip(d?.candidateName, 80), role: clip(d?.timeline?.[0]?.role, 80) },
    fromRoles,
  }
}
