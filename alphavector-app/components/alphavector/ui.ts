import { cx, focusRing } from '@/components/onboarding/ui'

// One visual language for the whole flow, so nobody has to guess what can be clicked or typed into.
//
//   Fields you type into: a visible box, a real label above, never a bare placeholder.
//   Things you choose:    outlined pills and cards; selected ones fill with the accent and show a check.
//   Plain information:    no border, muted colour.
//   Actions:              one filled accent button per screen; everything else is quieter.

const edge = 'border-[color-mix(in_srgb,var(--text-primary)_26%,transparent)]'
const edgeHover = 'hover:border-[color-mix(in_srgb,var(--text-primary)_46%,transparent)]'

/** A text field or textarea. */
export const field = cx(
  'w-full rounded-xl border bg-[var(--surface)] px-3.5 py-2.5 text-[16px] leading-snug text-[var(--text-primary)]',
  edge, edgeHover,
  'placeholder:text-[var(--text-dim)] focus:border-[var(--neon)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-border)]',
)

/** The label that sits above a field. */
export const label = 'mb-1.5 block text-[15px] font-semibold text-[var(--text-primary)]'

/** Helper text under a label or a field. Not interactive. */
export const hint = 'text-[14px] leading-snug text-[var(--text-muted)]'

/** A screen title. */
export const title = 'text-[clamp(1.9rem,4.6vw,2.7rem)] font-semibold leading-[1.1] tracking-tight text-[var(--text-primary)]'
export const lead = 'mt-3 max-w-xl text-[17px] leading-snug text-[var(--text-secondary)]'

/** A choice pill: outlined until chosen. */
export const choice = (on: boolean, blocked = false) => cx(
  'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-medium transition-colors', focusRing,
  on ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
    : blocked ? 'cursor-not-allowed border-[var(--border-ws)] text-[var(--text-dim)]'
    : cx(edge, edgeHover, 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'),
)

/** A larger selectable card (radio style). */
export const card = (on: boolean) => cx(
  'flex w-full flex-col items-start gap-0.5 rounded-2xl border px-4 py-3.5 text-left transition-colors', focusRing,
  on ? 'border-[var(--neon)] bg-[var(--neon-surface)]' : cx(edge, edgeHover, 'bg-[var(--surface)]'),
)

/** The one filled button on a screen. */
export const primary = cx(
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--neon)] px-5 py-2.5 text-[15px] font-bold text-[#0a0a0a] transition-[filter,opacity]',
  'hover:brightness-105 disabled:cursor-not-allowed disabled:bg-[var(--surface-dim)] disabled:text-[var(--text-dim)]', focusRing,
)

/** Secondary: outlined. */
export const secondary = cx(
  'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-[15px] font-semibold text-[var(--text-secondary)] transition-colors',
  edge, edgeHover, 'hover:text-[var(--text-primary)]', focusRing,
)

/** Tertiary: an underlined text action. */
export const textAction = cx('text-[14px] font-medium text-[var(--text-secondary)] underline underline-offset-4 hover:text-[var(--text-primary)]', focusRing)
