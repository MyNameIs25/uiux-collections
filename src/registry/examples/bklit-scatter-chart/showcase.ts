import { defineShowcase } from '../../types'
import { ScatterChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-scatter-chart',
  name: 'Bklit Scatter Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A composable scatter plot from Bklit UI: each point plots a value against time, dots are coloured by vertical position with a red-to-green gradient, points reveal on mount, and hovering highlights one while dimming the rest.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'hover'],
  Component: ScatterChartDemo,
  preview: 'fit',
})
