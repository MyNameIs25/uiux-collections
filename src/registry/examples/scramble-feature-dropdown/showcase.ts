import { defineShowcase } from '../../types'
import { ScrambleFeatureDropdown } from './demo'

export default defineShowcase({
  id: 'scramble-feature-dropdown',
  name: 'Scramble-Reveal Feature Dropdown',
  category: 'navigation',
  created: '2026-07-09T13:55:00+09:00',
  status: 'done',
  description:
    'A nav "Features" dropdown with a two-column panel: hovering a feature on the left swaps the preview card on the right. The card\'s new title and serif description don\'t just fade in — they decode from glyph noise into readable text, while an ambient glow tinted with the item\'s accent colour blooms around the card, so every feature arrives with its own mood. Crosshair ticks on the panel corners finish the technical-drawing look.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['dropdown', 'hover', 'scramble', 'glow'],
  Component: ScrambleFeatureDropdown,
  principle: `The decode effect is GSAP's \`ScrambleTextPlugin\`: one tween per text node replaces the old string with glyph noise and resolves it left-to-right into the new one — no hand-rolled interval loop. The trick that makes it safe in React: the JSX children are the *constant* initial strings, so React never rewrites the nodes and the tween stays the only writer. The ambient glow is just a big soft \`box-shadow\` tinted per item; transitioning \`box-shadow\` crossfades the mood.

\`\`\`tsx
gsap.registerPlugin(ScrambleTextPlugin)
tl.to(desc, {
  duration: 0.8,
  scrambleText: { text: item.desc, chars: 'abc…!<>-_[]{}', speed: 0.3 },
})
<div className="transition-[box-shadow] duration-500"
     style={{ boxShadow: \`0 24px 80px -12px \${item.glow}55\` }} />
\`\`\``,
})
