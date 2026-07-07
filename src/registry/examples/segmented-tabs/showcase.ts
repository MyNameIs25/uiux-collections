import { defineShowcase } from '../../types'
import { SegmentedTabs } from './demo'

export default defineShowcase({
  id: 'segmented-tabs',
  name: 'Segmented Tabs',
  category: 'navigation',
  created: '2026-07-07',
  status: 'done',
  description:
    'A row of tabs with a grey "pill" that glides and reshapes under the selected one — position and width animate in lockstep, so switching to a distant tab slides through the middle rather than cross-fading. A lighter, quicker highlight tracks the hovered tab independently, so both can sit on different tabs at once.',
  libraries: ['react', 'tailwind'],
  tags: ['tabs', 'hover', 'click', 'pill', 'minimal'],
  Component: SegmentedTabs,
  principle: `Two absolutely-positioned indicators animate between *measured* tab boxes, never between each other. A \`useLayoutEffect\` records each tab's \`offsetLeft\`/\`offsetWidth\` (relative to the list) into state; the selected pill sets \`transform: translateX(left)\` + \`width\` and transitions **both on the same ease**, so it glides and reshapes as one motion (FLIP-like) — a single reused element, which is why a two-tab jump visibly passes through the middle. The hover highlight is a separate element on a faster \`120ms\` ease, so selection and hover live on different tabs simultaneously.

\`\`\`tsx
const activeRect = rects[active] // { left, width } from offsetLeft/offsetWidth
<div style={{
  width: activeRect.width,
  transform: \`translateX(\${activeRect.left}px)\`,
  transition: 'transform 220ms cubic-bezier(0.2,0,0,1), width 220ms cubic-bezier(0.2,0,0,1)',
}} />
\`\`\``,
})
