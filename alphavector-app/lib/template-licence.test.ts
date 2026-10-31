import test from 'node:test'
import assert from 'node:assert/strict'
import { generateProjectRepositoryTemplate } from './template'
import { parseXlsx } from './parsers/xlsx'
test('template carries its licence but the importer ignores it', async () => {
  const buf = generateProjectRepositoryTemplate()
  const text = await parseXlsx(buf)
  assert.ok(!/licen[cs]e|Creative Commons/i.test(text), 'licence text must not reach the extractor')
  assert.match(text, /--- Sheet: Projects ---/)
  const XLSX = await import('xlsx'); const wb = XLSX.read(buf, { type: 'buffer' })
  assert.ok(wb.SheetNames.includes('About & licence'))
  const csv = 'Project name,Client\nA,B\n# Content in this template is licensed under a Creative Commons Attribution 4.0 International license: x,,\n'
  const t2 = await parseXlsx(Buffer.from(csv))
  assert.ok(!/Creative Commons/.test(t2)); assert.match(t2, /A,B/)
})
