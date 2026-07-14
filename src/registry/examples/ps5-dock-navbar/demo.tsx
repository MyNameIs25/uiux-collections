import { useEffect, useRef, useState } from 'react'
import {
  BookOpen,
  Clock,
  Database,
  FileText,
  Headphones,
  HelpCircle,
  LayoutList,
  type LucideIcon,
  Map,
  Pencil,
  Plus,
  Radio,
  Rocket,
  Scissors,
  Settings,
  Sparkles,
  Star,
  User,
  Video,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Item = { icon: LucideIcon; title: string; desc: string }
type Category = { icon: LucideIcon; label: string; items: Item[] }

const CATEGORIES: Category[] = [
  {
    icon: Rocket,
    label: 'Launch',
    items: [
      { icon: Sparkles, title: 'Overview', desc: 'What ships this week' },
      { icon: Map, title: 'Roadmap', desc: 'Next 3 milestones' },
      { icon: BookOpen, title: 'Changelog', desc: 'v4.2 · just now' },
    ],
  },
  {
    icon: Settings,
    label: 'Product',
    items: [
      { icon: LayoutList, title: 'Dashboard', desc: 'Realtime analytics' },
      { icon: Pencil, title: 'Editor', desc: 'Draft & publish' },
      { icon: FileText, title: 'API', desc: 'REST & GraphQL · v2' },
      { icon: Plus, title: 'Integrations', desc: 'Connect your stack' },
    ],
  },
  {
    icon: Star,
    label: 'Pricing',
    items: [
      { icon: Star, title: 'Pro', desc: '$12 / month' },
      { icon: User, title: 'Team', desc: '5 seats · $49' },
      { icon: Database, title: 'Enterprise', desc: "SSO · SLA · let's talk" },
    ],
  },
  {
    icon: Video,
    label: 'Studio',
    items: [
      { icon: Radio, title: 'Record', desc: '4K · 60fps' },
      { icon: Scissors, title: 'Clips', desc: 'Trim & share' },
      { icon: Video, title: 'Stream', desc: 'Go live' },
    ],
  },
  {
    icon: Headphones,
    label: 'Support',
    items: [
      { icon: HelpCircle, title: 'Help Center', desc: 'Guides & answers' },
      { icon: Clock, title: 'System Status', desc: 'All systems go' },
      { icon: User, title: 'Contact', desc: 'We reply in ~2h' },
    ],
  },
]

const TILE = 56 // inactive icon-tile size
const GAP = 132 // dock icon centre-to-centre; dock slides in these units
const ROW_H = 84 // sub-item row centre-to-centre within each half of the wheel
const CAPSULE_Y = 336 // y of the focused item / glass capsule (below the dock)
const ABOVE_NEAR = 118 // y of the nearest item *above* the dock; earlier ones stack up
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export function Ps5DockNavbar() {
  const [cat, setCat] = useState(1) // start on "Product"
  const [item, setItem] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)

  const category = CATEGORIES[cat]
  const mid = (CATEGORIES.length - 1) / 2

  const selectCat = (i: number) => {
    setCat(i)
    setItem(0) // a new column always focuses its first entry
  }

  // Arrow keys drive it like a game pad: ←/→ switch category, ↑/↓ the wheel.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const handlers: Record<string, () => void> = {
      ArrowLeft: () => selectCat(Math.max(0, cat - 1)),
      ArrowRight: () => selectCat(Math.min(CATEGORIES.length - 1, cat + 1)),
      ArrowUp: () => setItem((v) => Math.max(0, v - 1)),
      ArrowDown: () => setItem((v) => Math.min(category.items.length - 1, v + 1)),
    }
    const onKey = (e: KeyboardEvent) => {
      const handle = handlers[e.key]
      if (handle) {
        e.preventDefault()
        handle()
      }
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [cat, category.items.length])

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      className="relative h-[560px] w-full overflow-hidden outline-none [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]"
    >
      {/* Silk PS5 backdrop: a blue radial base with a soft diagonal light band
          and a darker upper-left sweep layered over it. */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_120%_at_72%_18%,#6ba6e6_0%,#4585c8_34%,#2b619b_66%,#1e4c7d_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(116deg,transparent_28%,rgba(255,255,255,0.16)_45%,rgba(255,255,255,0.03)_56%,transparent_72%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(158deg,rgba(9,28,58,0.55)_0%,rgba(9,28,58,0.12)_32%,transparent_46%)]" />

      {/* DOCK — the row slides so the active tile is always centred. Sits above
          the wheel (z-20) so items scrolling into the upper half pass behind it. */}
      <div className="absolute inset-x-0 top-[150px] z-20 h-[110px] overflow-x-hidden [mask-image:linear-gradient(90deg,transparent,#000_16%,#000_84%,transparent)]">
        <div
          className="absolute top-1/2 left-1/2 flex items-center transition-transform duration-[450ms] motion-reduce:transition-none"
          style={{
            // Single source of truth for the offset: −50% centres the row on the
            // viewport's mid-line, the extra −35% nudges it up to sit under the
            // dock. (Kept in the inline transform, not split with a Tailwind
            // -translate-y class, so the number stays honest.)
            transform: `translate(calc(-50% + ${(mid - cat) * GAP}px), -85%)`,
            transitionTimingFunction: SPRING,
            gap: GAP - TILE,
          }}
        >
          {CATEGORIES.map((c, i) => {
            const active = i === cat
            const Icon = c.icon
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => selectCat(i)}
                aria-label={c.label}
                aria-current={active}
                className={cn(
                  'grid shrink-0 cursor-pointer place-items-center rounded-[18px] transition-all duration-300 motion-reduce:transition-none',
                  active
                    ? 'scale-[1.28] bg-white text-[#2f6db0] shadow-[0_0_5px_0_rgba(255,255,255,0.6)]'
                    : 'bg-white/15 text-white/60 backdrop-blur-md hover:bg-white/25 hover:text-white/80',
                )}
                style={{ width: TILE, height: TILE, transitionTimingFunction: SPRING }}
              >
                <Icon className="size-6" strokeWidth={2.2} />
              </button>
            )
          })}
        </div>
      </div>

      {/* Active category label, centred under the dock. Re-keyed so it fades on switch. */}
      <div
        key={cat}
        className="absolute inset-x-0 top-[248px] z-20 text-center text-[17px] font-semibold text-white motion-safe:animate-list-reveal"
      >
        {category.label}
      </div>

      {/* SUB-ITEM WHEEL — the focused item sits in a fixed glass capsule below the
          dock; earlier items stack ABOVE the dock and later ones BELOW the capsule,
          so the dock floats in the gap between the two halves. Each item just
          translates to its target y, animating across the gap when focus changes. */}
      <div className="absolute top-0 left-1/2 z-10 h-0 w-0">
        {/* Glass capsule, behind the focused icon. Kept nearly square with a
            radius = height/2, so the top's flat segment (width − 2·radius) is
            only ~8px and the whole top reads as curved — not a sliced-off edge. */}
        <div
          className="absolute top-0 left-0 border border-white/30 bg-white/12 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-1.5px_2px_rgba(255,255,255,0.14),0_12px_30px_-10px_rgba(0,0,0,0.45)] backdrop-blur-md"
          style={{ width: 100, height: 92, borderRadius: 46, transform: `translate(-50%, calc(${CAPSULE_Y}px - 50%))` }}
        />

        {category.items.map((it, i) => {
          const focused = i === item
          const Icon = it.icon
          const rel = i - item
          // Focused → capsule; later → stacked below it; earlier → stacked above the dock.
          const y =
            rel === 0 ? CAPSULE_Y : rel > 0 ? CAPSULE_Y + rel * ROW_H : ABOVE_NEAR + (rel + 1) * ROW_H
          return (
            <button
              key={it.title}
              type="button"
              onClick={() => setItem(i)}
              aria-current={focused}
              className="absolute top-0 left-0 flex cursor-pointer items-center gap-10 text-left transition-[transform,opacity] duration-[450ms] motion-reduce:transition-none"
              style={{
                transform: `translateX(-28px) translateY(calc(${y}px - 50%))`,
                transitionTimingFunction: SPRING,
                opacity: focused ? 1 : Math.max(0.3, 1 - Math.abs(rel) * 0.4),
              }}
            >
              {/* Icon column — centred on the capsule line. */}
              <span
                className={cn(
                  'grid place-items-center transition-colors duration-300',
                  focused ? 'text-white' : 'text-white/70',
                )}
                style={{ width: 56, height: 56 }}
              >
                <Icon className={focused ? 'size-7' : 'size-[22px]'} strokeWidth={2.2} />
              </span>

              {/* Detail — big title + divider + description for the focused row,
                  just a label for the rest. */}
              {focused ? (
                <span key={`${cat}-${item}`} className="block w-[360px] motion-safe:animate-list-reveal">
                  <span className="block text-[32px] leading-none font-semibold tracking-tight text-white">
                    {it.title}
                  </span>
                  <span className="my-3 block h-px w-full bg-white/25" />
                  <span className="block text-[16px] text-white/60">{it.desc}</span>
                </span>
              ) : (
                <span className="block text-[22px] font-medium whitespace-nowrap text-white/50">
                  {it.title}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
