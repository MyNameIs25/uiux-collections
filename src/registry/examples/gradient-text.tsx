import { defineShowcase } from '../types'

function GradientText() {
  return (
    <span className="bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
      Make it pop
    </span>
  )
}

export const gradientText = defineShowcase({
  id: 'gradient-text',
  name: 'Gradient Text',
  category: 'text',
  description: 'Headline text filled with a clipped gradient.',
  tags: ['gradient', 'headline', 'typography'],
  Component: GradientText,
})
