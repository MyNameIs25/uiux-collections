import { defineShowcase } from '../../types'
import { CalendarSyncInlineConfirm } from './demo'

export default defineShowcase({
  id: 'calendar-sync-inline-confirm',
  name: 'Calendar Sync Inline Confirm',
  category: 'buttons',
  created: '2026-07-14T19:15:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A white "Calendar" settings pill whose "Sync" button confirms in place — no toast, no spinner beside it. Click and the label blurs away, the button darkens into a track with a white bar sweeping left→right (indeterminate), the bar snaps full, then the whole track collapses width-wise into a gradient black dot as a check springs in. It auto-resets so you can fire it again. All feedback happens inside the button’s own footprint.',
  libraries: ['react', 'tailwind'],
  tags: ['morph', 'spring', 'loading', 'click', 'monochrome'],
  utilities: ['animate-calendar-sync-slide', 'animate-calendar-sync-fill'],
  Component: CalendarSyncInlineConfirm,
  principle: `The control is one \`rounded-full\` box whose \`width\` animates between the pill width and its own height — a pill as wide as it is tall *is* a circle, so it collapses into the success dot with no second element. \`ml-auto\` pins it to the card’s right edge, so the collapse shrinks *toward* that edge, landing where the button was. The idle label, the indeterminate \`animate-calendar-sync-slide\` bar (a white sliver that translateX-sweeps in units of its own width), and the check share **one** \`grid place-items-center\` cell and cross-fade by phase.

\`\`\`tsx
<button
  style={{ width: isCircle ? TRACK_H : TRACK_W, height: TRACK_H }}
  className="ml-auto grid place-items-center overflow-hidden rounded-full
             transition-[width,background-color] ease-[cubic-bezier(0.34,1.56,0.64,1)]">
  <span className={phase === 'idle' ? 'opacity-100' : 'opacity-0 blur-[6px]'}>Sync</span>
  {/* sweeps -110% → 360% of the bar's own width, so any width reads edge-to-edge */}
  <span className="h-full w-[28%] rounded-full bg-white motion-safe:animate-calendar-sync-slide" />
  <Check className={isCircle ? 'scale-100 opacity-100' : 'scale-50 opacity-0'} />
</button>
\`\`\``,
})
