import { useState } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const CHILDREN = ['kind-badge.tsx', 'referenced-archived-badge.tsx', 'unreferenced-badge.tsx']

type TriState = 'checked' | 'unchecked' | 'indeterminate'

/** Custom checkbox: a rounded square that fills grey when on, with a white
 *  ✓ / − that pops in on a back-ease. When `preview` is set (parent hovered)
 *  an *unchecked* box shows a faint ghost ✓ — a preview of the bulk-apply. */
function CheckBox({ state, preview }: { state: TriState; preview?: boolean }) {
  const on = state !== 'unchecked'
  const ghost = preview && state === 'unchecked'
  return (
    <span
      className={cn(
        'grid size-[22px] shrink-0 place-items-center rounded-[7px] border transition-colors duration-150',
        on ? 'border-transparent bg-[#7d7d7d]' : 'border-[#bebebe] bg-white',
      )}
    >
      {/* Both glyphs stay mounted and overlap (same grid cell); only scale /
          colour / opacity flip, so the mark springs in instead of appearing hard.
          `text-[#7d7d7d] opacity-40` is the faint ghost preview on a white box. */}
      <Check
        strokeWidth={3.5}
        className={cn(
          'col-start-1 row-start-1 size-3.5 transition-all duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
          state === 'checked'
            ? 'scale-100 text-white opacity-100'
            : ghost
              ? 'scale-100 text-[#7d7d7d] opacity-40'
              : 'scale-0 text-white opacity-0',
        )}
      />
      <Minus
        strokeWidth={3.5}
        className={cn(
          'col-start-1 row-start-1 size-3.5 text-white transition-transform duration-150 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none',
          state === 'indeterminate' ? 'scale-100' : 'scale-0',
        )}
      />
    </span>
  )
}

export function FeatureFlagBulkCheckbox() {
  // Which child files are checked. All three share this ONE Set, so a bulk
  // toggle flips them in a single state change → they transition together with
  // no per-item stagger and no lag (that simultaneity is the whole effect).
  const [childSet, setChildSet] = useState<Set<string>>(new Set())
  const [parentState, setParentState] = useState<TriState>('unchecked')
  // An unrelated sibling that's just always on, for context.
  const [standalone, setStandalone] = useState(true)
  // True while the parent row is hovered — drives the faint ghost-check preview.
  const [hovering, setHovering] = useState(false)

  // Hovering previews the "select all" the click would do — but only when the
  // group isn't already fully checked (otherwise there's nothing to add).
  const previewing = hovering && parentState !== 'checked'

  const toggleParent = () => {
    if (parentState === 'checked') {
      setChildSet(new Set())
      setParentState('unchecked')
    } else {
      // Everything flips to checked in the same render — parent and all children
      // together, no delay.
      setChildSet(new Set(CHILDREN))
      setParentState('checked')
    }
  }

  const toggleChild = (name: string) => {
    const next = new Set(childSet)
    if (next.has(name)) next.delete(name)
    else next.add(name)
    setChildSet(next)
    // A manual child edit resolves the parent: filled when all are checked, a
    // "−" when only some are, empty when none.
    if (next.size === 0) setParentState('unchecked')
    else if (next.size === CHILDREN.length) setParentState('checked')
    else setParentState('indeterminate')
  }

  return (
    <div className="flex min-h-[22rem] w-full items-center justify-center bg-neutral-100 p-4 sm:p-8 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]">
      <div className="w-full max-w-[380px] rounded-2xl border border-black/[0.06] bg-[#fbfbfb] p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_8px_24px_-12px_rgba(0,0,0,0.12)]">
        {/* Unrelated, always-checked sibling. */}
        <button
          type="button"
          onClick={() => setStandalone((s) => !s)}
          role="checkbox"
          aria-checked={standalone}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors can-hover:hover:bg-black/[0.03]"
        >
          <CheckBox state={standalone ? 'checked' : 'unchecked'} />
          <span className="truncate text-[14px] font-medium text-[#181818]">Feature Flag Details Layout</span>
        </button>

        {/* Parent + children group. */}
        <div>
          <button
            type="button"
            onClick={toggleParent}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            role="checkbox"
            aria-checked={parentState === 'indeterminate' ? 'mixed' : parentState === 'checked'}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors can-hover:hover:bg-black/[0.03]"
          >
            <CheckBox state={parentState} preview={previewing} />
            <span className="truncate text-[14px] font-medium text-[#181818]">Feature Flag Badges</span>
          </button>

          {/* Tree connectors: one vertical spine dropping from under the parent
              box to the last child's centre, plus a short elbow into each row.
              left-[19px] = card-pad(8) + row-pad(8) + half a 22px box (11) − 8. */}
          <div className="relative">
            <span
              aria-hidden
              className="absolute -top-1 bottom-[18px] left-[19px] w-px bg-[#e4e4e4]"
            />
            {CHILDREN.map((name) => {
              const on = childSet.has(name)
              return (
                <div key={name} className="relative flex h-9 items-center">
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-[19px] h-px w-[15px] bg-[#e4e4e4]"
                  />
                  <button
                    type="button"
                    onClick={() => toggleChild(name)}
                    role="checkbox"
                    aria-checked={on}
                    className="ml-[34px] flex min-w-0 flex-1 items-center gap-2.5 rounded-lg py-1.5 pr-2 text-left transition-colors can-hover:hover:bg-black/[0.03]"
                  >
                    <CheckBox state={on ? 'checked' : 'unchecked'} preview={previewing} />
                    <span className="truncate text-[13px] text-[#8a8a8a]">{name}</span>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
