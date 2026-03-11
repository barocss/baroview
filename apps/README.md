# baroview example apps (apps)

Example apps showing how to use baroview in **different environments**.  
All live in the **pnpm workspace** and reference **baroview** (or baroview-core) with `workspace:*`.

---

## App list

| App | Stack | Description |
|-----|-------|-------------|
| **html** | Vanilla HTML, Vite | ESM (`main.js` → baroview) + CDN (`baroview-cdn.js`) samples. Includes **all example pages** (slides, grid, etc.). |
| **react** | React 19, Vite | Uses `<baro-view>` as-is. **Full examples** on one page: Single, Grid, Slides, etc. |
| **vue** | Vue 3, Vite | Uses `<baro-view>`. Vue needs `compilerOptions.isCustomElement` for custom elements. |
| **solid** | Solid, Vite | Uses `<baro-view>`. |
| **svelte** | Svelte 5, Vite | Uses `<baro-view>`. With Svelte 5 + Vite, `resolve.conditions: ['browser']` is recommended. |

---

## Common notes

- **Demo assets**: If each app has `demo.svg`, `demo.md`, `demo.pdf` in `public/`, they are available at `/demo.svg` etc.
- **baroview build**: Run **once** from the root: `pnpm build`. Then the workspace baroview (and core) is built and the apps work.
- **Port**: Each app’s Vite port is printed when you run it (often 5000 and up).

---

## html (Vanilla HTML)

- **Role**: **Main demo app** showing both ESM and CDN usage.
- **Entry points**: `index.html` (ESM), `cdn.html` (single CDN script), `slides-samples.html` (slide example list), `slides-samples-cdn.html` (same examples via CDN).
- **Run**: `pnpm dev:html` (or `pnpm --filter app-html dev`).
- **Build**: Root `pnpm build` copies **baroview-cdn.js** to `apps/html/public/`, so after `pnpm build`, building/previewing app-html also runs the CDN sample.

---

## react

- **Role**: Example of using baroview web components in React.
- **Run**: `pnpm dev:react`.
- **Content**: Single URL, Grid, Image+MD+PDF, 3-column grid, Slides (fraction/progress/deeplink/loop/transition), Slides from Markdown, Inline pre/code, 12 slides (horizontal/vertical), etc., all on one page.

---

## vue

- **Role**: Example of using baroview web components in Vue 3.
- **Setup**: In `vite.config.js`, register `baro-view` and `baro-view-item` in `compilerOptions.isCustomElement` (otherwise "Failed to resolve component" warning).
- **Run**: `pnpm dev:vue`.
- **Content**: Same section layout as the React app.

---

## solid

- **Role**: Example of using baroview web components in Solid.
- **Run**: `pnpm dev:solid`.
- **Content**: Same section layout as the React app.

---

## svelte

- **Role**: Example of using baroview web components in Svelte 5.
- **Setup**: In `vite.config.js`, set `resolve.conditions: ['browser']` (avoids Svelte 5 `mount()` being resolved for the server bundle).
- **Run**: `pnpm dev:svelte`.
- **Content**: Same section layout as the React app.

---

## Script summary (from root)

| Command | App |
|---------|-----|
| `pnpm dev:html` | app-html |
| `pnpm dev:react` | app-react |
| `pnpm dev:vue` | app-vue |
| `pnpm dev:solid` | app-solid |
| `pnpm dev:svelte` | app-svelte |

To build a single app:

```bash
pnpm --filter app-html build
pnpm --filter app-react build
# ...
```
