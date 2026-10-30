'use client'
// The AlphaVector app flow: projects > strengths > passion > niche (optional) > Future Blueprint.
// Inputs live in this browser (useInputs). Analysis, Blueprint and progress reuse the WingSpan engine unchanged.
import { useState } from 'react'
import { ArrowLeft, ArrowRight, RefreshCw, Check } from 'lucide-react'
import { MotionConfig } from 'framer-motion'
import { useWingspan } from '@/context/WingspanContext'
import { TopNav } from '@/components/layout/TopNav'
import { ValidationScreen } from '@/components/screens/ValidationScreen'
import { BlueprintScreen } from '@/components/screens/BlueprintScreen'
import { FlowFooter } from '@/components/onboarding/FlowFooter'
import { cx, focusRing, primaryButton, quietButton } from '@/components/onboarding/ui'
import { MAX_INTERESTS, MIN_INTERESTS } from '@/lib/interests'
import { cancelCareerPipeline, runCareerPipeline } from '@/lib/pipeline'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { computeStrengths } from '@/lib/alphavector/strengths'
import { isFilled } from '@/lib/alphavector/types'
import { useInputs } from './useInputs'
import { ProjectsStep } from './ProjectsStep'
import { StrengthsStep } from './StrengthsStep'
import { PassionStep } from './PassionStep'
import { NicheStep } from './NicheStep'

const STEPS = [
  { key: 'projects', label: 'Projects', title: 'Log what you have actually done', lead: 'Your history is the evidence. Everything AlphaVector tells you traces back to this table.' },
  { key: 'strengths', label: 'Strengths', title: 'What your work proves about you', lead: 'Calculated from your table, not from how you describe yourself.' },
  { key: 'passion', label: 'Passion', title: 'What you are drawn to', lead: 'Strengths tell us what you can do. Passion tells us what is worth doing.' },
  { key: 'niche', label: 'Market niche', title: 'Choose where to aim (or let the market decide)', lead: 'Optional. The market signal is always on; this only focuses it.' },
] as const

function Stepper({ step, onJump, maxReached }: { step: number; onJump: (i: number) => void; maxReached: number }) {
  return (
    <nav aria-label="Progress" className="mb-8">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {[...STEPS.map((s) => s.label), 'Blueprint'].map((label, i) => {
          const done = i < step
          const current = i === step
          const reachable = i <= maxReached && i < STEPS.length
          return (
            <li key={label} className="flex items-center gap-2">
              <button type="button" disabled={!reachable} aria-current={current ? 'step' : undefined} onClick={() => onJump(i)}
                className={cx('inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors', focusRing,
                  current ? 'border-[var(--neon)] bg-[var(--neon-surface)] text-[var(--text-primary)]'
                    : done ? 'border-[var(--border-ws)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    : 'border-[var(--border-dim)] text-[var(--text-dim)]')}>
                <span className={cx('flex h-4 w-4 items-center justify-center rounded-full text-[10px]', done ? 'bg-[var(--neon)] text-[#0a0a0a]' : 'border border-current')}>
                  {done ? <Check size={10} strokeWidth={3} aria-hidden /> : i + 1}
                </span>
                {label}
              </button>
              {i < STEPS.length && <span className="h-px w-4 bg-[var(--border-ws)]" aria-hidden />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Recalibrate({ onConfirm }: { onConfirm: () => void }) {
  const [asking, setAsking] = useState(false)
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {asking && (
        <div role="dialog" aria-label="Recalibrate" className="w-72 rounded-[14px] border border-[var(--border-ws)] bg-[var(--surface)] p-4 shadow-xl">
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Recalibrate your Blueprint?</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            Reached a goal or finished new projects? Your table is kept. Add what is new, adjust your passions, and AlphaVector fixes your position again. This Blueprint stays in your saved versions if you saved it.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" className={quietButton} onClick={() => setAsking(false)}>Not now</button>
            <button type="button" className={primaryButton} onClick={() => { setAsking(false); onConfirm() }}>Recalibrate</button>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setAsking((v) => !v)} aria-expanded={asking}
        className={cx('inline-flex items-center gap-2 rounded-full border border-[var(--neon-border)] bg-[var(--surface)] px-4 py-2.5 text-[13px] font-semibold text-[var(--text-primary)] shadow-lg hover:bg-[var(--neon-surface)]', focusRing)}>
        <RefreshCw size={14} className="text-[var(--neon)]" aria-hidden /> Recalibrate
      </button>
    </div>
  )
}

export default function StartFlow() {
  const { state, dispatch } = useWingspan()
  const { inputs, setInputs, patchRow, addRow, removeRow } = useInputs()
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)

  const filled = inputs.rows.filter(isFilled)
  const withProcesses = filled.filter((r) => r.hard.length + r.soft.length > 0)
  const strengths = computeStrengths(inputs.rows).filter((s) => !inputs.dismissed.includes(s.id))

  const gate: string | null =
    step === 0 ? (filled.length < 1 ? 'Add at least one project with a name.'
      : withProcesses.length < 1 ? 'Tick the processes you did on at least one project.' : null)
    : step === 1 ? (strengths.length < 1 ? 'Keep at least one strength to continue.' : null)
    : step === 2 ? (inputs.passions.length < MIN_INTERESTS ? `Choose at least ${MIN_INTERESTS} areas that pull you (${inputs.passions.length} so far).` : null)
    : null

  const go = (i: number) => { setStep(i); setMaxReached((m) => Math.max(m, i)); window.scrollTo({ top: 0 }) }

  const launch = () => {
    const data = buildExtractedData(inputs)
    const interests = [...inputs.passions.slice(0, MAX_INTERESTS), ...inputs.niches.map((n) => `${n} (target market niche)`)]
    // Keep the shared state in step with what this person chose, so the review screens show it.
    for (const i of state.interests) if (!inputs.passions.includes(i)) dispatch({ type: 'TOGGLE_INTEREST', interest: i })
    for (const i of inputs.passions.slice(0, MAX_INTERESTS)) if (!state.interests.includes(i)) dispatch({ type: 'TOGGLE_INTEREST', interest: i })
    dispatch({ type: 'SET_EXTRACTED_DATA', data })
    dispatch({ type: 'SET_SCREEN', screen: 'validating' })
    void runCareerPipeline(data, interests, dispatch, { mode: 'professional' })
  }

  const recalibrate = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); go(0) }

  if (state.screen === 'blueprint') {
    return <><BlueprintScreen /><Recalibrate onConfirm={recalibrate} /></>
  }
  if (state.screen === 'validating' || state.screen === 'discovering') {
    return <><TopNav /><ValidationScreen /></>
  }

  const s = STEPS[step]
  const last = step === STEPS.length - 1
  return (
    <MotionConfig reducedMotion="user">
      <TopNav />
      <main className="mx-auto w-full max-w-5xl px-4 pb-48 pt-24 sm:px-6 md:pt-28">
        <Stepper step={step} onJump={go} maxReached={maxReached} />
        <header className="mb-8 max-w-3xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--neon)]">Step {step + 1} of {STEPS.length + 1}</p>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight text-[var(--text-primary)] sm:text-[34px]" style={{ fontFamily: 'var(--font-sora)' }}>{s.title}</h1>
          <p className="mt-2 text-[15px] text-[var(--text-secondary)]">{s.lead}</p>
        </header>

        {step === 0 && <ProjectsStep about={inputs.about} rows={inputs.rows} onAbout={(about) => setInputs((v) => ({ ...v, about }))} onPatch={patchRow} onAdd={addRow} onRemove={removeRow} />}
        {step === 1 && <StrengthsStep rows={inputs.rows} dismissed={inputs.dismissed} onBack={() => go(0)}
          onToggleDismiss={(id) => setInputs((v) => ({ ...v, dismissed: v.dismissed.includes(id) ? v.dismissed.filter((x) => x !== id) : [...v.dismissed, id] }))} />}
        {step === 2 && <PassionStep inputs={inputs} onPatchRow={patchRow} onPassions={(passions) => setInputs((v) => ({ ...v, passions }))} />}
        {step === 3 && <NicheStep niches={inputs.niches} onChange={(niches) => setInputs((v) => ({ ...v, niches }))} />}
      </main>

      <FlowFooter
        message={gate ?? (last ? 'Ready. AlphaVector will now fix your position.' : 'Looks good. Continue when you are ready.')}
        hint={step === 0 ? 'Saved in this browser as you type.' : undefined}
        actions={<>
          {step > 0 && <button type="button" className={quietButton} onClick={() => go(step - 1)}><ArrowLeft size={14} aria-hidden /> Back</button>}
          {last && inputs.niches.length === 0 && <button type="button" className={quietButton} onClick={launch}>Skip niche</button>}
          <button type="button" className={primaryButton} disabled={!!gate} onClick={() => (last ? launch() : go(step + 1))}>
            {last ? 'Build my Future Blueprint' : 'Continue'} <ArrowRight size={14} aria-hidden />
          </button>
        </>}
      />
    </MotionConfig>
  )
}
