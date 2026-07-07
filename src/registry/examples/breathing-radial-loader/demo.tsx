// Gradient hub + arc colours (fixed — the card is always cream, so these read
// the same in light and dark; only the surrounding stage follows the theme).
const HUB_FROM = '#7ED8A6'
const HUB_TO = '#3F9F73'
const TRACK = 'rgba(140, 210, 180, 0.4)' // pale mint track ring
const ARC = '#3EAA82' // saturated emerald progress arc

const R = 70 // ring radius inside the 200×200 viewBox
const CIRC = 2 * Math.PI * R // ring circumference
const ARC_FRACTION = 0.28 // the arc covers ~28% of the ring (~100°)

// Each bar shares one `animate-equalize` keyframe; a negative delay phase-shifts
// it so the three heights never line up — an equalizer, not a single block.
const BAR_DELAYS = ['0s', '-0.35s', '-0.7s']

/** Three white, bottom-anchored bars that morph height like a data equalizer. */
function EqualizerIcon() {
  return (
    <div aria-hidden className="flex h-9 items-end gap-[6px]">
      {BAR_DELAYS.map((delay) => (
        <span
          key={delay}
          // `h-1/2` is the resting height the keyframes override while running —
          // and the value that shows if animations are reduced/disabled.
          className="h-1/2 w-[7px] rounded-full bg-white animate-equalize motion-reduce:animate-none"
          style={{ animationDelay: delay }}
        />
      ))}
    </div>
  )
}

/**
 * A "preparing your data" loader: a gradient-green hub with a morphing bar-chart
 * glyph, wrapped by a mint track ring and a spinning emerald progress arc. The
 * whole ring group breathes — swelling and fading on every rotation — while the
 * static hub stays put. Auto-plays on mount; no interaction.
 */
export function BreathingRadialLoader() {
  return (
    <div className="flex min-h-[30rem] w-full items-center justify-center bg-background p-8">
      <div
        className="flex flex-col items-center rounded-[24px] px-14 pt-14 pb-12"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #FFFDF7, #FDF6E3)',
          boxShadow: '0 24px 60px -22px rgba(63, 159, 115, 0.35)',
        }}
      >
        {/* Airy top that balances the caption below, so the ring sits at the
            card's vertical centre — this is also the slice the gallery-card crop
            frames on, and it echoes the open space above the original loader. */}
        <div aria-hidden className="h-24" />

        <div className="relative grid size-44 place-items-center">
          {/* Faint static halo behind everything (decorative). */}
          <div
            aria-hidden
            className="absolute size-40 rounded-full"
            style={{ backgroundColor: 'rgba(63, 159, 115, 0.06)' }}
          />

          {/* Ring group: breathes as one. The SVG inside spins, so only the
              dashed arc appears to move (the full track ring is symmetric). */}
          <div className="absolute inset-0 animate-radial-breathe motion-reduce:animate-none">
            <svg
              viewBox="0 0 200 200"
              className="size-full animate-radial-spin motion-reduce:animate-none"
            >
              <circle cx="100" cy="100" r={R} fill="none" stroke={TRACK} strokeWidth={5} />
              <circle
                cx="100"
                cy="100"
                r={R}
                fill="none"
                stroke={ARC}
                strokeWidth={6}
                strokeLinecap="round"
                strokeDasharray={`${CIRC * ARC_FRACTION} ${CIRC}`}
              />
            </svg>
          </div>

          {/* Center hub — sits above the ring and never scales or spins. */}
          <div
            role="status"
            aria-label="Preparing your plan"
            className="relative grid size-24 place-items-center rounded-full"
            style={{
              backgroundImage: `linear-gradient(135deg, ${HUB_FROM}, ${HUB_TO})`,
              boxShadow: '0 8px 24px rgba(63, 159, 115, 0.35)',
            }}
          >
            <EqualizerIcon />
          </div>
        </div>

        <h2 className="mt-9 text-[1.7rem] font-semibold tracking-tight text-[#1F3A32]">
          Preparing your plan
        </h2>
        <p className="mt-2 max-w-[15rem] text-center text-[0.95rem] leading-relaxed text-[#8A9A93]">
          Analyzing your goals and putting together a plan tailored just for you.
        </p>
      </div>
    </div>
  )
}
