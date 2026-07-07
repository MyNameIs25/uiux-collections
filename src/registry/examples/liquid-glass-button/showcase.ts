import { defineShowcase } from '../../types'
import { LiquidGlassButton } from './demo'

export default defineShowcase({
  id: 'liquid-glass-button',
  name: 'Liquid Glass Button',
  category: 'buttons',
  created: '2026-07-07',
  status: 'done',
  description:
    'A capsule glass button that refracts a slowly drifting background like water, with a springy hover.',
  libraries: ['react', 'tailwind', 'css'],
  tags: ['glass', 'liquid', 'blur', 'hover', 'spring'],
  utilities: ['liquid-glass', 'animate-liquid-drift', 'font-orbitron'],
  Component: LiquidGlassButton,
  preview: 'fit',
  principle: `The frosted look is \`backdrop-filter: blur()\`; the *liquid* look feeds an SVG filter into the same property — \`feTurbulence\` makes smooth noise and \`feDisplacementMap\` bends the blurred backdrop, so the background refracts like water instead of blurring evenly. It's packaged as a reusable Tailwind \`@utility liquid-glass\`. \`backdrop-filter: url()\` is Chromium-only, so a plain \`blur()\` sits before it as a fallback. The springy press is a \`cubic-bezier\` overshoot transitioning \`scale\`, fired by \`hover:scale-105\`.

\`\`\`tsx
{/* in the component: noise -> displacement bends the backdrop */}
<filter id="liquid-glass">
  <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves="2" result="n" />
  <feDisplacementMap in="SourceGraphic" in2="n" scale="64" />
</filter>

/* src/styles/utilities.css — reusable Tailwind utility */
@utility liquid-glass {
  backdrop-filter: blur(8px) saturate(1.3);                    /* fallback */
  backdrop-filter: blur(2px) saturate(1.5) url(#liquid-glass); /* liquid */
  transition: scale .8s cubic-bezier(.175, .885, .32, 2.2);
}

// usage: <button className="liquid-glass hover:scale-105">
\`\`\``,
})
