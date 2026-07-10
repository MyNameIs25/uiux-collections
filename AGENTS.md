# AGENTS.md

> This is the **single source of truth** for agent instructions.
> `CLAUDE.md` is a symlink to this file — edit **only** `AGENTS.md` and changes
> propagate automatically.

## Project overview

`uiux-collections` is a **personal, local-only** React SPA used to collect and
showcase cool UI/UX components and effects (hero pages, animations, WebGL, etc.).
Components live here so they can be lifted directly into other projects when
needed.

- **No backend / no database.** Everything is 100% local and client-side.
- Purpose: a reusable gallery of polished, copy-pasteable UI/UX building blocks.

## Tech stack

- **Build:** Vite + React 19 + TypeScript
- **Package manager:** pnpm (always use `pnpm`, never `npm`/`yarn`)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`, config-less — theme in `src/index.css`)
- **UI primitives:** shadcn/ui (new-york style, neutral base) → `pnpm dlx shadcn@latest add <component>`
- **Animation:** GSAP
- **3D / WebGL:** three.js, @react-three/fiber, @react-three/drei
- **Icons:** lucide-react
- **Utilities:** `cn()` in `src/lib/utils.ts` (clsx + tailwind-merge)

## Commands

```bash
pnpm dev       # start the dev server
pnpm build     # type-check (tsc -b) + production build
pnpm preview   # preview the production build
pnpm lint      # run oxlint
```

## Conventions

- Import from `src` with the `@/` alias (e.g. `import { cn } from '@/lib/utils'`).
- shadcn/ui primitives live in **`src/components/base/`** (renamed from the default `ui`; the `ui` alias in `components.json` points here, so `pnpm dlx shadcn@latest add <component>` installs into `base`). Import them as `@/components/base/<name>`.
- Put app-level components (sidebar, gallery, toggles) directly under `src/components/`; collected showcases go under `src/registry/`.
- Style with Tailwind utility classes; use theme tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.) so light/dark modes work automatically.
- Each collected effect/component should be self-contained and easy to copy out.
- Keep everything client-side — do not introduce servers, APIs, or databases.

## Theming (dark mode)

- `ThemeProvider` (`src/components/theme-provider.tsx`) wraps the app in `main.tsx`; it toggles the `.dark` class on `<html>` and persists to `localStorage` (`uiux-theme`). Tailwind v4 dark variant is wired via `@custom-variant dark` in `index.css`.
- `useTheme()` exposes `theme` / `resolvedTheme` / `setTheme` / `toggleTheme`. The global toggle button is `ModeToggle` (`src/components/mode-toggle.tsx`), rendered in the home header. Every component inherits light/dark from this — just use theme tokens.

## State via URL params (no router)

- There is **no router**. Global UI state lives in the URL query string. `useUrlParam(key, default)` (`src/hooks/use-url-param.ts`) reads/writes a param via `history.pushState` and broadcasts a custom event so all instances stay in sync.
- The catalog filter uses `useCatalogParams()` (`src/hooks/use-catalog-params.ts`) → `?category=<id>`, `?tags=`, `?status=`, `?sort=`, `?q=<search>`, and `?page=<n>`. Add new URL-backed state with `useUrlParam`.

## Registry — adding a component

> **Before implementing any example, read [docs/IMPLEMENTATION-GUIDELINE.md](docs/IMPLEMENTATION-GUIDELINE.md)** — the collection's philosophy (simple · understandable · reusable; lean on libraries like GSAP/shadcn to delete code; promote reusable CSS to Tailwind `@utility`s; degrade gracefully; touch-first). **Anything animated must pick its engine off that file's CSS · GSAP · raw-rAF decision ladder** — hand-rolled lerp/`dt` rAF loops where GSAP fits are rejected in review. Then tag per [docs/TAGS-GUIDELINE.md](docs/TAGS-GUIDELINE.md) and write the `principle` per [docs/PRINCIPLE-GUIDELINE.md](docs/PRINCIPLE-GUIDELINE.md).
>
> **When writing or editing anything that feeds a showcase's Agent prompt** — a hand-written `prompt`, the `buildPrompt` generator, or the metadata the prompt is composed from (`description`, `utilities`, and the `demo.tsx` source that ships verbatim) — you **MUST** first read [docs/PROMPT-GUIDELINE.md](docs/PROMPT-GUIDELINE.md).

Categories and the component catalog live in `src/registry/`. Adding a component
is **drop a folder** — no edits to `registry.ts` (it auto-discovers via
`import.meta.glob`):

1. Create `src/registry/examples/<id>/` with two files:
   - **`demo.tsx`** — the component itself, exported (e.g. `export function Foo() {...}`). This single file is both what renders live **and** what the details page shows as **Source** (imported verbatim via Vite `?raw`). Never write the code twice. Multi-file examples: put helpers alongside and import them.
   - **`showcase.ts`** — `export default defineShowcase({...})` with the metadata:
     - `id`, `name`, `category` (a valid `CategoryId`) — required; `id` is usually the folder name.
     - `created`, `status` — required. `created` is an ISO date-**time** string with an offset (`'2026-07-08T14:30:00+09:00'`), stamped when you add the example (drives the home-page **sort by created**). Include the time — same-day additions sort by recency via `Date.parse`; a date-only value sorts as start-of-day and can't be ordered against siblings from the same day. `status` is one of `'done' | 'in-progress' | 'archived'` (`src/registry/statuses.ts`), shown as a coloured dot on the card and drives the **status filter**.
     - `Component` — import it from `./demo`.
     - `preview` — optional; set to `'fit'` for **full-bleed** showcases (heroes, full backgrounds) designed for a whole viewport. On gallery cards the live preview is cropped to a fixed-height window (its vertical middle shows); on the details page it's scaled to fit the width (capped so libraries/tags stay in view). Omit for normal-sized components (buttons, cards, text), which render at native size. Framing + the hover **Expand-to-fullscreen** button live in `LivePreview` (`src/components/live-preview.tsx`); width-scaling is `ScaledPreview` (`src/components/scaled-preview.tsx`).
     - `description`, `tags` — shown on the card/details page; feed search. **Tag using the controlled vocabulary in [docs/TAGS-GUIDELINE.md](docs/TAGS-GUIDELINE.md)** (style / motion / trigger / capability groups + naming rules) — don't invent synonyms.
     - `libraries` — array of `LibraryId` (`src/registry/libraries.ts`, e.g. `['react', 'tailwind', 'gsap']`); rendered as badges.
     - `utilities` — optional array of **custom Tailwind utility / token names** the showcase uses (from `src/styles/`, catalogued in `src/registry/utilities.ts`, e.g. `['liquid-glass', 'animate-liquid-drift']`). Rendered in the details page's **Utilities** section as hover-cards that reveal what each expands to. Omit if it only uses stock Tailwind. When you add a new `@utility`/token in `src/styles/`, add a matching entry to `utilities.ts`.
     - `principle` — optional hand-written **"aha"** of the effect: a short prose explanation + a fenced key snippet (Markdown), shown in the **Principle** tab. **Follow [docs/PRINCIPLE-GUIDELINE.md](docs/PRINCIPLE-GUIDELINE.md)** (explanation ≤ 80 words, name the load-bearing classes/APIs and say *why*; if it relies on a custom utility, name and explain it).
     - `prompt` — optional, shown in the **Agent prompt** tab (the one artifact meant to be copied into *another* agent with no repo access, for a faithful reproduction). **Usually leave it unset** — `buildPrompt` in `prompt.ts` auto-composes a self-contained prompt from the metadata + `principle` (the *why*) + the CSS of every custom utility in `utilities` + the full `demo.tsx` `source` (the ground-truth *what*). Only hand-write `prompt` for the rare cases in **[docs/PROMPT-GUIDELINE.md](docs/PROMPT-GUIDELINE.md)**; either way, follow that guide.
   - Do **not** set `source` — the registry injects it from `demo.tsx?raw`.
2. Sidebar counts, gallery filtering/search, and the details page (Principle / Source / Agent prompt tabs) all update automatically.

To add a **new category**, append an entry to `CATEGORIES` in `src/registry/categories.ts` (id + label + lucide icon). Current categories: buttons, cards, modals, hero, navigation, forms, feedback, data-display, animation, backgrounds, text, 3d.
To add a **new library**, append an entry to `LIBRARIES` in `src/registry/libraries.ts`.

### Custom CSS / reusable utilities

Prefer Tailwind utility classes. When an effect needs custom CSS, express it as a **reusable Tailwind `@utility`** or theme token rather than a per-component `<style>` block, and put it in `src/styles/`, grouped by kind: `theme.css` (design tokens: `--font-*`, `--ease-*`, …), `animations.css` (`--animate-*` + `@keyframes`), `utilities.css` (`@utility`). `index.css` `@import`s these. Then **catalogue each in `src/registry/utilities.ts`** (name + kind + `summary` + the `css` it expands to) so showcases can list it in `utilities` and the details page can explain it. Load web fonts via a `<link>` in `index.html` (a build-time CSS `@import` of an external font is stripped by Vite); keep the `--font-*` token in `theme.css`.

## Navigation & the details page

- No router: the open component is stored in the URL as `?component=<id>`. The card body stays interactive (hover/animations run live); a top-right shadcn icon button on each card sets it. The header **Back** button (and picking a category/tag/search) clears it. `App.tsx` reads it via `useUrlParam` and renders `ComponentDetails` when set, otherwise `TagFilterBar` + `ComponentGallery`.
- The details page (`component-details.tsx`) shows: live preview, `libraries` badges, full description + clickable tags, an optional **Utilities** section (custom Tailwind utilities as shadcn `HoverCard` chips that reveal what each expands to, from `src/registry/utilities.ts`), and a shadcn `Tabs` **Principle / Source / Agent prompt** block, each copyable via `CopyButton` (`copy-button.tsx`).

## Filtering (category + tags + status + search) and sorting

All filter/sort state lives in the URL via `useCatalogParams()` and combines as **category AND tags AND status AND text**, then ordered by `?sort=`:

- `?category=<id>` — single category (sidebar).
- `?tags=a,b` — multiple tags, **intersection** (a component matches only if it has *all* selected tags; adding tags narrows results).
- `?status=a,b` — multiple statuses, **union** (matches any selected). Rendered as chips in the `CatalogToolbar` above the tag bar; empty = any status. `getStatusCounts(category, query, tags)` in `registry.ts` feeds the counts.
- `?q=<text>` — free-text over name/description/tags.
- `?sort=newest|oldest` — order by `created` (default `newest`), via the shadcn `Select` in `CatalogToolbar`; `sortByCreated(list, order)` in `registry.ts`. Status and sort are global (they persist across category switches, unlike tags).
- `?page=<n>` — 1-based gallery page (default `1`, omitted from the URL when 1). The `ComponentGallery` slices the sorted results into pages of `PAGE_SIZE` (6) and renders a shadcn `Pagination` (`components/base/pagination.tsx`) below the grid, hidden when everything fits on one page. **Any change to a filter/sort/search resets `?page=` to 1** (handled in `useCatalogParams` — the old page index no longer maps to the same results). The page links carry a real `href` for middle-click but intercept `onClick` to update the URL via `pushState` (no full navigation).

Tags are rendered as clickable chips (`TagPill`, no leading `#`) in two places: the `TagFilterBar` under the header (scoped to the current category, with per-tag counts, collapsing past 12 behind a `…` expander) and the details page. Clicking a tag toggles it in `?tags=`. Switching category clears tags (they're category-scoped). `getTagCounts(category)` and `filterShowcases(category, query, tags)` live in `registry.ts`.

Tag values follow the controlled vocabulary in [docs/TAGS-GUIDELINE.md](docs/TAGS-GUIDELINE.md) — keep new tags consistent with it so search/filter stays reliable.

## Structure

```
src/
  App.tsx                    # home page: sidebar + header + gallery
  main.tsx                   # React root, wraps app in ThemeProvider
  index.css                  # Tailwind import + shadcn theme tokens (light/dark) + @imports src/styles/*
  styles/                    # custom CSS grouped by kind (imported by index.css)
    theme.css                #   design tokens: --font-*, --ease-*
    animations.css           #   --animate-* + @keyframes
    utilities.css            #   custom @utility (e.g. liquid-glass)
  lib/utils.ts               # cn() helper
  hooks/
    use-url-param.ts         # router-free URL query-param state
    use-catalog-params.ts    # category + tags + status + sort + search + page filter state
    use-mobile.ts            # (shadcn) mobile breakpoint
  components/
    theme-provider.tsx       # dark/light context
    mode-toggle.tsx          # global dark-mode toggle button
    app-sidebar.tsx          # category sidebar (shadcn)
    catalog-toolbar.tsx      # status filter chips + created-date sort (shadcn Select)
    status-dot.tsx           # coloured status dot (done/in-progress/archived)
    tag-filter-bar.tsx       # collapsible tag chips under the header
    tag-pill.tsx             # clickable tag chip (no #), optional count
    component-gallery.tsx    # grid of live previews; top-right icon button opens details
    component-details.tsx    # details page: preview, libraries, metadata, principle/source/prompt
    live-preview.tsx         # preview frame: fit-crop / scale + hover Expand-to-fullscreen overlay
    scaled-preview.tsx       # scales a full-bleed component to fit its frame (used by live-preview)
    copy-button.tsx          # clipboard copy button with feedback
    base/                    # shadcn/ui primitives (generated)
  registry/
    categories.ts            # category catalog (single source of truth)
    libraries.ts             # library catalog (LibraryId + labels)
    statuses.ts              # status catalog (ShowcaseStatus + labels)
    utilities.ts             # custom Tailwind utility catalog (name/kind/summary/css)
    types.ts                 # Showcase type + defineShowcase() helper
    prompt.ts                # buildPrompt(): metadata + principle + utility CSS + full source -> agent prompt
    registry.ts              # glob auto-discovery + ?raw source, filter/sort/counts/lookup
    index.ts                 # re-exports
    examples/<id>/           # one folder per showcase:
      demo.tsx               #   the component (rendered live + shown as Source via ?raw)
      showcase.ts            #   defineShowcase({ metadata, Component, principle? })
components.json              # shadcn/ui config (ui alias → components/base)
```

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **uiux-collections** (4843 symbols, 7146 relationships, 147 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/uiux-collections/context` | Codebase overview, check index freshness |
| `gitnexus://repo/uiux-collections/clusters` | All functional areas |
| `gitnexus://repo/uiux-collections/processes` | All execution flows |
| `gitnexus://repo/uiux-collections/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
