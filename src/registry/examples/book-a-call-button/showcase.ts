import { defineShowcase } from '../../types'
import { BookACallButton } from './demo'

export default defineShowcase({
  id: 'book-a-call-button',
  name: 'Book a Call Button',
  category: 'buttons',
  created: '2026-07-07',
  status: 'done',
  description:
    'A dark capsule CTA that shows only "Book a call" at rest. On hover it smoothly widens as a white arrow fades in on the right — the button making room for the next step. Move away and the arrow fades out and the width springs back. Pure CSS, no JS.',
  libraries: ['react', 'tailwind'],
  tags: ['hover', 'reveal', 'cta', 'pill'],
  Component: BookACallButton,
  principle: `\`width: auto\` can't be interpolated, so the arrow reveal animates between two **fixed lengths**: \`w-0\` → \`w-[26px]\` (an 8px gap + an 18px icon), which the browser *can* transition. The arrow lives in an \`overflow-hidden\` flex span, so at \`w-0\` it's clipped to nothing and the capsule hugs the text; on \`group-hover\` the span opens to 26px and \`inline-flex\` grows the button to fit. Opacity fades in on the same \`200ms ease-out\` curve, so the width change and the icon land together. Pure CSS — the whole thing is a \`group\` + \`group-hover:\`, no JS.

> A CSS-Grid \`0fr → 1fr\` track is the other common way to do this, but it only collapses inside a *definite-width* container; in a shrink-to-fit flex button both fractions distribute the same zero free space, so fixed lengths are the robust choice here.

\`\`\`tsx
<button className="group inline-flex items-center ...">
  Book a call
  <span className="flex w-0 items-center overflow-hidden opacity-0
                   transition-[width,opacity] duration-200 ease-out
                   group-hover:w-[26px] group-hover:opacity-100">
    <ArrowRight className="ml-2 size-[18px] shrink-0" />
  </span>
</button>
\`\`\``,
})
