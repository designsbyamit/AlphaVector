import { AlphaMark } from './AlphaMark'

/** Mark plus wordmark, in the current text colour so it works in both themes. */
export function BrandLogo({ className = '', markClass = 'h-6 w-auto', textClass = 'text-[1.05rem]' }: { className?: string; markClass?: string; textClass?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[var(--text-primary)] ${className}`}>
      <AlphaMark className={markClass} />
      <span className={`font-semibold tracking-tight ${textClass}`} style={{ fontFamily: 'var(--font-sora)' }}>AlphaVector</span>
    </span>
  )
}
