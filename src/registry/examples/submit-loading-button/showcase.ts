import { defineShowcase } from '../../types'
import { SubmitLoadingButton } from './demo'

export default defineShowcase({
  id: 'submit-loading-button',
  name: 'Submit Loading Button',
  category: 'buttons',
  created: '2026-07-08T19:05:00+09:00',
  status: 'done',
  description:
    'A green-outline SUBMIT pill that, on click, smoothly shrinks into a spinning loading ring (grey ring with one green side), then blooms into a solid-green disc with a white check to confirm — before easing back to the pill so you can submit again. The whole capsule → circle → capsule sequence is one width/border/colour interpolation, not a hard swap, so nothing pops. Dependency-free (the original used jQuery UI): pure CSS transitions + a tiny timed React state machine.',
  libraries: ['react', 'tailwind'],
  tags: ['morph', 'loading', 'click', 'cta'],
  utilities: ['animate-rotating', 'font-roboto'],
  Component: SubmitLoadingButton,
  principle: `The morph is one CSS interpolation, not three separate widgets. A single \`transition-all\` on the button interpolates \`width\` (130px↔40px), \`border\`, \`background\` and \`font-size\` between three className states; JS only flips \`phase\` on a timer (no jQuery). The loading ring is a trick: a circle whose \`border\` is grey but whose \`border-l\` is green, spun by \`animate-rotating\` so the green side reads as a moving progress gap. The success check sizes in \`em\` (\`size-[1em]\`), so the 0→13px \`font-size\` transition grows it in.

\`\`\`tsx
idle    && 'w-[130px] border-2 border-[#1ECD97] text-[12px] transition-all duration-[250ms]'
loading && 'w-10 border-[3px] border-[#bbb] border-l-[#1ECD97] text-[0px] animate-rotating'
success && 'w-10 border-[3px] border-[#1ECD97] bg-[#1ECD97] text-[13px] transition-all duration-[450ms]'
// check grows because it's sized in em:
{success ? <Check className="size-[1em]" /> : 'SUBMIT'}
\`\`\``,
})
