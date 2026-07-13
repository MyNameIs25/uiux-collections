import { defineShowcase } from '../../types'
import { LikeButtonBurst } from './demo'

export default defineShowcase({
  id: 'like-button-burst',
  name: 'Like Button Burst',
  category: 'buttons',
  created: '2026-07-14T15:20:00+09:00',
  status: 'done',
  description:
    'A glossy capsule like button. Click it and the outline heart fills with a white→grey gradient while the background cross-fades grey→blue, the count odometer-rolls up from a blur, and six white sparks spring out of the heart and fade. Every transition uses a back-ease that overshoots, so it lands with weight instead of easing flat. Click again to unlike — everything reverses, but the sparks fire on the way up only.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'spring', 'particles', 'click', 'counter', 'cta'],
  utilities: ['animate-like-roll', 'animate-particle-burst'],
  Component: LikeButtonBurst,
  principle: `The springy feel is faked with **one back-ease curve**, not a physics engine. \`cubic-bezier(0.34,1.56,0.64,1)\` overshoots past its target before settling — CSS's cheapest spring. Two custom keyframes reuse it as \`@utility\`s: \`animate-like-roll\` drops the count in from \`translateY(-15px)\` out of a \`blur(6px)\`, and \`animate-particle-burst\` flings each spark to its own inline \`--tx\`/\`--ty\` then shrinks it in place. Both are **one-shots replayed by remounting** — a \`key={count}\` / \`key={burst}\` change re-fires the keyframe, so no JS timeline is needed. The heart and background are plain \`transition-opacity\` cross-fades between two stacked layers (a single element can't tween between two gradients).

\`\`\`tsx
<span key={count} className="motion-safe:animate-like-roll">{count.toLocaleString()}</span>
{/* re-keying the layer replays the burst; each dot carries its own offset */}
<span key={burst}>{PARTICLES.map((p, i) =>
  <span style={{ '--tx': \`\${p.tx}px\`, '--ty': \`\${p.ty}px\` }}
        className="motion-safe:animate-particle-burst" />)}</span>
\`\`\``,
})
