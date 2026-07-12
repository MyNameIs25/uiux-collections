import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

type Key = 'ready' | 'error' | 'building' | 'queued' | 'provisioning' | 'canceled'

// Deployment statuses in display order. The mini indicator on the trigger is a
// pure derivation of `selected` in exactly this order.
const STATUSES: { key: Key; label: string; color: string }[] = [
  { key: 'ready', label: 'Ready', color: '#34d399' },
  { key: 'error', label: 'Error', color: '#ef4444' },
  { key: 'building', label: 'Building', color: '#f59e0b' },
  { key: 'queued', label: 'Queued', color: '#a1a1aa' },
  { key: 'provisioning', label: 'Provisioning', color: '#a1a1aa' },
  { key: 'canceled', label: 'Canceled', color: '#a1a1aa' },
]
const ALL = STATUSES.map((s) => s.key)
const UNSELECTED = '#d9dbdf'

export function StatusOnlyCheckallDropdown() {
  const [selected, setSelected] = useState<Set<Key>>(new Set(ALL))
  const [open, setOpen] = useState(true)

  const toggle = (k: Key) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k)
      else next.add(k)
      return next
    })

  return (
    <div className="flex min-h-[22rem] w-full flex-col items-center bg-[#f7f8fa] px-6 pt-16 font-sans text-[#171717]">
      {/* Trigger: the mini segmented indicator + a live count, so the current
          selection is previewable without opening the panel. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center gap-2.5 rounded-[13px] border border-[#e5e7eb] bg-white py-2 pr-2.5 pl-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:bg-[#fafafa]"
      >
        <span className="flex items-center gap-[3px]">
          {STATUSES.map((s) => (
            <span
              key={s.key}
              className="h-2.5 w-[6px] rounded-full transition-colors duration-150"
              style={{ background: selected.has(s.key) ? s.color : UNSELECTED }}
            />
          ))}
        </span>
        <span className="text-[13px] font-medium">Status</span>
        <span className="rounded-md bg-[#f1f2f4] px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-[#52525b]">
          {selected.size}/{ALL.length}
        </span>
        <ChevronDown
          className={cn('size-4 text-[#9ca3af] transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable
          className="mt-2 w-[264px] rounded-2xl border border-[#eceef1] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          {STATUSES.map((s) => {
            const checked = selected.has(s.key)
            // The whole "aha": the right-side action is a derivation of state.
            // Only this row selected → offer restore-all; otherwise → isolate.
            const soleSelection = selected.size === 1 && checked
            return (
              <div
                key={s.key}
                className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-black/[0.04]"
              >
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggle(s.key)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span
                    className={cn(
                      'grid size-5 place-items-center rounded-md border transition-colors duration-150',
                      checked ? 'border-transparent bg-[#171717]' : 'border-[#d4d4d8] bg-white',
                    )}
                  >
                    <Check
                      strokeWidth={3}
                      className={cn(
                        'size-3.5 text-white transition-[opacity,transform] duration-150 ease-out',
                        checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
                      )}
                    />
                  </span>
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-[13px] font-medium">{s.label}</span>
                </button>

                {/* Hover-revealed on pointer devices, always shown on touch. */}
                <button
                  type="button"
                  onClick={() => setSelected(soleSelection ? new Set(ALL) : new Set([s.key]))}
                  aria-label={soleSelection ? 'Select all statuses' : `Show only ${s.label}`}
                  className="shrink-0 text-[13px] text-[#9ca3af] opacity-100 transition-opacity duration-150 hover:text-[#52525b] can-hover:opacity-0 can-hover:group-hover:opacity-100 can-hover:group-focus-within:opacity-100"
                >
                  {soleSelection ? 'Check All' : 'Only'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
