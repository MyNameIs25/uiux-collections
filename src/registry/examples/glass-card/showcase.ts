import { defineShowcase } from '../../types'
import { GlassCard } from './demo'

export default defineShowcase({
  id: 'glass-card',
  name: 'Glass Card',
  category: 'cards',
  created: '2026-07-06',
  status: 'done',
  description: 'A frosted-glass card with a blurred gradient accent.',
  libraries: ['react', 'tailwind'],
  tags: ['glass', 'blur'],
  Component: GlassCard,
  principle: `Frosted glass is a translucent surface (\`bg-white/10\`) plus \`backdrop-blur-md\`, which blurs whatever sits *behind* the element. The translucency is what makes the blur visible — an opaque background would hide it. The soft glow is a separate blurred gradient blob (\`blur-2xl\`) placed behind the content.

\`\`\`tsx
<div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
  {/* blurred blob behind the content = the glow */}
  <div className="absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-400/40 blur-2xl" />
</div>
\`\`\``,
})
