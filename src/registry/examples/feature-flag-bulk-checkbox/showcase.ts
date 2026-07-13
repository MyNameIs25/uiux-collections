import { defineShowcase } from '../../types'
import { FeatureFlagBulkCheckbox } from './demo'

export default defineShowcase({
  id: 'feature-flag-bulk-checkbox',
  name: 'Feature Flag Bulk Checkbox',
  category: 'forms',
  created: '2026-07-14T16:10:00+09:00',
  status: 'done',
  description:
    'A file-tree checklist where hovering the parent checkbox previews the change — faint ghost ticks appear in the parent and all three children — and clicking flips every one of them to checked in the same frame: no per-item stagger, no lag, one instant "apply". Children can also be toggled individually, which drops the parent into an indeterminate "−". A thin elbow connector shows the hierarchy.',
  libraries: ['react', 'tailwind'],
  tags: ['tree', 'toggle', 'click', 'hover', 'minimal'],
  Component: FeatureFlagBulkCheckbox,
  principle: `The "instant, un-staggered" feel is structural, not animated: all three children read from **one shared \`Set\`**, so a bulk toggle is a *single* state change and their identical CSS \`transition\`s run in the same frame — there is nothing to stagger, and no timers sequence it. Hovering the parent sets a \`previewing\` flag passed to every box; an *unchecked* box then renders its ✓ at \`opacity-40\` (a "ghost" of the pending apply) which resolves straight into the solid tick on click. A back-ease \`cubic-bezier(0.34,1.56,0.64,1)\` on the mark's \`scale\`/\`opacity\` gives it the pop. No animation library — just batched \`setState\` + CSS.

\`\`\`tsx
const previewing = hovering && parentState !== 'checked'
// in CheckBox — a pending box shows a faint ghost ✓:
const ghost = preview && state === 'unchecked'
<Check className={cn(state === 'checked' ? 'scale-100 text-white opacity-100'
  : ghost ? 'scale-100 text-[#7d7d7d] opacity-40' : 'scale-0 opacity-0')} />
\`\`\``,
})
