import bg from './background.webp'

/**
 * Liquid glass button. The reusable surface + tokens live in `src/styles/`
 * (`liquid-glass` @utility, `font-orbitron`, `animate-liquid-drift`); this file
 * only supplies layout, the drifting photo, and the SVG <filter id="liquid-glass">
 * the surface refracts through.
 */
export function LiquidGlassButton() {
  return (
    <div className="relative isolate flex min-h-[28rem] w-full items-center justify-center overflow-hidden">
      {/* Drifting photo — the scene the glass refracts */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 animate-liquid-drift bg-[#0a0f08] bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      />

      {/* Displacement filter: procedural noise bends the backdrop like water */}
      <svg aria-hidden className="pointer-events-none absolute size-0">
        <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.01"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="1.2" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="64"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.5" />
        </filter>
      </svg>

      <button
        type="button"
        className="liquid-glass flex h-[180px] w-[350px] max-w-[86%] items-center justify-center rounded-full hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white/70"
      >
        <span className="font-orbitron text-4xl font-semibold uppercase tracking-[0.14em] text-white [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
          Explore
        </span>
      </button>
    </div>
  )
}
