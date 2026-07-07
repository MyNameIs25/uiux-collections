import { defineShowcase } from '../../types'
import { BreathingRadialLoader } from './demo'

export default defineShowcase({
  id: 'breathing-radial-loader',
  name: 'Breathing Radial Loader',
  category: 'feedback',
  created: '2026-07-07',
  status: 'done',
  description:
    'A "preparing your data" loader on a cream card: a gradient-green hub with a morphing bar-chart glyph, ringed by a mint track and a spinning emerald arc. The whole ring group breathes — swelling and fading like a radar ping on every rotation — while the hub stays put. Auto-plays, no interaction.',
  libraries: ['react', 'tailwind'],
  tags: ['loading', 'progress', 'gradient', 'morph', 'svg'],
  utilities: ['animate-radial-breathe', 'animate-radial-spin', 'animate-equalize'],
  Component: BreathingRadialLoader,
  preview: 'fit',
  principle: `Three independent CSS loops layered around one centre. The ring group carries \`animate-radial-breathe\` (scale 1→1.3→1 + fade) so track *and* arc swell together like a heartbeat; the SVG inside carries \`animate-radial-spin\` (a plain 360° rotate) — only the dashed arc looks like it moves because the full track ring is rotationally symmetric. The arc length is set once with \`stroke-dasharray\`. The hub is a sibling, so it never scales or spins. Each equalizer bar shares \`animate-equalize\` (a height keyframe) with a negative \`animationDelay\` to phase-shift it.

\`\`\`tsx
<div className="animate-radial-breathe">          {/* swell + fade */}
  <svg viewBox="0 0 200 200" className="animate-radial-spin">
    <circle r={70} stroke={TRACK} />              {/* symmetric — spin is invisible */}
    <circle r={70} stroke={ARC} strokeLinecap="round"
      strokeDasharray={\`\${CIRC * 0.28} \${CIRC}\`} /> {/* the only visible mover */}
  </svg>
</div>
{/* bars: one keyframe, phase-shifted per bar */}
<span className="h-1/2 animate-equalize" style={{ animationDelay: '-0.35s' }} />
\`\`\``,
})
