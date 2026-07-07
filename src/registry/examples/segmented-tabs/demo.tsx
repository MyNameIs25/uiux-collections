import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Boxes, Clock, Lock, Star, Users, type LucideIcon } from 'lucide-react'

const TABS: { label: string; Icon: LucideIcon }[] = [
  { label: 'Teamspaces', Icon: Boxes },
  { label: 'Recents', Icon: Clock },
  { label: 'Favorites', Icon: Star },
  { label: 'Shared', Icon: Users },
  { label: 'Private', Icon: Lock },
]

// The selected pill glides + reshapes on one shared ease (position AND width in
// lockstep = the "fluid" slide); the hover highlight flashes in far faster.
const SLIDE = '220ms cubic-bezier(0.2, 0, 0, 1)'
const FLASH = '120ms ease-out'

const reducedMotion = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

type Rect = { left: number; width: number }

export function SegmentedTabs() {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [rects, setRects] = useState<Rect[]>([])
  const [ready, setReady] = useState(false) // gate transitions until first measure
  const listRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const reduce = reducedMotion()

  // Measure each tab's box relative to the list. Both indicators are absolutely
  // positioned and only ever animate between these discrete targets — a single
  // reused element sliding, not two elements cross-fading (FLIP-like).
  useLayoutEffect(() => {
    const measure = () =>
      setRects(
        tabRefs.current.map((el) => ({
          left: el?.offsetLeft ?? 0,
          width: el?.offsetWidth ?? 0,
        })),
      )
    measure()
    const ro = new ResizeObserver(measure)
    if (listRef.current) ro.observe(listRef.current)
    return () => ro.disconnect()
  }, [])

  // Enable transitions only after the first paint so the pill doesn't slide in
  // from the left edge on mount.
  useEffect(() => setReady(true), [])

  const activeRect = rects[active]
  const hoverRect = hovered != null ? rects[hovered] : undefined
  const transition = (t: string) => (reduce || !ready ? 'none' : t)

  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center bg-[#F9F9F9] p-6">
      <div className="max-w-full rounded-2xl bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_30px_rgba(0,0,0,0.06)]">
        <h2 className="mb-4 px-1 text-2xl font-extrabold tracking-tight text-[#161616]">
          Fluid functionalism
        </h2>

        <div className="overflow-x-auto">
          <div ref={listRef} className="relative flex w-max gap-1">
            {/* Selected pill — opaque grey, glides + reshapes to the active tab. */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 h-full rounded-full bg-[#E8E8E8]"
              style={{
                width: activeRect?.width ?? 0,
                transform: `translateX(${activeRect?.left ?? 0}px)`,
                opacity: activeRect ? 1 : 0,
                transition: transition(`transform ${SLIDE}, width ${SLIDE}`),
              }}
            />
            {/* Hover highlight — lighter, quicker, independent of the selection. */}
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 left-0 h-full rounded-full bg-black/[0.04]"
              style={{
                width: hoverRect?.width ?? 0,
                transform: `translateX(${hoverRect?.left ?? 0}px) scale(${hoverRect ? 1 : 0.95})`,
                opacity: hoverRect ? 1 : 0,
                transition: transition(`transform ${FLASH}, width ${FLASH}, opacity ${FLASH}`),
              }}
            />

            {TABS.map(({ label, Icon }, i) => {
              const isActive = i === active
              return (
                <button
                  key={label}
                  type="button"
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  aria-current={isActive || undefined}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative z-10 flex items-center gap-2 rounded-full px-4 py-2 text-sm whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-black/20"
                  style={{
                    color: isActive ? '#151515' : '#686868',
                    fontWeight: isActive ? 600 : 400,
                    // color follows the pill, matched to the slide duration
                    transition: transition('color 220ms ease'),
                  }}
                >
                  <Icon
                    className="size-4"
                    strokeWidth={2}
                    style={{ color: isActive ? '#151515' : '#959595' }}
                  />
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
