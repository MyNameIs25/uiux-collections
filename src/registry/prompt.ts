import { CATEGORIES } from './categories'
import { libraryLabel } from './libraries'
import type { Showcase } from './types'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

/**
 * Compose a self-contained prompt that another coding agent can use to
 * reproduce a showcase. Uses the showcase's own `prompt` if provided, otherwise
 * generates one from its metadata and key code.
 */
export function buildPrompt(showcase: Showcase): string {
  if (showcase.prompt) return showcase.prompt

  const libs = (showcase.libraries ?? []).map(libraryLabel)
  const lines: string[] = [
    `Recreate this UI component as a self-contained React + TypeScript component.`,
    ``,
    `Name: ${showcase.name}`,
    `Category: ${categoryLabel(showcase.category)}`,
  ]
  if (showcase.description) lines.push(`Description: ${showcase.description}`)
  if (libs.length) lines.push(`Libraries to use: ${libs.join(', ')}`)
  if (showcase.tags?.length) lines.push(`Tags: ${showcase.tags.join(', ')}`)

  lines.push(
    ``,
    `Requirements:`,
    `- Match the visual result and any interaction/animation described.`,
    `- Use only the libraries listed above.`,
    `- Keep it self-contained and themeable (support light/dark via Tailwind tokens).`,
  )

  const reference = showcase.principle ?? showcase.source
  if (reference) {
    lines.push(
      ``,
      `Reference implementation:`,
      '```tsx',
      reference.trim(),
      '```',
    )
  }

  return lines.join('\n')
}
