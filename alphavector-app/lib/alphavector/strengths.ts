import { HARD_PROCESSES, SOFT_PROCESSES } from './catalog'
import { isFilled, type ProjectRow } from './types'

// Strengths come from experience data, not from self-description. For every process the person ticked:
//
//   coverage = min(1, projects using it / 3)        three projects is full marks, so long histories are not penalised
//   depth    = mean evidence richness of those projects, 0.4 + 0.3 (impact written) + 0.3 (feedback written)
//   breadth  = min(1, distinct industries it appeared in / 3)
//   Proof Score = 100 × (0.40 coverage + 0.35 depth + 0.25 breadth)
//
// Deterministic and explainable: the same table always gives the same scores.

export const STRENGTH_WEIGHTS = { coverage: 0.4, depth: 0.35, breadth: 0.25 } as const

export interface StrengthScore {
  id: string
  label: string
  kind: 'hard' | 'soft'
  score: number
  projects: number
  industries: number
  withImpact: number
  withFeedback: number
  confidence: 'low' | 'medium' | 'high'
  projectNames: string[]
}

const round1 = (n: number) => Math.round(n * 10) / 10
const has = (s: string) => s.trim().length > 0

export function richness(r: ProjectRow): number {
  return 0.4 + (has(r.impact) ? 0.3 : 0) + (has(r.feedback) ? 0.3 : 0)
}

export function computeStrengths(rows: ProjectRow[]): StrengthScore[] {
  const filled = rows.filter(isFilled)
  const out: StrengthScore[] = []
  const kinds: Array<['hard' | 'soft', typeof HARD_PROCESSES]> = [['hard', HARD_PROCESSES], ['soft', SOFT_PROCESSES]]
  for (const [kind, list] of kinds) {
    for (const p of list) {
      const used = filled.filter((r) => (kind === 'hard' ? r.hard : r.soft).includes(p.id))
      if (!used.length) continue
      const industries = new Set(used.map((r) => r.industry.trim().toLowerCase()).filter(Boolean)).size
      const coverage = Math.min(1, used.length / 3)
      const depth = used.reduce((a, r) => a + richness(r), 0) / used.length
      const breadth = Math.min(1, industries / 3)
      const score = 100 * (STRENGTH_WEIGHTS.coverage * coverage + STRENGTH_WEIGHTS.depth * depth + STRENGTH_WEIGHTS.breadth * breadth)
      out.push({
        id: p.id, label: p.label, kind, score: round1(score),
        projects: used.length, industries,
        withImpact: used.filter((r) => has(r.impact)).length,
        withFeedback: used.filter((r) => has(r.feedback)).length,
        confidence: used.length >= 3 ? 'high' : used.length === 2 ? 'medium' : 'low',
        projectNames: used.map((r) => r.name.trim()),
      })
    }
  }
  return out.sort((a, b) => b.score - a.score || b.projects - a.projects || a.label.localeCompare(b.label))
}

/** How much evidence the table holds overall, to set expectations before the analysis runs. */
export function evidenceQuality(rows: ProjectRow[]): 'rich' | 'moderate' | 'sparse' {
  const filled = rows.filter(isFilled)
  const documented = filled.filter((r) => has(r.impact) || has(r.feedback)).length
  if (filled.length >= 4 && documented >= 3) return 'rich'
  if (filled.length >= 2 && documented >= 1) return 'moderate'
  return 'sparse'
}
