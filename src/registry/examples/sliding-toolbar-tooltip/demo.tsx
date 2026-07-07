import { useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowUpFromLine,
  Eye,
  EyeOff,
  Inbox,
  Menu,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'

type Item = { label: string; Icon: LucideIcon; shortcut?: string; dot?: boolean }

// A Vercel-Toolbar-style row: 6 icons, some with a keyboard shortcut badge, two
// with an unread blue dot.
const ITEMS: Item[] = [
  { label: 'Comment', Icon: MessageSquare, shortcut: 'C' },
  { label: 'Inbox', Icon: Inbox, dot: true },
  { label: 'Feature Flags', Icon: EyeOff },
  { label: 'Draft Mode', Icon: Eye },
  { label: 'Share', Icon: ArrowUpFromLine, shortcut: 'M' },
  { label: 'Menu', Icon: Menu, dot: true },
]

// The tooltip is ONE element that slides + reshapes between icons on this ease
// (Vercel's curve); position and width move in lockstep so it morphs rather
// than re-popping. FADE is the pure opacity in/out used on first show / leave.
const SLIDE = '260ms cubic-bezier(0.32, 0.72, 0, 1)'
const FADE = '150ms ease-out'

const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

/** The tooltip's inner content — reused by the hidden measurers and the live bubble. */
function TipContent({ item }: { item: Item }) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium whitespace-nowrap text-white">
      {item.label}
      {item.shortcut && (
        <kbd className="grid size-[18px] place-items-center rounded border border-white/20 bg-white/5 text-[11px] font-medium text-white/70">
          {item.shortcut}
        </kbd>
      )}
    </span>
  )
}

type Rect = { center: number; width: number }

export function SlidingToolbarTooltip() {
  // `i` = hovered icon (null = none); `prev` = the one we came from, so we can
  // render the outgoing label and tell "first show" (prev null) from "moving".
  const [{ i, prev }, setState] = useState<{
    i: number | null
    prev: number | null
  }>({ i: null, prev: null })
  const [rects, setRects] = useState<Rect[]>([])
  const wrapRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
  const reduce = reducedMotion()

  const enter = (k: number) => setState((s) => ({ i: k, prev: s.i }))
  const leave = () => setState((s) => ({ i: null, prev: s.i }))

  // Measure each icon's centre (relative to the wrapper) and each label's
  // natural width. The bubble only ever animates between these discrete targets.
  useLayoutEffect(() => {
    const measure = () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const wb = wrap.getBoundingClientRect()
      setRects(
        ITEMS.map((_, k) => {
          const b = iconRefs.current[k]?.getBoundingClientRect()
          return {
            center: b ? b.left - wb.left + b.width / 2 : 0,
            width: labelRefs.current[k]?.offsetWidth ?? 0,
          }
        }),
      )
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  const visible = i !== null
  const moving = i !== null && prev !== null && prev !== i && !reduce
  // Glide only when travelling between two icons; first appearance is a pure fade.
  const slide = i !== null && prev !== null && !reduce
  const rect = rects[i ?? prev ?? 0]

  return (
    <div className="relative flex min-h-[20rem] w-full items-center justify-center bg-background p-6">
      {/* Hidden measurers → each tooltip's natural width. */}
      <div
        className="pointer-events-none absolute top-0 left-0 -z-10 opacity-0"
        aria-hidden
      >
        {ITEMS.map((item, k) => (
          <span
            key={item.label}
            ref={(el) => {
              labelRefs.current[k] = el
            }}
            className="inline-flex"
          >
            <TipContent item={item} />
          </span>
        ))}
      </div>

      <div ref={wrapRef} className="relative">
        {/* The one shared tooltip — slides + reshapes; never re-created. */}
        <div
          aria-hidden={!visible}
          className="pointer-events-none absolute bottom-full left-0 mb-2 h-8 overflow-hidden rounded-lg border border-white/10 bg-neutral-800 shadow-lg"
          style={{
            width: rect?.width ?? 0,
            transform: `translateX(${(rect?.center ?? 0) - (rect?.width ?? 0) / 2}px)`,
            opacity: visible ? 1 : 0,
            transition: [
              `opacity ${FADE}`,
              slide ? `transform ${SLIDE}, width ${SLIDE}` : '',
            ]
              .filter(Boolean)
              .join(', '),
          }}
        >
          {/* Both labels are absolutely stretched over the bubble and centred
              against IT (not a shared track), so a short incoming label can't be
              mis-centred by a wider outgoing one. They overlap; clip-path wipes
              swap them without a cross-fade. */}
          <div className="relative h-full">
            {moving && prev !== null && (
              <span
                key={`out-${prev}-${i}`}
                className="absolute inset-0 grid place-items-center animate-tooltip-wipe-out"
              >
                <TipContent item={ITEMS[prev]} />
              </span>
            )}
            {i !== null && (
              <span
                key={`in-${i}`}
                className={`absolute inset-0 grid place-items-center ${moving ? 'animate-tooltip-wipe-in' : ''}`}
              >
                <TipContent item={ITEMS[i]} />
              </span>
            )}
          </div>
        </div>

        {/* The toolbar itself. */}
        <div
          className="flex items-center gap-1 rounded-full border border-white/10 bg-neutral-900 p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          onMouseLeave={leave}
        >
          {ITEMS.map((item, k) => (
            <button
              key={item.label}
              type="button"
              ref={(el) => {
                iconRefs.current[k] = el
              }}
              aria-label={item.label}
              // Focus mirrors hover so keyboard/touch users get the tooltip too.
              onMouseEnter={() => enter(k)}
              onFocus={() => enter(k)}
              onBlur={leave}
              className="relative grid size-9 place-items-center rounded-full text-white/80 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {/* Per-icon circular highlight — its own fade, so the old and new
                  circles briefly coexist while the tooltip travels. */}
              <span
                aria-hidden
                className="absolute inset-0 rounded-full bg-white/10 transition-opacity duration-200"
                style={{ opacity: i === k ? 1 : 0 }}
              />
              <item.Icon className="relative size-[18px]" strokeWidth={2} />
              {item.dot && (
                <span
                  aria-hidden
                  className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-blue-500 ring-2 ring-neutral-900"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
