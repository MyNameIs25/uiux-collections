import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import gsap from 'gsap'
import { Play } from 'lucide-react'

const R = 16 // ring radius
const C = 2 * Math.PI * R // circumference — full ring dash length
const CHARGE_SECS = 1.6 // hold this long to fill / empty the ring
const DRAIN_SECS = 0.55 // how fast it springs back once released

/**
 * One press-and-hold charge value (0..1). Two opposing linear GSAP tweens on a
 * proxy object: holding tweens it toward 1, releasing tweens it back to 0, and
 * `overwrite: true` kills the opposing tween so a mid-hold release simply
 * retargets. Each button owns its own instance, so the two rings animate
 * independently.
 */
function useHoldCharge() {
  const [charge, setCharge] = useState(0)
  const proxy = useRef({ v: 0 }).current

  // Constant *rate*, not constant duration: from a partial charge the tween
  // only runs the remaining fraction of the full time (hence `ease: 'none'`).
  const tweenTo = (end: 0 | 1, fullSecs: number) =>
    gsap.to(proxy, {
      v: end,
      duration: fullSecs * Math.abs(end - proxy.v),
      ease: 'none',
      overwrite: true,
      onUpdate: () => setCharge(proxy.v),
    })

  const press = (e: ReactPointerEvent<HTMLButtonElement>) => {
    // Keep the hold alive if the finger drifts off the button.
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture unavailable — hold still works via pointerleave */
    }
    tweenTo(1, CHARGE_SECS)
  }
  const release = () => tweenTo(0, DRAIN_SECS)

  useEffect(() => () => gsap.killTweensOf(proxy), [proxy])

  const handlers = {
    onPointerDown: press,
    onPointerUp: release,
    onPointerLeave: release,
    onPointerCancel: release,
  }
  return { charge, handlers }
}

export function NextEpisodeCountdown() {
  const next = useHoldCharge() // dark pill: grey ring depletes as you hold
  const skip = useHoldCharge() // light pill: black ring fills as you hold

  return (
    <div className="flex min-h-[13rem] w-full items-center justify-center bg-white p-8 select-none">
      <div className="flex items-center gap-6">
        {/* Next — hold to run the grey ring down until it vanishes. */}
        <button
          type="button"
          {...next.handlers}
          aria-label="Hold to play next"
          className="flex touch-none items-center gap-3 rounded-full bg-[#1c1c1c] py-2 pr-6 pl-2 text-white transition-transform active:scale-[0.98]"
        >
          <span className="relative grid size-9 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90" aria-hidden>
              <circle
                cx="18"
                cy="18"
                r={R}
                fill="none"
                stroke="rgb(255 255 255 / 0.4)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * next.charge}
              />
            </svg>
            <Play className="size-4 translate-x-px fill-white" strokeWidth={0} />
          </span>
          <span className="text-sm font-medium">Next</span>
        </button>

        {/* Skip — hold to charge the grey ring full of black. */}
        <button
          type="button"
          {...skip.handlers}
          aria-label="Hold to skip"
          className="flex touch-none items-center gap-3 rounded-full bg-[#eeeeee] py-2 pr-6 pl-2 text-[#1c1c1c] transition-transform active:scale-[0.98]"
        >
          <span className="relative grid size-9 place-items-center">
            <svg viewBox="0 0 36 36" className="absolute inset-0 size-full -rotate-90" aria-hidden>
              <circle cx="18" cy="18" r={R} fill="none" stroke="#e2e2e2" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r={R}
                fill="none"
                stroke="#1c1c1c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - skip.charge)}
              />
            </svg>
            <Play className="size-4 translate-x-px fill-[#1c1c1c]" strokeWidth={0} />
          </span>
          <span className="text-sm font-medium">Skip</span>
        </button>
      </div>
    </div>
  )
}
