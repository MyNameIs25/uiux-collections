import { defineShowcase } from '../../types'
import { FrequencySelectorMorph } from './demo'

export default defineShowcase({
  id: 'frequency-selector-morph',
  name: 'Frequency Selector Morph',
  category: 'forms',
  created: '2026-07-13T11:00:00+09:00',
  status: 'done',
  description:
    'A settings row whose compact summary — "Frequency │ Daily ‹›" — morphs, as one continuous shape, into a full segmented control (Daily/Weekly/Monthly/Yearly) with a black confirm button; picking Weekly slides a Sun–Sat weekday row open beneath it. The selection highlight glides and resizes to each option, and confirming collapses the whole thing back to an updated summary. A true shared-element "magic move", not a show/hide.',
  libraries: ['react', 'tailwind', 'gsap'],
  tags: ['morph', 'click', 'tabs', 'stagger', 'minimal'],
  utilities: ['animate-option-in'],
  Component: FrequencySelectorMorph,
  principle: `The collapsed pill and the expanded segmented control are *different DOM nodes* sharing \`data-flip-id="pill"\`. GSAP **Flip** does the magic move: capture \`Flip.getState('[data-flip-id]')\` **before** the state change, then \`Flip.from(state, …)\` **after** — it diffs the two layouts and tweens each shared box's position/size (\`absolute\`+\`nested\` so the taller container reflows cleanly). Nodes that live in only one state — the check button, the weekday row, the "Frequency" label — are handled by Flip's \`onEnter\`/\`onLeave\` (fade + scale) instead of popping. As the pill opens, the options cascade in left→right: the \`animate-option-in\` utility (fade + slide-from-left) fires on mount with a per-index \`animation-delay\`, so the control "unrolls". The selection highlight is a separate, simpler trick: one absolute span whose \`transform\`/\`width\` transition to the active button's measured \`offsetLeft\`/\`offsetWidth\`.

\`\`\`tsx
const morph = (fade, change) => { pending.current = { state: Flip.getState('[data-flip-id]'), fade }; change() }
useLayoutEffect(() => {
  const p = pending.current; if (!p) return; pending.current = null
  Flip.from(p.state, { duration: 0.45, ease: 'power3.inOut', absolute: true, nested: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 }),
    onLeave: els => gsap.to(els, { opacity: 0 }) })
})
\`\`\``,
})
