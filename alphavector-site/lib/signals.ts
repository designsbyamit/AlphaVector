// The three signals. Class names are written out in full so Tailwind can see them.
export const SIGNALS = [
  {
    key: 'strengths',
    name: 'Strengths',
    short: 'What your work shows',
    text: 'text-strength',
    rule: 'border-strength-fill',
    fill: 'bg-strength-fill',
    measures: 'What your projects actually demonstrate, beyond what you would put on a CV: what you did, what came of it and what people said.',
    alone: 'You get very good at things nobody needs.',
    read: 'From your own projects: what you did, where, what it led to and the feedback you got. If the evidence is thin, we say so.',
  },
  {
    key: 'passion',
    name: 'Passion',
    short: 'What energises you',
    text: 'text-passion',
    rule: 'border-passion-fill',
    fill: 'bg-passion-fill',
    measures: 'The work that gives you energy, and the areas you would explore without being asked.',
    alone: 'You chase work you cannot yet do, or that no one is hiring for.',
    read: 'From how each project felt and the areas that pull you. It nudges the picture toward what you want. It never replaces the evidence.',
  },
  {
    key: 'market',
    name: 'Market demand',
    short: 'Where things are heading',
    text: 'text-market',
    rule: 'border-market-fill',
    fill: 'bg-market-fill',
    measures: 'Where hiring and skills are moving, and how exposed each direction is to AI and automation.',
    alone: 'You follow demand into work that drains you.',
    read: 'From dated, cited research from named sources, not from hunches or headlines.',
  },
] as const

export type SignalKey = (typeof SIGNALS)[number]['key']
