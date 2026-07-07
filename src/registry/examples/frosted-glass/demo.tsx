import bg from './background.webp'

/**
 * Frosted (iced) glass card. The reusable surface — heavy `backdrop-filter`
 * blur, layered shadows and the warm corner highlight — is the `frosted-glass`
 * @utility in `src/styles/`. This file adds the backdrop photo the frost
 * diffuses and, crucially, the SVG `<filter id="frost">` that generates the
 * physical grain a flat blur can't: `feTurbulence` synthesises fine noise and
 * `feDisplacementMap` jitters it, painted into a separate absolute layer so the
 * text on top stays razor sharp.
 */
export function FrostedGlassCard() {
  return (
    <div className="relative isolate flex min-h-[28rem] w-full items-center justify-center overflow-hidden bg-black">
      {/* Backdrop photo — the scene the frosted glass diffuses */}
      <img
        aria-hidden
        src={bg}
        alt=""
        className="pointer-events-none absolute inset-0 -z-10 size-full object-cover"
      />

      {/*
        Frost grain filter. feDisplacementMap is given no `in`, so it defaults to
        the previous result (`mono`, the desaturated noise) — it displaces the
        noise by itself, synthesising a speckled grain from nothing but math. The
        empty <span> it renders into becomes the frost overlay.
      */}
      <svg aria-hidden className="pointer-events-none absolute size-0">
        <filter id="frost">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            seed="3"
            result="noise"
          />
          <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
          <feDisplacementMap
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="frosted-glass flex flex-col overflow-hidden px-[1.5em] py-[1.5em]">
        {/* Frost speckle — filtered separately so it never touches the text. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-60 [filter:url(#frost)]"
        />
        <div className="relative z-10 text-[2rem] font-thin uppercase leading-[1.66] tracking-[0.2em] text-white [text-shadow:0_0_1.5em_#000]">
          Frosted Glass
        </div>
      </div>
    </div>
  )
}
