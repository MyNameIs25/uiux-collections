import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

// The right-hand control is ONE box whose width animates. Idle and loading share
// TRACK_W (only the fill/colour change), then success collapses width → TRACK_H
// so the pill becomes a circle. It's pinned to the card's right edge, so the
// collapse reads as shrinking *toward* that edge, landing where the button was.
// Kept deliberately narrow: this whole pill has `max-w-full`, so on a gallery
// card it's clamped to the (narrower) card width while its icon + label + this
// button don't shrink. A wide button would then spill past the pill's right
// edge — hence a short "Sync" label in a 104px track rather than "Sync Events".
const TRACK_W = 104
const TRACK_H = 44

type Phase = 'idle' | 'blur' | 'loading' | 'filling' | 'success'

// Relative rhythm of the confirmation, in ms. `loading` loops the indeterminate
// sweep for this long (duration is faked — there's no real request), then a
// short `filling` beat, the collapse, a hold, and an auto-reset so the demo
// re-arms itself.
const TIMINGS: Record<Exclude<Phase, 'idle'>, number> = {
  blur: 220,
  loading: 2600,
  filling: 240,
  success: 1500,
}

export function CalendarSyncInlineConfirm() {
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Drive the state machine off a single click: schedule each phase transition,
  // keeping handles so an unmount (or replay) can cancel the pending chain.
  const run = () => {
    if (phase !== 'idle') return
    let t = 0
    const step = (next: Phase, hold: number) => {
      timers.current.push(setTimeout(() => setPhase(next), t))
      t += hold
    }
    step('blur', TIMINGS.blur)
    step('loading', TIMINGS.loading)
    step('filling', TIMINGS.filling)
    step('success', TIMINGS.success)
    step('idle', 0)
  }

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout)
    },
    [],
  )

  const isDark = phase === 'loading' || phase === 'filling' || phase === 'success'
  const isCircle = phase === 'success'

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center bg-[#ededed] p-6 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]">
      <div className="flex w-[440px] max-w-full items-center gap-3.5 rounded-full bg-white p-2.5 pr-3 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-black/[0.03]">
        {/* Calendar avatar: a dark rounded square with a small binding tab and a
            white panel of dark dots — an app-icon read of a calendar. */}
        <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#efefef]">
          <span className="relative grid size-8 place-items-center rounded-[10px] bg-[#1c1c1e]">
            <span className="absolute top-[3px] h-[3px] w-3 rounded-full bg-[#1c1c1e]" />
            <span className="mt-[3px] grid grid-cols-4 gap-[3px] rounded-[5px] bg-white p-[5px]">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="size-[3px] rounded-full bg-[#1c1c1e]" />
              ))}
            </span>
          </span>
        </span>

        <span className="text-[22px] font-bold tracking-tight text-[#111]">Calendar</span>

        {/* The morphing control, pinned right. */}
        <button
          type="button"
          onClick={run}
          disabled={phase !== 'idle'}
          aria-label="Sync events"
          className={cn(
            // grid-cols-1/grid-rows-1 pin the single track to the button box
            // (minmax(0,1fr)); without them the track auto-sizes to the widest
            // child (the "Sync Events" label) and the centred check drifts off
            // once the box collapses to the 44px circle.
            'relative ml-auto grid grid-cols-1 grid-rows-1 shrink-0 place-items-center overflow-hidden rounded-full transition-[width,height,background-color] duration-[450ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
            isDark ? 'bg-[#1a1a1a]' : 'bg-[#ececec]',
            isCircle &&
              'bg-[linear-gradient(135deg,#565656,#0a0a0a)] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.4)]',
          )}
          style={{ width: isCircle ? TRACK_H : TRACK_W, height: TRACK_H }}
        >
          {/* Idle label — blurs and fades out on press. */}
          <span
            className={cn(
              'col-start-1 row-start-1 whitespace-nowrap text-[15px] font-semibold text-[#1a1a1a] transition-[opacity,filter] duration-200 ease-out motion-reduce:transition-none',
              phase === 'idle' ? 'opacity-100 blur-0' : 'pointer-events-none opacity-0 blur-[6px]',
            )}
          >
            Sync
          </span>

          {/* Indeterminate track: a white bar sweeps across the clipped inset. */}
          <span
            className={cn(
              'relative col-start-1 row-start-1 h-[10px] w-[86%] overflow-hidden rounded-full transition-opacity duration-150',
              phase === 'loading' || phase === 'filling' ? 'opacity-100' : 'opacity-0',
            )}
          >
            {phase === 'loading' && (
              <span className="absolute left-0 top-0 h-full w-[28%] rounded-full bg-white motion-safe:animate-calendar-sync-slide" />
            )}
            {phase === 'filling' && (
              <span className="absolute left-0 top-0 h-full w-full origin-left rounded-full bg-white motion-safe:animate-calendar-sync-fill" />
            )}
          </span>

          {/* Success check — pops in a beat after the collapse. */}
          <Check
            strokeWidth={3}
            className={cn(
              'col-start-1 row-start-1 size-[18px] text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
              isCircle ? 'scale-100 opacity-100 delay-[130ms]' : 'scale-50 opacity-0',
            )}
          />
        </button>
      </div>
    </div>
  )
}
