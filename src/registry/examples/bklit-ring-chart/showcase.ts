import { defineShowcase } from '../../types'
import { RingChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-ring-chart',
  name: 'Bklit Ring Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable donut / ring chart from Bklit UI: one concentric ring per series, each animating up to its value on mount, with a live-counting total in the centre and a hover state that highlights individual rings.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'stat'],
  Component: RingChartDemo,
  preview: 'fit',
})
