import Link from 'next/link'
import { Logo } from './Logo'
import { NAV, START_URL } from '@/lib/config'

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-4 sm:px-8">
        <Link href="/" aria-label="AlphaVector, home"><Logo /></Link>
        <nav aria-label="Main" className="order-3 flex w-full gap-6 overflow-x-auto font-display text-[0.95rem] sm:order-none sm:w-auto">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap py-1 text-ink-soft underline-offset-8 hover:underline">{n.label}</Link>
          ))}
        </nav>
        <a href={START_URL} className="btn btn-primary btn-sm">Find your fix</a>
      </div>
    </header>
  )
}
