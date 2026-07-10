import { useEffect, useRef } from 'react'
import gsap from 'gsap'

// Grid + sweep geometry (cells, not px — the font size scales everything).
const ROWS = 4
const COLS = 28
const BLOCK_W = 4 // solid block width
const TAIL = 7 // dither trail length behind the block
const LEAD = 2 // short soft edge in front of it
const SWEEP_SECS = 1.5 // one left→right pass; yoyo brings it back

// Density ladder, sparse → solid. Braille cells (U+2800 block) are strictly
// 1ch wide in monospace fonts, so "more dots" = "denser pixel" with zero
// layout shift; the full block █ caps the ladder as the solid interior.
const LADDER = ['⠆', '⠶', '⣶', '⣿', '█']
// Resting texture: single-dot cells, alternated per cell parity so the field
// reads as an offset checker of tiny squares rather than a flat grid.
const BG = ['⠂', '⠐']

/** Stable per-cell jitter (0..1) — the ordered-dither threshold that breaks
 *  the trail into halftone speckle instead of clean vertical bands. */
const jitter = (r: number, c: number) => (((r * 31 + c * 17) ^ (r * 7)) % 10) / 10

/** One full frame of the matrix as a string; `head` in columns, `dir` ±1. */
function frame(head: number, dir: number) {
  let out = ''
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const d = c - head
      const edge = Math.abs(d) - BLOCK_W / 2
      if (edge <= 0) {
        out += '█'
        continue
      }
      // The dither band hangs off the trailing side (motion afterimage);
      // the leading edge stays nearly hard, like the reference.
      const reach = Math.sign(d) === -dir ? TAIL : LEAD
      const f = Math.max(0, 1 - edge / reach) ** 2
      const lvl = Math.floor(f * LADDER.length + jitter(r, c) * 0.9)
      out += lvl <= 0 ? BG[(r + c) % 2] : LADDER[Math.min(lvl - 1, LADDER.length - 1)]
    }
    out += '\n'
  }
  return out
}

const FIRST_FRAME = frame(BLOCK_W / 2, 1)

export function DotMatrixScanLoader() {
  const preRef = useRef<HTMLPreElement>(null)

  // GSAP owns the <pre> text after mount (the JSX child is the constant first
  // frame, so React never rewrites it). One yoyo tween sweeps the head across
  // the row and back; every update re-renders the whole string — ~500 cells,
  // far cheaper than a DOM node per dot.
  useEffect(() => {
    const pre = preRef.current
    if (!pre) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pre.textContent = frame(COLS * 0.62, 1)
      return
    }
    const proxy = { t: 0 }
    let prev = 0
    const tween = gsap.to(proxy, {
      t: 1,
      duration: SWEEP_SECS,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      onUpdate: () => {
        const dir = proxy.t >= prev ? 1 : -1
        prev = proxy.t
        pre.textContent = frame(BLOCK_W / 2 + proxy.t * (COLS - BLOCK_W), dir)
      },
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex min-h-[10rem] w-full items-center justify-center overflow-hidden bg-[#f0eef3] px-6 py-10"
    >
      {/* leading-[0.62] is load-bearing twice over: a monospace cell is
          ~0.6em wide × 1em tall, so squashing the line box to ~0.62em makes
          the dot lattice square like the reference — and the overlapping
          rows of █ fuse into one seamless solid (many monospace fonts leave
          a hairline gap under █ at line-height 1). */}
      <pre
        ref={preRef}
        aria-hidden
        className="font-mono text-[9px] leading-[0.62] text-[#da3b5c] select-none sm:text-[12px]"
      >
        {FIRST_FRAME}
      </pre>
    </div>
  )
}
