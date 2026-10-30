// AlphaVector catalogue: the checklists and niches the app offers. One file, so a different discipline
// (engineering, marketing, teaching) is a change here and nowhere else.

export interface Process { id: string; label: string }

/** Hard-skill processes: the craft steps a person actually carried out on a project. */
export const HARD_PROCESSES: Process[] = [
  { id: 'user-research', label: 'User research & interviews' },
  { id: 'research-synthesis', label: 'Research synthesis & insights' },
  { id: 'strategy', label: 'Product & design strategy' },
  { id: 'ia-flows', label: 'Information architecture & user flows' },
  { id: 'prototyping', label: 'Wireframing & prototyping' },
  { id: 'ui-visual', label: 'UI & visual design' },
  { id: 'interaction-motion', label: 'Interaction & motion design' },
  { id: 'design-systems', label: 'Design systems & components' },
  { id: 'usability-testing', label: 'Usability testing & validation' },
  { id: 'data-metrics', label: 'Data analysis & metrics' },
  { id: 'content-writing', label: 'Content & UX writing' },
  { id: 'accessibility', label: 'Accessibility & inclusive design' },
  { id: 'ai-design', label: 'Designing with or for AI' },
  { id: 'front-end', label: 'Front-end or code prototyping' },
  { id: 'dev-handoff', label: 'Developer handoff & QA' },
  { id: 'service-journeys', label: 'Service blueprints & journey mapping' },
]

/** Soft-skill processes: how the person worked with other people. */
export const SOFT_PROCESSES: Process[] = [
  { id: 'stakeholders', label: 'Stakeholder management' },
  { id: 'facilitation', label: 'Facilitating workshops' },
  { id: 'storytelling', label: 'Storytelling & presenting' },
  { id: 'cross-functional', label: 'Cross-functional collaboration' },
  { id: 'influence', label: 'Negotiation & influencing' },
  { id: 'leading', label: 'Leading or managing a team' },
  { id: 'mentoring', label: 'Mentoring & coaching' },
  { id: 'conflict', label: 'Resolving conflict' },
  { id: 'decisions', label: 'Prioritising & decision-making' },
  { id: 'client-comms', label: 'Client communication' },
  { id: 'framing', label: 'Framing ambiguous problems' },
  { id: 'change', label: 'Driving change & evangelising design' },
]

export const labelOf = (id: string): string =>
  [...HARD_PROCESSES, ...SOFT_PROCESSES].find((p) => p.id === id)?.label ?? id

/** Optional market niches. Picking none lets the market data decide. */
export const NICHES: string[] = [
  'AI products & agents',
  'Enterprise SaaS',
  'Fintech & payments',
  'Healthcare & wellbeing',
  'Education & EdTech',
  'E-commerce & D2C',
  'Global capability centres (GCCs) in India',
  'Climate & sustainability',
  'Gaming, media & entertainment',
  'Mobility & logistics',
  'Government & public services',
  'Consulting & agencies',
]

export const MAX_NICHES = 3

/** Short labels for pills, where space is tight. The full names stay in the picker, tooltips and the strengths panel. */
const SHORT: Record<string, string> = {
  'user-research': 'User research', 'research-synthesis': 'Research synthesis', strategy: 'Strategy', 'ia-flows': 'Info architecture',
  prototyping: 'Prototyping', 'ui-visual': 'UI and visuals', 'interaction-motion': 'Interaction and motion', 'design-systems': 'Design systems',
  'usability-testing': 'Usability testing', 'data-metrics': 'Data and metrics', 'content-writing': 'UX writing', accessibility: 'Accessibility',
  'ai-design': 'AI design', 'front-end': 'Front-end code', 'dev-handoff': 'Dev handoff', 'service-journeys': 'Journey mapping',
  stakeholders: 'Stakeholders', facilitation: 'Workshops', storytelling: 'Presenting', 'cross-functional': 'Cross-team work',
  influence: 'Influencing', leading: 'Leading a team', mentoring: 'Mentoring', conflict: 'Resolving conflict', decisions: 'Prioritising',
  'client-comms': 'Client comms', framing: 'Framing problems', change: 'Driving change',
}
export const shortOf = (id: string): string => SHORT[id] ?? labelOf(id)
