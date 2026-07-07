import { defineShowcase } from '../../types'
import { GradientText } from './demo'

export default defineShowcase({
  id: 'gradient-text',
  name: 'Gradient Text',
  category: 'text',
  created: '2026-07-06',
  status: 'done',
  description: 'Headline text filled with a clipped gradient.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'typography'],
  Component: GradientText,
  principle: `The gradient is painted as a background, then clipped to the glyph shapes with \`bg-clip-text\`, and the text's own fill is removed with \`text-transparent\` so the gradient shows through. Without \`text-transparent\` the solid text color would sit on top and hide it.

\`\`\`tsx
<span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
  Make it pop
</span>
\`\`\``,
})
