import { isDescribed, isFilled, type ProjectRow, type Stage } from './types'

/** The least the engine needs to say anything reliable: three real projects, each described. */
export const MIN_PROJECTS = 3

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
  if (named.length < MIN_PROJECTS) next = `Add ${MIN_PROJECTS - named.length} more ${plural(MIN_PROJECTS - named.length, 'project', 'projects')}. Rough is fine.`
  else if (described < named.length) {
    const n = named.length - described
    next = `Say what you did on ${n} ${plural(n, 'project', 'projects')}. One sentence is enough.`
  } else if (withResult < Math.min(3, named.length)) next = 'Add what came of it for a project or two. A number helps.'
  else if (named.length < 5) next = 'One or two more projects would sharpen the picture.'

  return { pct, label, projects: named.length, described, withResult, next }
}

/**
 * Why the person cannot continue from the projects step yet, in plain words, or null when they can.
 * Needs: where they are right now, no unedited example rows, and at least three real projects each with a line about what they did.
 */
export function continueGate(stage: Stage, rows: ProjectRow[]): string | null {
  if (!stage) return 'Tell us where you are right now. It is one tap.'
  if (rows.some((r) => r.sample)) return 'Change an example to make it yours, or clear the examples.'
  const real = rows.filter(isFilled)
  const described = real.filter(isDescribed).length
  if (described >= MIN_PROJECTS) return null
  const need = MIN_PROJECTS - described
  if (real.length < MIN_PROJECTS) return `Add ${MIN_PROJECTS - real.length} more ${plural(MIN_PROJECTS - real.length, 'project', 'projects')} to continue. A line about what you did is enough.`
  return `Say what you did on ${need} more ${plural(need, 'project', 'projects')} to continue. One sentence is enough.`
}
