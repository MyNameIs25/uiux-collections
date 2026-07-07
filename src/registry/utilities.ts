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
}

export function getUtility(name: string): CustomUtility | undefined {
  return CUSTOM_UTILITIES[name]
}
