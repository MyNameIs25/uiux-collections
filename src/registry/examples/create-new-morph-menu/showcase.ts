import { defineShowcase } from '../../types'
import { CreateNewMorphMenu } from './demo'

export default defineShowcase({
  id: 'create-new-morph-menu',
  name: 'Create New Morph Menu',
  category: 'navigation',
  created: '2026-07-12T15:00:00+09:00',
  status: 'done',
  description:
    'A dark "Create new" capsule button that, on click, stretches open into a card menu — a dark title band cradling a white 2×3 icon grid — while the "+" spins 45° into a "×". It reads like Framer Motion\'s shared-layout FLIP, but there is no layout library: the same one container morphs because both states are concrete sizes. The label and toggle never move; a single grey highlight glides in 2-D between the grid cells.',
  libraries: ['react', 'tailwind'],
  tags: ['morph', 'spring', 'menu', 'click', 'stagger'],
  Component: CreateNewMorphMenu,
  principle: `You don't need Framer Motion's \`layout\` FLIP for a shared-layout morph when both states have *computable* sizes — the closed capsule and open card are concrete numbers, so one \`transition-[width,height,border-radius]\` on the **same** container carries the whole shape change. The label and \`+\` toggle are anchored (\`top\`/\`left\`/\`right\`) so they never move — the box just grows beneath them, and the \`+\`→\`×\` is one persistent glyph on a 45° \`rotate\`. The "stacked cards" look is a *second* independent rounded rect inset by \`CARD_INSET\` so the dark corners peek out — not a single continuous outline. A gentle overshoot ease (\`cubic-bezier(0.34,1.28,0.64,1)\`) fakes the spring.

\`\`\`tsx
const { w, h, r } = open ? OPEN : CLOSED // both concrete → CSS can tween them
<div style={{ width: w, height: h, borderRadius: r }}
  className="transition-[width,height,border-radius] duration-[360ms]
             ease-[cubic-bezier(0.34,1.28,0.64,1)]" />
<Plus className={open ? 'rotate-45' : ''} />        {/* + → × */}
<div style={{ top: 52, left: 8 }} className="absolute rounded-[20px] bg-white" /> {/* peeking corners */}
\`\`\``,
})
