import { useEffect, useState, type CSSProperties } from 'react'
import { MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = { name: string; time: string; text: string; grad: string }
const MESSAGES: Message[] = [
  {
    name: 'Alice Johnson',
    time: '2h',
    text: 'Hey! Are we still on for the meeting today?',
    grad: 'from-violet-500 to-indigo-500',
  },
  {
    name: 'Bob Smith',
    time: '2h',
    text: "Don't forget to check out the new project updates",
    grad: 'from-orange-400 to-rose-500',
  },
  {
    name: 'Charlie Davis',
    time: 'Yesterday',
    text: 'Can you send me the files from last week?',
    grad: 'from-teal-400 to-emerald-600',
  },
]

// Geometry. The button is a circle at the top; the panel grows *below* it. The
// panel's top (TOP) sits a little inside the button's footprint so their edges
// overlap — that overlap, blurred by the goo filter, is what forms the liquid
// neck while the panel expands.
const BTN = 64
const PANEL_W = 300
const PANEL_H = 300
const TOP = 46
const BOUNCE = 'cubic-bezier(0.34, 1.56, 0.64, 1)' // slight overshoot = springy

export function GooeyMessagesDropdown() {
  const [open, setOpen] = useState(false)
  const [gooey, setGooey] = useState(true) // the liquid filter is a toggleable layer
  const [slow, setSlow] = useState(false)

  const dur = slow ? 1200 : 520
  // Content waits for the shape to (mostly) form, then reveals row by row.
  const base = Math.round(dur * 0.5)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const shapeStyle: CSSProperties = {
    top: TOP,
    width: open ? PANEL_W : BTN,
    height: open ? PANEL_H : 0,
    transitionDuration: `${dur}ms`,
    transitionTimingFunction: BOUNCE,
  }

  return (
    <div className="flex min-h-[34rem] w-full flex-col items-center justify-center bg-white p-6 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]">
      {/* The author's own demo controls: the "goo" is a separable visual layer,
          so it can be switched off (crisp morph) and re-timed independently. */}
      <div className="mb-10 flex items-center gap-2">
        <Toggle active={gooey} onClick={() => setGooey((v) => !v)}>
          Gooey {gooey ? 'On' : 'Off'}
        </Toggle>
        <Toggle active={slow} onClick={() => setSlow((v) => !v)}>
          {slow ? 'Slow' : 'Normal'}
        </Toggle>
      </div>

      <div className="relative" style={{ width: PANEL_W, height: TOP + PANEL_H }}>
        {/* SHAPE LAYER — button circle + panel rect, same colour, under one goo
            filter so their blurred edges fuse into a metaball neck. Content is
            deliberately NOT in here (the filter would smear it). */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ filter: gooey ? 'url(#goo-messages)' : undefined }}
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-[#1b1b1b]"
            style={{ width: BTN, height: BTN }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-[28px] bg-[#1b1b1b] transition-[width,height] motion-reduce:transition-none"
            style={shapeStyle}
          />
        </div>

        {/* CONTENT LAYER — crisp, above the shapes. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Messages"
          className="absolute left-1/2 top-0 z-10 grid size-16 -translate-x-1/2 cursor-pointer place-items-center rounded-full text-white"
        >
          <MessageSquare className="size-6" strokeWidth={2} />
        </button>

        <div
          className="absolute left-1/2 -translate-x-1/2 overflow-hidden rounded-[28px] transition-opacity duration-300 motion-reduce:transition-none"
          style={{
            top: TOP,
            width: PANEL_W,
            height: PANEL_H,
            opacity: open ? 1 : 0,
            transitionDelay: open ? `${base}ms` : '0ms',
            pointerEvents: open ? 'auto' : 'none',
          }}
        >
          {/* Re-keyed on open so the stagger replays every time it unfurls. */}
          <div key={open ? 'open' : 'closed'} className="flex h-full flex-col px-5 py-4 text-white">
            <div className="flex items-center justify-between">
              <span className="text-[19px] font-bold">Messages</span>
              <span className="text-[13px] text-white/45">3 new</span>
            </div>

            <div className="mt-3 flex flex-col gap-1">
              {MESSAGES.map((m, i) => (
                <div
                  key={m.name}
                  style={{ animationDelay: `${base + i * 70}ms` }}
                  className="flex items-center gap-3 rounded-xl py-2 motion-safe:animate-list-reveal"
                >
                  <span
                    className={cn('size-11 shrink-0 rounded-full bg-gradient-to-br', m.grad)}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[15px] font-medium">{m.name}</span>
                      <span className="shrink-0 text-[12px] text-white/40">{m.time}</span>
                    </div>
                    <div className="truncate text-[13px] text-white/45">{m.text}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto border-t border-white/10 pt-2.5 text-center">
              <span
                style={{ animationDelay: `${base + 220}ms` }}
                className="inline-block text-[13px] text-white/50 motion-safe:animate-list-reveal"
              >
                View All Messages
              </span>
            </div>
          </div>
        </div>

        {/* The goo: blur the shape layer, then crush alpha back to a hard edge
            (feColorMatrix) so overlapping blurs read as one fused blob, not two
            fuzzy ones. stdDeviation + the last two matrix numbers set how sticky
            the merge is. */}
        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <filter id="goo-messages">
              <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}

function Toggle({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'cursor-pointer rounded-full px-4 py-2 text-[14px] font-medium transition-colors',
        active ? 'bg-[#1b1b1b] text-white' : 'bg-[#eaeaea] text-[#1b1b1b]',
      )}
    >
      {children}
    </button>
  )
}
