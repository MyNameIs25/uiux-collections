import { defineShowcase } from '../../types'
import { RecordCapsuleMenu } from './demo'

export default defineShowcase({
  id: 'record-capsule-menu',
  name: 'Record Capsule Menu',
  category: 'navigation',
  created: '2026-07-10T11:20:00+09:00',
  status: 'done',
  description:
    'An iOS-style screen-record control that lives as a dark capsule of stacked dot-grid glyphs, blooms into a two-row Record / Screenshot card on hover, and — after a click and a simulated "Starting..." beat — morphs again into a four-row recording panel with a live timer, Restart and Delete. The container reshapes like liquid between every state, and a single floating highlight glides between rows the way native iOS lists do.',
  libraries: ['react', 'tailwind'],
  tags: ['menu', 'morph', 'hover', 'click', 'timer'],
  utilities: ['animate-tooltip-wipe-in'],
  Component: RecordCapsuleMenu,
  principle: `Every phase maps to *concrete* \`width/height/border-radius\` numbers (\`rows × ROW_H + padding\`), so the capsule→card→panel "liquid" morph is a plain \`transition-[width,height,border-radius]\` with an iOS ease — no layout-animation library needed, because the sizes are computable. The hover highlight is one absolute block that \`translateY\`s between rows (the native-list treatment) instead of per-row backgrounds. Timers only drive the state machine: \`setTimeout\` for the Starting... beat, \`setInterval\` for the clock; the reused \`animate-tooltip-wipe-in\` utility wipes each swapped label in.

\`\`\`tsx
const SHAPE = { idle: { w: 64, h: 104, r: 32 }, menu: { w: 224, h: 116, r: 28 },
  recording: { w: 224, h: 220, r: 28 } }  // concrete numbers → CSS can tween them
<div style={{ width: w, height: h, borderRadius: r }}
  className="overflow-hidden transition-[width,height,border-radius]
             duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]" />
<span style={{ transform: \`translateY(\${hover * ROW_H}px)\` }}
  className="absolute rounded-[22px] bg-white/10 transition-transform" />
\`\`\``,
})
