# Charts — vendored from **Bklit UI**

Everything in this directory is **third-party code from [Bklit UI](https://bklit.com)**
(registry: <https://ui.bklit.com>), an MIT-licensed chart component library built on
the shadcn/ui registry. **It is not hand-written in this repo** — do not treat these
files as our own components or "improve" them by hand; update them through the CLI.

## How it was installed

The `@bklit` registry namespace is registered in [`components.json`](../../../components.json):

```json
"registries": { "@bklit": "https://ui.bklit.com/r/{name}.json" }
```

Each chart was pulled in with the shadcn CLI (source + npm deps copied into the project):

```bash
pnpm dlx shadcn@latest add @bklit/<name>-chart
# e.g. pnpm dlx shadcn@latest add @bklit/ring-chart
```

Underlying deps live in `package.json`: `@visx/*`, `motion`, `@number-flow/react`,
and `d3-*` (used by sankey / pie / scatter / candlestick).

## Theming

Bklit's chart tokens (`--chart-background`, `--chart-foreground`, `--chart-grid`,
`--chart-crosshair`, `--chart-scale-01..05`, …, light + dark) were written by the CLI
into [`src/index.css`](../../index.css). The colourful series palette
(`--chart-1..5`) is this project's existing shadcn theme, left as-is.

## The 16 charts

Roots (some ship a folder of sub-components; `heatmap/` and `sankey/` have an
`index.ts` barrel): `area-chart`, `bar-chart`, `candlestick-chart`,
`composed-chart`, `funnel-chart`, `gauge`, `heatmap-chart`, `line-chart`,
`live-line-chart`, `pie-chart`, `profit-loss-line`, `radar-chart`, `ring-chart`,
`sankey-chart`, `scatter-chart`, `sunburst-chart`.

Live demos of each live under `src/registry/examples/bklit-<slug>/` (the gallery's
**Data Display** category). Every example is namespaced with the `bklit-` prefix
(id + folder) and a "Bklit …" display name so future charts from other libraries
can coexist without collisions.

### Post-vendoring fixups already applied

shadcn remaps bklit's `src/charts/` to `src/components/charts/`, which broke two of
bklit's relative imports (fixed in place): `chart-loading-label.tsx` now imports
`../shimmering-text` (not `../components/…`), and `profit-loss-line.tsx` imports
`@/lib/profit-loss-segments`. Missing `@types/d3-*` were added as devDependencies.
Re-check these after any CLI re-install.

## Updating / re-adding

Re-run `pnpm dlx shadcn@latest add @bklit/<name> --overwrite`. Note the CLI may
re-inject theme vars into `src/index.css` and has been known to emit malformed
`var(----…)` (four-dash) tokens in the `@theme inline` block — check and fix those
after any re-install.

_License: Bklit UI is MIT. See <https://bklit.com>._
