import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrambleTextPlugin)

// Letters + tech symbols, matching the "decoding" look of the reference.
const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyz!<>-_\\/[]{}=+*^?#'
const TITLE_SECS = 0.5
const DESC_SECS = 0.8

// palette = [sky-top, sky-bottom, far ridge, near ridge, sun]; glow tints the
// card's ambient shadow and the menu diamond, tying menu ↔ card ↔ artwork.
const ITEMS = [
  {
    id: 'analytics',
    title: 'Analytics',
    desc: 'Gain detailed insights into user behavior, funnels, and conversion journeys across your product.',
    glow: '#6b9bff',
    palette: ['#a8c3f0', '#5b7fc7', '#3b5aa0', '#22376b', '#f4e3c8'],
  },
  {
    id: 'realtime',
    title: 'Realtime',
    desc: 'Watch every event stream in as it happens, with live cursors, presence, and zero-refresh updates.',
    glow: '#ff9b54',
    palette: ['#ffd9a0', '#f2994a', '#c75b39', '#7a2e2e', '#fff3d6'],
  },
  {
    id: 'performance',
    title: 'Performance',
    desc: 'Trace slow queries, cold starts, and render bottlenecks down to the exact line that costs you.',
    glow: '#41d99b',
    palette: ['#c9f0d8', '#58b98a', '#2e8c62', '#1b5a40', '#f2ffd9'],
  },
  {
    id: 'profiles',
    title: 'Profiles',
    desc: 'Give every user a rich identity with avatars, roles, and activity history in one place.',
    glow: '#d783ff',
    palette: ['#eac8f5', '#b06fd8', '#7d4bb5', '#4a2a7a', '#ffe9f5'],
  },
]

/** Flat-illustration mountain scene; same geometry, recolored per item. */
function Thumb({ palette: p, uid }: { palette: string[]; uid: string }) {
  return (
    <svg viewBox="0 0 320 200" className="size-full" aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p[0]} />
          <stop offset="100%" stopColor={p[1]} />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#sky-${uid})`} />
      <circle cx="242" cy="58" r="26" fill={p[4]} opacity="0.9" />
      <polygon points="0,200 70,90 150,200" fill={p[2]} opacity="0.75" />
      <polygon points="90,200 190,60 300,200" fill={p[2]} />
      <polygon points="180,200 260,120 340,200" fill={p[3]} />
      <polygon points="-20,200 40,140 110,200" fill={p[3]} />
    </svg>
  )
}

export function ScrambleFeatureDropdown() {
  const [open, setOpen] = useState(true)
  const [active, setActive] = useState(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const item = ITEMS[active]

  // GSAP owns the two text nodes after mount: the JSX children below are the
  // constant initial strings (ITEMS[0]), so React never rewrites them and the
  // scramble tween is the only writer.
  useEffect(() => {
    const title = titleRef.current
    const desc = descRef.current
    if (!title || !desc) return
    // Already showing this item (initial mount, StrictMode re-run) → nothing
    // to decode. Text-equality is the idempotent guard a `firstRun` ref isn't.
    if (title.textContent === item.title && desc.textContent === item.desc) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      title.textContent = item.title
      desc.textContent = item.desc
      return
    }
    const tl = gsap.timeline()
    tl.to(title, {
      duration: TITLE_SECS,
      scrambleText: { text: item.title, chars: 'upperCase', speed: 0.4 },
    }, 0).to(desc, {
      duration: DESC_SECS,
      scrambleText: { text: item.desc, chars: SCRAMBLE_CHARS, speed: 0.3 },
    }, 0)
    return () => {
      tl.kill()
    }
  }, [item])

  return (
    <div className="flex min-h-[34rem] w-full items-start justify-center bg-[#0a0a0a] px-6 pt-10">
      {/* Hover opens, clicking the trigger toggles (touch path). The open
          panel IS the showcase, so this demo deliberately does NOT close on
          hover-out — a cropped gallery preview would rest on an empty black
          stage. In a real nav, add onMouseLeave={() => setOpen(false)} here
          (the panel's before: bridge keeps the trigger→panel crossing safe). */}
      <nav className="relative">
        <div className="flex items-center gap-8 text-[15px] text-[#8a8a8a]">
          <button type="button" className="transition-colors hover:text-white">
            Blog
          </button>
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onMouseEnter={() => setOpen(true)}
            onClick={() => setOpen((o) => !o)}
            className={cn(
              'flex items-center gap-1.5 transition-colors hover:text-white',
              open && 'text-white',
            )}
          >
            Features
            <ChevronDown
              className={cn('size-4 transition-transform duration-300', open && 'rotate-180')}
            />
          </button>
          <button type="button" className="transition-colors hover:text-white">
            Docs
          </button>
        </div>

        <div
          role="menu"
          aria-label="Features"
          className={cn(
            'absolute left-1/2 top-full mt-4 flex w-[560px] max-w-[88vw] -translate-x-1/2 flex-col gap-6 rounded-2xl border border-white/10 bg-[#131313]/90 p-6 backdrop-blur-md sm:flex-row',
            // Invisible bridge over the mt-4 gap: without it the pointer falls
            // out of the nav while crossing trigger → panel and mouseleave
            // closes the menu (pseudo-elements count for hit-testing).
            'before:absolute before:inset-x-0 before:-top-4 before:h-4',
            'transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none',
            open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0',
          )}
        >
          {/* Crosshair corner ticks — the "technical drawing" flavor. */}
          {['-top-1 -left-1', '-top-1 -right-1', '-bottom-1 -left-1', '-bottom-1 -right-1'].map(
            (pos) => (
              <svg key={pos} viewBox="0 0 8 8" aria-hidden className={cn('absolute size-2 text-white/30', pos)}>
                <path d="M4 0v8M0 4h8" stroke="currentColor" strokeWidth="1" />
              </svg>
            ),
          )}

          {/* Left column: feature list. Hover, focus, or tap selects. */}
          {/* Fixed list width (not min-w): the card column and thumb height
              derive from it, so it must not shift with font loading. */}
          <ul className="flex flex-col gap-1 sm:w-40 sm:shrink-0">
            {ITEMS.map((it, i) => (
              <li key={it.id}>
                <button
                  type="button"
                  role="menuitem"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-md px-2 py-2.5 text-left text-[15px] transition-colors duration-150',
                    i === active ? 'text-white' : 'text-[#8a8a8a] hover:text-white',
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'size-1.5 rotate-45 transition-[opacity,scale] duration-150',
                      i === active ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
                    )}
                    style={{ backgroundColor: it.glow }}
                  />
                  {it.title}
                </button>
              </li>
            ))}
          </ul>

          {/* Right column: preview card. The ambient glow is a big soft
              box-shadow tinted with the active item's accent (55 = ~33% alpha);
              transitioning box-shadow crossfades the mood between items. */}
          {/* min-w-0: a flex child's default min-width:auto lets mid-scramble
              glyph noise (one long unbreakable "word") blow the column past
              the panel. */}
          <div
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#1a1a1a] p-3 transition-[box-shadow] duration-500"
            style={{ boxShadow: `0 24px 80px -12px ${item.glow}55` }}
          >
            <div className="relative aspect-[8/5] overflow-hidden rounded-lg">
              {/* All thumbs stay mounted; opacity crossfade picks the active one. */}
              {ITEMS.map((it, i) => (
                <div
                  key={it.id}
                  aria-hidden={i !== active}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300',
                    i === active ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <Thumb palette={it.palette} uid={it.id} />
                </div>
              ))}
            </div>
            <h3 ref={titleRef} className="mt-3 px-1 text-[15px] font-medium text-white">
              {ITEMS[0].title}
            </h3>
            <p
              ref={descRef}
              aria-hidden
              // Fixed 4-line box + wrap-anywhere: glyph noise wraps differently
              // from the final text (often one unbreakable run), so without
              // both, a transient reflow pumps the panel taller and wider.
              className="mt-1.5 h-[5.75rem] overflow-hidden px-1 font-serif text-sm leading-relaxed text-[#9c9c9c] [overflow-wrap:anywhere]"
            >
              {ITEMS[0].desc}
            </p>
            {/* Static copy for screen readers — the scrambling node above is
                decorative noise mid-animation. */}
            <span className="sr-only" role="status">
              {item.title}: {item.desc}
            </span>
          </div>
        </div>
      </nav>
    </div>
  )
}
