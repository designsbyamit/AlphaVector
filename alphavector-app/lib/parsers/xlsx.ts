// lib/parsers/xlsx.ts
export async function parseXlsx(buffer: Buffer): Promise<string> {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const lines: string[] = []
  for (const sheetName of workbook.SheetNames) {
    // The template carries its licence on its own sheet; it is not career data.
    if (/^about\b|^licen[cs]e/i.test(sheetName.trim())) continue
    lines.push(`--- Sheet: ${sheetName} ---`)
    const sheet = workbook.Sheets[sheetName]
    // Lines that start with # are notes (the CSV template ends with its licence line), not rows of data.
    const csv = XLSX.utils.sheet_to_csv(sheet).split('\n').filter((l) => !l.trimStart().startsWith('#')).join('\n')
    lines.push(csv)
  }
  return lines.join('\n')
}
