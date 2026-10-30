import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Passion worksheet' }

const PROMPTS = [
  'List the three projects you would repeat tomorrow. What exactly made each one worth repeating?',
  'List the project you were glad to finish. What drained you: the work itself, the people, the pace or the setting?',
  'When did you last lose track of time at work? What were you doing?',
  'Which problem do you keep noticing and wanting to fix, even when it is not your job?',
  'What do colleagues ask you to help with, and which of those requests do you secretly enjoy?',
  'Name two areas you would work on for a year without a pay rise. What do they have in common?',
  'What would you stop doing today if you could, and is that the work or the way it is organised?',
]

export default function PassionWorksheet() {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-10 pt-14 sm:px-8">
      <p className="no-print"><Link href="/resources" className="font-display text-[0.95rem] underline underline-offset-4">Back to resources</Link></p>
      <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)] font-bold">Passion worksheet</h1>
      <p className="mt-4 text-ink-soft">Answer in a sentence or two. Look for patterns across your answers rather than a single winner. Bring them to step three of the app, where you mark each project and choose your areas.</p>
      <p className="no-print mt-3 text-[1rem] text-muted">Use your browser&apos;s print command to print this page or save it as a PDF.</p>
      <ol className="mt-10 space-y-9">
        {PROMPTS.map((p, i) => (
          <li key={p}>
            <p className="font-display text-[1.15rem] font-semibold"><span className="mr-2 text-muted">{i + 1}.</span>{p}</p>
            <div className="mt-3 space-y-5" aria-hidden="true">
              <div className="border-b border-rule pt-5" /><div className="border-b border-rule pt-5" />
            </div>
          </li>
        ))}
      </ol>
    </article>
  )
}
