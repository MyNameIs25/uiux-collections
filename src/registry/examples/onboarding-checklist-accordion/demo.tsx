import { useState } from 'react'
import { Check, ChevronRight, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

const ITEMS = [
  'Create your profile',
  'Add your first campaign',
  'Set budget & rules',
  'Invite creators',
  'Review submissions & approve',
]
const TICKS = 20 // the segmented "battery" progress bar has this many bars

type Status = 'done' | 'current' | 'todo'

/** A row's leading dot: green ✓ (done), white-on-black number (current), or a
 *  hollow grey-ringed number (todo). Number and check overlap in one grid cell
 *  and swap by scale, so completing a task pops the tick in over the number. */
function StatusDot({ n, status }: { n: number; status: Status }) {
  return (
    <span
      className={cn(
        'grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-200',
        status === 'done' && 'border-transparent bg-[#22c55e]',
        status === 'current' && 'border-transparent bg-white',
        status === 'todo' && 'border-white/20 bg-transparent',
      )}
    >
      <Check
        strokeWidth={3}
        className={cn(
          'col-start-1 row-start-1 size-3.5 text-white transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
          status === 'done' ? 'scale-100' : 'scale-0',
        )}
      />
      <span
        className={cn(
          'col-start-1 row-start-1 text-[12px] font-semibold tabular-nums transition-transform duration-200 motion-reduce:transition-none',
          status === 'current' ? 'text-[#0a0a0a]' : 'text-white/45',
          status === 'done' ? 'scale-0' : 'scale-100',
        )}
      >
        {n}
      </span>
    </span>
  )
}

export function OnboardingChecklistAccordion() {
  const [open, setOpen] = useState(true)
  // Which tasks are complete. `current` = the first incomplete task; the rest
  // are `todo`. Clicking a row toggles its completion, which drives everything.
  const [done, setDone] = useState<Set<number>>(new Set([0, 1]))

  const current = ITEMS.findIndex((_, i) => !done.has(i))
  const statusOf = (i: number): Status =>
    done.has(i) ? 'done' : i === current ? 'current' : 'todo'

  const toggle = (i: number) =>
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })

  // Green bars = the completed fraction of the discrete progress bar.
  const filled = Math.round((done.size / ITEMS.length) * TICKS)

  return (
    <div className="flex min-h-[24rem] w-full items-center justify-center bg-[#0a0a0a] p-6 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]">
      <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-[#1c1c1e] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,_0_20px_50px_-20px_rgba(0,0,0,0.8)]">
        {/* Title bar — click to expand / collapse. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
        >
          <ChevronUp
            className={cn(
              'size-4 shrink-0 text-white/70 transition-transform duration-300',
              open ? 'rotate-0' : 'rotate-180',
            )}
          />
          <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold text-white">
            Getting started
          </span>
          <span className="ml-auto flex shrink-0 items-center gap-2.5">
            {/* Segmented "battery" progress: a row of thin rounded bars, the
                first `filled` of them green. Discrete, not a smooth bar. Hidden
                on narrow screens where it can't share the row with the title —
                the "N/5" score still carries the progress. */}
            <span aria-hidden className="hidden items-center gap-[2px] min-[420px]:flex">
              {Array.from({ length: TICKS }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    'h-[11px] w-[2.5px] rounded-full transition-colors duration-300',
                    i < filled ? 'bg-[#22c55e]' : 'bg-[#3a3a3c]',
                  )}
                />
              ))}
            </span>
            <span className="text-[12px] tabular-nums text-white/50">
              {done.size}/{ITEMS.length}
            </span>
          </span>
        </button>

        {/* Collapsible list. The `grid-rows-[0fr→1fr]` trick tweens height with
            no measured max-height. Rows stay mounted so the collapse animates;
            the inner list is re-keyed on `open` so the stagger replays each time. */}
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div key={open ? 'open' : 'closed'} className="border-t border-white/[0.06] py-1.5">
              {ITEMS.map((label, i) => {
                const status = statusOf(i)
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => toggle(i)}
                    style={{ animationDelay: `${i * 45}ms` }}
                    className="flex h-11 w-full items-center gap-3 px-4 text-left motion-safe:animate-list-reveal"
                  >
                    <StatusDot n={i + 1} status={status} />
                    <span
                      className={cn(
                        'flex-1 truncate text-[15px] transition-colors duration-200',
                        status === 'done' && 'text-white/55',
                        status === 'current' && 'font-semibold text-white',
                        status === 'todo' && 'text-white/40',
                      )}
                    >
                      {label}
                    </span>
                    {status !== 'done' && (
                      <ChevronRight className="size-4 shrink-0 text-white/30" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
