'use client'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import type { ActivityEvent } from '@/types/wingspan'
import type { StrengthScore } from '@/lib/alphavector/strengths'
import { cx } from '@/components/onboarding/ui'
import { lead, primary, secondary, textAction, title } from './ui'

const STAGES: Array<{ label: string; sources: string[] }> = [
  { label: 'Reading your projects', sources: ['aggregator', 'careerDna'] },
  { label: 'Checking the market', sources: ['market'] },
  { label: 'Comparing your routes', sources: ['directions', 'orchestrator'] },
  { label: 'Planning your roadmap', sources: ['growth', 'blueprint'] },
]

type Phase = 'running' | 'ready' | 'error'

/** The wait: four plain stages and a preview of what is already known, instead of a page of details to check. */
export function BuildingScreen({ name, activity, phase, error, strengths, onOpen, onRetry, onBack }: {
  name: string
  activity: ActivityEvent[]
  phase: Phase
  error: string | null
  strengths: StrengthScore[]
  onOpen: () => void
  onRetry: () => void
  onBack: () => void
}) {
  const done = (src: string) => activity.some((e) => e.source === src && e.status === 'done')
  const started = (src: string) => activity.some((e) => e.source === src)
  const status = STAGES.map((s) => (phase === 'ready' || s.sources.every(done) ? 'done' : s.sources.some(started) ? 'active' : 'waiting'))
  // The first unfinished stage is the one in progress, even before its first event arrives.
  const firstOpen = status.findIndex((x) => x !== 'done')
  const shown = status.map((x, i) => (phase === 'running' && i === firstOpen && x === 'waiting' ? 'active' : x))
  const first = name.trim().split(/\s+/)[0]

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-5 pb-16 pt-24">
      {phase === 'error' ? (
        <div role="alert">
          <AlertCircle size={28} aria-hidden className="text-red-400" />
          <h1 className="mt-4 text-[28px] font-semibold text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sora)' }}>That did not finish</h1>
          <p className="mt-2 text-[16px] text-[var(--text-secondary)]">{friendlyError(error)} Your projects are safe.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={onRetry} className={primary}>Try again</button>
            <button type="button" onClick={onBack} className={secondary}><ArrowLeft size={15} aria-hidden /> Back to my projects</button>
          </div>
        </div>
      ) : (
        <>
          <h1 className={title} style={{ fontFamily: 'var(--font-sora)' }}>
            {phase === 'ready' ? (first ? `${first}, your Blueprint is ready` : 'Your Blueprint is ready') : first ? `Building your Blueprint, ${first}` : 'Building your Blueprint'}
          </h1>
          <p className={lead}>
            {phase === 'ready' ? 'Three routes, the gaps to close and a roadmap are waiting.' : 'This takes about four minutes. You can leave this tab open and come back.'}
          </p>

          <ol className="mt-8 flex flex-col gap-3" aria-label="Progress">
            {STAGES.map((s, i) => (
              <li key={s.label} className={cx('flex items-center gap-3 text-[17px]', shown[i] === 'waiting' ? 'text-[var(--text-dim)]' : 'text-[var(--text-primary)]')} aria-current={shown[i] === 'active' ? 'step' : undefined}>
                <span className={cx('flex h-7 w-7 items-center justify-center rounded-full border', shown[i] === 'done' ? 'border-[var(--neon)] bg-[var(--neon)] text-[#0a0a0a]' : 'border-[var(--border-ws)]')}>
                  {shown[i] === 'done' ? <Check size={15} strokeWidth={3} aria-hidden /> : shown[i] === 'active' ? <Loader2 size={15} aria-hidden className="animate-spin text-[var(--neon)] motion-reduce:animate-none" /> : null}
                </span>
                {s.label}
              </li>
            ))}
          </ol>

          {phase === 'ready' && (
            <button type="button" onClick={onOpen} className={cx(primary, 'av-rise mt-8 w-fit !px-7 !py-3.5 !text-[17px]')}>Open my Blueprint <ArrowRight size={16} aria-hidden /></button>
          )}

          {strengths.length > 0 && (
            <section className="mt-12 border-t border-[var(--border-dim)] pt-6" aria-label="What your projects already show">
              <h2 className="text-[14px] font-semibold text-[var(--text-secondary)]">{phase === 'ready' ? 'What your projects showed' : 'While you wait, here is what your projects already show'}</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {strengths.slice(0, 5).map((s) => <li key={s.id} className="rounded-full border border-[var(--border-ws)] px-3.5 py-1.5 text-[14px] text-[var(--text-primary)]">{s.label}</li>)}
              </ul>
            </section>
          )}

          {phase === 'running' && (
            <button type="button" onClick={onBack} className={cx('mt-10 w-fit', textAction)}>Stop and edit my projects</button>
          )}
        </>
      )}
    </main>
  )
}

/** Turn raw provider errors into a sentence a person can act on. */
export function friendlyError(error?: string | null): string {
  if (!error) return 'Something went wrong while building your Blueprint.'
  if (/invalid api key|invalid_api_key|api key|\b401\b|\b403\b/i.test(error)) {
    return 'The AI service is not connected on this version of the app yet. This is a setup issue, not something you did.'
  }
  if (/\b429\b|rate limit|quota/i.test(error)) return 'The AI service is busy right now. Wait a minute and try again.'
  return 'Something went wrong while building your Blueprint.'
}
