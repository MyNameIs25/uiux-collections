import { Fragment, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * One half of a flip card. A full-height glyph sits inside a half-height
 * `overflow-hidden` window, so `side="top"` shows its upper half and
 * `side="bottom"` its lower half. Reused for both the static faces and the
 * animated flaps.
 */
function CardFace({
  side,
  digit,
  className,
}: {
  side: 'top' | 'bottom'
  digit: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'absolute inset-x-0 h-1/2 overflow-hidden',
        side === 'top'
          ? 'top-0 rounded-t-[6px] bg-gradient-to-b from-neutral-700 to-neutral-800'
          : 'bottom-0 rounded-b-[6px] bg-gradient-to-b from-neutral-800 to-neutral-900',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-x-0 flex h-[200%] items-center justify-center text-[64px] font-bold leading-none tabular-nums text-neutral-100 [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]',
          side === 'top' ? 'top-0' : 'bottom-0',
        )}
      >
        {digit}
      </div>
    </div>
  )
}

/** A single 0–9 digit that plays a split-flap flip whenever `value` changes. */
function FlipDigit({ value }: { value: number }) {
  const [current, setCurrent] = useState(value)
  const [previous, setPrevious] = useState(value)

  useEffect(() => {
    if (value !== current) {
      setPrevious(current)
      setCurrent(value)
    }
  }, [value, current])

  const cur = String(current)
  const prev = String(previous)
  const flipping = current !== previous

  return (
    <div className="relative h-[92px] w-[62px] shadow-lg [perspective:280px]">
      {/* Settled faces: the new top is revealed as the flap falls; the old
          bottom stays until the new bottom flap drops over it. */}
      <CardFace side="top" digit={cur} />
      <CardFace side="bottom" digit={prev} />

      {/* Flaps — a changing `key` remounts them so the CSS animation replays. */}
      {flipping && (
        <>
          <CardFace
            key={`t${current}`}
            side="top"
            digit={prev}
            className="z-10 origin-bottom animate-flip-down [backface-visibility:hidden]"
          />
          <CardFace
            key={`b${current}`}
            side="bottom"
            digit={cur}
            className="z-10 origin-top animate-flip-up [backface-visibility:hidden]"
          />
        </>
      )}

      {/* Center seam */}
      <div className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-px bg-black/40" />
    </div>
  )
}

/** Two flip digits + a label, for one time unit. */
function FlipGroup({ value, label }: { value: number; label: string }) {
  const digits = String(value).padStart(2, '0').split('')
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1.5">
        {digits.map((d, i) => (
          <FlipDigit key={i} value={Number(d)} />
        ))}
      </div>
      <span className="text-[0.7rem] font-medium tracking-[0.2em] text-neutral-400 uppercase">
        {label}
      </span>
    </div>
  )
}

function Colon() {
  return (
    <div className="flex h-[92px] flex-col items-center justify-center gap-2.5">
      <span className="size-1.5 rounded-full bg-neutral-600" />
      <span className="size-1.5 rounded-full bg-neutral-600" />
    </div>
  )
}

function useCountdown(targetDate: number, onComplete?: () => void) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, targetDate - Date.now()),
  )
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let done = false
    const tick = () => {
      const r = Math.max(0, targetDate - Date.now())
      setRemaining(r)
      if (r <= 0 && !done) {
        done = true
        onCompleteRef.current?.()
      }
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return remaining
}

/**
 * Reusable flip-countdown clock. Pass a target timestamp (ms); it renders
 * days:hours:minutes:seconds and flips each digit as it changes.
 */
export function FlipCountdown({
  targetDate,
  onComplete,
}: {
  targetDate: number
  onComplete?: () => void
}) {
  const total = Math.floor(useCountdown(targetDate, onComplete) / 1000)
  const groups = [
    { label: 'Days', value: Math.floor(total / 86400) },
    { label: 'Hours', value: Math.floor((total % 86400) / 3600) },
    { label: 'Minutes', value: Math.floor((total % 3600) / 60) },
    { label: 'Seconds', value: total % 60 },
  ]
  return (
    <div className="flex items-start gap-2 sm:gap-4">
      {groups.map((g, i) => (
        <Fragment key={g.label}>
          <FlipGroup value={g.value} label={g.label} />
          {i < groups.length - 1 && <Colon />}
        </Fragment>
      ))}
    </div>
  )
}

export function FlipClock() {
  // Demo target a couple of days out so every unit ticks.
  const [target] = useState(
    () => Date.now() + ((2 * 24 + 8) * 3600 + 41 * 60 + 30) * 1000,
  )
  return (
    <div className="flex min-h-[18rem] w-full items-center justify-center bg-neutral-950 p-8">
      <FlipCountdown targetDate={target} />
    </div>
  )
}
