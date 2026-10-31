'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cx, focusRing } from '@/components/onboarding/ui'
import { primary } from './ui'

// A small game for the wait: keep Strengths, Passion and Market all alive. It mirrors the framework,
// where a route only holds if all three signals do. Rounds last one to two minutes.

const GAUGES = [
  { id: 'strengths', label: 'Strengths', colour: '#2ec4b6', key: '1', drain: 0.85 },
  { id: 'passion', label: 'Passion', colour: '#ff6b8b', key: '2', drain: 1.0 },
  { id: 'market', label: 'Market', colour: 'var(--neon)', key: '3', drain: 1.15 },
] as const

const TAP = 24
const BEST_KEY = 'alphavector-balance-best'

function readBest(): number {
  if (typeof window === 'undefined') return 0
  try { return Number(localStorage.getItem(BEST_KEY)) || 0 } catch { return 0 }
}
function writeBest(n: number) {
  try { localStorage.setItem(BEST_KEY, String(n)) } catch { /* private mode: best score just is not kept */ }
}

type Mode = 'idle' | 'playing' | 'over'

export function BalanceGame() {
  const [mode, setMode] = useState<Mode>('idle')
  const [levels, setLevels] = useState<number[]>([100, 100, 100])
  const [seconds, setSeconds] = useState(0)
  const [best, setBest] = useState(readBest)
  const [lost, setLost] = useState<string | null>(null)
  const state = useRef({ levels: [100, 100, 100], t: 0, last: 0 })

  const start = useCallback(() => {
    state.current = { levels: [100, 100, 100], t: 0, last: performance.now() }
    setLevels([100, 100, 100]); setSeconds(0); setLost(null); setMode('playing')
  }, [])

  const tap = useCallback((i: number) => {
    const s = state.current
    s.levels = s.levels.map((v, j) => (j === i ? Math.min(100, v + TAP) : v))
    setLevels(s.levels)
  }, [])

  useEffect(() => {
    if (mode !== 'playing') return
    const id = window.setInterval(() => {
      const s = state.current
      const now = performance.now()
      // Clamp so switching tabs does not unfairly end a round.
      const dt = Math.min(0.25, (now - s.last) / 1000)
      s.last = now
      s.t += dt
      const base = 8 + s.t * 0.2
      s.levels = s.levels.map((v, i) => Math.max(0, v - base * GAUGES[i].drain * dt))
      setLevels(s.levels)
      setSeconds(Math.floor(s.t))
      const dead = s.levels.findIndex((v) => v <= 0)
      if (dead >= 0) {
        window.clearInterval(id)
        const score = Math.floor(s.t)
        setLost(GAUGES[dead].label)
        setSeconds(score)
        setBest((b) => { if (score > b) { writeBest(score); return score } return b })
        setMode('over')
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [mode])

  useEffect(() => {
    if (mode !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      const i = GAUGES.findIndex((g) => g.key === e.key)
      if (i >= 0) tap(i)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, tap])

  return (
    <section className="rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-5" aria-label="A game while you wait">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[17px] font-semibold text-[var(--text-primary)]">Keep the balance</h2>
        {best > 0 && <span className="text-[14px] text-[var(--text-muted)]">Best: {best}s</span>}
      </div>

      {mode === 'idle' && (
        <>
          <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]">
            Strengths, Passion and Market all drain. Tap one to refill it. If any of the three runs dry, the round ends. A good route needs all three, and so does this game.
          </p>
          <button type="button" onClick={start} className={cx(primary, 'mt-4')}>Play while you wait</button>
        </>
      )}

      {mode === 'playing' && (
        <>
          <p className="mt-2 text-[14px] text-[var(--text-muted)]">Tap a gauge, or press 1, 2 or 3. Time: {seconds}s</p>
          <div className="mt-3 flex flex-col gap-2.5">
            {GAUGES.map((g, i) => {
              const low = levels[i] < 28
              return (
                <button
                  key={g.id}
                  type="button"
                  onPointerDown={(e) => { e.preventDefault(); tap(i) }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i) } }}
                  className={cx('relative h-14 w-full select-none overflow-hidden rounded-xl border bg-[var(--bg)] text-left touch-manipulation', focusRing, low ? 'border-red-400/70' : 'border-[var(--border-ws)]')}
                  aria-label={`${g.label}, ${Math.round(levels[i])} percent. Tap to refill.`}
                >
                  <span className="absolute inset-y-0 left-0" style={{ width: `${levels[i]}%`, background: g.colour, opacity: 0.85 }} aria-hidden />
                  <span className="relative flex h-full items-center justify-between px-4 text-[16px] font-semibold text-[var(--text-primary)] mix-blend-normal">
                    <span className="rounded bg-[var(--bg)]/70 px-1.5">{g.label}</span>
                    <span className="rounded bg-[var(--bg)]/70 px-1.5 text-[13px] text-[var(--text-secondary)]">{g.key}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </>
      )}

      {mode === 'over' && (
        <>
          <p className="mt-2 text-[15px] leading-snug text-[var(--text-secondary)]" role="status">
            {lost} ran dry after {seconds} seconds.{seconds >= best && seconds > 0 ? ' That is your best yet.' : ''}
          </p>
          <button type="button" onClick={start} className={cx(primary, 'mt-4')}>Play again</button>
        </>
      )}
    </section>
  )
}
