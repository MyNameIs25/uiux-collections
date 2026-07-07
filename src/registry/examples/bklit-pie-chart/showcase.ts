import { defineShowcase } from '../../types'
import { PieChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-pie-chart',
  name: 'Bklit Pie Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A composable pie / donut chart from Bklit UI: slices grow in on mount with a live-counting total in the centre, and hovering pops a slice outward while dimming the rest.',
  libraries: ['react', 'bklit', 'visx', 'motion', 'd3'],
  tags: ['chart', 'hover'],
  Component: PieChartDemo,
  preview: 'fit',
})
