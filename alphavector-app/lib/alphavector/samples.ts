import { resolveRow } from './infer'
import { newRow, type ProjectRow } from './types'

export const INDUSTRIES = [
  'Fintech', 'Healthcare', 'Education', 'E-commerce and retail', 'Enterprise software', 'Media and entertainment',
  'Travel and hospitality', 'Mobility and logistics', 'Government and public sector', 'Social impact',
  'Agency and consulting', 'Gaming', 'Energy and climate', 'Telecom', 'Food and beverage',
]

const make = (p: Partial<ProjectRow>): ProjectRow => resolveRow({ ...newRow(), ...p, sample: true })

/** Three example rows so nobody starts from a blank page. They are flagged and never analysed until edited. */
export const sampleRows = (): ProjectRow[] => [
  make({
    name: 'Campus food-ordering app', client: 'College canteen', industry: 'Food and beverage',
    did: 'Interviewed 12 students, sketched the flows, built a clickable prototype in Figma and tested it with 8 users.',
    impact: 'Queue time fell by about a third in the pilot.', feedback: 'Praised', energy: 'energising',
  }),
  make({
    name: 'Bank sign-up redesign', client: 'Internship at a private bank', industry: 'Fintech',
    did: 'Mapped the sign-up journey, redesigned the screens, presented three options to the product head and worked with two developers on handoff.',
    impact: 'Drop-off at step two went from 38% to 27%.', feedback: 'Praised', energy: 'neutral',
  }),
  make({
    name: 'Component library for a hospital app', client: 'Freelance', industry: 'Healthcare',
    did: 'Built a component library with tokens, wrote accessibility guidelines and mentored a junior designer.',
    impact: 'Screens took about half the time to build.', feedback: 'Mixed', energy: 'energising',
  }),
]

const BULLET = /^\s*(?:[-*•·]|\d{1,2}[.)])\s*/
const SPLIT = /\s+[-–—]\s+|:\s+/

/**
 * Turn pasted text into rows. Handles one project per line ("Name - what I did") and rows copied straight
 * from a spreadsheet (tab-separated: name, client, industry, what you did, what came of it).
 */
export function parsePasted(text: string, max = 15): ProjectRow[] {
  const rows: ProjectRow[] = []
  for (const raw of (text ?? '').split(/\r?\n/)) {
    const line = raw.replace(BULLET, '').trim()
    if (!line) continue
    const r = newRow()
    if (line.includes('\t')) {
      const [name = '', client = '', industry = '', did = '', impact = ''] = line.split('\t').map((c) => c.trim())
      Object.assign(r, { name, client, industry, did, impact })
    } else {
      const [name, ...rest] = line.split(SPLIT)
      Object.assign(r, { name: name.trim(), did: rest.join(' ').trim() })
    }
    r.name = r.name.slice(0, 90)
    if (!r.name) continue
    rows.push(resolveRow(r))
    if (rows.length >= max) break
  }
  return rows
}
