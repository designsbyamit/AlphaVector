import { HARD_PROCESSES, SOFT_PROCESSES, shortOf } from './catalog'
import { kindOf } from './infer'
import type { ProjectRow } from './types'

// The pills under "What you did". They keep offering the most relevant skill the person has not yet covered.
// Tier 1 is the standard process list, ranked by what the project already shows. When every standard skill
// has been added or skipped, tier 2 offers suggestive skills beyond the list. Deterministic and explainable.

export interface Suggestion { id: string; label: string; full?: string; kind: 'hard' | 'soft'; tier: 'standard' | 'extra' }

/** Skills that tend to travel together in real projects. Sharing a cluster makes one skill relevant after another. */
const CLUSTERS: string[][] = [
  ['user-research', 'research-synthesis', 'usability-testing', 'service-journeys', 'facilitation', 'framing'],
  ['ia-flows', 'prototyping', 'ui-visual', 'interaction-motion', 'usability-testing', 'accessibility', 'content-writing'],
  ['design-systems', 'ui-visual', 'accessibility', 'dev-handoff', 'front-end', 'cross-functional'],
  ['dev-handoff', 'front-end', 'cross-functional', 'stakeholders', 'decisions'],
  ['strategy', 'data-metrics', 'framing', 'stakeholders', 'decisions', 'influence'],
  ['storytelling', 'stakeholders', 'client-comms', 'influence', 'facilitation'],
  ['leading', 'mentoring', 'conflict', 'change', 'decisions', 'stakeholders'],
  ['ai-design', 'data-metrics', 'front-end', 'prototyping'],
]

/** What to offer first when a row is still empty: the skills most projects involve, mixing craft and people. */
const STARTERS = [
  'prototyping', 'user-research', 'stakeholders', 'ui-visual', 'cross-functional', 'storytelling',
  'usability-testing', 'ia-flows', 'facilitation', 'design-systems',
]

export interface Extra { id: string; label: string; kind: 'hard' | 'soft'; near: string[] }

/** Suggestive skills beyond the standard list. `near` links each to the standard skills that make it relevant. */
export const EXTRAS: Extra[] = [
  { id: 'x-competitive', label: 'Competitive analysis', kind: 'hard', near: ['strategy', 'user-research'] },
  { id: 'x-personas', label: 'Persona creation', kind: 'hard', near: ['user-research', 'research-synthesis'] },
  { id: 'x-stakeholder-interviews', label: 'Stakeholder interviews', kind: 'hard', near: ['user-research', 'stakeholders'] },
  { id: 'x-sketching', label: 'Concept sketching', kind: 'hard', near: ['prototyping', 'ui-visual'] },
  { id: 'x-storyboard', label: 'Storyboarding', kind: 'hard', near: ['service-journeys', 'interaction-motion'] },
  { id: 'x-moodboards', label: 'Moodboards', kind: 'hard', near: ['ui-visual'] },
  { id: 'x-illustration', label: 'Illustration', kind: 'hard', near: ['ui-visual'] },
  { id: 'x-icons', label: 'Icon design', kind: 'hard', near: ['ui-visual', 'design-systems'] },
  { id: 'x-dataviz', label: 'Data visualisation', kind: 'hard', near: ['data-metrics', 'ui-visual'] },
  { id: 'x-prompts', label: 'Prompt design', kind: 'hard', near: ['ai-design'] },
  { id: 'x-design-qa', label: 'Design QA', kind: 'hard', near: ['dev-handoff', 'design-systems'] },
  { id: 'x-docs', label: 'Docs and guidelines', kind: 'hard', near: ['design-systems', 'dev-handoff'] },
  { id: 'x-ideation', label: 'Rapid ideation', kind: 'hard', near: ['framing', 'prototyping'] },
  { id: 'x-photo-video', label: 'Photography or video', kind: 'hard', near: ['ui-visual', 'storytelling'] },
  { id: 'x-physical', label: '3D or physical prototyping', kind: 'hard', near: ['prototyping'] },
  { id: 'x-presentation', label: 'Presentation design', kind: 'hard', near: ['storytelling', 'ui-visual'] },
  { id: 'x-proposals', label: 'Pitches and proposals', kind: 'hard', near: ['storytelling', 'strategy'] },
  { id: 'x-localisation', label: 'Localisation', kind: 'hard', near: ['content-writing'] },
  { id: 'x-instrumentation', label: 'Analytics setup', kind: 'hard', near: ['data-metrics'] },
  { id: 'x-project-mgmt', label: 'Timelines and scope', kind: 'soft', near: ['decisions', 'client-comms'] },
  { id: 'x-budget', label: 'Budgets and vendors', kind: 'soft', near: ['client-comms', 'leading'] },
  { id: 'x-critique', label: 'Running critiques', kind: 'soft', near: ['facilitation', 'mentoring'] },
  { id: 'x-feedback', label: 'Giving feedback', kind: 'soft', near: ['mentoring', 'conflict'] },
  { id: 'x-async', label: 'Remote or async work', kind: 'soft', near: ['cross-functional'] },
  { id: 'x-teaching', label: 'Teaching or training others', kind: 'soft', near: ['mentoring', 'storytelling'] },
  { id: 'x-community', label: 'Building a community', kind: 'soft', near: ['change', 'facilitation'] },
  { id: 'x-hiring', label: 'Hiring and interviewing', kind: 'soft', near: ['leading'] },
  { id: 'x-cultures', label: 'Working across cultures', kind: 'soft', near: ['cross-functional', 'client-comms'] },
  { id: 'x-self-learning', label: 'Learning tools fast', kind: 'soft', near: ['framing'] },
  { id: 'x-club', label: 'Leading a club', kind: 'soft', near: ['leading', 'change'] },
]

const EXTRA_BY_ID = new Map(EXTRAS.map((e) => [e.id, e]))

export const CUSTOM_PREFIX = 'custom:'
export const customId = (label: string) => `${CUSTOM_PREFIX}${label.trim().replace(/\s+/g, ' ').slice(0, 40)}`
export const extraLabel = (id: string) => EXTRA_BY_ID.get(id)?.label ?? id.replace(CUSTOM_PREFIX, '')
export const extraKind = (id: string): 'hard' | 'soft' | 'custom' => EXTRA_BY_ID.get(id)?.kind ?? 'custom'

const STANDARD = [...HARD_PROCESSES, ...SOFT_PROCESSES]

const shared = (a: string, b: string) => CLUSTERS.reduce((n, c) => n + (c.includes(a) && c.includes(b) ? 1 : 0), 0)

function rank<T extends { id: string }>(items: T[], near: (item: T) => string[], row: ProjectRow, others: ProjectRow[], baseOf: (item: T) => number): T[] {
  const mine = [...row.hard, ...row.soft]
  const score = (item: T) => {
    const rel = near(item)
    // Relevance to what this project already shows.
    let s = mine.reduce((n, id) => n + rel.reduce((m, r) => m + (r === id ? 2 : shared(r, id)), 0) * 1.5, 0)
    // People repeat themselves: skills used on their other projects are likely here too.
    s += Math.min(3, others.filter((o) => [...o.hard, ...o.soft, ...o.extra].includes(item.id)).length) * 1.5
    return s + baseOf(item)
  }
  return [...items].sort((a, b) => score(b) - score(a))
}

/** Keep the mix honest: no more than `max` of one kind in the visible set while the other kind has candidates. */
function mix(sorted: Suggestion[], limit: number): Suggestion[] {
  const max = Math.ceil(limit * 0.67)
  const out: Suggestion[] = []
  const counts = { hard: 0, soft: 0 }
  const rest: Suggestion[] = []
  for (const s of sorted) {
    if (out.length < limit && counts[s.kind] < max) { out.push(s); counts[s.kind]++ } else rest.push(s)
  }
  for (const s of rest) { if (out.length >= limit) break; out.push(s) }
  return out
}

export interface Suggestions { tier: 'standard' | 'extra' | 'done'; items: Suggestion[] }

/**
 * What to offer next for one row. Standard skills first, most relevant first; skills already added, removed or
 * skipped never come back. Once the standard list is fully covered, suggestive extras take over.
 */
export function suggestionsFor(row: ProjectRow, others: ProjectRow[] = [], limit = 6): Suggestions {
  const covered = new Set([...row.hard, ...row.soft, ...row.removed, ...row.skipped, ...row.extra])
  const empty = row.hard.length + row.soft.length === 0

  const std = STANDARD.filter((p) => !covered.has(p.id))
  if (std.length) {
    const ranked = rank(std, (p) => [p.id], row, others, (p) => {
      const i = STARTERS.indexOf(p.id)
      return (empty && i >= 0 ? (STARTERS.length - i) * 0.5 : 0) + (STANDARD.length - STANDARD.findIndex((x) => x.id === p.id)) * 0.01
    })
    const items = ranked.map((p) => ({ id: p.id, label: shortOf(p.id), full: p.label, kind: kindOf(p.id), tier: 'standard' as const }))
    return { tier: 'standard', items: mix(items, limit) }
  }

  const ex = EXTRAS.filter((e) => !covered.has(e.id))
  if (ex.length) {
    const ranked = rank(ex, (e) => e.near, row, others, (e) => (EXTRAS.length - EXTRAS.indexOf(e)) * 0.01)
    const items = ranked.map((e) => ({ id: e.id, label: e.label, kind: e.kind, tier: 'extra' as const }))
    return { tier: 'extra', items: mix(items, limit) }
  }
  return { tier: 'done', items: [] }
}

/** Patch that adds a suggestion: standard skills become manual ticks, extras are stored by id. */
export function acceptSuggestion(row: ProjectRow, s: Pick<Suggestion, 'id' | 'tier'>): Partial<ProjectRow> {
  if (s.tier === 'extra') return { extra: [...new Set([...row.extra, s.id])] }
  return { manual: [...new Set([...row.manual, s.id])], removed: row.removed.filter((x) => x !== s.id) }
}

/** Patch that skips suggestions so they stop coming back. */
export const skipSuggestions = (row: ProjectRow, ids: string[]): Partial<ProjectRow> => ({ skipped: [...new Set([...row.skipped, ...ids])] })

/** Patch that adds a skill the person typed themselves. Ignores blanks and duplicates. */
export function addCustom(row: ProjectRow, label: string): Partial<ProjectRow> {
  const clean = label.trim().replace(/\s+/g, ' ')
  if (clean.length < 2) return {}
  const id = customId(clean)
  const dup = row.extra.some((x) => x.toLowerCase() === id.toLowerCase())
  return dup ? {} : { extra: [...row.extra, id] }
}

export const removeExtra = (row: ProjectRow, id: string): Partial<ProjectRow> => ({ extra: row.extra.filter((x) => x !== id) })
