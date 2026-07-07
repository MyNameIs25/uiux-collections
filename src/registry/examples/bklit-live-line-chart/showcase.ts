import { defineShowcase } from '../../types'
import { LiveLineChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-live-line-chart',
  name: 'Bklit Live Line Chart',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A streaming real-time line from Bklit UI. New points push in on an interval while the time window scrolls left, the y-domain eases to fit, and a pulsing dot with a value badge rides the live tip.',
  libraries: ['react', 'bklit', 'visx', 'motion', 'd3'],
  tags: ['chart', 'auto'],
  Component: LiveLineChartDemo,
  preview: 'fit',
})
