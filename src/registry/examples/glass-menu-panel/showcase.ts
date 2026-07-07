import { defineShowcase } from '../../types'
import { GlassMenuPanel } from './demo'

export default defineShowcase({
  id: 'glass-menu-panel',
  name: 'Glass Menu Panel',
  category: 'navigation',
  created: '2026-07-07',
  status: 'done',
  preview: 'fit',
  description:
    'A frosted-glass user menu floating over a photo — the scene behind it bleeds through the panel as soft, blurred colour, which is the whole point. Two grouped sections split by a divider, an amber-ringed "selected" capsule you can move by clicking, an iOS-style dark-mode switch that springs across, and a glassy Log out button.',
  libraries: ['react', 'tailwind'],
  tags: ['glass', 'blur', 'menu', 'toggle', 'dark-mode'],
  Component: GlassMenuPanel,
  principle: `Depth comes from **two nested glass tints** over one \`backdrop-blur-2xl backdrop-saturate-150\`: a darker outer frame (\`bg-neutral-950/55\`) and a lighter inner menu card (\`bg-white/6\`) stacked on it, so the card reads a shade brighter and the footer sits on the darker frame. \`backdrop-blur\` blurs whatever is *behind* the panel; the translucency is what makes that blurred photo visible — an opaque fill would hide it. A \`before:\` \`from-white/7\` sheen fakes the lit glass edge.

\`\`\`tsx
<div className="rounded-[28px] border border-white/10 bg-neutral-950/55
                backdrop-blur-2xl backdrop-saturate-150"> {/* darker outer frame */}
  <div className="rounded-[20px] bg-white/[0.06]">…menu…</div> {/* lighter inner card */}
  {/* Feedback + Log out sit here, on the darker frame */}
</div>
\`\`\``,
})
