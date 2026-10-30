import { NextResponse } from 'next/server'

// Workshop enquiries are emailed through Resend's REST API. When the keys are not configured the route says so
// plainly (503) and the form shows an email fallback, so an enquiry is never silently lost.

const FIELDS = ['name', 'email', 'organisation', 'kind', 'size', 'timing', 'message'] as const
const LIMITS: Record<(typeof FIELDS)[number], number> = { name: 120, email: 200, organisation: 200, kind: 60, size: 40, timing: 120, message: 3000 }
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Send the form as JSON.' }, { status: 400 })
  // Honeypot: real people never fill this field.
  if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true })

  const v = {} as Record<(typeof FIELDS)[number], string>
  for (const f of FIELDS) v[f] = typeof body[f] === 'string' ? (body[f] as string).trim().slice(0, LIMITS[f]) : ''
  if (!v.name || !v.organisation) return NextResponse.json({ error: 'Add your name and organisation.' }, { status: 400 })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return NextResponse.json({ error: 'Enter a valid email address so we can reply.' }, { status: 400 })

  const key = process.env.RESEND_API_KEY
  const to = process.env.ENQUIRY_TO
  if (!key || !to) return NextResponse.json({ error: 'This form cannot take enquiries right now.' }, { status: 503 })

  const rows = [['Name', v.name], ['Email', v.email], ['Organisation', v.organisation], ['Type', v.kind], ['Group size', v.size], ['Preferred timing', v.timing], ['Message', v.message]]
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? 'AlphaVector <onboarding@resend.dev>',
      to: [to],
      reply_to: v.email,
      subject: `Workshop enquiry: ${v.organisation}`,
      html: `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows.map(([k, val]) => `<tr><td><b>${k}</b></td><td>${esc(val || '-').replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`,
    }),
  }).catch(() => null)

  if (!res || !res.ok) return NextResponse.json({ error: 'The message could not be sent. Please try again or email us.' }, { status: 502 })
  return NextResponse.json({ ok: true })
}
