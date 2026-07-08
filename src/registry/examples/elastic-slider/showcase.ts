import { defineShowcase } from '../../types'
import { ElasticSlider } from './demo'

export default defineShowcase({
  id: 'elastic-slider',
  name: 'Elastic Tick-Wave Slider',
  category: 'forms',
  created: '2026-07-07T17:12:45+09:00',
  status: 'done',
  description:
    'A range slider whose track is a row of rounded tick marks. Dragging paints the passed ticks blue and lifts a travelling wave of taller ticks around the thumb; the filled dot chases the pointer with a springy lag, so a fast drag briefly splits it from the leading halo ring before it catches up and snaps to the nearest tick.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['slider', 'drag', 'spring', 'wave', 'monochrome'],
  Component: ElasticSlider,
  principle: `The handfeel is a retargetable tween, **not** a CSS transition (a transition only eases to a fixed target — it can't trail a continuously moving finger). \`gsap.quickTo\` keeps one persistent tween per property and re-aims it on every pointer move, so the dot lags a fast drag and settles exactly on the last target — no hand-rolled lerp/rAF loop. Rendering the halo ring at the *raw* pointer while the dot chases the *snapped* target is what splits the two circles mid-drag. The wave is the tweened \`pos\` fed through a Gaussian tick-height curve.

\`\`\`tsx
const posTo = gsap.quickTo(anim, 'pos', { duration: 0.35, ease: 'power3', onUpdate: nudge })
posTo(Math.round(raw * STEPS) / STEPS) // every pointermove re-aims the SAME tween
const dist = i - anim.pos * STEPS
const h = BASE_H + BUMP * Math.exp(-(dist * dist) / (2 * SPREAD * SPREAD)) * anim.wave
// ring at raw finger, dot at anim.pos (lagging) → they split on a fast drag
\`\`\``,
})
