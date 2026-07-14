/**
 * Catalog of the project's **custom Tailwind utilities / theme tokens** (the
 * `@utility` and `@theme` values defined in `src/styles/`). These are not stock
 * Tailwind — a showcase that uses one lists it in `utilities`, and the details
 * page renders a "Utilities" section where hovering each shows what it expands
 * to. Keep this in sync with `src/styles/`.
 */
export interface CustomUtility {
  /** Class name as written in markup (e.g. `liquid-glass`, `font-orbitron`). */
  name: string
  /** Rough grouping, used as a label. */
  kind: 'utility' | 'animation' | 'font'
  /** Where it's defined, so readers can find the source. */
  file: string
  /** One-line plain-English summary of what it produces. */
  summary: string
  /** The underlying CSS it expands to — shown on hover. */
  css: string
}

export const CUSTOM_UTILITIES: Record<string, CustomUtility> = {
  'liquid-glass': {
    name: 'liquid-glass',
    kind: 'utility',
    file: 'src/styles/utilities.css',
    summary:
      'A frosted-glass surface (translucent gradient + border + inset highlights) whose backdrop is bent by an SVG displacement filter for a water-like refraction. Falls back to plain frosted glass off Chromium; ships a springy scale transition.',
    css: `@utility liquid-glass {
  border: 1px solid rgb(255 255 255 / .32);
  background: linear-gradient(135deg,
    rgb(255 255 255 / .22), rgb(255 255 255 / .03));
  box-shadow: 0 8px 32px rgb(0 0 0 / .35),
    inset 0 1px 1px rgb(255 255 255 / .5);
  backdrop-filter: blur(8px) saturate(1.3);           /* fallback */
  @supports (backdrop-filter: url("#x")) {            /* Chromium */
    backdrop-filter: blur(2px) saturate(1.5) url(#liquid-glass);
  }
  transition: scale .8s cubic-bezier(.175, .885, .32, 2.2);
}`,
  },
  'animate-liquid-drift': {
    name: 'animate-liquid-drift',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      "Slowly pans an element's background-position on a 15s loop for a gentle, ambient drift.",
    css: `@theme {
  --animate-liquid-drift: liquid-drift 15s ease-in-out infinite;
  @keyframes liquid-drift {
    0%, 100% { background-position: 50% 50%; }
    25%      { background-position: 20% 75%; }
    50%      { background-position: 80% 25%; }
    75%      { background-position: 35% 60%; }
  }
}`,
  },
  'animate-option-in': {
    name: 'animate-option-in',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'One option easing in from its left edge (fade + slide-from-left + slight scale). Give each item in a row an increasing `animation-delay` and they cascade left→right, so a segmented control "unrolls" as it appears. `both` holds the hidden start through the delay.',
    css: `@theme {
  --animate-option-in: option-in 0.34s cubic-bezier(0.22, 1, 0.36, 1) both;
  @keyframes option-in {
    from { opacity: 0; transform: translateX(-10px) scale(0.94); }
    to   { opacity: 1; transform: translateX(0) scale(1); }
  }
}`,
  },
  'animate-flip-down': {
    name: 'animate-flip-down',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      "Split-flap top half: rotates from flat to -90° on its bottom edge (pair with `origin-bottom`) so the old digit's top falls away.",
    css: `@theme {
  --animate-flip-down: flip-down 0.25s ease-in forwards;
  @keyframes flip-down {
    from { transform: rotateX(0deg); }
    to   { transform: rotateX(-90deg); }
  }
}`,
  },
  'animate-flip-up': {
    name: 'animate-flip-up',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      "Split-flap bottom half: after a 0.25s delay, swings from 90° up to flat on its top edge (pair with `origin-top`) so the new digit's bottom drops in.",
    css: `@theme {
  --animate-flip-up: flip-up 0.25s ease-out 0.25s both;
  @keyframes flip-up {
    from { transform: rotateX(90deg); }
    to   { transform: rotateX(0deg); }
  }
}`,
  },
  'animate-border-beam': {
    name: 'animate-border-beam',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Spins a registered `<angle>` custom property (`--angle`) a full 360° on a linear loop. Pair it with a `conic-gradient(from var(--angle), …)` so a light beam travels around a border. The `@property` registration is required — an unregistered var cannot be interpolated.',
    css: `@property --angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@theme {
  --animate-border-beam: border-beam 8s linear infinite;
  @keyframes border-beam {
    to { --angle: 360deg; }
  }
}`,
  },
  'frosted-glass': {
    name: 'frosted-glass',
    kind: 'utility',
    file: 'src/styles/utilities.css',
    summary:
      'A heavy iced-glass surface: translucent white over a blur(1rem) backdrop-filter with layered drop + inset shadows (no border line). Its ::after paints a warm conic-gradient highlight along the top-left corner ring (padding-box mask subtracted from border-box). Pair with an SVG filter:url(#frost) grain layer for the frost speckle.',
    css: `@utility frosted-glass {
  position: relative;
  border-radius: 0.5rem;
  background-color: rgb(255 255 255 / .2);
  backdrop-filter: blur(1rem);
  box-shadow:
    0 0 3rem -1rem rgb(0 0 0 / .2),
    0 0 1rem -0.5rem rgb(0 0 0 / .2),
    inset 0 0 3rem 0 rgb(255 255 255 / .15),
    inset 0 0 0.25rem 0 rgb(255 255 255 / .15);
  &::after {                 /* warm corner highlight = a masked border ring */
    content: "";
    position: absolute; inset: 0 auto auto 0;
    width: min(100%, 1rem); height: min(100%, 1rem);
    padding: min(100%, 1rem);
    border: 1px solid transparent;
    border-radius: inherit;
    background: conic-gradient(from -90deg at center,
      transparent 8%, #fff, transparent 17%) border-box;
    mask: linear-gradient(transparent), linear-gradient(white);
    mask-clip: padding-box, border-box;
    mask-composite: subtract;
  }
}`,
  },
  'glass-hud': {
    name: 'glass-hud',
    kind: 'utility',
    file: 'src/styles/utilities.css',
    summary:
      'An Apple-style frosted "HUD" card: a translucent 135° white gradient over a blur+saturate backdrop-filter, with a four-layer box-shadow that fakes a lit top edge, shaded bottom edge, hairline border and drop shadow. Shared by the clock and weather widgets.',
    css: `@utility glass-hud {
  border-radius: 24px;
  background-image: linear-gradient(135deg,
    rgb(255 255 255 / .1) 0%, rgb(255 255 255 / .04) 50%,
    rgb(255 255 255 / .07) 100%);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  backdrop-filter: blur(20px) saturate(1.8);
  box-shadow: 0 8px 32px 0 rgb(0 0 0 / .3),
    0 0 0 1px rgb(255 255 255 / .05),
    inset 0 1px 0 0 rgb(255 255 255 / .15),
    inset 0 -1px 0 0 rgb(0 0 0 / .1);
  transition: .4s cubic-bezier(.16, 1, .3, 1);
}`,
  },
  'animate-widget-slide-in': {
    name: 'animate-widget-slide-in',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Glass-card entrance: rises 20px, scales 0.95→1 and sharpens from blur(10px)→0 on an easeOutExpo curve. Uses `both` fill so an added `animation-delay` holds the hidden state (lets cards stagger in).',
    css: `@theme {
  --animate-widget-slide-in: widget-slide-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
  @keyframes widget-slide-in {
    from { opacity: 0; transform: translateY(20px) scale(0.95); filter: blur(10px); }
    to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
}`,
  },
  'animate-seconds-pulse': {
    name: 'animate-seconds-pulse',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Gentle 1s opacity heartbeat (0.5↔0.9) for the ticking seconds readout.',
    css: `@theme {
  --animate-seconds-pulse: seconds-pulse 1s ease-in-out infinite;
  @keyframes seconds-pulse {
    0%, 100% { opacity: 0.5; }
    50%      { opacity: 0.9; }
  }
}`,
  },
  'animate-now-pulse': {
    name: 'animate-now-pulse',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Breathing halo for the "Now" cell: an outer box-shadow ring expands 0→8px and fades while an inner glow brightens, on a 3s loop.',
    css: `@theme {
  --animate-now-pulse: now-pulse 3s ease-in-out infinite;
  @keyframes now-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgb(102 204 255 / .4), inset 0 0 15px rgb(102 204 255 / .1); }
    50%      { box-shadow: 0 0 0 8px rgb(102 204 255 / 0), inset 0 0 20px rgb(102 204 255 / .2); }
  }
}`,
  },
  'animate-radial-breathe': {
    name: 'animate-radial-breathe',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Radar-ping breathing: scales an element 1→1.3→1 while fading 1→0.5→1 on a 2.2s ease-in-out loop. Put it on the ring group so the whole track + arc swells and settles like a heartbeat.',
    css: `@theme {
  --animate-radial-breathe: radial-breathe 2.2s ease-in-out infinite;
  @keyframes radial-breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.3); opacity: 0.5; }
  }
}`,
  },
  'animate-radial-spin': {
    name: 'animate-radial-spin',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Rotates an element a full 360° on a 2.2s linear loop. Applied to the SVG so the dashed progress arc orbits the hub once per breathing cycle; the symmetric track ring hides that it is spinning too.',
    css: `@theme {
  --animate-radial-spin: radial-spin 2.2s linear infinite;
  @keyframes radial-spin {
    to { transform: rotate(360deg); }
  }
}`,
  },
  'animate-equalize': {
    name: 'animate-equalize',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      "Morphs a bottom-anchored bar's height through 35→90→50→75% on a 1.1s loop, like an audio equalizer. Give sibling bars different (negative) animation-delays to phase-shift them so they dance out of step.",
    css: `@theme {
  --animate-equalize: equalize 1.1s ease-in-out infinite;
  @keyframes equalize {
    0%, 100% { height: 35%; }
    25%      { height: 90%; }
    50%      { height: 50%; }
    75%      { height: 75%; }
  }
}`,
  },
  'animate-tooltip-wipe-in': {
    name: 'animate-tooltip-wipe-in',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Reveals text left→right by animating `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` (the right clip edge sweeps across). Pair with `animate-tooltip-wipe-out` on the outgoing label in the same box for a curtain swap instead of a cross-fade.',
    css: `@theme {
  --animate-tooltip-wipe-in: tooltip-wipe-in 260ms cubic-bezier(0.32, 0.72, 0, 1) both;
  @keyframes tooltip-wipe-in {
    from { clip-path: inset(0 100% 0 0); }
    to   { clip-path: inset(0 0 0 0); }
  }
}`,
  },
  'animate-tooltip-wipe-out': {
    name: 'animate-tooltip-wipe-out',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Hides text left→right by animating `clip-path: inset(0 0 0 0)` → `inset(0 0 0 100%)` (the left clip edge sweeps across). The inverse of `animate-tooltip-wipe-in`; both wipe the same direction so old + new text briefly overlap mid-swap.',
    css: `@theme {
  --animate-tooltip-wipe-out: tooltip-wipe-out 260ms cubic-bezier(0.32, 0.72, 0, 1) both;
  @keyframes tooltip-wipe-out {
    from { clip-path: inset(0 0 0 0); }
    to   { clip-path: inset(0 0 0 100%); }
  }
}`,
  },
  'font-orbitron': {
    name: 'font-orbitron',
    kind: 'font',
    file: 'src/styles/theme.css',
    summary:
      'Applies the Orbitron display typeface (loaded via a <link> in index.html).',
    css: `@theme {
  --font-orbitron: 'Orbitron', system-ui, sans-serif;
}`,
  },
  'font-homenaje': {
    name: 'font-homenaje',
    kind: 'font',
    file: 'src/styles/theme.css',
    summary:
      'Applies the Homenaje display typeface (loaded via a <link> in index.html).',
    css: `@theme {
  --font-homenaje: 'Homenaje', system-ui, sans-serif;
}`,
  },
  'font-roboto': {
    name: 'font-roboto',
    kind: 'font',
    file: 'src/styles/theme.css',
    summary:
      'Applies the Roboto UI typeface (loaded via a <link> in index.html).',
    css: `@theme {
  --font-roboto: 'Roboto', system-ui, sans-serif;
}`,
  },
  'animate-rotating': {
    name: 'animate-rotating',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'A steady linear 360° spin, 2s per turn, after a 0.25s start delay — the submit button’s loading ring. The delay lets the capsule→circle shrink finish before the ring begins turning.',
    css: `@theme {
  --animate-rotating: rotating 2s 0.25s linear infinite;
  @keyframes rotating {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
}`,
  },
  'animate-list-reveal': {
    name: 'animate-list-reveal',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'A list row easing in — fade + a 6px rise on an ease-out curve. Give each row an increasing `animation-delay` (e.g. `i * 50ms`) and they cascade top→bottom as a panel opens. `both` holds the hidden start through the delay.',
    css: `@theme {
  --animate-list-reveal: list-reveal 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
  @keyframes list-reveal {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
}`,
  },
  'animate-like-roll': {
    name: 'animate-like-roll',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Odometer roll for a changing value: it drops into place from above (translateY(-15px)→0) while sharpening out of a blur(6px)→0 and fading in. The back-ease `cubic-bezier(0.34,1.56,0.64,1)` overshoots the rest position so the number lands with a spring. Replay it by remounting the element on a `key` change.',
    css: `@theme {
  --animate-like-roll: like-roll 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  @keyframes like-roll {
    from { opacity: 0; transform: translateY(-15px); filter: blur(6px); }
    to   { opacity: 1; transform: translateY(0);      filter: blur(0); }
  }
}`,
  },
  'animate-particle-burst': {
    name: 'animate-particle-burst',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'One-shot confetti/spark burst: a dot springs from the centre out to its own `--tx`/`--ty` offset (set per-particle inline) by ~40% of the run, then shrinks and fades in place — it never returns to centre. Give each particle a different `--tx`/`--ty` (e.g. cos/sin around a circle) and remount the layer on a `key` to re-fire.',
    css: `@theme {
  --animate-particle-burst: particle-burst 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  @keyframes particle-burst {
    0%   { opacity: 0; transform: translate(0, 0) scale(0); }
    40%  { opacity: 1; transform: translate(var(--tx), var(--ty)) scale(1); }
    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0); }
  }
}`,
  },
  'animate-calendar-sync-slide': {
    name: 'animate-calendar-sync-slide',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Indeterminate progress sweep: a short bar slides left→right across a clipped track forever. `translateX` is expressed in multiples of the bar’s own width (-110% → 360%), so it starts fully off the left and ends fully off the right regardless of the bar’s width. Loop it (`infinite`) while a task’s duration is unknown.',
    css: `@theme {
  --animate-calendar-sync-slide: calendar-sync-slide 1.3s ease-in-out infinite;
  @keyframes calendar-sync-slide {
    from { transform: translateX(-110%); }
    to   { transform: translateX(360%); }
  }
}`,
  },
  'animate-calendar-sync-fill': {
    name: 'animate-calendar-sync-fill',
    kind: 'animation',
    file: 'src/styles/animations.css',
    summary:
      'Quick determinate fill: a bar grows from empty to full pinned to its left edge (`scaleX(0)→scaleX(1)`, `origin-left`). Play once at the tail of an indeterminate loop to signal “done” right before the track collapses to a success dot.',
    css: `@theme {
  --animate-calendar-sync-fill: calendar-sync-fill 0.24s ease-in both;
  @keyframes calendar-sync-fill {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
}`,
  },
}

export function getUtility(name: string): CustomUtility | undefined {
  return CUSTOM_UTILITIES[name]
}
