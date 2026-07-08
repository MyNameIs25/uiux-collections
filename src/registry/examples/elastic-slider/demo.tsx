import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import gsap from 'gsap'

const STEPS = 20 // 21 ticks; value runs 0..20
const TICKS = STEPS + 1
const CHASE_SECS = 0.35 // how long the dot takes to catch a stopped pointer
const WAVE_SECS = 0.45 // wave crest fade in on grab / out on release
const SPREAD = 2.2 // wave width, measured in ticks
const BASE_H = 14 // resting tick height (px)
const BUMP = 26 // extra height at the crest of the wave (px)
const ROW_H = BASE_H + BUMP
const ACCENT = '#3b82f6'
const INACTIVE = 'rgba(255,255,255,0.28)'

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function ElasticSlider() {
  const areaRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [ripple, setRipple] = useState(0)

  // GSAP tweens this proxy; `nudge()` re-renders (via onUpdate) to mirror it
  // to the DOM. The raw/target refs aren't animated, just remembered.
  const anim = useRef({ pos: 0, wave: 0 }).current // dot progress + wave strength
  const rawRef = useRef(0) // unsnapped pointer progress (0..1) — the leading ring
  const targetRef = useRef(0) // snapped target progress — where the dot is headed
  const [, nudge] = useReducer((n: number) => n + 1, 0)

  // One persistent, retargetable tween per property (`gsap.quickTo`): every
  // call re-aims the SAME tween, so the dot continuously trails a moving
  // finger and settles exactly on the last target. This replaces a hand-rolled
  // damped-chase rAF loop — NOT a CSS transition, which couldn't trail a
  // moving finger this smoothly.
  const posTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  const waveTo = useRef<ReturnType<typeof gsap.quickTo> | null>(null)
  useEffect(() => {
    const secs = (s: number) => (reducedMotion() ? 0 : s)
    posTo.current = gsap.quickTo(anim, 'pos', {
      duration: secs(CHASE_SECS),
      ease: 'power3',
      onUpdate: nudge,
    })
    waveTo.current = gsap.quickTo(anim, 'wave', {
      duration: secs(WAVE_SECS),
      ease: 'power2.out',
      onUpdate: nudge,
    })
    return () => gsap.killTweensOf(anim)
  }, [anim])

  const setFromClientX = (clientX: number) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const raw = clamp((clientX - rect.left) / rect.width, 0, 1)
    rawRef.current = raw // ring follows the raw finger position
    const v = Math.round(raw * STEPS) // value snaps to the nearest tick
    targetRef.current = v / STEPS
    setValue(v)
    posTo.current?.(v / STEPS)
    nudge() // reflect the ring even when the snapped value didn't change
  }

  const onMove = (e: PointerEvent) => setFromClientX(e.clientX)
  const onUp = () => {
    setDragging(false)
    rawRef.current = targetRef.current // ring re-seats onto the dot's target
    waveTo.current?.(0)
    window.removeEventListener('pointermove', onMove)
  }
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
    setRipple((r) => r + 1) // one-shot halo ripple
    waveTo.current?.(1)
    setFromClientX(e.clientX)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const bump = (delta: number) => {
    const v = clamp(value + delta, 0, STEPS)
    rawRef.current = v / STEPS
    targetRef.current = v / STEPS
    setValue(v)
    posTo.current?.(v / STEPS)
  }
  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }
    if (e.key in step) {
      e.preventDefault()
      bump(step[e.key])
    } else if (e.key === 'Home') {
      e.preventDefault()
      bump(-STEPS)
    } else if (e.key === 'End') {
      e.preventDefault()
      bump(STEPS)
    }
  }

  useEffect(
    () => () => window.removeEventListener('pointermove', onMove),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { pos, wave } = anim
  const raw = rawRef.current
  const reduce = reducedMotion()

  return (
    <div className="flex min-h-[16rem] w-full items-center justify-center bg-[#0a0a0a] px-8 py-12">
      <div
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={STEPS}
        aria-valuenow={value}
        aria-label="Value"
        onKeyDown={onKeyDown}
        className="relative w-[min(360px,80vw)] rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#3b82f6]/50 focus-visible:ring-offset-4 focus-visible:ring-offset-[#0a0a0a]"
      >
        {/* Tick track + thumb layers share this box; % positions map 0..1. */}
        <div
          ref={areaRef}
          onPointerDown={onPointerDown}
          className="relative flex touch-none items-center justify-between"
          style={{ height: ROW_H }}
        >
          {Array.from({ length: TICKS }, (_, i) => {
            const active = i / STEPS <= pos + 1e-9
            const dist = i - pos * STEPS
            // Gaussian crest centred on the dot: ticks nearby rise, tapering out.
            const h = BASE_H + BUMP * Math.exp(-(dist * dist) / (2 * SPREAD * SPREAD)) * wave
            return (
              <span
                key={i}
                className="w-1 shrink-0 rounded-full"
                style={{ height: h, backgroundColor: active ? ACCENT : INACTIVE }}
              />
            )
          })}

          {/* Leading halo ring — sits on the raw pointer (near the finger). */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-opacity duration-200"
            style={{ left: `${raw * 100}%`, borderColor: ACCENT, opacity: dragging ? 0.5 : 0 }}
          >
            {dragging && !reduce && (
              <span
                key={ripple}
                className="absolute inset-0 animate-ping rounded-full [animation-iteration-count:1]"
                style={{ backgroundColor: ACCENT, opacity: 0.25 }}
              />
            )}
          </div>

          {/* Trailing filled dot — tweens toward the snapped target (the visible lag). */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 size-4 rounded-full transition-transform duration-150"
            style={{
              left: `${pos * 100}%`,
              backgroundColor: ACCENT,
              transform: `translate(-50%,-50%) scale(${dragging ? 1.15 : 1})`,
            }}
          />
        </div>

        {/* Value readout, tethered to the dot by a short dashed line + node. */}
        <div
          className="pointer-events-none absolute flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${pos * 100}%`, top: ROW_H / 2 + 10 }}
        >
          <span className="h-3 border-l border-dashed" style={{ borderColor: ACCENT }} />
          <span className="size-1 rounded-full" style={{ backgroundColor: ACCENT }} />
          <span className="mt-1 font-mono text-xs tabular-nums" style={{ color: ACCENT }}>
            {value}
          </span>
        </div>
      </div>
    </div>
  )
}
