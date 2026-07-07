import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { Play } from 'lucide-react'

const R = 16 // ring radius
const C = 2 * Math.PI * R // circumference — full ring dash length
const CHARGE_MS = 1600 // hold this long to fill / empty the ring
const DRAIN_MS = 550 // how fast it springs back once released

/**
 * One press-and-hold charge value (0..1). A single rAF loop climbs it while a
 * pointer is held and drains it back when released. Each button owns its own
 * instance, so the two rings animate independently.
 */
function useHoldCharge() {
  const [charge, setCharge] = useState(0)
  const holding = useRef(false)
  const value = useRef(0)
  const raf = useRef(0)
  const last = useRef(0)

  const frame = (ts: number) => {
    if (last.current) {
      const dt = ts - last.current
      const delta = holding.current ? dt / CHARGE_MS : -dt / DRAIN_MS
      value.current = Math.min(1, Math.max(0, value.current + delta))
      setCharge(value.current)
    }
    last.current = ts
    if (holding.current || value.current > 0) {
      raf.current = requestAnimationFrame(frame)
    } else {
      raf.current = 0
      last.current = 0
    }
  }
  const kick = () => {
    if (!raf.current) raf.current = requestAnimationFrame(frame)
  }

  const press = (e: ReactPointerEvent<HTMLButtonElement>) => {
    // Keep the hold alive if the finger drifts off the button.
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      /* pointer capture unavailable — hold still works via pointerleave */
    }
    holding.current = true
    last.current = 0
    kick()
  }
  const release = () => {
    holding.current = false
    last.current = 0
    kick() // let the loop drain it back down
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

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
