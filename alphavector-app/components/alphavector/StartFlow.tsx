'use client'
// The AlphaVector app flow, in two light steps: your projects, then what pulls you. Then one calm wait and the Blueprint.
// Inputs live in this browser (useInputs). Analysis, Blueprint and progress reuse the WingSpan engine unchanged.
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'
import { MotionConfig } from 'framer-motion'
import { useWingspan } from '@/context/WingspanContext'
import { BlueprintScreen } from '@/components/screens/BlueprintScreen'
import { FlowFooter } from '@/components/onboarding/FlowFooter'
import { cx, focusRing, primaryButton, quietButton } from '@/components/onboarding/ui'
import { MAX_INTERESTS, MIN_INTERESTS } from '@/lib/interests'
import { cancelCareerPipeline, runCareerPipeline } from '@/lib/pipeline'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { computeStrengths } from '@/lib/alphavector/strengths'
import { continueGate, evidence, MIN_PROJECTS } from '@/lib/alphavector/progress'
import { isFilled } from '@/lib/alphavector/types'
import { useInputs } from './useInputs'
import { FlowHeader } from './FlowHeader'
import { HelloBar } from './HelloBar'
import { ProjectGrid } from './ProjectGrid'
import { SignalPanel } from './SignalPanel'
import { PullStep } from './PullStep'
import { BuildingScreen } from './BuildingScreen'

function Recalibrate({ onConfirm }: { onConfirm: () => void }) {
  const [asking, setAsking] = useState(false)
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {asking && (
        <div role="dialog" aria-label="Recalibrate" className="w-72 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 shadow-xl">
          <p className="text-[14px] font-semibold text-[var(--text-primary)]">Recalibrate your Blueprint?</p>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
            Reached a goal or finished new projects? Your projects are kept. Add what is new, adjust what pulls you, and AlphaVector fixes your position again.
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
  const { inputs, setInputs, patchRow, addRow, removeRow, addRows, clearSamples, setAbout, reset } = useInputs()
  const [step, setStep] = useState<0 | 1>(0)

  const real = useMemo(() => inputs.rows.filter((r) => isFilled(r) && !r.sample), [inputs.rows])
  const ev = useMemo(() => evidence(real), [real])
  const strengths = useMemo(() => computeStrengths(real).filter((s) => !inputs.dismissed.includes(s.id)), [real, inputs.dismissed])

  // Why the person cannot continue yet, in plain words. Null means they can.
  const gate0 = continueGate(inputs.about.stage, inputs.rows)
  const gate1: string | null = inputs.passions.length < MIN_INTERESTS ? `Pick ${MIN_INTERESTS - inputs.passions.length} more that pull you.` : null

  const goTop = () => window.scrollTo({ top: 0 })

  const launch = () => {
    const data = buildExtractedData(inputs)
    const interests = [...inputs.passions.slice(0, MAX_INTERESTS), ...inputs.niches.map((n) => `${n} (target market niche)`)]
    // Keep the shared state in step with what this person chose, so later screens show it.
    for (const i of state.interests) if (!inputs.passions.includes(i)) dispatch({ type: 'TOGGLE_INTEREST', interest: i })
    for (const i of inputs.passions.slice(0, MAX_INTERESTS)) if (!state.interests.includes(i)) dispatch({ type: 'TOGGLE_INTEREST', interest: i })
    dispatch({ type: 'SET_EXTRACTED_DATA', data })
    dispatch({ type: 'SET_SCREEN', screen: 'validating' })
    void runCareerPipeline(data, interests, dispatch, { mode: 'professional' })
  }
  const retry = () => {
    if (state.extractedData) void runCareerPipeline(state.extractedData, state.interests, dispatch, { mode: 'professional' })
  }
  const backToEdit = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); setStep(1); goTop() }
  const startOver = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); reset(); setStep(0); goTop() }
  const recalibrate = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); setStep(0); goTop() }
  const openBlueprint = () => {
    if (state.extractedData) dispatch({ type: 'SET_VALIDATED_DATA', data: { ...state.extractedData, interests: state.interests } })
    dispatch({ type: 'SET_SCREEN', screen: 'blueprint' })
  }

  if (state.screen === 'blueprint') return <><BlueprintScreen /><Recalibrate onConfirm={recalibrate} /></>

  if (state.screen === 'validating' || state.screen === 'discovering') {
    const phase = state.blueprintReady ? 'ready' : state.error && !state.blueprintLoading ? 'error' : 'running'
    return (
      <>
        <FlowHeader onStartOver={startOver} />
        <BuildingScreen name={inputs.about.name} activity={state.activity} phase={phase} error={state.error} strengths={strengths}
          onOpen={openBlueprint} onRetry={retry} onBack={backToEdit} />
      </>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <FlowHeader onStartOver={startOver} label={step === 0 ? 'Step 1 of 2' : 'Step 2 of 2'} />
      <main className="mx-auto w-full max-w-6xl px-4 pb-44 pt-24 sm:px-6">
        {step === 0 ? (
          <>
            <h1 className="max-w-2xl text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.1] tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sora)' }}>
              What have you worked on?
            </h1>
            <p className="mt-3 max-w-xl text-[17px] text-[var(--text-secondary)]">Add at least {MIN_PROJECTS} projects, five if you can. Rough is fine. Tell us what you did in plain words and we pick up the skills for you.</p>
            <div className="mt-8"><HelloBar about={inputs.about} onChange={setAbout} /></div>
            <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <ProjectGrid rows={inputs.rows} onPatch={patchRow} onAdd={addRow} onRemove={removeRow} onAddRows={addRows} onClearSamples={clearSamples} />
              <SignalPanel rows={inputs.rows} dismissed={inputs.dismissed}
                onDismiss={(id) => setInputs((v) => ({ ...v, dismissed: [...v.dismissed, id] }))} onUndo={() => setInputs((v) => ({ ...v, dismissed: [] }))} />
            </div>
          </>
        ) : (
          <>
            <h1 className="max-w-2xl text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.1] tracking-tight text-[var(--text-primary)]" style={{ fontFamily: 'var(--font-sora)' }}>
              What pulls you?
            </h1>
            <p className="mt-3 max-w-xl text-[17px] text-[var(--text-secondary)]">Your projects show what you can do. This is about what you want more of.</p>
            <div className="mt-10"><PullStep inputs={inputs} onPassions={(passions) => setInputs((v) => ({ ...v, passions }))} onNiches={(niches) => setInputs((v) => ({ ...v, niches }))} /></div>
          </>
        )}
      </main>

      <FlowFooter
        message={(step === 0 ? gate0 ?? ev.next : gate1) ?? (step === 0 ? 'Looks good. Keep going or continue.' : 'Ready. This takes about four minutes.')}
        hint={step === 0 ? `${ev.described} of ${MIN_PROJECTS} needed projects described. Saved on this device.` : undefined}
        actions={<>
          {step === 1 && <button type="button" className={quietButton} onClick={() => { setStep(0); goTop() }}><ArrowLeft size={14} aria-hidden /> Back</button>}
          <button type="button" className={primaryButton} disabled={step === 0 ? !!gate0 : !!gate1}
            onClick={() => (step === 0 ? (setStep(1), goTop()) : launch())}>
            {step === 0 ? 'Continue' : 'Build my Blueprint'} <ArrowRight size={14} aria-hidden />
          </button>
        </>}
      />
    </MotionConfig>
  )
}
