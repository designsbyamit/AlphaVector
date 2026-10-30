import type { ExtractedCareerData, Project, TimelineEntry } from '@/types/wingspan'
import { labelOf } from './catalog'
import { computeStrengths, evidenceQuality } from './strengths'
import { isFilled, type Inputs, type ProjectRow } from './types'

const t = (s: string) => s.trim()

function projectSummary(r: ProjectRow): string {
  const parts: string[] = []
  if (r.hard.length) parts.push(`Hard-skill work: ${r.hard.map(labelOf).join('; ')}.`)
  if (r.soft.length) parts.push(`Soft-skill work: ${r.soft.map(labelOf).join('; ')}.`)
  if (t(r.feedback)) parts.push(`Feedback received: ${t(r.feedback)}`)
  if (t(r.remarks)) parts.push(`Remarks: ${t(r.remarks)}`)
  if (r.energy) parts.push(`The person says this work was ${r.energy}.`)
  return parts.join(' ')
}

/**
 * The single boundary between the AlphaVector table and the WingSpan analysis engine. The engine only ever
 * sees an ExtractedCareerData, so everything downstream (agents, scoring, Blueprint) works unchanged.
 */
export function buildExtractedData(inputs: Inputs, now = new Date().getFullYear()): ExtractedCareerData {
  const { about } = inputs
  const rows = inputs.rows.filter(isFilled)
  const years = Math.max(0, Math.min(50, Math.round(Number(about.years) || 0)))

  const timeline: TimelineEntry[] = t(about.currentRole) || years > 0
    ? [{
        id: 'current', role: t(about.currentRole) || 'Practitioner', company: t(about.organisation) || 'Current',
        startDate: String(now - years), endDate: 'Present', confirmed: true,
        description: years > 0 ? `${years} years of professional experience, as reported by the person.` : undefined,
      }]
    : []

  const projects: Project[] = rows.map((r) => ({
    id: r.id, name: t(r.name), company: t(r.client), industry: t(r.industry) || undefined,
    summary: projectSummary(r), impact: t(r.impact) || undefined,
    hardSkills: r.hard.map(labelOf), softSkills: r.soft.map(labelOf),
    feedback: t(r.feedback) || undefined, remarks: t(r.remarks) || undefined, energy: r.energy || undefined,
  }))

  const dismissed = new Set(inputs.dismissed)
  const skills = computeStrengths(rows).filter((s) => !dismissed.has(s.id)).map((s) => s.label)

  const industries = [...new Set(rows.map((r) => t(r.industry)).filter(Boolean))]
  const rawText = [
    t(about.name) ? `Name: ${t(about.name)}` : '',
    t(about.currentRole) ? `Current role: ${t(about.currentRole)}${t(about.organisation) ? ` at ${t(about.organisation)}` : ''}` : '',
    years > 0 ? `Experience: ${years} years` : '',
    '',
    ...rows.map((r, i) => `Project ${i + 1}: ${t(r.name)} (client: ${t(r.client) || 'n/a'}, industry: ${t(r.industry) || 'n/a'}). ${projectSummary(r)}${t(r.impact) ? ` Impact: ${t(r.impact)}` : ''}`),
  ].join('\n').trim()

  return {
    timeline, projects, skills, education: [], rawText,
    candidateName: t(about.name).slice(0, 80),
    contact: t(about.location) ? { location: t(about.location) } : {},
    evidenceQuality: evidenceQuality(rows),
    geographySignals: t(about.location) ? [t(about.location)] : [],
    footprintSignals: industries,
    careerStageSignals: years > 0 ? [`${years} years of experience`] : [],
  }
}
