import { useEffect, useState } from 'react'
import { Calendar, Files, Flag, Folder, Notebook, Plus, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

// The whole morph is a "shared-layout" illusion with ZERO layout library:
// closed and open are both CONCRETE sizes, so one CSS transition on
// width/height/border-radius carries the capsule → card shape change.
const CLOSED = { w: 172, h: 52, r: 26 }
const OPEN = { w: 292, h: 240, r: 28 }

const TITLE_H = 52 // dark title band — equals CLOSED.h so the shared label/toggle never shift
const CARD_INSET = 8 // how far the white card sits inside the dark layer → dark corners peek out
const CELL_W = 88
const CELL_H = 84
const PAD = 6 // grid inset inside the white card

// 2×3 grid, row-major — the floating highlight maps index → (col,row) off these.
const ITEMS = [
  { icon: Folder, label: 'Project' },
  { icon: Notebook, label: 'Notebook' },
  { icon: Files, label: 'Notes' },
  { icon: Trophy, label: 'Goal' },
  { icon: Flag, label: 'Milestone' },
  { icon: Calendar, label: 'Event' },
]

export function CreateNewMorphMenu() {
  const [open, setOpen] = useState(false)
  const [hover, setHover] = useState(0)

  // Esc closes, like a real menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => {
    setOpen(false)
    setHover(0)
  }
  const { w, h, r } = open ? OPEN : CLOSED

  return (
    // Soft Apple-grey canvas so both the dark button and the white card read.
    <div className="flex min-h-[20rem] w-full items-center justify-center bg-[#f2f2f5] p-10">
      <div
        style={{ width: w, height: h, borderRadius: r }}
        className="relative overflow-hidden bg-[#1c1c1e] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] transition-[width,height,border-radius] duration-[360ms] ease-[cubic-bezier(0.34,1.28,0.64,1)] motion-reduce:transition-none"
      >
        {/* Full-capsule click target to OPEN. Goes inert once open so the
            grid below it becomes interactive. */}
        <button
          type="button"
          aria-label="Open create menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className={cn('absolute inset-0 z-20', open && 'pointer-events-none')}
        />

        {/* Shared, never-moving label: anchored top-left in BOTH states — the
            container just grows beneath it. That's the shared-layout feel. */}
        <span className="pointer-events-none absolute left-5 top-4 z-30 text-[15px] font-semibold text-white">
          Create new
        </span>

        {/* Shared toggle: one persistent glyph, so the + → × is a continuous
            45° rotate rather than a swap. */}
        <button
          type="button"
          aria-label={open ? 'Close create menu' : 'Create new'}
          onClick={() => (open ? close() : setOpen(true))}
          className="absolute right-3.5 top-[13px] z-30 grid size-6 place-items-center"
        >
          <Plus
            strokeWidth={2.2}
            className={cn(
              'size-[22px] text-white transition-transform duration-[360ms] ease-[cubic-bezier(0.34,1.28,0.64,1)] motion-reduce:transition-none',
              open && 'rotate-45',
            )}
          />
        </button>

        {/* White content card: a SECOND independent rounded rect, inset so the
            dark layer's corners peek out — the "stacked cards" look, not one
            continuous outline. Blooms from the title band (`origin-top`). */}
        <div
          style={{ top: TITLE_H, left: CARD_INSET, width: OPEN.w - CARD_INSET * 2, height: OPEN.h - TITLE_H - CARD_INSET }}
          className={cn(
            'absolute z-10 origin-top rounded-[20px] bg-white transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none',
            open ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
          )}
        >
          <div className="relative" style={{ padding: PAD }}>
            {/* One floating highlight glides in 2-D between cells (col×row),
                instead of a background on every item. */}
            <span
              aria-hidden
              className="absolute rounded-2xl bg-[#f0f0f0] transition-transform duration-200 ease-out motion-reduce:transition-none"
              style={{
                width: CELL_W,
                height: CELL_H,
                top: PAD,
                left: PAD,
                transform: `translate(${(hover % 3) * CELL_W}px, ${Math.floor(hover / 3) * CELL_H}px)`,
              }}
            />
            <div className="relative grid grid-cols-3">
              {ITEMS.map(({ icon: Icon, label }, i) => (
                <button
                  key={label}
                  type="button"
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  style={{
                    width: CELL_W,
                    height: CELL_H,
                    transform: open ? 'none' : 'translateY(8px)',
                    transitionDelay: open ? `${i * 22 + 40}ms` : '0ms',
                  }}
                  className="flex flex-col items-center justify-center gap-2 transition-transform duration-300 ease-out motion-reduce:transition-none"
                >
                  <Icon className="size-6 text-[#9a9a9a]" strokeWidth={1.6} />
                  <span className="text-[11px] font-medium text-[#1d1d1f]">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
