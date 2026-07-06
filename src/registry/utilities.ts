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
