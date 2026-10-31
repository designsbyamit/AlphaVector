import test from 'node:test'
import assert from 'node:assert/strict'
import { rowsFromExtracted } from './importMap'

test('extracted projects become table rows with skills inferred from their text', () => {
  const r = rowsFromExtracted({
    candidateName: 'Asha Rao',
    timeline: [{ id: 't', role: 'Product Designer', company: 'Acme', startDate: '2022', endDate: 'Present', confirmed: true }],
    projects: [
      { id: 'a', name: 'Checkout redesign', company: 'Acme Pay', industry: 'Fintech', summary: 'Ran interviews and built a prototype in Figma', impact: '+12% conversion' },
      { id: 'b', name: 'Design system', company: 'Acme', summary: 'Built a component library', impact: '' },
      { id: 'c', name: 'Mobile app', company: 'Acme', summary: 'Presented to the CEO', impact: '' },
    ],
  })
  assert.equal(r.rows.length, 3)
  assert.equal(r.rows[0].client, 'Acme Pay')
  assert.equal(r.rows[0].impact, '+12% conversion')
  assert.ok(r.rows[0].hard.includes('user-research') && r.rows[0].hard.includes('prototyping'))
  assert.ok(r.rows[2].soft.includes('stakeholders'))
  assert.equal(r.rows.every((x) => !x.sample), true)
  assert.deepEqual(r.person, { name: 'Asha Rao', role: 'Product Designer' })
  assert.equal(r.fromRoles, 0)
})

test('when a resume names few projects, roles fill the gap', () => {
  const r = rowsFromExtracted({
    timeline: [
      { id: '1', role: 'Senior Designer', company: 'Acme', startDate: '', endDate: '', description: 'Led a team of 4 and ran workshops', confirmed: true },
      { id: '2', role: 'Designer', company: 'Beta', startDate: '', endDate: '', confirmed: true },
    ],
    projects: [{ id: 'a', name: 'Checkout redesign', company: 'Acme', summary: '' }],
  })
  assert.equal(r.rows.length, 3)
  assert.equal(r.fromRoles, 2)
  assert.ok(r.rows[1].soft.includes('leading') && r.rows[1].soft.includes('facilitation'))
})

test('duplicates, blanks and missing data are handled', () => {
  assert.deepEqual(rowsFromExtracted(null).rows, [])
  assert.deepEqual(rowsFromExtracted({}).person, { name: '', role: '' })
  const r = rowsFromExtracted({ projects: [
    { id: 'a', name: 'Same', company: '' }, { id: 'b', name: 'same', company: '' }, { id: 'c', name: '  ', company: '' },
  ] })
  assert.equal(r.rows.length, 1)
})

test('imports are capped', () => {
  const projects = Array.from({ length: 30 }, (_, i) => ({ id: `${i}`, name: `Project ${i}`, company: '' }))
  assert.equal(rowsFromExtracted({ projects }).rows.length, 12)
})
