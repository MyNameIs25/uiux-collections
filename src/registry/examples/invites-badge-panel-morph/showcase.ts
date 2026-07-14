import { defineShowcase } from '../../types'
import { InvitesBadgePanelMorph } from './demo'

export default defineShowcase({
  id: 'invites-badge-panel-morph',
  name: 'Invites Badge-to-Panel Morph',
  category: 'navigation',
  created: '2026-07-14T18:30:00+09:00',
  status: 'done',
  description:
    'A light "Invites 2" pill that, on click, morphs — as one continuous shape — into a full invitations panel: the capsule stretches into a rounded card, the "Invites" label grows into the header, the dark "2" badge glides to the corner and cross-fades into the close ✕, and the list blurs in a beat behind the container. Closing plays the whole thing in reverse. The button is literally the seed of the panel.',
  libraries: ['react', 'tailwind'],
  tags: ['morph', 'blur', 'click', 'popover', 'minimal'],
  Component: InvitesBadgePanelMorph,
  principle: `No layout library — the effect is one **persistent container** interpolating \`width\`/\`height\`/\`border-radius\` from pill to panel via a plain CSS \`transition\`, while every other piece is *absolutely positioned inside it* and rides along. Because the container is flex-centred, growing it reads as unfurling from the pill's centre. The "Invites" label transitions its \`left\`/\`top\`/\`font-size\`; the badge is anchored **top-right**, so as the box widens it glides to the corner while its \`background-color\` and stacked \`2\`/\`✕\` cross-fade. The list is always mounted (so close reverses too) and blurs in on a \`delay\` — container leads, content follows.

\`\`\`tsx
<div style={{ width: open ? PANEL_W : PILL_W, height: open ? panelH : PILL_H,
              borderRadius: open ? 28 : PILL_H / 2 }}
     className="overflow-hidden transition-[width,height,border-radius] ...">
  <span style={{ left: open?24:20, top: open?22:21, fontSize: open?25:17 }} /* Invites */ />
  <div className={open ? 'opacity-100 blur-0 delay-[120ms]' : 'opacity-0 blur-md'}>{/* list */}</div>
  <button style={{ top: open?14:8, right: open?14:8 }} /* 2 ⇄ ✕ */ />
</div>
\`\`\``,
})
