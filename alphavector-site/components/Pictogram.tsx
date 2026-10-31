'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

// Small animated pictograms in the same language as the hero diagram: thin strokes, soft-filled rings that
// close in on a point, one signal colour per signal. Each one plays once, when it scrolls into view.
export type PictogramKind = 'vector' | 'strengths' | 'passion' | 'market' | 'routes' | 'loop'

const S = { teal: 'var(--color-strength-fill)', rose: 'var(--color-passion-fill)', amber: 'var(--color-market-fill)', ink: 'var(--color-ink)', soft: 'var(--color-muted)' }
const ring = (cx: number, cy: number, r: number, c: string, from: number, delay = 0) => (
  <circle key={`${cx}${cy}${r}${c}`} className="fix-ring" style={{ ['--from' as string]: from, animationDelay: `${delay}s` }} cx={cx} cy={cy} r={r} fill={c} fillOpacity="0.1" stroke={c} strokeWidth="3" />
)

const ART: Record<PictogramKind, ReactNode> = {
  // Size and direction: an arrow drawn from you toward the point where three signals meet.
  vector: (
    <>
      <line className="pg-draw" style={{ ['--len' as string]: 112 }} x1="34" y1="126" x2="112" y2="52" stroke={S.ink} strokeWidth="3.5" strokeLinecap="round" />
      <g className="pg-mark" style={{ ['--delay' as string]: '1.1s' }}>
        <polyline points="96,50 114,50 114,68" fill="none" stroke={S.ink} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="34" cy="126" r="6" fill={S.ink} />
      </g>
      {ring(114, 50, 18, S.teal, 1.8, 0.3)}
      {ring(130, 50, 18, S.rose, 1.8, 0.45)}
      {ring(122, 64, 18, S.amber, 1.8, 0.6)}
    </>
  ),
  strengths: (
    <>
      {ring(80, 80, 50, S.teal, 1.5)}
      <polyline className="pg-draw" style={{ ['--len' as string]: 110, animationDelay: '0.9s' }} points="54,82 72,100 108,60" fill="none" stroke={S.teal} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  passion: (
    <>
      <circle className="pg-ripple" style={{ ['--delay' as string]: '0s' }} cx="80" cy="80" r="62" fill="none" stroke={S.rose} strokeWidth="2.5" />
      <circle className="pg-ripple" style={{ ['--delay' as string]: '1.1s' }} cx="80" cy="80" r="62" fill="none" stroke={S.rose} strokeWidth="2.5" />
      {ring(80, 80, 30, S.rose, 1.6)}
      <circle className="pg-mark" style={{ ['--delay' as string]: '1s' }} cx="80" cy="80" r="8" fill={S.rose} />
    </>
  ),
  market: (
    <>
      {ring(80, 80, 50, S.amber, 1.5)}
      <polyline className="pg-draw" style={{ ['--len' as string]: 130, animationDelay: '0.9s' }} points="46,104 68,84 86,96 116,58" fill="none" stroke={S.amber} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle className="pg-mark" style={{ ['--delay' as string]: '2s' }} cx="116" cy="58" r="7" fill={S.amber} />
    </>
  ),
  // Three routes at three distances from where you stand.
  routes: (
    <>
      {[26, 48, 70].map((r, i) => (
        <circle key={r} className="fix-ring" style={{ ['--from' as string]: 1.4, animationDelay: `${i * 0.35}s` }} cx="80" cy="80" r={r} fill="none" stroke={S.soft} strokeWidth="2.5" strokeDasharray="3 7" />
      ))}
      {[[26, -50], [48, 20], [70, 130]].map(([r, a], i) => (
        <circle key={r} className="pg-mark" style={{ ['--delay' as string]: `${1 + i * 0.4}s` }} cx={80 + r * Math.cos((a * Math.PI) / 180)} cy={80 + r * Math.sin((a * Math.PI) / 180)} r="7" fill={[S.teal, S.amber, S.rose][i]} />
      ))}
      <circle className="pg-mark" style={{ ['--delay' as string]: '0.8s' }} cx="80" cy="80" r="8" fill={S.ink} />
    </>
  ),
  // A fix you come back to: a slow orbit around the three signals.
  loop: (
    <>
      <circle className="fix-ring" style={{ ['--from' as string]: 1.3 }} cx="80" cy="80" r="52" fill="none" stroke={S.soft} strokeWidth="2.5" strokeDasharray="3 7" />
      <g className="pg-mark" style={{ ['--delay' as string]: '0.9s' }}>
        <circle cx="68" cy="74" r="9" fill={S.teal} />
        <circle cx="92" cy="74" r="9" fill={S.rose} />
        <circle cx="80" cy="94" r="9" fill={S.amber} />
      </g>
      <g className="pg-orbit"><circle cx="80" cy="28" r="7" fill="var(--color-signal)" /></g>
    </>
  ),
}

export function Pictogram({ kind, className = '' }: { kind: PictogramKind; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className={`aspect-square ${className}`} aria-hidden="true">
      {seen && <svg viewBox="0 0 160 160" className="h-full w-full overflow-visible">{ART[kind]}</svg>}
    </div>
  )
}
