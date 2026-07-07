import { defineShowcase } from '../../types'
import { AuroraHero } from './demo'

export default defineShowcase({
  id: 'aurora-hero',
  name: 'Aurora Hero',
  category: 'hero',
  created: '2026-07-06T23:13:18+09:00',
  status: 'done',
  description:
    'A dark landing hero with drifting aurora gradients, a masked grid, and a staggered GSAP entrance.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['gradient', 'stagger', 'float', 'auto'],
  Component: AuroraHero,
  preview: 'fit',
  principle: `The aurora is just three oversized color circles (\`size-96 rounded-full\`) melted together with \`blur-3xl\`, stacked behind the content on a dark base. A faint grid sits on top, faded at the edges by a \`radial-gradient\` \`mask-image\` so it never ends on a hard border. GSAP handles motion: \`gsap.from(..., { stagger })\` fades and rises the content on mount, while the blobs drift forever on an infinite \`yoyo\` tween.

\`\`\`tsx
<div className="relative isolate overflow-hidden bg-slate-950">
  {/* aurora = blurred color blobs behind the content */}
  <div className="absolute size-96 rounded-full bg-fuchsia-600/40 blur-3xl" />
  {/* grid faded at the edges so it never hits a hard border */}
  <div className="absolute inset-0 [background-image:linear-gradient(to_right,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse,black,transparent_75%)]" />
  {/* ...content... */}
</div>

// entrance: fade + rise, one after another
gsap.from('[data-animate]', { opacity: 0, y: 24, stagger: 0.12, ease: 'power3.out' })
\`\`\``,
})
