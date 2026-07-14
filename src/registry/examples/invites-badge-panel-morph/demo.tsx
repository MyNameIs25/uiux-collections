import { useLayoutEffect, useRef, useState } from 'react'
import { DraftingCompass, Folder, Wrench, X, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Invite = { icon: LucideIcon; title: string; subtitle: string; unread?: boolean }
const INVITES: Invite[] = [
  { icon: Folder, title: 'Sonora Repository', subtitle: 'Contribute to the code repository', unread: true },
  { icon: DraftingCompass, title: 'Design Tokens', subtitle: 'Collaborate on design tokens', unread: true },
  { icon: Zap, title: 'Motion Kit', subtitle: 'Contribute to motion components' },
  { icon: Wrench, title: 'Build Tools', subtitle: 'Explore build tools & pipeline' },
]

// Collapsed pill vs expanded panel geometry. The container is ONE element that
// interpolates its width / height / border-radius between these; every other
// piece is absolutely positioned inside it and slides to its new spot, so the
// pill visibly *becomes* the panel rather than a panel appearing next to it.
const PILL_W = 152
const PILL_H = 64
const PANEL_W = 336
const HEADER_H = 72 // where the list starts, below the "Invites" title + close
const PAD_B = 12
// One shared easing/timing for the container morph and the elements that ride it.
const MORPH = 'duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'

export function InvitesBadgePanelMorph() {
  const [open, setOpen] = useState(false)
  // Measure the list once so the container can animate to an exact pixel height
  // (border-radius/height can't interpolate to `auto`).
  const listRef = useRef<HTMLDivElement>(null)
  const [listH, setListH] = useState(268)
  useLayoutEffect(() => {
    if (listRef.current) setListH(listRef.current.offsetHeight)
  }, [])
  const panelH = HEADER_H + listH + PAD_B

  return (
    <div className="flex min-h-[26rem] w-full items-center justify-center bg-white p-4 sm:p-8 [font-family:-apple-system,'Segoe_UI',Inter,sans-serif]">
      {/* The morphing container: pill ⇄ panel. Centred by the flex stage, so it
          grows outward from the pill's centre. */}
      <div
        className={cn(
          'relative overflow-hidden bg-[#f0f0f1] shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[width,height,border-radius]',
          MORPH,
        )}
        style={{
          width: open ? PANEL_W : PILL_W,
          height: open ? panelH : PILL_H,
          borderRadius: open ? 28 : PILL_H / 2,
        }}
      >
        {/* Click-to-open overlay (collapsed only). */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open invites"
          aria-expanded={open}
          className={cn('absolute inset-0 z-20', open && 'pointer-events-none')}
        />

        {/* "Invites" — one persistent label that grows and slides from the pill
            into the panel header (transitioning left / top / font-size). */}
        <span
          className={cn(
            'pointer-events-none absolute font-semibold text-[#1a1a1a] transition-[left,top,font-size]',
            MORPH,
          )}
          style={{
            left: open ? 24 : 20,
            top: open ? 22 : 21,
            fontSize: open ? 25 : 17,
          }}
        >
          Invites
        </span>

        {/* The list, revealed with a blur-in that *follows* the container (a
            delay on open; on close it blurs out first). It's always mounted so
            the reverse animation plays too; clipped by the container while collapsed. */}
        <div
          ref={listRef}
          className={cn(
            'absolute left-0 px-3 transition-[opacity,filter] duration-[340ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
            open ? 'opacity-100 blur-0 delay-[120ms]' : 'pointer-events-none opacity-0 blur-md',
          )}
          style={{ top: HEADER_H, width: PANEL_W }}
        >
          {INVITES.map(({ icon: Icon, title, subtitle, unread }) => (
            <div
              key={title}
              className="group flex items-center gap-3 rounded-2xl px-3 py-2 transition-colors can-hover:hover:bg-black/[0.04]"
            >
              <span className="relative grid size-11 shrink-0 place-items-center rounded-[14px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <Icon className="size-5 text-[#3f3f46]" strokeWidth={2} />
                {unread && (
                  <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-[#111] ring-[3px] ring-[#f0f0f1] transition-[box-shadow]" />
                )}
              </span>
              <div className="min-w-0">
                <div className="truncate text-[15px] font-semibold text-[#1a1a1a]">{title}</div>
                <div className="truncate text-[13px] text-[#9ca3af]">{subtitle}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Shared circle: the dark "2" badge ⇄ the light close button. It's
            anchored top-right, so as the container grows it glides from the
            pill's right edge to the panel's corner; bg colour + 2/✕ cross-fade. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close invites' : 'Open invites'}
          className={cn(
            'absolute z-30 grid size-12 place-items-center rounded-full transition-[top,right,background-color,box-shadow]',
            MORPH,
            open ? 'bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]' : 'bg-[#1c1c1e]',
          )}
          style={{ top: open ? 14 : 8, right: open ? 14 : 8 }}
        >
          <span
            className={cn(
              'col-start-1 row-start-1 text-[15px] font-semibold text-white transition-opacity duration-200 motion-reduce:transition-none',
              open ? 'opacity-0' : 'opacity-100',
            )}
          >
            2
          </span>
          <X
            strokeWidth={2.5}
            className={cn(
              'col-start-1 row-start-1 size-5 text-[#1a1a1a] transition-opacity duration-200 motion-reduce:transition-none',
              open ? 'opacity-100' : 'opacity-0',
            )}
          />
        </button>
      </div>
    </div>
  )
}
