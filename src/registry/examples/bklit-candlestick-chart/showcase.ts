import { defineShowcase } from '../../types'
import { CandlestickChartDemo } from './demo'

export default defineShowcase({
  id: 'bklit-candlestick-chart',
  name: 'Bklit Candlestick Chart',
  category: 'data-display',
  created: '2026-07-07',
  status: 'done',
  description:
    'A composable OHLC candlestick chart from Bklit UI: each period draws a wick and body coloured green or red by close-versus-open, candles reveal on mount, and hovering one candle dims the others.',
  libraries: ['react', 'bklit', 'visx', 'motion', 'd3'],
  tags: ['chart', 'hover'],
  Component: CandlestickChartDemo,
  preview: 'fit',
})
