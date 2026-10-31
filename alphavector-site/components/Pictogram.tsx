'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'

// Pictograms in the portfolio's language: a coloured field panel with a faint grid, thin ink strokes, dashed
// connectors at half opacity, and exactly one lime accent. Each plays once when it scrolls into view.
// The three signals map to three of the portfolio's field tones: Strengths teal, Passion plum, Market graphite.
export type PictogramKind = 'vector' | 'strengths' | 'passion' | 'market' | 'routes' | 'loop'
export type FieldTone = 'cobalt' | 'teal' | 'plum' | 'graphite'

const I = 'var(--color-on-field)'
const L = 'var(--color-signal)'
const dash = { strokeDasharray: '3 5', opacity: 0.55 } as const

const ART: Record<PictogramKind, ReactNode> = {
  // Size and direction: from you, toward the point where the three signals agree.
  vector: (
    <>
      <circle className="fix-mark" style={{ ['--delay' as string]: '0.2s' }} cx="40" cy="86" r="6" fill="none" stroke={I} strokeWidth="1.5" />
      <line className="pg-draw" style={{ ['--len' as string]: 130 }} x1="46" y1="82" x2="150" y2="36" stroke={I} strokeWidth="1.5" />
      <polyline className="pg-mark" style={{ ['--delay' as string]: '1.1s' }} points="134,34 152,35 146,52" fill="none" stroke={I} strokeWidth="1.5" strokeLinejoin="round" />
      <circle className="fix-ring" style={{ ['--from' as string]: 1.6, animationDelay: '0.9s' }} cx="160" cy="32" r="18" fill="none" stroke={I} strokeWidth="1.2" {...dash} />
      <circle className="pg-mark" style={{ ['--delay' as string]: '1.4s' }} cx="160" cy="32" r="8" fill={L} />
    </>
  ),
  // Evidence: rows of proof, the strongest one is the signal.
  strengths: (
    <>
      {[0, 1, 2].map((i) => (
        <g key={i} className="pg-mark" style={{ ['--delay' as string]: `${0.2 + i * 0.35}s` }}>
          <rect x="44" y={26 + i * 28} width="112" height="20" rx="10" fill="none" stroke={i === 0 ? L : I} strokeWidth="1.5" />
          <circle cx="56" cy={36 + i * 28} r="5" fill={i === 0 ? L : 'none'} stroke={i === 0 ? L : I} strokeWidth="1.5" />
          <line x1="72" y1={36 + i * 28} x2={138 - i * 22} y2={36 + i * 28} stroke={I} strokeWidth="1.5" opacity="0.7" />
        </g>
      ))}
    </>
  ),
  // Pull: ripples out from one point, centred.
  passion: (
    <>
      {[16, 32, 48, 64].map((r, i) => (
        <circle key={r} className="fix-ring" style={{ ['--from' as string]: 1.4, animationDelay: `${i * 0.2}s` }} cx="100" cy="60" r={r} fill="none" stroke={I} strokeWidth="1.5" opacity={1 - i * 0.2} />
      ))}
      <circle className="pg-ripple" style={{ ['--delay' as string]: '1.2s' }} cx="100" cy="60" r="64" fill="none" stroke={L} strokeWidth="1.2" />
      <circle className="pg-mark" style={{ ['--delay' as string]: '0.9s' }} cx="100" cy="60" r="8" fill={L} />
    </>
  ),
  // Demand: bars that rise, the tallest and newest is the signal.
  market: (
    <>
      {[[46, 30], [76, 46], [106, 62], [136, 82]].map(([x, h], i) => (
        <rect key={x} className="pg-mark" style={{ ['--delay' as string]: `${0.2 + i * 0.3}s` }} x={x} y={98 - h} width="20" height={h} rx="2" fill={i === 3 ? L : 'none'} stroke={i === 3 ? L : I} strokeWidth="1.5" />
      ))}
      <line className="pg-draw" style={{ ['--len' as string]: 130, animationDelay: '0.8s' }} x1="40" y1="100" x2="170" y2="100" stroke={I} strokeWidth="1.2" opacity="0.55" />
    </>
  ),
  // Three routes at three distances, you at the centre.
  routes: (
    <>
      {[22, 42, 62].map((r, i) => (
        <circle key={r} className="fix-ring" style={{ ['--from' as string]: 1.4, animationDelay: `${i * 0.3}s` }} cx="100" cy="60" r={r} fill="none" stroke={I} strokeWidth="1.2" {...dash} />
      ))}
      {[[22, 200], [42, 340], [62, 90]].map(([r, a], i) => (
        <g key={r} className="pg-mark" style={{ ['--delay' as string]: `${1 + i * 0.35}s` }}>
          <line x1="100" y1="60" x2={100 + r * Math.cos((a * Math.PI) / 180)} y2={60 + r * Math.sin((a * Math.PI) / 180)} stroke={I} strokeWidth="1" opacity="0.5" />
          <circle cx={100 + r * Math.cos((a * Math.PI) / 180)} cy={60 + r * Math.sin((a * Math.PI) / 180)} r="5" fill="none" stroke={I} strokeWidth="1.5" />
        </g>
      ))}
      <circle className="pg-mark" style={{ ['--delay' as string]: '0.7s' }} cx="100" cy="60" r="8" fill={L} />
    </>
  ),
  // The portfolio's own loop motif, slowly turning: two circles that keep being checked against each other.
  loop: (
    <>
      <g className="pg-orbit-c">
        <circle className="fix-ring" style={{ ['--from' as string]: 1.3 }} cx="76" cy="60" r="34" fill="none" stroke={L} strokeWidth="2" />
        <circle className="fix-ring" style={{ ['--from' as string]: 1.3, animationDelay: '0.2s' }} cx="124" cy="60" r="34" fill="none" stroke={I} strokeWidth="2" />
      </g>
    </>
  ),
}

const bg: Record<FieldTone, string> = { cobalt: 'var(--field-cobalt)', teal: 'var(--field-teal)', plum: 'var(--field-plum)', graphite: 'var(--field-graphite)' }

export function Pictogram({ kind, tone = 'cobalt', label, className = '' }: { kind: PictogramKind; tone?: FieldTone; label?: string; className?: string }) {
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
    <div ref={ref} className={`field-panel relative overflow-hidden ${className}`} style={{ background: bg[tone], aspectRatio: '16 / 10' }} aria-hidden="true">
      <div className="field-grid" />
      {label && <span className="absolute left-4 top-3 font-mono text-[0.625rem] uppercase tracking-[0.08em]" style={{ color: 'var(--color-signal)' }}>{label}</span>}
      <div className="absolute inset-[10%]">
        {seen && <svg viewBox="0 0 200 120" className="h-full w-full overflow-visible">{ART[kind]}</svg>}
      </div>
    </div>
  )
}
