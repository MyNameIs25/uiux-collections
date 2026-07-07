import { defineShowcase } from '../../types'
import { RainbowBorderBeamInput } from './demo'

export default defineShowcase({
  id: 'rainbow-border-beam-input',
  name: 'Rainbow Border Beam Input',
  category: 'forms',
  created: '2026-07-07T22:39:07+09:00',
  status: 'done',
  description:
    'A dark AI chat input whose rounded border is traced by a soft purple→orange light beam that drifts clockwise on its own — an ambient, no-interaction glow that gives the panel a quiet sense of life. Pure CSS: one rotating conic-gradient, reused as a hairline ring, a crisp beam, and a blurred outward halo.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'glow', 'orbit', 'auto', 'search'],
  utilities: ['animate-border-beam'],
  Component: RainbowBorderBeamInput,
  principle: `The beam is a \`conic-gradient(from var(--angle), …)\` painted into the card's \`p-[2px]\` padding; the opaque inner panel masks the centre so only a gradient border remains. It moves because \`--angle\` is a **registered** \`@property\` of type \`<angle>\` — registration is the trick, since an unregistered custom property can't be interpolated, so \`animate-border-beam\` can spin it \`0deg → 360deg\` and the browser tweens it. A blurred copy of the same gradient sitting behind the card supplies the outward halo.

\`\`\`tsx
const BEAM = 'conic-gradient(from var(--angle), transparent 0deg, #8b5cf6 30deg, #fb923c 110deg, transparent 165deg)'
// crisp beam: gradient shows only through the 2px padding ring
<div className="animate-border-beam rounded-[28px] p-[2px]" style={{ backgroundImage: BEAM }}>
  <div className="rounded-[26px] bg-[#1c1c22]">…</div>
</div>
// @property --angle { syntax: '<angle>'; initial-value: 0deg } + @keyframes { to { --angle: 360deg } }
\`\`\``,
})
