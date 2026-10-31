'use client'
import { useState } from 'react'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error'; message: string; fallback?: boolean }

const input = 'field mt-1.5'

export function EnquiryForm({ contactEmail, mode = 'workshop' }: { contactEmail: string; mode?: 'workshop' | 'details' }) {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch('/api/enquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      const json = (await res.json().catch(() => ({}))) as { error?: string }
      if (res.ok) return setStatus({ kind: 'sent' })
      setStatus({ kind: 'error', message: json.error ?? 'Something went wrong.', fallback: res.status >= 500 })
    } catch {
      setStatus({ kind: 'error', message: 'You appear to be offline. Check your connection and send again.' })
    }
  }

  if (status.kind === 'sent') {
    return (
      <div role="status" className="card">
        <p className="font-display text-[1.4rem] font-medium">Enquiry sent</p>
        <p className="mt-2 text-ink-soft">Thank you. We will reply to the email address you gave.</p>
      </div>
    )
  }

  if (mode === 'details') {
    return (
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
        <input type="hidden" name="kind" value="Technical note request" />
        <label className="block font-display text-[0.95rem] font-medium">Your name
          <input name="name" required autoComplete="name" className={input} />
        </label>
        <label className="block font-display text-[0.95rem] font-medium">Email
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block font-display text-[0.95rem] font-medium sm:col-span-2">Organisation (optional)
          <input name="organisation" autoComplete="organization" className={input} />
        </label>
        <label className="block font-display text-[0.95rem] font-medium sm:col-span-2">What would you like to know?
          <textarea name="message" rows={4} placeholder="For example: how strengths are scored, or where the market data comes from" className={input} />
        </label>
        <div className="absolute left-[-9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <div className="sm:col-span-2">
          <button type="submit" disabled={status.kind === 'sending'} className="btn btn-primary">{status.kind === 'sending' ? 'Sending' : 'Request the technical note'}</button>
          {status.kind === 'error' && (
            <p role="alert" className="mt-4 max-w-xl text-[1rem] text-passion">
              {status.message}
              {status.fallback && contactEmail ? <> You can also write to <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : null}
            </p>
          )}
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
      <label className="block font-display text-[0.95rem] font-medium">Your name
        <input name="name" required autoComplete="name" className={input} />
      </label>
      <label className="block font-display text-[0.95rem] font-medium">Email
        <input name="email" type="email" required autoComplete="email" className={input} />
      </label>
      <label className="block font-display text-[0.95rem] font-medium">Organisation
        <input name="organisation" required autoComplete="organization" className={input} />
      </label>
      <label className="block font-display text-[0.95rem] font-medium">Group type
        <select name="kind" className={input} defaultValue="Institute or college">
          <option>Institute or college</option><option>Training centre</option><option>School</option><option>Company or community</option><option>Other</option>
        </select>
      </label>
      <label className="block font-display text-[0.95rem] font-medium">Group size
        <input name="size" inputMode="numeric" placeholder="e.g. 30" className={input} />
      </label>
      <label className="block font-display text-[0.95rem] font-medium">Preferred timing
        <input name="timing" placeholder="e.g. January, weekday mornings" className={input} />
      </label>
      <label className="block font-display text-[0.95rem] font-medium sm:col-span-2">What would you like the group to leave with?
        <textarea name="message" rows={4} className={input} />
      </label>
      {/* Honeypot: hidden from people, visible to bots. */}
      <div className="absolute left-[-9999px]" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={status.kind === 'sending'} className="btn btn-primary">
          {status.kind === 'sending' ? 'Sending' : 'Send enquiry'}
        </button>
        {status.kind === 'error' && (
          <p role="alert" className="mt-4 max-w-xl text-[1rem] text-passion">
            {status.message}
            {status.fallback && contactEmail ? <> You can also write to <a className="underline" href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : null}
          </p>
        )}
      </div>
    </form>
  )
}
