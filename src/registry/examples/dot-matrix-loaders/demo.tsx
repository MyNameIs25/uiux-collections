import { useEffect, useRef, useState } from 'react'
import bg from './background.webp'

const LABELS = ['Building context', 'Setting things up', 'Creating layout']
const DOTS = 9
const STEP_MS = 150 // one dot lights every step → a ~1.35s fill-and-reset loop

/** A fresh random 0…8 permutation — the order the dots light up in. */
function shuffle() {
  const order = Array.from({ length: DOTS }, (_, i) => i)
  for (let i = DOTS - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

const prefersReducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/**
 * One 3×3 matrix. `lit` climbs 1→9 on an interval then hard-resets; on each
 * reset a new `shuffle()` reorders the fill, so it looks random but always
 * grows. A dot is on when its rank in that order is `< lit`. A random start
 * delay keeps the three matrices out of sync.
 */
function DotMatrix() {
  const [lit, setLit] = useState(() => (prefersReducedMotion() ? DOTS : 1))
  const order = useRef(shuffle())

  useEffect(() => {
    if (prefersReducedMotion()) return

    let count = 1
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(
      () => {
        interval = setInterval(() => {
          count = count >= DOTS ? 1 : count + 1
          if (count === 1) order.current = shuffle() // new pattern each loop
          setLit(count)
        }, STEP_MS)
      },
      Math.random() * STEP_MS * DOTS,
    )

    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [])

  return (
    <div aria-hidden className="grid grid-cols-3 gap-[4px]">
      {Array.from({ length: DOTS }, (_, i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-white"
          // toggle opacity (not display) so the grid never reflows
          style={{ opacity: order.current.indexOf(i) < lit ? 1 : 0 }}
        />
      ))}
    </div>
  )
}

export function DotMatrixLoaders() {
  return (
    <div className="relative isolate flex min-h-[22rem] w-full items-center justify-center overflow-hidden bg-black">
      {/* Backdrop painting — the scene the glass pills frost and darken */}
      <img
        aria-hidden
        src={bg}
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/40" />

      <div className="flex flex-col gap-5">
        {LABELS.map((label) => (
          <div
            key={label}
            className="flex items-center gap-3.5 rounded-full bg-[#2d2620]/35 px-6 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-blur-[14px] backdrop-saturate-[1.2]"
          >
            <DotMatrix />
            <span
              role="status"
              className="font-mono text-sm tracking-wide text-[#f2efe9]"
            >
              {label}..
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
