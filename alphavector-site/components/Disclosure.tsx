import type { ReactNode } from 'react'

/** Progressive disclosure on native <details>: closed by default, keyboard and screen-reader friendly, no script. */
export function Disclosure({ title, children, className = '' }: { title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <details className={`group border-b border-rule ${className}`}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-[1.1rem] font-medium [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <span aria-hidden="true" className="font-mono text-[1.3rem] text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="space-y-4 pb-6 text-ink-soft">{children}</div>
    </details>
  )
}
