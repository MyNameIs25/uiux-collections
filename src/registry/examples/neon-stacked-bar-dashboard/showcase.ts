import { defineShowcase } from '../../types'
import { NeonStackedBarDashboard } from './demo'

export default defineShowcase({
  id: 'neon-stacked-bar-dashboard',
  name: 'Neon Stacked Bar Dashboard',
  category: 'data-display',
  created: '2026-07-14T22:40:00+09:00',
  status: 'done',
  preview: 'fit',
  description:
    'A pure-black "Sales Report" panel whose chart is a rack of fifteen LED VU meters. Every bar is the same height — value is encoded by how much of the tube is *lit*, not by how tall it is — so five neon bands hang from the top and a dead grey remainder fills to the baseline. On load the segments fill downward in a left-to-right ripple while the three headline figures count up, and the whole thing settles into a cold, precise instrument panel: blown-out green haze on top, monospace slashed-zero numerals below.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['chart', 'neon', 'glow', 'stagger', 'reveal', 'counter'],
  utilities: ['neon-tube', 'font-jetbrains-mono'],
  Component: NeonStackedBarDashboard,
  principle: `Two inversions do the work. **The bars are 100%-stacked** — every column is the same \`BAR_H\`, so a bar says nothing by its height and everything by how far the colour reaches before the grey \`Unattributed\` remainder takes over. And **each segment is its own capsule**: \`neon-tube\` sets \`border-radius: 9999px\` on *every* band, with a real \`gap\` between them, so the stack reads as a chain of pills, not one bar with rounded ends. \`neon-tube\` drives fill *and* halo off a single \`--neon\` var (two box-shadows at different radii ≈ real light falloff), and \`--neon-glow\` lets the headline green bloom at 2.4× while the cool bands only simmer. The entrance is a GSAP \`stagger\` **function** that reads each segment's own \`data-col\`/\`data-seg\` back off the DOM, so one tween produces a two-axis wave: columns ripple left→right, bands light up top→bottom.

\`\`\`tsx
tl.from('[data-col]', {
  scaleY: 0, transformOrigin: 'top center',   // fill DOWNWARD, like a meter
  ease: 'power3.out', duration: 0.55,
  stagger: (_i, el) => Number(el.dataset.col) * 0.05   // left → right
                     + Number(el.dataset.seg) * 0.045, // top  → bottom
})

<span className="neon-tube" style={{ '--neon': '#66FF4D', '--neon-glow': 2.4 }} />
\`\`\``,
})
