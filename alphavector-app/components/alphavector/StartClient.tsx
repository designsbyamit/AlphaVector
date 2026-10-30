'use client'
import dynamic from 'next/dynamic'

// The flow reads this browser's saved entries on first render, so it is client-only.
const StartFlow = dynamic(() => import('./StartFlow'), {
  ssr: false,
  loading: () => <main className="flex min-h-screen items-center justify-center text-sm text-[var(--text-secondary)]">Loading…</main>,
})

export default function StartClient() { return <StartFlow /> }
