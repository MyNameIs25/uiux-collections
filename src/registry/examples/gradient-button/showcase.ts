import { defineShowcase } from '../../types'
import { GradientButton } from './demo'

export default defineShowcase({
  id: 'gradient-button',
  name: 'Gradient Button',
  category: 'buttons',
  description: 'A pill button with a gradient fill and a springy hover.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'cta', 'pill'],
  Component: GradientButton,
  // Key idea: a fully-rounded pill + gradient fill, scaled on hover/active.
  principle: `<button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-2.5 text-white transition-transform hover:scale-105 active:scale-95">
  Get started
</button>`,
})
