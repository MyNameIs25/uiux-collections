import { useEffect, useRef, useState } from 'react'
import {
  Copy,
  Download,
  Lock,
  Menu,
  Pencil,
  Sparkles,
  Trash2,
  UserPlus,
  Video,
  X,
  type LucideIcon,
} from 'lucide-react'

/** 8 sectors, clockwise from 12 o'clock. */
const ITEMS: { Icon: LucideIcon; label: string }[] = [
  { Icon: Download, label: 'Download' },
  { Icon: Lock, label: 'Permissions' },
  { Icon: Trash2, label: 'Delete' },
  { Icon: Copy, label: 'Duplicate' },
  { Icon: Video, label: 'Record' },
  { Icon: Sparkles, label: 'Ask AI' },
  { Icon: UserPlus, label: 'Add people' },
  { Icon: Pencil, label: 'Edit' },
]

const RADIUS = 86 // px from centre to each icon
const RING = 228 // disc diameter — just wide enough to hold the icons
const EASE_BACK = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // overshoot — the bloom
const EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)' // crisp — the snap back

const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export function RadialMenu() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const reduce = reducedMotion()

  // Esc and click-outside dismiss (only while open).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <div className="flex min-h-[26rem] w-full items-center justify-center bg-[#F1F1ED]">
      <div
        ref={rootRef}
        className="relative"
        style={{ width: RING, height: RING }}
      >
        {/* Ring disc — one white pie that scales from the centre. */}
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 overflow-hidden rounded-full bg-white shadow-[0_8px_30px_rgba(0,0,0,0.10)]"
          style={{
            width: RING,
            height: RING,
            transform: `translate(-50%, -50%) scale(${open ? 1 : 0})`,
            transition: reduce
              ? 'none'
              : `transform ${open ? 300 : 180}ms ${open ? EASE_BACK : EASE_IN}`,
          }}
        >
          {/* 4 diameters, offset 22.5° so each line falls *between* icons. */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute top-0 left-1/2 h-full w-px bg-black/[0.06]"
              style={{ transform: `translateX(-50%) rotate(${i * 45 + 22.5}deg)` }}
            />
          ))}
        </div>

        {/* Sector icons — each placed on the circle, staggered in on open. */}
        <div
          role="menu"
          aria-label="Actions"
          className="absolute top-1/2 left-1/2"
        >
          {ITEMS.map(({ Icon, label }, i) => {
            const a = i * 45
            return (
              <button
                key={label}
                type="button"
                role="menuitem"
                aria-label={label}
                title={label}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[#555555] transition-colors hover:bg-black/5"
                style={{
                  transform: open
                    ? `rotate(${a}deg) translateY(-${RADIUS}px) rotate(${-a}deg) scale(1)`
                    : `rotate(${a}deg) translateY(0px) rotate(${-a}deg) scale(0.5)`,
                  opacity: open ? 1 : 0,
                  pointerEvents: open ? 'auto' : 'none',
                  transition: reduce
                    ? 'none'
                    : `transform ${open ? 260 : 160}ms ${open ? EASE_BACK : EASE_IN} ${open ? i * 30 : 0}ms, opacity ${open ? 200 : 140}ms ease ${open ? i * 30 : 0}ms`,
                }}
              >
                <Icon className="size-5" strokeWidth={1.75} />
              </button>
            )
          })}
        </div>

        {/* Centre hub — toggles; hamburger ↔ × cross-fade. */}
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
          className="absolute top-1/2 left-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#555555] shadow-[0_8px_20px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.06)] transition-transform active:scale-95"
        >
          <Menu
            className="col-start-1 row-start-1 size-6 transition-all duration-200"
            strokeWidth={1.75}
            style={{
              opacity: open ? 0 : 1,
              transform: `rotate(${open ? 35 : 0}deg)`,
            }}
          />
          <X
            className="col-start-1 row-start-1 size-6 transition-all duration-200"
            strokeWidth={1.75}
            style={{
              opacity: open ? 1 : 0,
              transform: `rotate(${open ? 0 : -35}deg)`,
            }}
          />
        </button>
      </div>
    </div>
  )
}
