import { defineShowcase } from '../../types'
import { FlipClock } from './demo'

export default defineShowcase({
  id: 'flip-countdown',
  name: 'Flip Countdown',
  category: 'data-display',
  description:
    'A split-flap (odometer-style) countdown clock. Each digit does a 3D flip as it changes; composes any number of digits into days:hours:minutes:seconds.',
  libraries: ['react', 'tailwind'],
  tags: ['countdown', 'clock', 'flip', '3d', 'retro'],
  utilities: ['animate-flip-down', 'animate-flip-up'],
  Component: FlipClock,
  preview: 'fit',
  principle: `Each digit is two static halves — \`overflow-hidden\` windows onto a full-height glyph — plus two flapping copies. On change, the old top flap rotates \`0 → -90deg\` off its bottom edge (\`origin-bottom\`, \`animate-flip-down\`) to reveal the new static top; then the new bottom flap swings \`90 → 0deg\` on its top edge (\`origin-top\`, \`animate-flip-up\`) to cover the old static bottom. React replays the CSS animation by **remounting the flaps with a \`key\`** — no per-frame JS, no 40 pre-rendered nodes.

\`\`\`tsx
// perspective on the card; flaps replay their CSS animation via a keyed remount
<div className="[perspective:280px]">
  <CardFace side="top" digit={next} />                 {/* static, revealed */}
  <CardFace side="bottom" digit={prev} />              {/* static, covered  */}
  <CardFace side="top" digit={prev} key={next}
    className="origin-bottom animate-flip-down [backface-visibility:hidden]" />
  <CardFace side="bottom" digit={next} key={next}
    className="origin-top animate-flip-up [backface-visibility:hidden]" />
</div>
\`\`\``,
})
