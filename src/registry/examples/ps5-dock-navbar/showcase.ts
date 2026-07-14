import { defineShowcase } from '../../types'
import { Ps5DockNavbar } from './demo'

export default defineShowcase({
  id: 'ps5-dock-navbar',
  name: 'PS5 Dock Navbar',
  category: 'navigation',
  created: '2026-07-14T21:30:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A PlayStation-5-flavoured "quick menu" navbar on a silk-blue backdrop. A row of icon tiles slides so the selected one is always dead-centre — enlarged into a glowing white tile with its label beneath — and a vertical wheel of sub-items scrolls through a frosted glass capsule right under it, the focused entry blooming into a title + description. Drive it with clicks or the arrow keys, console-style: ←/→ change the category, ↑/↓ move the wheel.',
  libraries: ['react', 'tailwind'],
  tags: ['glass', 'glow', 'spring', 'click', 'keyboard', 'menu'],
  utilities: ['animate-list-reveal'],
  Component: Ps5DockNavbar,
  principle: `Two nested pickers, each just **one CSS transform** driven by an index. The dock row translates on **X** by \`(mid − cat) · GAP\` so the selected tile always lands at centre; the sub-item column translates on **Y** by \`−item · ROW_H\` so the focused row lands inside a *fixed* glass capsule. Everything else is static and positioned relative to that capsule line — rows above/below simply fade by their distance from the focus. The active tile is the only white one — \`bg-white\` plus a wide white \`box-shadow\` glow, scaled up with a springy \`cubic-bezier(0.34,1.56,0.64,1)\` so the focus lands with a console-like bounce.

\`\`\`tsx
{/* dock: slide so the active tile centres */}
<div style={{ transform: \`translateX(\${(mid - cat) * GAP}px)\` }}>…tiles…</div>

{/* wheel: slide so the focused row sits in the capsule */}
<div style={{ transform: \`translateY(\${-item * ROW_H}px)\` }}>
  {items.map((it, i) => <Row focused={i === item} … />)}
</div>
\`\`\``,
})
