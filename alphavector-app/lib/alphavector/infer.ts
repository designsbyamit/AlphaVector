import { HARD_PROCESSES, SOFT_PROCESSES } from './catalog'
import type { ProjectRow } from './types'

// Skills are inferred from plain words, so nobody has to scan a 28-item checklist. Deterministic and
// explainable: each process has a few trigger patterns, and the person can always add or remove any tick.

const HARD_PATTERNS: Record<string, RegExp> = {
  'user-research': /interview|user research|survey|field ?work|ethnograph|contextual inquiry|personas?\b|diary stud/i,
  'research-synthesis': /synthes|insights?\b|affinity|cluster|key findings|themes?\b/i,
  strategy: /strateg|roadmap|\bvision\b|\bokrs?\b|business case|positioning|north star/i,
  'ia-flows': /information architecture|\bia\b|user flows?|\bflows?\b|sitemap|site map|navigation|card sort/i,
  prototyping: /wireframe|prototyp|figma|sketch(ed|es|ing)?\b|mock-?ups?|low-?fi|hi-?fi|framer|invision|adobe xd|clickable/i,
  'ui-visual': /\bui\b|visual design|typograph|branding|brand identity|illustrat|layouts?\b|colou?r|graphic|icon(s|ography)?\b/i,
  'interaction-motion': /interaction design|motion|animat|micro-?interaction|lottie|transitions?\b/i,
  'design-systems': /design systems?|component librar|components?\b|design tokens?|pattern librar|style ?guide|storybook/i,
  'usability-testing': /usability|user test|a\/b|ab test|validat|tested (it )?with|\btested\b|testing sessions?/i,
  'data-metrics': /analytics|metrics?\b|\bdata\b|dashboards?|\bkpis?\b|funnel|conversion|\bsql\b|mixpanel|amplitude|ga4|drop-?off/i,
  'content-writing': /copywriting|microcopy|ux writ|content design|tone of voice|\bcopy\b|wrote (the )?(content|copy)/i,
  accessibility: /accessib|wcag|a11y|inclusive|screen reader|contrast/i,
  'ai-design': /\bai\b|machine learning|\bllm\b|\bgpt\b|chatbot|copilot|generative|\bagents?\b|prompt/i,
  'front-end': /\bhtml\b|\bcss\b|react|front-?end|\bcode(d)?\b|coding|javascript|typescript|swift|flutter|webflow|no-?code|built (it|the app|a site)/i,
  'dev-handoff': /hand-?off|hand-?over|developer (support|review)|\bqa\b|specs?\b|zeplin|redlines?|worked with (two |three |the )?(devs?|developers|engineers)/i,
  'service-journeys': /service blueprint|journey map|touchpoints?|omnichannel|customer journey|experience map/i,
}

const SOFT_PATTERNS: Record<string, RegExp> = {
  stakeholders: /stakeholder|sponsor|\bceo\b|\bcxo\b|leadership team|sign-?off|product head|head of|\bvp\b|director/i,
  facilitation: /workshops?|facilitat|design sprint|brainstorm|co-?creat|ideation session/i,
  storytelling: /present(ed|ing|ation)?\b|pitch(ed)?|storytell|\bdemo(ed)?\b|showcas|walk-?through|keynote|talk(ed)? to/i,
  'cross-functional': /cross-?functional|collaborat|worked with|\bpms?\b|product managers?|engineers?|developers?|\bdevs\b|marketing team|product team/i,
  influence: /negotiat|persuad|influenc|convinc|advocat|buy-?in|won (over|approval)/i,
  leading: /\bled\b|\blead(ing)?\b|managed (a |the )?team|team of \d+|head of design|directed|ran the team/i,
  mentoring: /mentor|coach(ed|ing)?\b|guid(ed|ing) (junior|interns?)|onboarded (new|junior)|taught|trained (the )?(team|juniors?|interns?)/i,
  conflict: /conflict|disagree|resolv(ed|ing)|mediat|aligned (the )?(team|stakeholders)/i,
  decisions: /prioriti[sz]|decid|trade-?offs?|cut scope|scoped|made the call/i,
  'client-comms': /\bclients?\b|customer calls?|kick-?off|status updates?|weekly (call|sync)|account manag/i,
  framing: /ambigu|problem (framing|statement)|defined the problem|reframe|discovery|scoping|open-?ended|0-?to-?1|from scratch/i,
  change: /evangel|adoption|design culture|champion|roll-?out|rolled out|change management|design thinking (training|session)/i,
}

export interface Inferred { hard: string[]; soft: string[] }

/** Process ids whose patterns appear in the text, in catalogue order. */
export function inferProcesses(text: string): Inferred {
  const t = text ?? ''
  return {
    hard: HARD_PROCESSES.filter((p) => HARD_PATTERNS[p.id]?.test(t)).map((p) => p.id),
    soft: SOFT_PROCESSES.filter((p) => SOFT_PATTERNS[p.id]?.test(t)).map((p) => p.id),
  }
}

const HARD_IDS = new Set(HARD_PROCESSES.map((p) => p.id))
export const kindOf = (id: string): 'hard' | 'soft' => (HARD_IDS.has(id) ? 'hard' : 'soft')

/**
 * Recompute the row's ticks: inferred from what they wrote and the project name, plus anything added by hand,
 * minus anything removed by hand. Manual choices always win over inference.
 */
export function resolveRow(r: ProjectRow): ProjectRow {
  const inf = inferProcesses(`${r.name} ${r.did}`)
  const removed = new Set(r.removed)
  const pick = (kind: 'hard' | 'soft', list: typeof HARD_PROCESSES) => {
    const ids = new Set([...inf[kind], ...r.manual.filter((id) => kindOf(id) === kind)])
    return list.filter((p) => ids.has(p.id) && !removed.has(p.id)).map((p) => p.id)
  }
  return { ...r, hard: pick('hard', HARD_PROCESSES), soft: pick('soft', SOFT_PROCESSES) }
}

/** Patch that flips one process on or off by hand, whatever inference thinks. */
export function toggleProcess(r: ProjectRow, id: string): Pick<ProjectRow, 'manual' | 'removed'> {
  const on = r.hard.includes(id) || r.soft.includes(id)
  return on
    ? { manual: r.manual.filter((x) => x !== id), removed: [...new Set([...r.removed, id])] }
    : { manual: [...new Set([...r.manual, id])], removed: r.removed.filter((x) => x !== id) }
}
