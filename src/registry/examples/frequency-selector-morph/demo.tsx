import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { Check, ChevronsLeftRight } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(Flip)

type Freq = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly'
const FREQS = ['Daily', 'Weekly', 'Monthly', 'Yearly'] as const
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const reduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** A stadium pill of options with one absolute highlight that slides AND resizes
 *  to the selected item — measured from the button's `offsetLeft/offsetWidth`,
 *  so variable-width tabs (Daily/Weekly/…) and equal `fill` columns both work. */
function Segmented({
  items,
  value,
  onChange,
  fill,
  flipId,
}: {
  items: readonly string[]
  value: string
  onChange: (v: string) => void
  fill?: boolean
  flipId?: string
}) {
  const btns = useRef<(HTMLButtonElement | null)[]>([])
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null)

  useLayoutEffect(() => {
    const el = btns.current[items.indexOf(value)]
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth })
  }, [value, items])

  return (
    <div data-flip-id={flipId} className="relative flex flex-1 overflow-hidden rounded-full bg-white p-1">
      {ind && (
        <span
          aria-hidden
          className="absolute top-1 bottom-1 left-0 rounded-full bg-[#ececee] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${ind.x}px)`, width: ind.w }}
        />
      )}
      {items.map((it, i) => (
        <button
          key={it}
          ref={(el) => {
            btns.current[i] = el
          }}
          type="button"
          onClick={() => onChange(it)}
          // Per-index delay → the options cascade in left→right on mount (expand),
          // so the control "unrolls" instead of just appearing.
          style={{ animationDelay: `${i * 55}ms` }}
          className={cn(
            'relative z-10 rounded-full py-2.5 text-center text-[15px] transition-colors duration-200 motion-safe:animate-option-in',
            fill ? 'flex-1' : 'px-4',
            value === it ? 'font-semibold text-[#111]' : 'font-medium text-[#9aa0a6]',
          )}
        >
          {it}
        </button>
      ))}
    </div>
  )
}

export function FrequencySelectorMorph() {
  const [expanded, setExpanded] = useState(false)
  const [freq, setFreq] = useState<Freq>('Daily')
  const [day, setDay] = useState<string>('Tue')
  const root = useRef<HTMLDivElement>(null)
  // Layout snapshot captured just before a state change; the effect plays the diff.
  const pending = useRef<Flip.FlipState | null>(null)

  // Capture the layout of every [data-flip-id] BEFORE the state change; the
  // effect below plays the diff. This is the whole "magic move".
  const morph = (change: () => void) => {
    if (reduced()) return change()
    pending.current = Flip.getState('[data-flip-id]')
    change()
  }

  useLayoutEffect(() => {
    const state = pending.current
    if (!state) return
    pending.current = null
    Flip.from(state, {
      duration: 0.45,
      ease: 'power3.inOut',
      // Only LEAVING nodes go absolute (so they fade without shoving layout);
      // the container + pill animate in normal flow, else the flex container is
      // stranded at position:absolute and its grey backdrop collapses.
      absoluteOnLeave: true,
      nested: true,
      // Elements that only exist in one state (check button, weekday row,
      // "Frequency" label) fade/scale rather than pop. The pill's own contents
      // (value text ⇄ segments) are clipped by the pill's `overflow-hidden`, so
      // they reveal as the box widens instead of overflowing the small start box.
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.3, delay: 0.08, ease: 'power2.out' },
        ),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.2, ease: 'power1.in' }),
    })
  })

  const summary = freq === 'Weekly' ? `Weekly, ${day}` : freq

  return (
    <div className="flex min-h-[20rem] w-full items-center justify-center bg-white px-6 font-sans">
      <div ref={root} className="w-full max-w-[440px]">
        <div data-flip-id="box" className="flex w-full flex-col gap-2 rounded-[26px] bg-[#f4f4f5] p-2">
          {!expanded ? (
            <button
              type="button"
              onClick={() => morph(() => setExpanded(true))}
              aria-expanded={false}
              className="flex items-center justify-between rounded-[20px] py-1 pr-1 pl-4 text-left"
            >
              <span data-flip-id="label" className="text-[15px] font-medium text-[#8a8d93]">
                Frequency
              </span>
              <span
                data-flip-id="pill"
                className="flex items-center gap-2 rounded-full bg-white py-2 pr-3 pl-4"
              >
                <span className="text-[15px] font-semibold text-[#111]">{summary}</span>
                <ChevronsLeftRight className="size-4 text-[#b4b7bc]" strokeWidth={2.5} />
              </span>
            </button>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Segmented
                  flipId="pill"
                  items={FREQS}
                  value={freq}
                  onChange={(v) => morph(() => setFreq(v as Freq))}
                />
                <button
                  data-flip-id="check"
                  type="button"
                  onClick={() => morph(() => setExpanded(false))}
                  aria-label="Confirm frequency"
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-[#111] text-white shadow-sm transition-transform active:scale-95"
                >
                  <Check className="size-5" strokeWidth={3} />
                </button>
              </div>
              {freq === 'Weekly' && (
                <div data-flip-id="week">
                  <Segmented items={DAYS} value={day} onChange={setDay} fill />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
