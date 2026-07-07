import { defineShowcase } from '../../types'
import { FrostedGlassCard } from './demo'

export default defineShowcase({
  id: 'frosted-glass',
  name: 'Frosted Glass',
  category: 'cards',
  created: '2026-07-07',
  status: 'done',
  description:
    'An iced-glass card: a heavy backdrop-blur over a photo, dusted with a physical frost grain generated live by an SVG turbulence filter (no noise image) and a warm highlight along one corner.',
  libraries: ['react', 'tailwind', 'css'],
  tags: ['glass', 'blur', 'grain', 'svg'],
  utilities: ['frosted-glass'],
  Component: FrostedGlassCard,
  preview: 'fit',
  principle: `A flat \`backdrop-filter: blur()\` is too smooth to read as *frost*, so the grain is synthesised in SVG instead of loading a noise image. \`feTurbulence\` makes fine \`fractalNoise\`; \`feDisplacementMap\` — given **no \`in\`**, so it defaults to the previous result (the desaturated noise) — jitters that noise by itself into an irregular speckle. It renders into an empty absolute \`<span>\`, kept on its own layer so the text above stays razor-sharp. The blur, shadows and corner highlight are the reusable \`frosted-glass\` @utility.

\`\`\`tsx
<filter id="frost">
  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" result="noise" />
  <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
  {/* no in= → displaces the mono grain by the noise: grain from pure math */}
  <feDisplacementMap in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
</filter>

{/* grain layer, separate from the text so glyphs never get displaced */}
<span aria-hidden className="absolute inset-0 [filter:url(#frost)]" />
\`\`\``,
})
