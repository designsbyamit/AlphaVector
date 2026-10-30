import test from 'node:test'
import assert from 'node:assert/strict'
import { computeStrengths, evidenceQuality, STRENGTH_WEIGHTS } from './strengths'
import { buildExtractedData } from './toExtracted'
import { emptyInputs, newRow, type ProjectRow } from './types'

const row = (o: Partial<ProjectRow>): ProjectRow => ({ ...newRow(), name: 'P', ...o })

test('weights sum to 1', () => {
  assert.equal(Object.values(STRENGTH_WEIGHTS).reduce((a, b) => a + b, 0), 1)
})

test('a process used in three documented projects across three industries scores 100', () => {
  const rows = ['Bank', 'Health', 'Retail'].map((industry, i) =>
    row({ name: `P${i}`, industry, hard: ['user-research'], impact: 'x', feedback: 'Praised' }))
  const s = computeStrengths(rows).find((x) => x.id === 'user-research')!
  assert.equal(s.score, 100)
  assert.equal(s.confidence, 'high')
  assert.equal(s.industries, 3)
})

test('a single undocumented project scores low and is low confidence', () => {
  const [s] = computeStrengths([row({ hard: ['prototyping'] })])
  // coverage 1/3, depth 0.4, breadth 0 -> 100 * (0.4/3 + 0.35*0.4)
  assert.equal(s.score, 27.3)
  assert.equal(s.confidence, 'low')
})

test('blank rows are ignored and unticked processes never appear', () => {
  assert.deepEqual(computeStrengths([newRow(), row({})]), [])
})

test('strengths are ranked by score', () => {
  const rows = [row({ hard: ['prototyping', 'ui-visual'], impact: 'i' }), row({ name: 'Q', hard: ['prototyping'] })]
  const ids = computeStrengths(rows).map((s) => s.id)
  assert.equal(ids[0], 'prototyping')
})

test('evidence quality grades the table', () => {
  assert.equal(evidenceQuality([row({})]), 'sparse')
  assert.equal(evidenceQuality([row({ impact: 'a' }), row({ name: 'B' })]), 'moderate')
  assert.equal(evidenceQuality([1, 2, 3, 4].map((n) => row({ name: `P${n}`, impact: 'a' }))), 'rich')
})

test('buildExtractedData maps the table into the engine shape', () => {
  const inputs = emptyInputs()
  inputs.about = { name: ' Asha ', currentRole: 'Senior Designer', organisation: 'Acme', years: '8', location: 'Pune', stage: '' }
  inputs.rows = [row({ name: 'Checkout redo', client: 'Acme', industry: 'Fintech', hard: ['prototyping'], soft: ['stakeholders'], impact: '+12% conversion', feedback: 'Praised', energy: 'energising' })]
  inputs.dismissed = ['stakeholders']
  const d = buildExtractedData(inputs, 2026)
  assert.equal(d.candidateName, 'Asha')
  assert.equal(d.timeline[0].startDate, '2018')
  assert.equal(d.projects.length, 1)
  assert.equal(d.projects[0].impact, '+12% conversion')
  assert.deepEqual(d.projects[0].hardSkills, ['Wireframing & prototyping'])
  assert.deepEqual(d.skills, ['Wireframing & prototyping'])
  assert.match(d.projects[0].summary ?? '', /energising/)
  assert.deepEqual(d.footprintSignals, ['Fintech'])
})

test('no role and no years gives an empty timeline', () => {
  const inputs = emptyInputs()
  inputs.rows = [row({})]
  assert.equal(buildExtractedData(inputs).timeline.length, 0)
})
