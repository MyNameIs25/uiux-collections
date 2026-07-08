import { defineShowcase } from '../../types'
import { WaveSlider } from './demo'

export default defineShowcase({
  id: 'wave-slider',
  name: 'Wave-dip Slider',
  category: 'forms',
  created: '2026-07-07T19:00:06+09:00',
  status: 'done',
  description:
    'A capsule packed with equalizer bars, dragged like a waveform. The bars pinch down to almost nothing under the finger and ease back to full height within a few bars, so a valley travels along the track; bars left of the value stay dark and the rest light — a soft edge that marks the value even at rest — while a rounded bubble shows the live percentage. On release the dip melts back to an even row, the value boundary intact.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['slider', 'drag', 'wave', 'spring'],
  Component: WaveSlider,
  principle: `Both the shape and the colour derive from one smoothed centre \`c\`. Height is a Gaussian notch, \`BAR_MAX - depth * dip * exp(-((pos - c)/σ)²)\`, that pinches bars to near-zero at the finger; \`c\` and the dip strength are each driven by \`gsap.quickTo\` — one persistent tween per value, re-aimed on every pointer move — so the valley trails the pointer and melts away on release (a CSS transition can't trail a moving target). Colour is a \`smoothstep\` ramp centred on \`c\`, a soft edge that marks the value even when the bars are flat.

\`\`\`tsx
const cTo = gsap.quickTo(anim, 'c', { duration: 0.3, ease: 'power3', onUpdate: nudge })
const h = BAR_MAX - (BAR_MAX - BAR_MIN) * anim.dip * Math.exp(-((pos - anim.c) / SIGMA) ** 2)
const t = smoothstep(anim.c - RAMP, anim.c + RAMP, pos) // soft value edge, dip or not
\`\`\``,
})
