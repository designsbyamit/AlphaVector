'use client'
import { useState } from 'react'
import { cx, focusRing } from '@/components/onboarding/ui'

/** A quiet header: the name, a promise that nothing is lost, and a way out. */
export function FlowHeader({ onStartOver, label }: { onStartOver: () => void; label?: string }) {
  const [asking, setAsking] = useState(false)
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--border-dim)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/AlphaVector_H.svg" alt="AlphaVector" className="h-6 w-auto" />
        <div className="flex items-center gap-4 text-[13px] text-[var(--text-muted)]">
          {label && <span className="hidden sm:inline">{label}</span>}
          <span className="hidden sm:inline">Saved on this device</span>
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
    </header>
  )
}
