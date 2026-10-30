import test from 'node:test'
import assert from 'node:assert/strict'
import { resolveRow } from './infer'
import { acceptSuggestion, addCustom, customId, EXTRAS, extraLabel, removeExtra, skipSuggestions, suggestionsFor } from './suggest'
import { HARD_PROCESSES, SOFT_PROCESSES } from './catalog'
import { newRow, type ProjectRow } from './types'

const row = (o: Partial<ProjectRow> = {}): ProjectRow => resolveRow({ ...newRow(), name: 'P', ...o })
const ALL = [...HARD_PROCESSES, ...SOFT_PROCESSES].map((p) => p.id)

test('an empty project starts with common standard skills, craft and people mixed', () => {
  const s = suggestionsFor(row())
  assert.equal(s.tier, 'standard')
  assert.equal(s.items.length, 6)
  assert.ok(s.items.every((i) => i.tier === 'standard'))
  assert.ok(s.items.some((i) => i.kind === 'hard') && s.items.some((i) => i.kind === 'soft'))
  assert.ok(s.items.map((i) => i.id).includes('prototyping'))
})

test('what is already ticked is never offered again', () => {
  const r = row({ did: 'Built a prototype in Figma and interviewed users' })
  const ids = suggestionsFor(r).items.map((i) => i.id)
  assert.ok(!ids.includes('prototyping') && !ids.includes('user-research'))
})

test('suggestions follow the work: after user research, related skills rise', () => {
  const r = row({ did: 'Interviewed twelve students' })
  const ids = suggestionsFor(r).items.map((i) => i.id)
  assert.ok(ids.includes('research-synthesis') || ids.includes('usability-testing'))
})

test('skills used on other projects are likely here too', () => {
  const other = row({ manual: ['accessibility'] })
  const without = suggestionsFor(row(), []).items.map((i) => i.id)
  const withOthers = suggestionsFor(row(), [other, row({ manual: ['accessibility'] })]).items.map((i) => i.id)
  assert.ok(!without.includes('accessibility'))
  assert.ok(withOthers.includes('accessibility'))
})

test('tapping adds a standard skill and a replacement pops in', () => {
  const r = row()
  const first = suggestionsFor(r).items[0]
  const r2 = resolveRow({ ...r, ...acceptSuggestion(r, first) })
  assert.ok([...r2.hard, ...r2.soft].includes(first.id))
  const next = suggestionsFor(r2).items
  assert.equal(next.length, 6)
  assert.ok(!next.map((i) => i.id).includes(first.id))
})

test('skipping hides a suggestion but does not hide a skill the text implies', () => {
  let r = row()
  const first = suggestionsFor(r).items[0]
  r = resolveRow({ ...r, ...skipSuggestions(r, [first.id]) })
  assert.ok(!suggestionsFor(r).items.map((i) => i.id).includes(first.id))
  r = resolveRow({ ...r, did: 'prototype wireframes user interviews presented to the CEO' })
  assert.ok([...r.hard, ...r.soft].some((id) => id === 'prototyping' || id === 'user-research'))
})

test('once every standard skill is covered, suggestive extras take over', () => {
  const r = row({ skipped: ALL })
  const s = suggestionsFor(r)
  assert.equal(s.tier, 'extra')
  assert.ok(s.items.length > 0 && s.items.every((i) => i.tier === 'extra' && i.id.startsWith('x-')))
})

test('extras are ranked by what the project shows, and added ones do not return', () => {
  const r = row({ skipped: ALL.filter((id) => id !== 'ai-design'), manual: ['ai-design'] })
  const ids = suggestionsFor(r).items.map((i) => i.id)
  assert.ok(ids.includes('x-prompts'), 'prompt design is near AI design')
  const r2 = { ...r, ...acceptSuggestion(r, { id: 'x-prompts', tier: 'extra' as const }) }
  assert.ok(r2.extra.includes('x-prompts'))
  assert.ok(!suggestionsFor(r2).items.map((i) => i.id).includes('x-prompts'))
})

test('when extras are also exhausted there is nothing left to show', () => {
  const r = row({ skipped: [...ALL, ...EXTRAS.map((e) => e.id)] })
  assert.deepEqual(suggestionsFor(r), { tier: 'done', items: [] })
})

test('custom skills can be added once, ignoring blanks and duplicates', () => {
  let r = row()
  r = { ...r, ...addCustom(r, '  Sound design  ') }
  assert.deepEqual(r.extra, [customId('Sound design')])
  assert.equal(extraLabel(r.extra[0]), 'Sound design')
  assert.deepEqual(addCustom(r, 'sound design'), {})
  assert.deepEqual(addCustom(r, ' '), {})
  r = { ...r, ...removeExtra(r, r.extra[0]) }
  assert.deepEqual(r.extra, [])
})
