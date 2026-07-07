import { defineShowcase } from '../../types'
import { GradientButton } from './demo'

export default defineShowcase({
  id: 'gradient-button',
  name: 'Gradient Button',
  category: 'buttons',
  created: '2026-07-06',
  status: 'done',
  description: 'A pill button with a gradient fill and a springy hover.',
  libraries: ['react', 'tailwind'],
  tags: ['gradient', 'hover', 'cta'],
  Component: GradientButton,
  principle: `A fully-rounded \`rounded-full\` pill with a \`bg-gradient-to-r\` fill. The springy feel comes from animating \`scale\` only — \`transition-transform\` with \`hover:scale-105\` and \`active:scale-95\` — which the GPU handles cheaply and which never triggers layout.

\`\`\`tsx
<button className="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-6 py-2.5 text-white transition-transform hover:scale-105 active:scale-95">
  Get started
</button>
\`\`\``,
})
