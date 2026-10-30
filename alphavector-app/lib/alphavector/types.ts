export type Energy = 'energising' | 'neutral' | 'draining' | ''
export type Feedback = 'Praised' | 'Mixed' | 'Critical' | ''

export interface ProjectRow {
  id: string
  name: string
  client: string
  industry: string
  /** What the person did, in their own words. Skills are inferred from this. */
  did: string
  /** Derived: inferred from the text plus anything the person added by hand, minus anything they removed. */
  hard: string[]
  soft: string[]
  /** Process ids the person added by hand / removed by hand. These always win over inference. */
  manual: string[]
  removed: string[]
  feedback: Feedback
  impact: string
  remarks: string
  energy: Energy
  /** True for example rows that have not been edited yet. They are never analysed as real data. */
  sample: boolean
}

export type Stage = '' | 'student' | '0-2' | '3-5' | '6-10' | '10+'

/** One tap replaces "years of experience": each stage maps to a representative number. */
export const STAGES: Array<{ id: Exclude<Stage, ''>; label: string; years: number }> = [
  { id: 'student', label: 'a student', years: 0 },
  { id: '0-2', label: '0 to 2 years in', years: 1 },
  { id: '3-5', label: '3 to 5 years in', years: 4 },
  { id: '6-10', label: '6 to 10 years in', years: 8 },
  { id: '10+', label: '10+ years in', years: 12 },
]

export interface About {
  name: string
  /** Role or course. Optional. */
  currentRole: string
  organisation: string
  /** Years of experience as a number string, set from the stage. */
  years: string
  location: string
  stage: Stage
}

export interface Inputs {
  about: About
  rows: ProjectRow[]
  /** Strength ids the person marked "not really me". */
  dismissed: string[]
  /** Passion: interests the person chose (3-5). */
  passions: string[]
  niches: string[]
}

export const emptyAbout = (): About => ({ name: '', currentRole: '', organisation: '', years: '', location: '', stage: '' })

export const newRow = (): ProjectRow => ({
  id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  name: '', client: '', industry: '', did: '', hard: [], soft: [], manual: [], removed: [],
  feedback: '', impact: '', remarks: '', energy: '', sample: false,
})

export const emptyInputs = (): Inputs => ({ about: emptyAbout(), rows: [newRow()], dismissed: [], passions: [], niches: [] })

/** A row counts once it has a name. Blank rows are ignored everywhere. */
export const isFilled = (r: ProjectRow) => r.name.trim().length > 0

/** A row is "done" once it says what the person did, in words or ticks. */
export const isDescribed = (r: ProjectRow) => isFilled(r) && (r.did.trim().length >= 8 || r.hard.length + r.soft.length > 0)

/** A row is blank when nothing at all has been typed or picked. */
export const isBlank = (r: ProjectRow) =>
  !r.name.trim() && !r.client.trim() && !r.industry.trim() && !r.did.trim() && !r.impact.trim() && !r.remarks.trim() && !r.feedback && !r.energy && r.manual.length === 0
