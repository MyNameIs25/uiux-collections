import type { ReactNode } from 'react'
import { CopyButton } from '@/components/copy-button'
import { LivePreview } from '@/components/live-preview'
import { TagPill } from '@/components/tag-pill'
import { Badge } from '@/components/base/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/base/tabs'
import { useCatalogParams } from '@/hooks/use-catalog-params'
import {
  buildPrompt,
  CATEGORIES,
  libraryLabel,
  type Showcase,
} from '@/registry'

const categoryLabel = (id: string) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id

function CodePane({ value, copyLabel }: { value: string; copyLabel: string }) {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton value={value} label={copyLabel} />
      </div>
      <pre className="max-h-[28rem] overflow-auto rounded-lg border bg-muted/40 p-4 text-sm">
        <code className="font-mono">{value}</code>
      </pre>
    </div>
  )
}

// Render inline `code` and *emphasis* inside principle prose.
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const pattern = /`([^`]+)`|\*([^*]+)\*/g
  let last = 0
  let key = 0
  let m: RegExpExecArray | null
  while ((m = pattern.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    if (m[1] != null) {
      nodes.push(
        <code
          key={key++}
          className="rounded bg-background/70 px-1 py-0.5 font-mono text-[0.85em]"
        >
          {m[1]}
        </code>,
      )
    } else if (m[2] != null) {
      nodes.push(<em key={key++}>{m[2]}</em>)
    }
    last = pattern.lastIndex
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

/**
 * The Principle tab: a short prose explanation + a fenced key snippet (see
 * docs/PRINCIPLE-GUIDELINE.md). Renders prose as prose and fenced ```code```
 * blocks as monospace, without pulling in a Markdown dependency.
 */
function PrinciplePane({ value }: { value: string }) {
  const parts: { type: 'prose' | 'code'; text: string }[] = []
  const fence = /```[a-zA-Z]*\n([\s\S]*?)```/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = fence.exec(value))) {
    if (m.index > last)
      parts.push({ type: 'prose', text: value.slice(last, m.index) })
    parts.push({ type: 'code', text: m[1].replace(/\n$/, '') })
    last = fence.lastIndex
  }
  if (last < value.length) parts.push({ type: 'prose', text: value.slice(last) })
  const blocks = parts.filter((p) => p.text.trim())

  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton value={value} label="Copy principle" />
      </div>
      <div className="flex flex-col gap-4 rounded-lg border bg-muted/40 p-4 pr-14 text-sm">
        {blocks.map((p, i) =>
          p.type === 'code' ? (
            <pre
              key={i}
              className="overflow-auto rounded-md border bg-background/60 p-3"
            >
              <code className="font-mono">{p.text}</code>
            </pre>
          ) : (
            <div
              key={i}
              className="flex flex-col gap-2 leading-relaxed text-foreground/90"
            >
              {p.text
                .trim()
                .split(/\n{2,}/)
                .map((para, j) => (
                  <p key={j}>{renderInline(para.trim())}</p>
                ))}
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export function ComponentDetails({ showcase }: { showcase: Showcase }) {
  const {
    name,
    description,
    category,
    tags,
    libraries,
    Component,
    principle,
    source,
    preview,
  } = showcase
  const { toggleTag } = useCatalogParams()
  const prompt = buildPrompt(showcase)

  // Build the tabs available for this showcase (principle is optional).
  const codeTabs: { value: string; label: string; node: ReactNode }[] = []
  if (principle) {
    codeTabs.push({
      value: 'principle',
      label: 'Principle',
      node: <PrinciplePane value={principle} />,
    })
  }
  if (source) {
    codeTabs.push({
      value: 'source',
      label: 'Source',
      node: <CodePane value={source} copyLabel="Copy source" />,
    })
  }
  codeTabs.push({
    value: 'prompt',
    label: 'Agent prompt',
    node: (
      <>
        <p className="mb-2 text-sm text-muted-foreground">
          Copy this and hand it to another agent to reproduce the effect.
        </p>
        <CodePane value={prompt} copyLabel="Copy prompt" />
      </>
    ),
  })

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
          <Badge variant="secondary">{categoryLabel(category)}</Badge>
        </div>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>

      {/* 1. Live preview */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Preview</h2>
        <LivePreview
          variant="details"
          fit={preview === 'fit'}
          Component={Component}
        />
      </section>

      {/* 2 & 3. Metadata: libraries, tags */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Libraries</h2>
          <div className="flex flex-wrap gap-2">
            {libraries?.length ? (
              libraries.map((lib) => (
                <Badge key={lib} variant="outline">
                  {libraryLabel(lib)}
                </Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-muted-foreground">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {tags?.length ? (
              tags.map((tag) => (
                <TagPill key={tag} tag={tag} onClick={() => toggleTag(tag)} />
              ))
            ) : (
              <span className="text-sm text-muted-foreground">—</span>
            )}
          </div>
        </div>
      </section>

      {/* 4. Copyable principle / source / prompt */}
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-muted-foreground">Implementation</h2>
        <Tabs defaultValue={codeTabs[0].value}>
          <TabsList>
            {codeTabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {codeTabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              {t.node}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
