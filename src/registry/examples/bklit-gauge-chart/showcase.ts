import { defineShowcase } from '../../types'
import { GaugeChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-gauge-chart',
  name: 'Bklit Gauge Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable notch gauge from Bklit UI that renders a single metric as a segmented radial arc with an animated formatted value in the center.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: GaugeChartDemo,
  preview: 'fit',
})
