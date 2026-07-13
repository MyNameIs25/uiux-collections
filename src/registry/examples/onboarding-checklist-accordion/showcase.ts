import { defineShowcase } from '../../types'
import { OnboardingChecklistAccordion } from './demo'

export default defineShowcase({
  id: 'onboarding-checklist-accordion',
  name: 'Onboarding Checklist Accordion',
  category: 'data-display',
  created: '2026-07-14T17:20:00+09:00',
  status: 'done',
  description:
    'A dark "Getting started" card whose title bar carries a segmented "battery" progress bar (discrete green ticks) and an "N/5" score. Click it to expand the task list, which fades in row by row. Each task shows one of three dot states — a green ✓ (done), a white-on-black number (the current step), or a hollow grey-ringed number (todo) — and clicking a row toggles it, filling the progress ticks live.',
  libraries: ['react', 'tailwind'],
  tags: ['accordion', 'progress', 'stagger', 'click', 'dark-mode'],
  utilities: ['animate-list-reveal'],
  Component: OnboardingChecklistAccordion,
  principle: `Two library-free tricks. **(1) Height:** the panel opens by tweening a CSS Grid track — \`grid-rows-[0fr] → grid-rows-[1fr]\` with the body in an \`overflow-hidden\` cell — so it animates to the content's natural height with no measured \`max-height\` and no JS. Rows stay mounted so the *collapse* animates too; the inner list is re-\`key\`ed on \`open\` so the \`animate-list-reveal\` stagger (per-row \`animation-delay\`) replays on every open. **(2) Progress:** the "battery" bar is just \`TICKS\` thin rounded \`<span>\`s; the first \`round(done/total · TICKS)\` get \`bg-[#22c55e]\`, so completing a task recolours them with a plain \`transition-colors\` — a discrete bar, not a smooth one.

\`\`\`tsx
<div className={cn('grid transition-[grid-template-rows] duration-300',
  open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
  <div className="overflow-hidden">
    <div key={open ? 'open' : 'closed'}>{/* rows: animate-list-reveal + delay */}</div>
  </div>
</div>
\`\`\``,
})
