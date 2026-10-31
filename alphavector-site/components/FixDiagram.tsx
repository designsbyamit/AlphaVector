// The fix, drawn in the portfolio's pictogram language: a field panel with a faint grid, thin ink strokes,
// dashed spokes, one lime accent. The layout is symmetrical about the vertical axis. Three beacons sit on an
// equilateral triangle around the fix, so all three distances (the circle radii) are equal: the point is
// reached by every signal at the same distance.
const INK = 'var(--color-on-field)'
const LIME = 'var(--color-signal)'
const F = { x: 240, y: 200 }
const D = 100
const at = (deg: number) => ({ x: F.x + D * Math.cos((deg * Math.PI) / 180), y: F.y + D * Math.sin((deg * Math.PI) / 180) })
const BEACONS = [
  { key: 'strengths', label: 'STRENGTHS', ...at(210), lx: 0, ly: -4, from: 1.5 },
  { key: 'passion', label: 'PASSION', ...at(330), lx: 0, ly: -4, from: 1.5 },
  { key: 'market', label: 'MARKET DEMAND', ...at(90), lx: 0, ly: 0, from: 1.5 },
]

export function FixDiagram({ className = '' }: { className?: string }) {
  return (
    <div className={`field-panel relative overflow-hidden ${className}`} style={{ background: 'var(--field-cobalt)', aspectRatio: '16 / 15' }}>
      <div className="field-grid" aria-hidden="true" />
      <span className="absolute left-5 top-4 font-mono text-[0.6875rem] uppercase tracking-[0.08em]" style={{ color: LIME }}>The fix</span>
      <svg viewBox="0 0 480 450" className="absolute inset-0 h-full w-full" role="img" aria-labelledby="fix-title fix-desc">
        <title id="fix-title">Three circles meeting at one point</title>
        <desc id="fix-desc">Strengths, passion and market demand each draw a circle at the same distance. Where they meet is your fix.</desc>
        {BEACONS.map((b, i) => (
          <g key={b.key}>
            <circle className="fix-ring" style={{ ['--from' as string]: b.from, animationDelay: `${i * 0.15}s` }} cx={b.x} cy={b.y} r={D} fill="none" stroke={INK} strokeWidth="2" />
            <line className="fix-mark" x1={b.x} y1={b.y} x2={F.x} y2={F.y} stroke={INK} strokeWidth="1.2" strokeDasharray="3 5" opacity="0.55" />
            <circle className="fix-mark" cx={b.x} cy={b.y} r="5.5" fill={INK} />
          </g>
        ))}
        <circle className="pg-ripple" style={{ ['--delay' as string]: '1.9s' }} cx={F.x} cy={F.y} r="30" fill="none" stroke={LIME} strokeWidth="1.5" />
        <circle className="fix-mark" cx={F.x} cy={F.y} r="11" fill={LIME} />
        <g fill={INK} fontFamily="var(--font-mono)" fontSize="13" letterSpacing="1.2" textAnchor="middle" className="fix-mark">
          <text x={BEACONS[0].x} y={BEACONS[0].y - D - 12}>{BEACONS[0].label}</text>
          <text x={BEACONS[1].x} y={BEACONS[1].y - D - 12}>{BEACONS[1].label}</text>
          <text x={BEACONS[2].x} y={BEACONS[2].y + D + 24}>{BEACONS[2].label}</text>
        </g>
      </svg>
    </div>
  )
}
