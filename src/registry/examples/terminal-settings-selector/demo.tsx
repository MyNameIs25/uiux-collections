import { MousePointer2, Pointer } from 'lucide-react'
import type { ReactNode } from 'react'

/**
 * Terminal-aesthetic settings selector. Two single-choice groups (Theme /
 * Cursor) whose options are tiny iconified UI mockups instead of swatches. Pure
 * CSS + native radios — no JS: each option is a <label> wrapping a `sr-only`
 * radio, and `group-has-[:checked]` drives the selected styling (orange border,
 * white label, orange pill) so nested bits react too. Radios keep it keyboard-
 * accessible (arrow keys move within a group).
 */

interface Palette {
  window: string
  line: string
  dot: string
  dotLit: string
  panel: string
  panelLine: string
  square: string
}

const DARK: Palette = {
  window: '#242424',
  line: '#464646',
  dot: '#4a4a4a',
  dotLit: '#EA5B3C',
  panel: '#333333',
  panelLine: '#525252',
  square: '#484848',
}
const LIGHT: Palette = {
  window: '#e7e7e7',
  line: '#c6c6c6',
  dot: '#c6c6c6',
  dotLit: '#EA5B3C',
  panel: '#f8f8f8',
  panelLine: '#d2d2d2',
  square: '#dcdcdc',
}

/** The little browser-window thumbnail: sidebar (dots + lines + avatar) and an
 *  elevated content panel with a header line and three cards. */
function Window({ p }: { p: Palette }) {
  return (
    <div className="relative size-full overflow-hidden rounded-[9px]" style={{ background: p.window }}>
      {/* traffic lights */}
      <div className="absolute top-[9%] left-[6%] flex gap-[3px]">
        <span className="size-[5px] rounded-full" style={{ background: p.dotLit }} />
        <span className="size-[5px] rounded-full" style={{ background: p.dot }} />
        <span className="size-[5px] rounded-full" style={{ background: p.dot }} />
      </div>
      {/* sidebar nav lines */}
      <div className="absolute top-[24%] left-[6%] flex flex-col gap-[5px]">
        <span className="h-[4px] w-[42px] rounded-full" style={{ background: p.line }} />
        <span className="h-[4px] w-[28px] rounded-full" style={{ background: p.line }} />
      </div>
      {/* sidebar footer: avatar + line */}
      <div className="absolute bottom-[9%] left-[6%] flex items-center gap-[4px]">
        <span className="size-[10px] rounded-full" style={{ background: p.line }} />
        <span className="h-[4px] w-[20px] rounded-full" style={{ background: p.line }} />
      </div>
      {/* elevated content panel */}
      <div
        className="absolute top-[16%] right-[5%] bottom-[8%] left-[42%] rounded-[7px] p-[8px] shadow-[0_6px_14px_-4px_rgba(0,0,0,0.5)]"
        style={{ background: p.panel }}
      >
        <span className="block h-[5px] w-[36px] rounded-full" style={{ background: p.panelLine }} />
        <div className="mt-[10px] flex gap-[5px]">
          <span className="h-[26px] flex-1 rounded-[4px]" style={{ background: p.square }} />
          <span className="h-[26px] flex-1 rounded-[4px]" style={{ background: p.square }} />
          <span className="h-[26px] flex-1 rounded-[4px]" style={{ background: p.square }} />
        </div>
      </div>
    </div>
  )
}

const THEMES = [
  { value: 'dark', label: 'Dark', mockup: <Window p={DARK} />, defaultChecked: true },
  { value: 'light', label: 'Light', mockup: <Window p={LIGHT} /> },
  {
    value: 'system',
    label: 'System',
    // System = the same window, dark on the left half, light clipped onto the right.
    mockup: (
      <div className="relative size-full">
        <Window p={DARK} />
        <div className="absolute inset-0 [clip-path:inset(0_0_0_50%)]">
          <Window p={LIGHT} />
        </div>
      </div>
    ),
  },
]

const CURSORS = [
  { value: 'default', label: 'Default', Icon: MousePointer2, defaultChecked: true },
  { value: 'pointer', label: 'Pointer', Icon: Pointer },
]

const cardBase =
  'rounded-[16px] border-2 border-transparent bg-[#0a0a0a] transition-colors ' +
  'group-hover:border-white/10 group-has-[:focus-visible]:ring-2 group-has-[:focus-visible]:ring-white/40 ' +
  'group-has-[:checked]:border-[#EA5B3C]'
const labelText = 'text-[15px] text-[#7d7d7d] transition-colors group-has-[:checked]:text-white'

function Section({ title, desc, children }: { title: string; desc: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-[28px] leading-none font-bold text-white">{title}</h3>
      <p className="mt-3 text-[15px] text-[#8a8a8a]">{desc}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

export function TerminalSettingsSelector() {
  return (
    <div className="w-full bg-[#1c1c1c] p-8 font-mono sm:p-12">
      <div className="mx-auto flex max-w-[600px] flex-col gap-12">
        <Section title="Theme" desc="Select your interface color scheme.">
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-5">
            {THEMES.map((t) => (
              <label key={t.value} className="group flex cursor-pointer flex-col items-center gap-3">
                <input
                  type="radio"
                  name="theme"
                  value={t.value}
                  defaultChecked={t.defaultChecked}
                  className="peer sr-only"
                />
                <div className={`aspect-[4/3] w-full p-[10px] ${cardBase}`}>{t.mockup}</div>
                <span className={labelText}>{t.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section title="Cursor" desc="Select the hover cursor style on interactive elements.">
          <div role="radiogroup" aria-label="Cursor" className="grid grid-cols-2 gap-5">
            {CURSORS.map(({ value, label, Icon, defaultChecked }) => (
              <label key={value} className="group flex cursor-pointer flex-col items-center gap-3">
                <input
                  type="radio"
                  name="cursor"
                  value={value}
                  defaultChecked={defaultChecked}
                  className="peer sr-only"
                />
                <div className={`grid aspect-[16/10] w-full place-items-center ${cardBase}`}>
                  <div className="relative">
                    <div className="flex h-9 w-[72px] items-center justify-center rounded-[12px] bg-[#3a3a3a] transition-colors group-has-[:checked]:bg-[#EA5B3C]">
                      <span className="h-[6px] w-7 rounded-full bg-white/90" />
                    </div>
                    <Icon
                      className="absolute -right-1 -bottom-2 size-5 fill-white text-[#1c1c1c] drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <span className={labelText}>{label}</span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
