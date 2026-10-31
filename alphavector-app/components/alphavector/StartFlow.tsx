'use client'
// The AlphaVector app flow, one focus per screen:
//   1 You  ->  2 Projects  ->  3 Your strengths  ->  4 What pulls you  ->  one calm wait  ->  the Blueprint.
// Inputs live in this browser (useInputs). Analysis, Blueprint and progress reuse the WingSpan engine unchanged.
import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'
import { MotionConfig } from 'framer-motion'
import { useWingspan } from '@/context/WingspanContext'
import { BlueprintScreen } from '@/components/screens/BlueprintScreen'
import { FlowFooter } from '@/components/onboarding/FlowFooter'
import { cx, focusRing } from '@/components/onboarding/ui'
import { MAX_INTERESTS, MIN_INTERESTS } from '@/lib/interests'
import { cancelCareerPipeline, runCareerPipeline } from '@/lib/pipeline'
import { buildExtractedData } from '@/lib/alphavector/toExtracted'
import { computeStrengths } from '@/lib/alphavector/strengths'
import { continueGate, evidence, MIN_PROJECTS } from '@/lib/alphavector/progress'
import { isFilled } from '@/lib/alphavector/types'
import { useInputs } from './useInputs'
import { FlowHeader } from './FlowHeader'
import { AboutStep } from './AboutStep'
import { ProjectList } from './ProjectList'
import { StrengthsReview } from './StrengthsReview'
import { PullStep } from './PullStep'
import { BuildingScreen } from './BuildingScreen'
import { lead, primary, secondary, title } from './ui'

const STEPS = 4

function Recalibrate({ onConfirm }: { onConfirm: () => void }) {
  const [asking, setAsking] = useState(false)
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {asking && (
        <div role="dialog" aria-label="Recalibrate" className="w-72 rounded-2xl border border-[var(--border-ws)] bg-[var(--surface)] p-4 shadow-xl">
          <p className="text-[15px] font-semibold text-[var(--text-primary)]">Recalibrate your Blueprint?</p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-secondary)]">
            Reached a goal or finished new projects? Your projects are kept. Add what is new, adjust what pulls you, and AlphaVector fixes your position again.
          </p>
          <div className="mt-3 flex justify-end gap-2">
            <button type="button" className={secondary} onClick={() => setAsking(false)}>Not now</button>
            <button type="button" className={primary} onClick={() => { setAsking(false); onConfirm() }}>Recalibrate</button>
          </div>
        </div>
      )}
      <button type="button" onClick={() => setAsking((v) => !v)} aria-expanded={asking}
        className={cx('inline-flex items-center gap-2 rounded-full border border-[var(--neon-border)] bg-[var(--surface)] px-4 py-2.5 text-[14px] font-semibold text-[var(--text-primary)] shadow-lg hover:bg-[var(--neon-surface)]', focusRing)}>
        <RefreshCw size={14} className="text-[var(--neon)]" aria-hidden /> Recalibrate
      </button>
    </div>
  )
}

/** Three dots that fill as projects are described. The one piece of progress shown while typing. */
function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={`${Math.min(n, MIN_PROJECTS)} of ${MIN_PROJECTS} projects described`}>
      {Array.from({ length: MIN_PROJECTS }, (_, i) => (
        <span key={i} className={cx('h-2.5 w-2.5 rounded-full border transition-colors', i < n ? 'border-[var(--neon)] bg-[var(--neon)]' : 'border-[var(--text-dim)]')} />
      ))}
    </span>
  )
}

export default function StartFlow() {
  const { state, dispatch } = useWingspan()
  const { inputs, setInputs, patchRow, addRow, removeRow, addRows, clearSamples, setAbout, reset } = useInputs()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  const real = useMemo(() => inputs.rows.filter((r) => isFilled(r) && !r.sample), [inputs.rows])
  const ev = useMemo(() => evidence(real), [real])
  const strengths = useMemo(() => computeStrengths(real).filter((s) => !inputs.dismissed.includes(s.id)), [real, inputs.dismissed])

  // Why the person cannot continue yet, in plain words. Null means they can.
  const gates: Record<1 | 2 | 3 | 4, string | null> = {
    1: inputs.about.stage ? null : 'Pick where you are to continue.',
    2: continueGate(inputs.about.stage || 'student', inputs.rows),
    3: strengths.length ? null : 'Keep at least one strength to continue.',
    4: inputs.passions.length < MIN_INTERESTS ? `Pick ${MIN_INTERESTS - inputs.passions.length} more that pull you.` : null,
  }
  const gate = gates[step]
  const go = (s: 1 | 2 | 3 | 4) => { setStep(s); window.scrollTo({ top: 0 }) }

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
  const backToEdit = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); go(4) }
  const startOver = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); reset(); go(1) }
  const recalibrate = () => { cancelCareerPipeline(); dispatch({ type: 'RESET_FLOW' }); go(2) }
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

  const last = step === STEPS
  return (
    <MotionConfig reducedMotion="user">
      <FlowHeader onStartOver={startOver} step={step} total={STEPS} />
      <main className="mx-auto w-full max-w-4xl px-4 pb-44 pt-28 sm:px-6">
        {step === 1 && <AboutStep about={inputs.about} onChange={setAbout} />}

        {step === 2 && (
          <div className="mx-auto w-full max-w-2xl">
            <h1 className={title} style={{ fontFamily: 'var(--font-sora)' }}>What have you worked on?</h1>
            <p className={lead}>Add at least {MIN_PROJECTS} projects. Rough is fine. Open one, say what you did in plain words, and we pick up the skills.</p>
            <div className="mt-9">
              <ProjectList rows={inputs.rows} onPatch={patchRow} onAdd={addRow} onRemove={removeRow} onAddRows={addRows} onClearSamples={clearSamples}
                onPerson={(p) => setAbout({ ...(!inputs.about.name.trim() && p.name ? { name: p.name } : {}), ...(!inputs.about.currentRole.trim() && p.role ? { currentRole: p.role } : {}) })} />
            </div>
          </div>
        )}

        {step === 3 && (
          <StrengthsReview rows={inputs.rows} dismissed={inputs.dismissed} onEdit={() => go(2)}
            onDismiss={(id) => setInputs((v) => ({ ...v, dismissed: [...v.dismissed, id] }))} onUndo={() => setInputs((v) => ({ ...v, dismissed: [] }))} />
        )}

        {step === 4 && <PullStep inputs={inputs} onPassions={(passions) => setInputs((v) => ({ ...v, passions }))} onNiches={(niches) => setInputs((v) => ({ ...v, niches }))} />}
      </main>

      <FlowFooter
        width="max-w-[45rem]"
        message={step === 2
          ? <span className="inline-flex items-center gap-3"><Dots n={ev.described} /><span>{gate ?? 'Enough to go on. Add more, or continue.'}</span></span>
          : gate ?? (last ? 'Ready. This takes about four minutes.' : step === 3 ? 'Looks right? Continue.' : 'Good. Continue.')}
        actions={<>
          {step > 1 && <button type="button" className={secondary} onClick={() => go((step - 1) as 1 | 2 | 3)}><ArrowLeft size={15} aria-hidden /> Back</button>}
          <button type="button" className={primary} disabled={!!gate} onClick={() => (last ? launch() : go((step + 1) as 2 | 3 | 4))}>
            {last ? 'Build my Blueprint' : 'Continue'} <ArrowRight size={15} aria-hidden />
          </button>
        </>}
      />
    </MotionConfig>
  )
}
