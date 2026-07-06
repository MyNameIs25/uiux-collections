/**
 * The libraries a showcase can depend on. Add new ones here; `LibraryId` keeps
 * showcase metadata honest and drives the badges on the details page.
 */
export const LIBRARIES = {
  react: { label: 'React' },
  tailwind: { label: 'Tailwind CSS' },
  css: { label: 'CSS' },
  gsap: { label: 'GSAP' },
  three: { label: 'three.js' },
  r3f: { label: 'React Three Fiber' },
  drei: { label: 'drei' },
  webgl: { label: 'WebGL' },
  'framer-motion': { label: 'Framer Motion' },
} as const satisfies Record<string, { label: string }>

export type LibraryId = keyof typeof LIBRARIES

export function libraryLabel(id: LibraryId): string {
  return LIBRARIES[id].label
}
