import { defineShowcase } from '../../types'
import { GradientText } from './demo'

export default defineShowcase({
  id: 'gradient-text',
  name: 'Gradient Text',
  category: 'text',
  description: 'Headline text filled with a clipped gradient.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'headline', 'typography'],
  Component: GradientText,
  // Key idea: paint a gradient background, clip it to the text, hide the fill.
  principle: `<span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
  Make it pop
</span>`,
})
