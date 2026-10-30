// The three signals. Class names are written out in full so Tailwind can see them.
export const SIGNALS = [
  {
    key: 'strengths',
    name: 'Strengths',
    short: 'What you have proven',
    text: 'text-strength',
    rule: 'border-strength-fill',
    fill: 'bg-strength-fill',
    measures: 'The work you have actually done: which processes you carried out on which projects, what came of it, and what people said.',
    alone: 'You get very good at things nobody needs.',
    read: 'From your project log. Every tick is tied to a project, an industry, an impact and the feedback you received, then scored for how well your history proves it.',
  },
  {
    key: 'passion',
    name: 'Passion',
    short: 'What pulls you',
    text: 'text-passion',
    rule: 'border-passion-fill',
    fill: 'bg-passion-fill',
    measures: 'The work that gives you energy, and the areas you would pursue without being asked.',
    alone: 'You chase work you cannot yet do, or that no one is hiring for.',
    read: 'From how each project felt (energised, neutral, drained) and the three to five areas you choose. It tilts the result toward what you want; it never replaces the evidence.',
  },
  {
    key: 'market',
    name: 'Market demand',
    short: 'What is wanted',
    text: 'text-market',
    rule: 'border-market-fill',
    fill: 'bg-market-fill',
    measures: 'Where hiring and skills are moving, how fast, and how exposed each direction is to automation or saturation.',
    alone: 'You follow demand into work that drains you.',
    read: 'From dated, cited research such as hiring-posting indices, labour statistics and industry reports, each weighted by how reliable its source is.',
  },
] as const

export type SignalKey = (typeof SIGNALS)[number]['key']
