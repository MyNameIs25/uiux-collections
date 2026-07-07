import { defineShowcase } from '../../types'
import { ProfitLossLineDemo } from './demo'

export default defineShowcase({
  id: 'bklit-profit-loss-line',
  name: 'Bklit Profit / Loss Line',
  category: 'data-display',
  created: '2026-07-07T21:43:48+09:00',
  status: 'done',
  description:
    'A sign-aware P&L line from Bklit UI that splits at the zero baseline: segments above zero render green, segments below render red. The crosshair tooltip colours its indicator to match the value under the cursor.',
  libraries: ['react', 'bklit', 'visx', 'motion'],
  tags: ['chart', 'reveal'],
  Component: ProfitLossLineDemo,
  preview: 'fit',
})
