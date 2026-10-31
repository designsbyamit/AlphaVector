import type { Metadata } from 'next'
import Link from 'next/link'
import { GLOSSARY, HARD_PROCESSES, SOFT_PROCESSES } from '@/lib/processes'
import { START_URL } from '@/lib/config'
import { LicenseNote } from '@/components/LicenseNote'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Templates, checklists and a glossary for using the AlphaVector framework.',
}

export default function Resources() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8">
        <h1 className="max-w-4xl text-[clamp(2.4rem,5.4vw,4.4rem)] font-light">Resources</h1>
        <p className="mt-6 max-w-2xl text-[1.25rem] text-ink-soft">Everything you need to prepare before you open the app, or to run the framework on paper.</p>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Downloads and worksheets</h2>
        <div className="mt-6 divide-y divide-rule border-y border-rule">
          <div className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-[1.3rem] font-medium">Project log template</h3>
              <p className="mt-1 max-w-xl text-ink-soft">The same columns as the app: project, client, industry, hard-skill and soft-skill processes, feedback, impact and remarks. Fill it in a spreadsheet first, then copy across.</p>
            </div>
            <a href="/downloads/alphavector-project-log-template.csv" download className="w-fit btn btn-secondary">Download .csv</a>
          </div>
          <div className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-[1.3rem] font-medium">Passion worksheet</h3>
              <p className="mt-1 max-w-xl text-ink-soft">A one-page set of questions about which work gave you energy and which drained you. Print it or save it as a PDF from your browser.</p>
            </div>
            <Link href="/resources/passion-worksheet" className="w-fit btn btn-secondary">Open worksheet</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">The process checklists</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">In the project log you tick what <em>you</em> did on each project, not what the team did. Read the lists once so you know what to look for in your own history.</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="border-t-[3px] border-strength-fill pt-4">
            <h3 className="text-[1.4rem] font-medium text-strength">Hard-skill processes</h3>
            <ul className="mt-3 space-y-1.5 text-[1.02rem]">{HARD_PROCESSES.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="border-t-[3px] border-passion-fill pt-4">
            <h3 className="text-[1.4rem] font-medium text-passion">Soft-skill processes</h3>
            <ul className="mt-3 space-y-1.5 text-[1.02rem]">{SOFT_PROCESSES.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Where the market data comes from</h2>
        <p className="mt-4 max-w-2xl text-ink-soft">Every source AlphaVector reads is listed with its reliability on the <Link className="font-medium text-ink underline underline-offset-4" href="/method#data">method page</Link>. Inside the app, each market claim in your Blueprint points back to its source.</p>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
        <h2 className="text-[clamp(1.7rem,3.2vw,2.5rem)] font-light">Glossary</h2>
        <dl className="mt-6 divide-y divide-rule border-y border-rule">
          {GLOSSARY.map(([t, d]) => (
            <div key={t} className="grid gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
              <dt className="font-display font-medium">{t}</dt>
              <dd className="text-ink-soft">{d}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12">
          <a href={START_URL} className="btn btn-primary">Find your direction</a>
        </div>
        <LicenseNote subject="this page and the templates and worksheets you can download from it" className="mt-10 max-w-2xl" />
      </section>
    </>
  )
}
