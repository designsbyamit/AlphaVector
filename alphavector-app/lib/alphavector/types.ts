export type Energy = 'energising' | 'neutral' | 'draining' | ''

export interface ProjectRow {
  id: string
  name: string
  client: string
  industry: string
  hard: string[]
  soft: string[]
  feedback: string
  impact: string
  remarks: string
  energy: Energy
}

export interface About {
  name: string
  currentRole: string
  organisation: string
  /** Years of professional experience, as typed. */
  years: string
  location: string
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

export const emptyAbout = (): About => ({ name: '', currentRole: '', organisation: '', years: '', location: '' })

export const newRow = (): ProjectRow => ({
  id: `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  name: '', client: '', industry: '', hard: [], soft: [], feedback: '', impact: '', remarks: '', energy: '',
})

export const emptyInputs = (): Inputs => ({ about: emptyAbout(), rows: [newRow()], dismissed: [], passions: [], niches: [] })

/** A row counts once it has a name. Blank rows are ignored everywhere. */
export const isFilled = (r: ProjectRow) => r.name.trim().length > 0
