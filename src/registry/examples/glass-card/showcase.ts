import { defineShowcase } from '../../types'
import { GlassCard } from './demo'

export default defineShowcase({
  id: 'glass-card',
  name: 'Glass Card',
  category: 'cards',
  description: 'A frosted-glass card with a blurred gradient accent.',
  libraries: ['react', 'tailwind'],
  tags: ['glass', 'blur', 'glassmorphism'],
  Component: GlassCard,
  // Key idea: semi-transparent bg + backdrop-blur, plus a blurred gradient blob
  // behind the content for the glow.
  principle: `<div className="rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md">
  {/* blurred gradient blob behind content = the glow */}
  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-fuchsia-400/40 to-indigo-400/40 blur-2xl" />
  {/* ...content... */}
</div>`,
})
