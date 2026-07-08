import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import gsap from 'gsap'

const N = 40 // number of equalizer bars
const BAR_MIN = 6 // bar height (px) at the bottom of the dip
const BAR_MAX = 44 // resting / full bar height (px)
const SIGMA = 0.06 // dip width as a fraction of the track (≈ ±3 bars)
const RAMP = 0.045 // colour transition half-width around the value (≈ ±2 bars)
const CHASE_SECS = 0.3 // how long the dip centre takes to catch a stopped pointer
const DIP_SECS = 0.45 // dip strength fade in on grab / out on release
const DARK = [63, 63, 70] as const // zinc-700 — selected / left of value
const LIGHT = [212, 212, 216] as const // zinc-300 — unselected / right of value

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const mix = (a: number, b: number, t: number) => a + (b - a) * t
// Smooth 0→1 ramp across [e0, e1] — a soft edge instead of a hard line.
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
const rgb = (t: number) =>
  `rgb(${Math.round(mix(DARK[0], LIGHT[0], t))}, ${Math.round(mix(DARK[1], LIGHT[1], t))}, ${Math.round(mix(DARK[2], LIGHT[2], t))})`
const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function WaveSlider() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(38) // 0..100, the live percentage

  // GSAP tweens this proxy; `nudge()` re-renders (via onUpdate) to mirror it
  // to the DOM each frame.
  const anim = useRef({ c: 0.38, dip: 0 }).current // dip centre + dip strength
  const [, nudge] = useReducer((n: number) => n + 1, 0)

  // One persistent, retargetable tween per property (`gsap.quickTo`): every
  // pointer move re-aims the SAME tween, so the valley trails the finger and
  // settles on the last target — no hand-rolled lerp/rAF loop, and not a CSS
  // transition (which can't trail a continuously moving target).
  const cTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const dipTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  useEffect(() => {
    const secs = (s: number) => (reducedMotion() ? 0 : s)
    cTo.current = gsap.quickTo(anim, 'c', {
      duration: secs(CHASE_SECS),
      ease: 'power3',
      onUpdate: nudge,
    })
    dipTo.current = gsap.quickTo(anim, 'dip', {
      duration: secs(DIP_SECS),
      ease: 'power2.out',
      onUpdate: nudge,
    })
    return () => gsap.killTweensOf(anim)
  }, [anim])

  const setFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const raw = clamp((clientX - rect.left) / rect.width, 0, 1)
    setValue(Math.round(raw * 100))
    cTo.current?.(raw)
  }
  const onMove = (e: PointerEvent) => setFromClientX(e.clientX)
  const onUp = () => {
    dipTo.current?.(0)
    window.removeEventListener('pointermove', onMove)
  }
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    dipTo.current?.(1)
    setFromClientX(e.clientX)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const bump = (delta: number) => {
    const v = clamp(value + delta, 0, 100)
    setValue(v)
    cTo.current?.(v / 100)
  }
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (e.key in step) {
      e.preventDefault()
      bump(step[e.key])
    } else if (e.key === 'Home') {
      e.preventDefault()
      bump(-100)
    } else if (e.key === 'End') {
      e.preventDefault()
      bump(100)
    }
  }

  useEffect(
    () => () => window.removeEventListener('pointermove', onMove),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const c = anim.c
  const dip = anim.dip

  return (
    <div className="flex min-h-[16rem] w-full items-center justify-center bg-[#f4f4f5] px-8 py-14">
      <div
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label="Percentage"
        onKeyDown={onKeyDown}
        className="relative w-[min(420px,84vw)] rounded-full outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/60 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f4f4f5]"
      >
        {/* Value bubble — rides the dip centre, fades with the dip strength. */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-2 left-0 z-10"
          style={{
            left: `${c * 100}%`,
            opacity: dip,
            transform: `translate(-50%, -100%) translateY(${(1 - dip) * 6}px)`,
          }}
        >
          <div className="relative rounded-xl bg-white px-3 py-1.5 text-center shadow-[0_6px_20px_rgba(0,0,0,0.12)]">
            <div className="text-lg leading-none font-bold text-zinc-900 tabular-nums">{value}</div>
            <div className="text-[10px] leading-tight text-zinc-400">%</div>
            {/* Downward pointer — a rotated square peeking out the bottom. */}
            <div className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-white" />
          </div>
        </div>

        {/* Capsule track of equalizer bars. */}
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          className="relative flex h-[72px] touch-none cursor-grab items-center justify-between rounded-full border border-black/5 bg-white px-5 shadow-[0_4px_14px_rgba(0,0,0,0.05)] active:cursor-grabbing"
        >
          {Array.from({ length: N }, (_, i) => {
            const pos = i / (N - 1)
            const d = (pos - c) / SIGMA
            const bell = Math.exp(-d * d) // 1 at the dip centre, →0 away
            const h = BAR_MAX - (BAR_MAX - BAR_MIN) * dip * bell
            // Colour is a soft step centred on the value, so the selected/
            // unselected boundary stays visible even at rest (no dip needed).
            const t = smoothstep(c - RAMP, c + RAMP, pos)
            return (
              <span
                key={i}
                className="w-[3px] shrink-0 rounded-full"
                style={{ height: h, backgroundColor: rgb(t) }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
