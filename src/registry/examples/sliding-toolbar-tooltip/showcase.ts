import { defineShowcase } from '../../types'
import { SlidingToolbarTooltip } from './demo'

export default defineShowcase({
  id: 'sliding-toolbar-tooltip',
  name: 'Sliding Toolbar Tooltip',
  category: 'navigation',
  created: '2026-07-07',
  status: 'done',
  description:
    'A dark floating capsule toolbar (Vercel Toolbar style). Hovering an icon lights a circular highlight and floats a dark label bubble above it. Move between icons and the bubble does not re-pop — a single element glides and reshapes to the next icon while its text is wiped over by clip-path masks, so old and new labels briefly overlap for a liquid, one-piece morph.',
  libraries: ['react', 'tailwind'],
  utilities: ['animate-tooltip-wipe-in', 'animate-tooltip-wipe-out'],
  tags: ['tooltip', 'hover', 'morph', 'pill', 'minimal'],
  Component: SlidingToolbarTooltip,
  principle: `The tooltip is **one element**, never re-created. A \`useLayoutEffect\` measures each icon's centre and each label's natural width into \`rects\`; the bubble sets \`transform: translateX(center - width/2)\` + \`width\` and transitions **both on the same ease**, so it glides and reshapes as it travels (FLIP-like) instead of re-popping. The label doesn't cross-fade: outgoing and incoming text share one grid cell and are wiped by \`clip-path: inset()\` in the same left→right direction (\`animate-tooltip-wipe-in/out\`), so they briefly overlap mid-swap. First show / leave is a plain opacity fade.

\`\`\`tsx
const rect = rects[i] // { center, width } from measured icon + label
<div style={{
  width: rect.width,
  transform: \`translateX(\${rect.center - rect.width / 2}px)\`,
  transition: 'transform 260ms cubic-bezier(.32,.72,0,1), width 260ms cubic-bezier(.32,.72,0,1)',
}}>
  <span className="animate-tooltip-wipe-out">{ITEMS[prev].label}</span>{/* old */}
  <span className="animate-tooltip-wipe-in">{ITEMS[i].label}</span>{/* new, same cell */}
</div>
\`\`\``,
})
