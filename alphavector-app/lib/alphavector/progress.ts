import { isDescribed, isFilled, type ProjectRow } from './types'

// The evidence meter: a gentle read on how much the project log can prove, with one concrete next step.
// Points: up to 5 named projects (10 each), 5 described (6 each), 5 with a result (4 each) = 100.

export interface Evidence {
  pct: number
  label: 'Just started' | 'Taking shape' | 'Solid' | 'Strong'
  projects: number
  described: number
  withResult: number
  /** What to do next, or null when the log is in good shape. */
  next: string | null
}

const plural = (n: number, one: string, many: string) => (n === 1 ? one : many)

export function evidence(rows: ProjectRow[]): Evidence {
  const named = rows.filter(isFilled)
  const described = named.filter(isDescribed).length
  const withResult = named.filter((r) => r.impact.trim() || r.feedback).length
  const pct = Math.min(5, named.length) * 10 + Math.min(5, described) * 6 + Math.min(5, withResult) * 4
  const label = pct < 25 ? 'Just started' : pct < 55 ? 'Taking shape' : pct < 85 ? 'Solid' : 'Strong'

  let next: string | null = null
  if (named.length < 3) next = `Add ${3 - named.length} more ${plural(3 - named.length, 'project', 'projects')}. Rough is fine.`
  else if (described < named.length) {
    const n = named.length - described
    next = `Say what you did on ${n} ${plural(n, 'project', 'projects')}. One sentence is enough.`
  } else if (withResult < Math.min(3, named.length)) next = 'Add what came of it for a project or two. A number helps.'
  else if (named.length < 5) next = 'One or two more projects would sharpen the picture.'

  return { pct, label, projects: named.length, described, withResult, next }
}
