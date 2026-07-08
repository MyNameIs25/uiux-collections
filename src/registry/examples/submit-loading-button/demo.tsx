import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

/*
  Submit → loading → success micro-interaction, ported from Valentin Galmand's
  CodePen (which used jQuery UI's animated addClass) to dependency-free React.
  The "aha": the capsule → circle → capsule morph is NOT a swap — a single
  `transition-all` interpolates width / border / colour / font-size between three
  className states, and JS only flips the state on a timer. See the principle.
*/

type Phase = 'idle' | 'loading' | 'success'

// Timeline (ms), transcribed from the original. The 250ms capsule→circle shrink
// and 450ms circle→green expand are the CSS transition durations below.
const LOADING_MS = 2250 // simulated request wait; the ring spins throughout
const SUCCESS_MS = 1250 // how long the green check lingers before it resets

export function SubmitLoadingButton() {
  const [phase, setPhase] = useState<Phase>('idle')
  const timers = useRef<number[]>([])

  // Clear any pending timers if the component unmounts mid-sequence.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function start() {
    if (phase !== 'idle') return // ignore clicks while busy
    setPhase('loading')
    timers.current.push(
      window.setTimeout(() => setPhase('success'), LOADING_MS),
      window.setTimeout(() => setPhase('idle'), LOADING_MS + SUCCESS_MS),
    )
  }

  const idle = phase === 'idle'
  const loading = phase === 'loading'
  const success = phase === 'success'

  return (
    <button
      type="button"
      onClick={start}
      aria-busy={loading}
      aria-label={success ? 'Submitted' : 'Submit'}
      className={cn(
        'inline-flex h-10 cursor-pointer items-center justify-center overflow-hidden rounded-[40px] font-roboto font-bold uppercase leading-none outline-none',
        // Idle capsule. `transition-all` is what makes every state change morph.
        idle &&
          'w-[130px] border-2 border-[#1ECD97] bg-white text-[12px] tracking-[1px] text-[#1ECD97] transition-all duration-[250ms] ease-[ease] active:tracking-[2px] can-hover:hover:bg-[#1ECD97] can-hover:hover:text-white',
        // Loading circle: a grey ring with ONE green side (`border-l`), spun by
        // `animate-rotating` so the green segment reads as a moving progress gap.
        // `text-[0px]` hides "SUBMIT" without unmounting it (no layout jump).
        loading &&
          'w-10 border-[3px] border-[#bbbbbb] border-l-[#1ECD97] bg-white text-[0px] text-[#1ECD97] transition-all duration-[250ms] ease-[ease] motion-safe:animate-rotating',
        // Success: the ring fills to solid green over 450ms; the check grows from
        // 0 because it's sized in `em`, so the 0→13px font-size drives it.
        success &&
          'w-10 border-[3px] border-[#1ECD97] bg-[#1ECD97] text-[13px] text-white transition-all duration-[450ms] ease-[ease]',
      )}
    >
      {success ? <Check className="size-[1em]" strokeWidth={4} aria-hidden /> : 'SUBMIT'}
    </button>
  )
}
