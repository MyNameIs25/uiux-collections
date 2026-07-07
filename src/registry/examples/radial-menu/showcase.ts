import { defineShowcase } from '../../types'
import { RadialMenu } from './demo'

export default defineShowcase({
  id: 'radial-menu',
  name: 'Radial Menu',
  category: 'navigation',
  created: '2026-07-07',
  status: 'done',
  description:
    'A floating hamburger button that blooms into an 8-sector pie menu on click and snaps shut fast. Icons fan out on a circle with a staggered overshoot; Esc or an outside click dismisses it.',
  libraries: ['react', 'tailwind'],
  tags: ['menu', 'click', 'toggle', 'stagger', 'spring'],
  Component: RadialMenu,
  preview: 'fit',
  principle: `Open and close share one \`isOpen\` boolean but not one timing — the trick is computing each element's \`transition\` string *from state*. Opening runs a long \`cubic-bezier(0.34,1.56,0.64,1)\` overshoot with a per-icon \`\${i*30}ms\` stagger delay; closing runs a short \`ease-in\` with zero delay — so it blooms slowly and collapses fast, no library needed. Each icon lands on the circle with the classic \`rotate(a) translateY(-R) rotate(-a)\`: spin the frame, step outward, spin the glyph back upright.

\`\`\`tsx
style={{
  transform: open
    ? \`rotate(\${a}deg) translateY(-\${R}px) rotate(\${-a}deg) scale(1)\`
    : \`rotate(\${a}deg) translateY(0px) rotate(\${-a}deg) scale(0.5)\`,
  opacity: open ? 1 : 0,
  // slow + staggered opening, fast + uniform closing
  transition: \`transform \${open ? 260 : 160}ms \${open ? EASE_BACK : EASE_IN} \${open ? i * 30 : 0}ms\`,
}}
\`\`\``,
})
