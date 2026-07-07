import { defineShowcase } from '../../types'
import { TerminalSettingsSelector } from './demo'

export default defineShowcase({
  id: 'terminal-settings-selector',
  name: 'Terminal Settings Selector',
  category: 'forms',
  created: '2026-07-07',
  status: 'done',
  preview: 'fit',
  description:
    'A terminal-aesthetic settings panel: Theme (Dark / Light / System) and Cursor (Default / Pointer) single-choice groups whose options are tiny iconified UI mockups instead of swatches. Monospace copy sells the "terminal" vibe; the selected card gets a crisp coral-orange border and its label turns white. Pure CSS with native radios — no JS, keyboard-navigable.',
  libraries: ['react', 'tailwind'],
  tags: ['click', 'dark-mode', 'monochrome', 'minimal'],
  Component: TerminalSettingsSelector,
  principle: `Each option is a \`<label>\` wrapping a visually-hidden \`<input type="radio">\`, so selection is real form state — **no JS**, and arrow keys move within a group for free. The label is a \`group\`; the selected styling hangs off \`group-has-[:checked]\`, which (unlike \`peer-checked\`, limited to siblings) also reaches *nested* elements — so one checked radio drives the card's orange border, the label turning white, **and** the cursor mockup's pill turning orange. The previews are the trick: instead of swatches, each card is a miniature UI built from positioned divs, and **System** is just the Dark window with a Light copy stacked on top and \`clip-path: inset(0 0 0 50%)\` so only its right half shows.

\`\`\`tsx
<label className="group ...">
  <input type="radio" name="theme" className="peer sr-only" defaultChecked />
  <div className="border-2 border-transparent group-has-[:checked]:border-[#EA5B3C] ...">{mockup}</div>
  <span className="text-[#7d7d7d] group-has-[:checked]:text-white">Dark</span>
</label>
// System split: <Window p={DARK} /> then <Window p={LIGHT} /> clipped to the right half
\`\`\``,
})
