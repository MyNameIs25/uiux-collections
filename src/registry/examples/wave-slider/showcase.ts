import { defineShowcase } from '../../types'
import { WaveSlider } from './demo'

export default defineShowcase({
  id: 'wave-slider',
  name: 'Wave-dip Slider',
  category: 'forms',
  created: '2026-07-07',
  status: 'done',
  description:
    'A capsule packed with equalizer bars, dragged like a waveform. The bars pinch down to almost nothing under the finger and ease back to full height within a few bars, so a valley travels along the track; bars left of the value stay dark and the rest light — a soft edge that marks the value even at rest — while a rounded bubble shows the live percentage. On release the dip melts back to an even row, the value boundary intact.',
  libraries: ['react', 'tailwind'],
  tags: ['slider', 'drag', 'wave', 'spring'],
  Component: WaveSlider,
  principle: `Both the shape and the colour derive from one smoothed centre \`c\`. Height is a Gaussian notch, \`BAR_MAX - depth * dip * exp(-((pos - c)/σ)²)\`, that pinches bars to near-zero at the finger and eases back within a few bars; \`c\` and the dip strength are lerped toward their targets in \`requestAnimationFrame\` (not a CSS transition), so the valley trails the pointer and melts away on release. Colour is a \`smoothstep\` ramp centred on \`c\` — a soft edge, not a positional gradient — so the selected/unselected boundary reads at the value even when the bars are flat.

\`\`\`tsx
const h = BAR_MAX - (BAR_MAX - BAR_MIN) * dip * Math.exp(-((pos - c) / SIGMA) ** 2)
const t = smoothstep(c - RAMP, c + RAMP, pos) // soft value edge, dip or not
const color = mixRgb(DARK, LIGHT, t)          // dark left of value, light right
\`\`\``,
})
