import { defineShowcase } from '../types'

function GradientButton() {
  return (
    <button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-2.5 font-medium text-white shadow-lg transition-transform hover:scale-105 active:scale-95">
      Get started
    </button>
  )
}

export const gradientButton = defineShowcase({
  id: 'gradient-button',
  name: 'Gradient Button',
  category: 'buttons',
  description: 'A pill button with a gradient fill and a springy hover.',
  tags: ['gradient', 'cta', 'pill'],
  Component: GradientButton,
})
