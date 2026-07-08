import { useRef, useState, type ReactNode } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { Clock, Pause, Play } from 'lucide-react'

/*
  iOS-style "Set Timer" capsule, ported from a Dribbble motion study
  (@diip3sh × @motiondotdev). The "aha": ONE container morphs between three
  states instead of swapping panels — Motion's `layout` prop measures the box
  before and after the content changes and animates width/height/radius between
  them, so the capsule feels like it stretches while the contents flow inside.
    idle    → a "Set timer" pill
    picker  → a vertical minute wheel with depth-of-field blur (drag to choose)
    running → Pause | M:SS | Cancel, wrapped by a depleting orange ring
  See the principle for the load-bearing pieces.
*/

type Phase = 'idle' | 'picker' | 'running'

// Springy ease-out Apple uses for its sheet/capsule morphs.
const IOS_EASE = [0.32, 0.72, 0, 1] as const
const ITEM_H = 40 // picker row height (px)
const WINDOW_H = ITEM_H * 5 // 5 rows visible; the outer two fade into depth
const BASE_TOP = WINDOW_H / 2 - ITEM_H / 2 // column top so index 0 sits centred at y=0
const MAX_MIN = 60

const ORANGE = '#e8602e'

function formatMMSS(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds))
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

// One minute row. It reads the shared column offset `y` and derives its own
// opacity / blur / scale from how far it sits from the centre line — that
// distance→blur mapping is the depth-of-field of a real iOS picker.
function PickerItem({
  index,
  y,
  onSelect,
}: {
  index: number
  y: MotionValue<number>
  onSelect: (index: number) => void
}) {
  const distance = useTransform(y, (v) => Math.abs((v + index * ITEM_H) / ITEM_H))
  const opacity = useTransform(distance, (d) => Math.max(1 - d * 0.32, 0.12))
  const scale = useTransform(distance, (d) => Math.max(1 - d * 0.08, 0.78))
  const filter = useTransform(distance, (d) => `blur(${Math.min(d * 1.7, 6)}px)`)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      style={{ height: ITEM_H, opacity, scale, filter }}
      className="flex w-full items-center justify-center text-2xl font-semibold tabular-nums text-white"
    >
      {index + 1}
    </motion.button>
  )
}

// Drag-to-choose minute wheel. `y` (px) is the column translate; snapping and
// selection are computed from it, so there is no per-frame React state.
function MinutePicker({
  value,
  onChange,
}: {
  value: number
  onChange: (minutes: number) => void
}) {
  const y = useMotionValue(-(value - 1) * ITEM_H)

  function snapTo(index: number) {
    const clamped = Math.min(Math.max(index, 0), MAX_MIN - 1)
    animate(y, -clamped * ITEM_H, { type: 'spring', stiffness: 500, damping: 42 })
    onChange(clamped + 1)
  }

  return (
    <div
      className="relative overflow-hidden select-none [mask-image:linear-gradient(to_bottom,transparent,#000_28%,#000_72%,transparent)]"
      style={{ height: WINDOW_H, width: 132 }}
    >
      {/* centre band — the two hairlines that frame the selected value */}
      <div
        className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-md border-y border-white/12"
        style={{ height: ITEM_H }}
      />
      <span className="pointer-events-none absolute left-[62%] top-1/2 -translate-y-1/2 text-sm text-white/45">
        min
      </span>
      <motion.div
        className="absolute inset-x-0 cursor-grab active:cursor-grabbing"
        style={{ y, top: BASE_TOP }}
        drag="y"
        dragConstraints={{ top: -(MAX_MIN - 1) * ITEM_H, bottom: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={() => snapTo(Math.round(-y.get() / ITEM_H))}
      >
        {Array.from({ length: MAX_MIN }, (_, i) => (
          <PickerItem key={i} index={i} y={y} onSelect={snapTo} />
        ))}
      </motion.div>
    </div>
  )
}

// Capsule-outline progress ring that gets "eaten" as `progress` runs 1 → 0.
// It's TWO mirrored half-capsule paths, each starting at the bottom-centre and
// running up its own side to the top-centre. Motion normalises `pathLength` to
// 0–1, so `pathLength: progress` draws each half from the bottom up — the two
// ends retreat together and the gap opens symmetrically from the TOP, exactly
// like the reference (a single rect would erode from one corner instead).
const RING_HALVES = [
  'M150 62.5 H32 A30.5 30.5 0 0 1 32 1.5 H150', // bottom-centre → left cap → top-centre
  'M150 62.5 H268 A30.5 30.5 0 0 0 268 1.5 H150', // bottom-centre → right cap → top-centre
]

function ProgressRing({ progress }: { progress: MotionValue<number> }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      viewBox="0 0 300 64"
      preserveAspectRatio="none"
      aria-hidden
    >
      {RING_HALVES.map((d) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          stroke={ORANGE}
          strokeWidth="3"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ pathLength: progress }}
        />
      ))}
    </svg>
  )
}

// Small pill button used for Cancel / Start / Pause.
function Pill({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'flex h-9 shrink-0 items-center justify-center rounded-full px-3.5 text-sm font-semibold whitespace-nowrap transition-transform active:scale-95 ' +
        className
      }
    >
      {children}
    </button>
  )
}

export function SetTimerCapsule() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [minutes, setMinutes] = useState(5)
  const [paused, setPaused] = useState(false)
  const reduce = useReducedMotion()

  // The countdown lives in motion values so ticking the label and depleting the
  // ring never re-render React. We advance it ourselves from a wall-clock
  // deadline instead of a fixed-duration tween — that makes pause/resume exact
  // (pausing just stops advancing) and immune to background-tab throttling.
  const remaining = useMotionValue(0)
  const progress = useMotionValue(1)
  const label = useTransform(remaining, formatMMSS)
  const total = useRef(0) // original duration, for the ring's progress fraction
  const endAt = useRef(0) // performance.now() timestamp the timer reaches 0

  // A live ref, so the frame loop below never runs on a stale closure.
  const active = useRef(false)
  active.current = phase === 'running' && !paused

  useAnimationFrame(() => {
    if (!active.current) return
    const left = Math.max((endAt.current - performance.now()) / 1000, 0)
    remaining.set(left)
    progress.set(left / total.current)
    if (left === 0) setPhase('idle')
  })

  function start() {
    total.current = minutes * 60
    endAt.current = performance.now() + total.current * 1000
    remaining.set(total.current)
    progress.set(1)
    setPaused(false)
    setPhase('running')
  }

  function togglePause() {
    if (paused) {
      // Resume: push the finish line out by whatever time was left.
      endAt.current = performance.now() + remaining.get() * 1000
      setPaused(false)
    } else {
      setPaused(true)
    }
  }

  function cancel() {
    setPhase('idle')
  }

  const transition = { duration: reduce ? 0 : 0.42, ease: IOS_EASE }

  return (
    <div className="flex min-h-72 w-full items-center justify-center bg-neutral-200 p-6 sm:p-10 dark:bg-neutral-950">
      <motion.div
        layout
        transition={{ layout: transition }}
        // A fixed 32px radius: short states (idle/running, ≤64px tall) clamp to a
        // perfect pill, while the tall picker becomes a rounded-rectangle whose
        // small corners don't clip the Cancel/Start buttons. A full 999px radius
        // would clamp to ~half the width on the tall picker and eat the buttons.
        style={{ borderRadius: 32 }}
        className="relative flex shrink-0 items-center justify-center overflow-hidden bg-[#2b2b2e] text-white ring-1 ring-white/10 ring-inset shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)]"
      >
        {phase === 'running' && <ProgressRing progress={progress} />}

        <AnimatePresence mode="popLayout" initial={false}>
          {phase === 'idle' && (
            <motion.button
              key="idle"
              type="button"
              onClick={() => setPhase('picker')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="flex h-14 items-center gap-2 px-6 font-semibold whitespace-nowrap"
            >
              <Clock className="size-5 text-white/70" />
              Set timer
            </motion.button>
          )}

          {phase === 'picker' && (
            <motion.div
              key="picker"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="flex flex-col items-center gap-3 px-5 py-4"
            >
              <MinutePicker value={minutes} onChange={setMinutes} />
              <div className="flex gap-2">
                <Pill onClick={() => setPhase('idle')} className="bg-[#48484b] text-white">
                  Cancel
                </Pill>
                <Pill onClick={start} className="bg-[#e8602e] text-white">
                  Start
                </Pill>
              </div>
            </motion.div>
          )}

          {phase === 'running' && (
            <motion.div
              key="running"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              className="flex h-16 w-max items-center gap-2 px-2.5"
            >
              <Pill
                onClick={togglePause}
                className="gap-1.5 bg-[#3d1f14] text-[#f2966e]"
              >
                {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
                {paused ? 'Resume' : 'Pause'}
              </Pill>
              <motion.span className="text-2xl font-bold tabular-nums" aria-live="off">
                {label}
              </motion.span>
              <Pill onClick={cancel} className="bg-[#48484b] text-white">
                Cancel
              </Pill>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
