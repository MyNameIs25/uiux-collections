import {
  useEffect,
  useReducer,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'

const STEPS = 20 // 21 ticks; value runs 0..20
const TICKS = STEPS + 1
const DAMP = 0.2 // elastic follow: the dot moves 20% of the remaining gap each frame
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

  // Live animation state lives in refs so the rAF loop always reads the latest
  // without being re-created; `nudge()` forces a render to mirror them to the DOM.
  const rawRef = useRef(0) // unsnapped pointer progress (0..1) — the leading ring
  const targetRef = useRef(0) // snapped target progress — where the dot is headed
  const posRef = useRef(0) // visual dot progress — lerps toward target (the lag)
  const waveRef = useRef(0) // 0..1 wave strength; fades in/out with dragging
  const draggingRef = useRef(false)
  const rafRef = useRef(0)
  const [, nudge] = useReducer((n: number) => n + 1, 0)

  const animate = () => {
    const reduce = reducedMotion()
    // Damped chase — NOT a CSS transition — so the dot continuously trails a
    // moving finger and only catches up once the pointer slows/stops.
    posRef.current += (targetRef.current - posRef.current) * (reduce ? 1 : DAMP)
    const wantWave = draggingRef.current && !reduce ? 1 : 0
    waveRef.current += (wantWave - waveRef.current) * 0.15
    nudge()
    const settled =
      Math.abs(targetRef.current - posRef.current) < 5e-4 && waveRef.current < 2e-3
    if (draggingRef.current || !settled) {
      rafRef.current = requestAnimationFrame(animate)
    } else {
      posRef.current = targetRef.current
      waveRef.current = 0
      rafRef.current = 0
      nudge()
    }
  }
  const startLoop = () => {
    if (!rafRef.current) rafRef.current = requestAnimationFrame(animate)
  }

  const setFromClientX = (clientX: number) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const raw = clamp((clientX - rect.left) / rect.width, 0, 1)
    rawRef.current = raw // ring follows the raw finger position
    const v = Math.round(raw * STEPS) // value snaps to the nearest tick
    targetRef.current = v / STEPS
    setValue(v)
    startLoop()
  }

  const onMove = (e: PointerEvent) => setFromClientX(e.clientX)
  const onUp = () => {
    setDragging(false)
    draggingRef.current = false
    rawRef.current = targetRef.current // ring re-seats onto the dot's target
    window.removeEventListener('pointermove', onMove)
    startLoop()
  }
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
    draggingRef.current = true
    setRipple((r) => r + 1) // one-shot halo ripple
    setFromClientX(e.clientX)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp, { once: true })
  }

  const bump = (delta: number) => {
    const v = clamp(value + delta, 0, STEPS)
    rawRef.current = v / STEPS
    targetRef.current = v / STEPS
    setValue(v)
    startLoop()
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
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('pointermove', onMove)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const pos = posRef.current
  const raw = rawRef.current
  const wave = waveRef.current
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

          {/* Trailing filled dot — lerps toward the snapped target (the visible lag). */}
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
