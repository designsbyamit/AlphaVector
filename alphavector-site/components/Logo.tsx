export function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g strokeWidth="3.5">
        <circle cx="24" cy="26" r="15" stroke="var(--color-strength-fill)" />
        <circle cx="40" cy="26" r="15" stroke="var(--color-passion-fill)" />
        <circle cx="32" cy="40" r="15" stroke="var(--color-market-fill)" />
      </g>
      <circle cx="32" cy="31" r="4.2" fill="var(--color-ink)" />
    </svg>
  )
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display text-[1.35rem] font-semibold tracking-tight">AlphaVector</span>
    </span>
  )
}
