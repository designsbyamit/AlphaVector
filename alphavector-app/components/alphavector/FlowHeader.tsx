'use client'
import { useState } from 'react'
import { cx, focusRing } from '@/components/onboarding/ui'

/** A quiet header: the name, where you are, and a way out. The thin line shows progress through the steps. */
export function FlowHeader({ onStartOver, step, total }: { onStartOver: () => void; step?: number; total?: number }) {
  const [asking, setAsking] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-dim)] bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[45rem] items-center justify-between gap-4 px-4 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/AlphaVector_H.svg" alt="AlphaVector" className="h-6 w-auto" />
        <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)]">
          {step && total ? <span>Step {step} of {total}</span> : null}
          {asking ? (
            <span className="flex items-center gap-2">
              Clear everything?
              <button type="button" onClick={() => { setAsking(false); onStartOver() }} className={cx('font-semibold text-red-400 underline underline-offset-4', focusRing)}>Yes, start over</button>
              <button type="button" onClick={() => setAsking(false)} className={cx('underline underline-offset-4', focusRing)}>Keep</button>
            </span>
          ) : (
            <button type="button" onClick={() => setAsking(true)} className={cx('underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)}>Start over</button>
          )}
        </div>
      </div>
      {step && total ? (
        <div className="h-[2px] bg-[var(--border-dim)]" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label="Progress">
          <div className="h-full bg-[var(--neon)] transition-[width] duration-500" style={{ width: `${(step / total) * 100}%` }} />
        </div>
      ) : null}
    </header>
  )
}
