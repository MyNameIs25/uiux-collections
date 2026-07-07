import { defineShowcase } from '../../types'
import { ComposedChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-composed-chart',
  name: 'Bklit Composed Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A composable multi-series chart from Bklit UI that layers bars, a line, and a filled area on one shared time axis, each revealing on mount, so units, revenue, and run-rate read together in a single frame.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: ComposedChartDemo,
  preview: 'fit',
})
