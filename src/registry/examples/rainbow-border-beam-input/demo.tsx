import { ArrowUp, Mic, Plus, SlidersHorizontal } from 'lucide-react'

/*
  A purple→magenta→orange arc (~160° wide, the rest transparent) painted as a
  conic-gradient that reads the animated `--angle`. Sampled along the border it
  looks like a single beam sweeping around the rectangle. The same gradient is
  reused three times: a faint static ring, the crisp beam, and a blurred glow.
*/
const BEAM =
  'conic-gradient(from var(--angle), transparent 0deg, #8b5cf6 30deg, #d946ef 70deg, #fb923c 110deg, transparent 165deg, transparent 360deg)'

export function RainbowBorderBeamInput() {
  return (
    <div className="relative flex min-h-[22rem] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#0a0a0c] p-8">
      {/* Ambient wash so the beam has something to bloom against. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(139,92,246,0.14),transparent_60%)]"
      />

      <div className="relative w-full max-w-xl">
        {/* Glow: a blurred copy of the beam that bleeds outward for the halo.
            It paints before (under) the card, whose opaque centre hides it. */}
        <div
          aria-hidden
          className="animate-border-beam pointer-events-none absolute -inset-2 rounded-[34px] opacity-70 blur-xl motion-reduce:animate-none"
          style={{ background: BEAM }}
        />

        {/* Card: the beam lives in the 2px padding; the opaque inner panel masks
            the centre so only a gradient border shows. A faint white bg-color
            gives a constant hairline ring where the conic arc is transparent. */}
        <div
          className="animate-border-beam relative rounded-[28px] p-[2px] motion-reduce:animate-none"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)', backgroundImage: BEAM }}
        >
          <div className="rounded-[26px] bg-[#1c1c22] px-5 pb-3 pt-4">
            <textarea
              rows={2}
              placeholder="Ask anything"
              className="w-full resize-none bg-transparent text-[15px] leading-relaxed text-zinc-200 outline-none placeholder:text-zinc-500"
            />

            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                aria-label="Add attachment"
                className="grid size-9 place-items-center rounded-full bg-[#2a2a30] text-zinc-300 transition-colors hover:bg-[#34343c]"
              >
                <Plus className="size-[18px]" />
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#2a2a30] px-3 text-sm text-zinc-300 transition-colors hover:bg-[#34343c]"
              >
                <SlidersHorizontal className="size-4" />
                Tools
              </button>

              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Dictate"
                  className="grid size-9 place-items-center rounded-full text-zinc-300 transition-colors hover:bg-white/5"
                >
                  <Mic className="size-[18px]" />
                </button>
                <button
                  type="button"
                  aria-label="Send"
                  className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,#8b5cf6,#7c3aed)] text-white shadow-[0_4px_14px_rgba(124,58,237,0.45)] transition-transform active:scale-95"
                >
                  <ArrowUp className="size-5" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
