// Trilateration, drawn: each signal is a beacon, each circle is the distance from that beacon to you.
// Where the three circles meet is the fix. Radii are the real distances from each beacon to the fix point,
// and the viewBox is sized so every circle fits whole.
const FIX = { x: 300, y: 310 }
const BEACONS = [
  { key: 'strengths', label: 'Strengths', sub: 'what you\'ve proven', x: 170, y: 175, from: 1.55, color: 'var(--color-strength-fill)', text: 'var(--color-strength)', above: true },
  { key: 'passion', label: 'Passion', sub: 'what pulls you', x: 450, y: 165, from: 1.7, color: 'var(--color-passion-fill)', text: 'var(--color-passion)', above: true },
  { key: 'market', label: 'Market demand', sub: 'what is wanted', x: 330, y: 470, from: 1.6, color: 'var(--color-market-fill)', text: 'var(--color-market)', above: false },
]
const dist = (b: { x: number; y: number }) => Math.round(Math.hypot(b.x - FIX.x, b.y - FIX.y) * 10) / 10

export function FixDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="-40 -50 720 740" className={className} role="img" aria-labelledby="fix-title fix-desc">
      <title id="fix-title">Three circles meeting at one point</title>
      <desc id="fix-desc">Strengths, passion and market demand each draw a circle. Where they meet is your fix.</desc>
      {BEACONS.map((b) => {
        const labelY = b.above ? b.y - 38 : b.y + 42
        return (
          <g key={b.key}>
            <circle className="fix-ring" style={{ ['--from' as string]: b.from }} cx={b.x} cy={b.y} r={dist(b)} fill={b.color} fillOpacity="0.08" stroke={b.color} strokeWidth="2.5" />
            <line x1={b.x} y1={b.y} x2={FIX.x} y2={FIX.y} stroke={b.color} strokeWidth="1.5" strokeDasharray="3 6" className="fix-mark" />
            <circle cx={b.x} cy={b.y} r="7" fill={b.color} />
            <text x={b.x} y={labelY} textAnchor="middle" fill={b.text} fontSize="26" fontWeight="650" fontFamily="var(--font-display)">{b.label}</text>
            <text x={b.x} y={labelY + 22} textAnchor="middle" fill="var(--color-muted)" fontSize="17" fontFamily="var(--font-body)" fontStyle="italic">{b.sub}</text>
          </g>
        )
      })}
      <g className="fix-mark">
        <circle cx={FIX.x} cy={FIX.y} r="17" fill="var(--color-paper)" stroke="var(--color-ink)" strokeWidth="2.5" />
        <circle cx={FIX.x} cy={FIX.y} r="6" fill="var(--color-ink)" />
        <text x={FIX.x + 28} y={FIX.y + 8} fill="var(--color-ink)" fontSize="24" fontWeight="650" fontFamily="var(--font-display)">your fix</text>
      </g>
    </svg>
  )
}
