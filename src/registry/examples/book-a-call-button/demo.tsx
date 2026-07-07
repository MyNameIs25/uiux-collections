import { ArrowRight } from 'lucide-react'

export function BookACallButton() {
  return (
    <div className="flex min-h-[13rem] w-full items-center justify-center gap-3 rounded-3xl bg-[#f4f4f5] p-10">
      {/* The effect: a dark CTA that widens on hover as an arrow fades in. */}
      <button
        type="button"
        className="group inline-flex items-center rounded-full bg-[linear-gradient(180deg,#3a3a3a_0%,#111111_55%,#000000_100%)] px-6 py-3.5 text-base font-semibold text-white shadow-[0_6px_16px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] transition-transform active:scale-[0.98]"
      >
        Book a call
        {/*
          width:auto can't be transitioned, so the reveal animates between two
          fixed lengths: 0 → 26px (8px gap + 18px icon). overflow-hidden clips
          the arrow while collapsed; opacity fades in on the same 200ms curve so
          the width change and the icon arrive together.
        */}
        <span className="flex w-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-200 ease-out group-hover:w-[26px] group-hover:opacity-100">
          <ArrowRight className="ml-2 size-[18px] shrink-0" strokeWidth={2.25} />
        </span>
      </button>
    </div>
  )
}
