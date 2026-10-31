import Link from 'next/link'
import { Logo } from './Logo'
import { LicenseNote } from './LicenseNote'
import { NAV, START_URL } from '@/lib/config'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-[1rem] text-muted">Your next move deserves more than a guess. Built from your own projects and dated market research.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-col gap-2 font-display text-[0.95rem]">
          {NAV.map((n) => <Link key={n.href} href={n.href} className="w-fit hover:underline">{n.label}</Link>)}
        </nav>
        <div className="flex flex-col gap-2 font-display text-[0.95rem]">
          <a href={START_URL} className="w-fit hover:underline">Find your direction</a>
          <Link href="/workshop#enquire" className="w-fit hover:underline">Book a workshop</Link>
        </div>
      </div>
      <div className="mx-auto max-w-6xl border-t border-rule px-5 py-6 sm:px-8"><LicenseNote subject="this site" /></div>
    </footer>
  )
}
