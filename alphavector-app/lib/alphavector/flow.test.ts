import test from 'node:test'
import assert from 'node:assert/strict'
import { inferProcesses, resolveRow, toggleProcess } from './infer'
import { continueGate, evidence, MIN_PROJECTS } from './progress'
import { parsePasted, sampleRows } from './samples'
import { buildExtractedData } from './toExtracted'
import { emptyInputs, isBlank, isDescribed, newRow, type ProjectRow } from './types'

const row = (o: Partial<ProjectRow>): ProjectRow => resolveRow({ ...newRow(), name: 'P', ...o })

test('plain sentences are enough to infer hard and soft skills', () => {
  const { hard, soft } = inferProcesses('Interviewed 12 students, built a clickable prototype in Figma and presented it to the product head')
  assert.ok(hard.includes('user-research'))
  assert.ok(hard.includes('prototyping'))
  assert.ok(soft.includes('storytelling'))
  assert.ok(soft.includes('stakeholders'))
})

test('text with no signals infers nothing', () => {
  assert.deepEqual(inferProcesses('Did some work'), { hard: [], soft: [] })
})

test('resolveRow derives ticks from the words', () => {
  const r = row({ did: 'Ran a workshop and mapped the customer journey' })
  assert.ok(r.soft.includes('facilitation'))
  assert.ok(r.hard.includes('service-journeys'))
})

test('manual removal beats inference and manual adds survive edits', () => {
  let r = row({ did: 'Built a prototype in Figma' })
  assert.ok(r.hard.includes('prototyping'))
  r = resolveRow({ ...r, ...toggleProcess(r, 'prototyping') })
  assert.ok(!r.hard.includes('prototyping'), 'removed by hand')
  r = resolveRow({ ...r, did: r.did + ' and tested with users' })
  assert.ok(!r.hard.includes('prototyping'), 'stays removed after more typing')
  assert.ok(r.hard.includes('usability-testing'))
  r = resolveRow({ ...r, ...toggleProcess(r, 'accessibility') })
  assert.ok(r.hard.includes('accessibility'), 'added by hand')
  r = resolveRow({ ...r, did: 'something else' })
  assert.ok(r.hard.includes('accessibility'), 'manual add survives rewriting the text')
})

test('rows describe themselves once there is a sentence or a tick', () => {
  assert.equal(isDescribed(row({ name: 'A' })), false)
  assert.equal(isDescribed(row({ name: 'A', did: 'Designed the screens end to end' })), true)
  assert.equal(isBlank(newRow()), true)
  assert.equal(isBlank(row({ name: '' , did: 'x' })), false)
})

test('evidence meter grows with detail and gives one next step', () => {
  assert.equal(evidence([]).pct, 0)
  assert.match(evidence([]).next ?? '', /Add 3 more projects/)
  const three = [1, 2, 3].map((n) => row({ name: `P${n}`, did: 'Designed the whole flow and tested it' }))
  const e3 = evidence(three)
  assert.equal(e3.pct, 30 + 18)
  assert.match(e3.next ?? '', /came of it/)
  const rich = [1, 2, 3, 4, 5].map((n) => row({ name: `P${n}`, did: 'Designed the whole flow and tested it', impact: 'up 10%' }))
  const e5 = evidence(rich)
  assert.equal(e5.pct, 100)
  assert.equal(e5.label, 'Strong')
  assert.equal(e5.next, null)
})

test('example rows are flagged and never analysed until edited', () => {
  const samples = sampleRows()
  assert.equal(samples.length, 3)
  assert.ok(samples.every((s) => s.sample && s.hard.length > 0))
  const inputs = emptyInputs()
  inputs.rows = samples
  assert.equal(buildExtractedData(inputs).projects.length, 0)
  inputs.rows = [{ ...samples[0], sample: false }]
  assert.equal(buildExtractedData(inputs).projects.length, 1)
})

test('pasted lines and spreadsheet rows become project rows', () => {
  const lines = parsePasted('1. Checkout redesign - ran interviews and built a prototype\n- Design system: wrote the component library\n\nMobile app')
  assert.equal(lines.length, 3)
  assert.equal(lines[0].name, 'Checkout redesign')
  assert.ok(lines[0].hard.includes('user-research'))
  assert.equal(lines[1].name, 'Design system')
  assert.equal(lines[2].did, '')
  const sheet = parsePasted('Bank app\tAcme\tFintech\tPresented to the CEO\t+12% conversion')
  assert.equal(sheet[0].client, 'Acme')
  assert.equal(sheet[0].industry, 'Fintech')
  assert.equal(sheet[0].impact, '+12% conversion')
  assert.ok(sheet[0].soft.includes('stakeholders'))
})

test('stage sets years and a student gets a sensible timeline', () => {
  const inputs = emptyInputs()
  inputs.about.stage = 'student'
  inputs.rows = [row({ name: 'Thesis project', did: 'Interviewed users' })]
  const d = buildExtractedData(inputs, 2026)
  assert.equal(d.timeline[0].role, 'Student')
  assert.equal(d.timeline[0].startDate, '2026')
  inputs.about.stage = '6-10'
  assert.equal(buildExtractedData(inputs, 2026).timeline[0].startDate, '2018')
  assert.match(buildExtractedData(inputs).projects[0].summary ?? '', /in their words: Interviewed users/)
})

test('continuing needs at least three described projects, a stage and no unedited examples', () => {
  const three = [1, 2, 3].map((n) => row({ name: `P${n}`, did: 'Designed the screens and tested them' }))
  assert.equal(MIN_PROJECTS, 3)
  assert.match(continueGate('', three) ?? '', /where you are/)
  assert.equal(continueGate('student', three), null)
  assert.match(continueGate('student', three.slice(0, 2)) ?? '', /Add 1 more project to continue/)
  assert.match(continueGate('student', [])  ?? '', /Add 3 more projects/)
  const undescribed = [row({ name: 'A', did: 'Designed the screens and tested them' }), row({ name: 'B' }), row({ name: 'C' })]
  assert.match(continueGate('3-5', undescribed) ?? '', /Say what you did on 2 more projects/)
  assert.match(continueGate('student', [...three, ...sampleRows()]) ?? '', /examples/)
  assert.equal(continueGate('student', [...three, newRow()]), null, 'blank rows are ignored')
})
