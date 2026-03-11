# baroview-core

Shared **core** for baroview: `<baro-view>` / `<baro-view-item>` components, layout/gallery/slides logic, format detection, and the **viewer registry**.  
**No marked or pdf.js dependency.** Markdown and PDF are provided by injectable renderers from baroview or baroview-cdn.

---

## When to use this package

- You want to **plug in your own markdown/PDF renderer** (different library, server-side render, etc.).
- You want to **reduce bundle size** and register only the viewers you need.
- You want to **add new formats** via `registerViewer()` like a plugin.

In most cases you use **baroview** (ESM) or **baroview-cdn** and do not depend on core directly.

---

## Install

```bash
pnpm add baroview-core
```

npm/yarn:

```bash
npm install baroview-core
```

---

## Usage (after setting injectables)

You must configure markdown and PDF renderers before loading core.

```js
import { setMarkdownRenderer } from 'baroview-core/markdown-renderer';
import { setPdfRenderer } from 'baroview-core/pdf-renderer';

setMarkdownRenderer(async (text) => {
  // Use your preferred markdown engine
  return myMarkdownLib.parse(text);
});

setPdfRenderer(async (url, container) => {
  // Your PDF rendering (e.g. canvas)
});

import 'baroview-core'; // Registers <baro-view>, <baro-view-item>
```

Then use `<baro-view url="...">` in HTML/JS.

---

## Export structure

| Export | Description |
|--------|-------------|
| **`baroview-core`** (main) | Full re-export: components, registry, format detection, types. |
| **`baroview-core/markdown-renderer`** | `setMarkdownRenderer`, `getMarkdownRenderer`. |
| **`baroview-core/pdf-renderer`** | `setPdfRenderer`, `getPdfRenderer`. |

From the main entry:

- **Components**: `BaroViewElement`, `BaroViewItemElement` (usually you only `import 'baroview-core'` to register them).
- **Viewer registry**: `registerViewer`, `getViewer`, `ViewerHost`, `ViewerRenderFn`.
- **Format detection**: `getFormatFromUrl`, `getFormatFromUrlSync`, `formatFromContentType`, `ViewFormat`.
- **Styles**: `STYLES` (string for Shadow DOM).
- **Types**: `BaroViewItemData`, `GalleryStyle`, `LayoutType`, etc.

---

## Viewer registry API

Use the registry to add new formats without changing `_renderViewer` in core.

### Types

```ts
import type { ViewerHost, ViewerRenderFn } from 'baroview-core';
import type { ViewFormat } from 'baroview-core';

// Host: only getAttribute and style (part of baro-view element)
interface ViewerHost {
  getAttribute(name: string): string | null;
  style: CSSStyleDeclaration;
}

// Render function: (url, container, host) => void | Promise<void>
type ViewerRenderFn = (
  url: string,
  container: HTMLElement,
  host: ViewerHost
) => void | Promise<void>;
```

### Register / lookup

```ts
import { registerViewer, getViewer } from 'baroview-core';

// Register once at app init
registerViewer('docx', (url, container, host) => {
  // Render DOCX viewer into container
});

// getViewer is used internally by core; third parties only need to call registerViewer.
```

### Built-in viewers

On load, **built-in-viewers** auto-registers: `image`, `video`, `audio`, `html`, `markdown`, `pdf`.  
`office` and `unsupported` are handled as fallback UI in core, not via the registry.

To add a new format:

1. **detect-format.ts**: Add to `ViewFormat` and to extension/Content-Type mapping.
2. **Register**: Call `registerViewer('newformat', (url, container, host) => { ... })` (in built-in-viewers or in your app).

See [docs/architecture-viewer-extension.md](../../docs/architecture-viewer-extension.md) for the full design.

---

## Injectable renderers

### Markdown

- **setMarkdownRenderer(fn)**: Set `(text: string) => Promise<string>`.  
  If not set, opening a markdown URL yields an error such as "Markdown renderer not set".
- **getMarkdownRenderer()**: Returns the current function or null.

### PDF

- **setPdfRenderer(fn)**: Set `(url: string, container: HTMLElement) => Promise<void>`.  
  If not set, PDF can still open via core’s iframe fallback (baroview/baroview-cdn set it).
- **getPdfRenderer()**: Returns the current function or null.

---

## Build (development)

From monorepo root:

```bash
pnpm --filter baroview-core build
```

Or from `packages/baroview-core`:

```bash
pnpm build
```

Output: `dist/baroview-core.js` (ESM), `dist/baroview-core.umd.cjs`, `dist/markdown-renderer.js`, `dist/pdf-renderer.js`, plus TypeScript declarations.

---

## Dependencies

- **Runtime**: None (marked and pdf.js are not included).
- **Dev**: TypeScript, Vite.
