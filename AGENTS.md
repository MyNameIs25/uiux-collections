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
- Put reusable showcase components under `src/components/`; shadcn primitives land in `src/components/ui/`.
- Style with Tailwind utility classes; use theme tokens (`bg-background`, `text-foreground`, etc.) so light/dark modes work.
- Each collected effect/component should be self-contained and easy to copy out.
- Keep everything client-side — do not introduce servers, APIs, or databases.

## Structure

```
src/
  App.tsx         # entry view (currently just the home page)
  main.tsx        # React root
  index.css       # Tailwind import + shadcn theme tokens (light/dark)
  lib/utils.ts    # cn() helper
  components/      # collected UI/UX components (create as needed)
    ui/            # shadcn/ui primitives (generated)
components.json    # shadcn/ui config
```
