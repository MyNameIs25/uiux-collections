import { defineShowcase } from '../../types'
import { DotMatrixScanLoader } from './demo'

export default defineShowcase({
  id: 'dot-matrix-scan-loader',
  name: 'Dot-Matrix Scan Loader',
  category: 'feedback',
  created: '2026-07-09T15:05:00+09:00',
  status: 'done',
  description:
    'A loading bar drawn entirely with text: a monospace field of tiny Unicode dots, swept back and forth by a solid block whose trailing edge dissolves into halftone speckle — like an old dot-matrix screen refreshing. No canvas, no SVG, no images; every "pixel" is a Braille character, and the dither trail always hangs off the side the block is moving away from.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['loading', 'auto', 'retro', 'typography'],
  Component: DotMatrixScanLoader,
  principle: `The whole loader is one \`<pre>\` string. Braille cells (U+2800 block) are strictly \`1ch\` wide in monospace fonts, so a sparse→solid glyph ladder (\`⠆ ⠶ ⣶ ⣿ █\`) turns character choice into pixel density with zero layout shift. Each frame maps a cell's distance behind the scan head to a ladder level, plus a stable per-cell jitter — ordered dithering that breaks the edge into halftone speckle instead of bands. A GSAP \`yoyo\` tween sweeps the head; \`leading-none\` fuses the \`█\` rows into one solid block.

\`\`\`tsx
const f = Math.max(0, 1 - edge / (trailing ? TAIL : LEAD)) ** 2
const lvl = Math.floor(f * LADDER.length + jitter(row, col) * 0.9)
cell = lvl <= 0 ? BG[(row + col) % 2] : LADDER[Math.min(lvl - 1, LADDER.length - 1)]
gsap.to(proxy, { t: 1, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut',
  onUpdate: () => { pre.textContent = frame(headFrom(proxy.t), dir) } })
\`\`\``,
})
