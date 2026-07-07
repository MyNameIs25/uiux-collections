import { defineShowcase } from '../../types'
import { ElasticSlider } from './demo'

export default defineShowcase({
  id: 'elastic-slider',
  name: 'Elastic Tick-Wave Slider',
  category: 'forms',
  created: '2026-07-07',
  status: 'done',
  description:
    'A range slider whose track is a row of rounded tick marks. Dragging paints the passed ticks blue and lifts a travelling wave of taller ticks around the thumb; the filled dot chases the pointer with a springy lag, so a fast drag briefly splits it from the leading halo ring before it catches up and snaps to the nearest tick.',
  libraries: ['react', 'tailwind'],
  tags: ['slider', 'drag', 'spring', 'wave', 'monochrome'],
  Component: ElasticSlider,
  principle: `The handfeel is a per-frame damped chase in \`requestAnimationFrame\`, **not** a CSS transition (a transition only eases to a fixed target — it can't trail a continuously moving finger). Each frame the visual dot advances a fraction of its remaining gap, \`pos += (target - pos) * 0.2\`, so it lags a fast drag and settles when the pointer stops. Rendering the halo ring at the *raw* pointer while the dot chases the *snapped* target is what makes the two circles visibly split apart mid-drag. The wave is the same \`pos\` fed through a Gaussian: each tick's height gets \`exp(-dist² / 2σ²)\` added, centred on the dot.

\`\`\`tsx
posRef.current += (targetRef.current - posRef.current) * DAMP // chase, not snap
const dist = i - posRef.current * STEPS
const h = BASE_H + BUMP * Math.exp(-(dist * dist) / (2 * SPREAD * SPREAD)) * wave
// ring at rawRef (finger), dot at posRef (lagged) → they split on a fast drag
\`\`\``,
})
