# baroview

**URL-based document viewer web component.** Pass one or more URLs; it detects the format and renders with the appropriate viewer (image, video, PDF, markdown, etc.). Use the same `<baro-view>` in **React, Vue, Solid, Svelte, or vanilla HTML** — no framework-specific packages required.

---

## Project scope and goals

- **Single entry point**: One component `<baro-view>` handles multiple formats; you only pass URLs.
- **Framework-agnostic**: Web Components work the same in React, Vue, Svelte, Solid, and vanilla HTML.
- **Bundle flexibility**: Use the ESM package (baroview) in your bundle, or the single CDN script (baroview-cdn) with no build step.
- **Extensible**: Viewer registry (`registerViewer`) lets you add new formats without changing core.

---

## Tech stack

| Area | Technology |
|------|------------|
| Runtime | Web Components (Custom Elements), Shadow DOM |
| Language | TypeScript |
| Build | Vite 6 |
| Monorepo | pnpm workspaces |
| Markdown | marked (injectable; baroview uses static import, baroview-cdn loads from esm.sh) |
| PDF | pdf.js (injectable; baroview uses static import, baroview-cdn loads from esm.sh) |

---

## Repository structure

```
baroview/
├── package.json              # Workspace root
├── pnpm-workspace.yaml
├── README.md                 # This file
├── docs/                     # Design and architecture
│   └── architecture-viewer-extension.md
├── packages/
│   ├── baroview-core/        # Shared logic, viewer registry; no marked/pdf
│   ├── baroview/             # Main ESM package (marked, pdfjs-dist static import)
│   └── baroview-cdn/         # Single script; marked and pdf.js loaded from CDN
└── apps/
    ├── html/                 # Vanilla HTML (ESM + CDN samples)
    ├── react/
    ├── vue/
    ├── solid/
    └── svelte/
```

- **packages/**  
  - [baroview-core](./packages/baroview-core/README.md): Components, layout, viewer registry.  
  - [baroview](./packages/baroview/README.md): Main package; wires marked + pdf.js then loads core.  
  - [baroview-cdn](./packages/baroview-cdn/README.md): Single `<script type="module">`; depends on CDN for marked/pdf.js.
- **apps/**  
  - [apps/README.md](./apps/README.md): Example apps per framework.

---

## Package summary

| Package | Purpose | Install | When to use |
|---------|---------|--------|-------------|
| **baroview** | Main ESM library | `pnpm add baroview` | With Vite/Webpack etc.; marked and pdf.js are bundled. |
| **baroview-core** | Shared logic only (no marked/pdf) | `pnpm add baroview-core` | When you want to plug in your own markdown/PDF renderer. |
| **baroview-cdn** | Single script (CDN) | Copy `dist/baroview-cdn.js` or use unpkg | When using HTML with `<script type="module" src="...">` and no build. |

---

## Quick start

### ESM (with bundler)

```bash
pnpm add baroview
```

```html
<script type="module" src="/node_modules/baroview/dist/baroview.js"></script>
<baro-view url="https://example.com/doc.pdf"></baro-view>
```

Or in JS/TS:

```js
import 'baroview'; // Registers <baro-view>, <baro-view-item>
// Then add <baro-view url="..."> to the DOM
```

### CDN (no build)

Load the published script:

```html
<script type="module" src="https://unpkg.com/baroview-cdn@latest/dist/baroview-cdn.js"></script>
<baro-view url="/demo.pdf"></baro-view>
```

For local development, run `pnpm build` and serve `apps/html/public/baroview-cdn.js`.

### Try it from this repo

```bash
git clone <this-repo>
cd baroview
pnpm install
pnpm build
pnpm dev:html    # open the URL shown (e.g. http://localhost:5173)
```

Then open the HTML app and use the ESM or CDN sample pages. For React, Vue, Solid, or Svelte, run `pnpm dev:react`, `pnpm dev:vue`, `pnpm dev:solid`, or `pnpm dev:svelte` and see the example app.

---

## Usage in React, Vue, Solid, Svelte

baroview is a **Web Component**, so you use the same `<baro-view>` and `<baro-view-item>` in any framework. No framework-specific packages are published — the component works as a custom element in all of them.

| Framework | Usage | One-time setup |
|-----------|--------|----------------|
| **React** | `<baro-view url={url} />` | Import `'baroview'` once (e.g. in root). Use the element as a DOM tag. See [apps/react](./apps/react). |
| **Vue 3** | `<baro-view :url="url" />` | In Vite: `compilerOptions.isCustomElement: ['baro-view', 'baro-view-item']`. See [apps/vue](./apps/vue). |
| **Solid** | `<baro-view url={url} />` | Import `'baroview'` once. Use as DOM tag. See [apps/solid](./apps/solid). |
| **Svelte 5** | `<baro-view url={url} />` | In Vite: `resolve.conditions: ['browser']`. See [apps/svelte](./apps/svelte). |

Full runnable examples: [apps/README.md](./apps/README.md). Each app (`pnpm dev:react`, etc.) shows single URL, grid, gallery, slides, and framework-specific config.

---

## Why no separate React/Vue/Solid/Svelte packages?

We intentionally ship **one** component (and the core/CDN variants), not `@baroview/react`, `@baroview/vue`, etc. Reasons:

- **Web Components are the abstraction.** `<baro-view>` is a custom element that works in every framework; wrapping it in framework components would duplicate API surface and versioning for little gain.
- **Lower maintenance.** One implementation, one set of docs and attributes; framework apps in `apps/` show the small amount of config each framework needs (custom elements, Vite options).
- **Wrappers only if needed later.** If we see real pain (e.g. typed props, framework-specific slots), we can add optional wrapper packages then. For “pass URLs and options as attributes,” the raw element is enough.

So: use **baroview** (or baroview-cdn) and the `<baro-view>` element in your React/Vue/Solid/Svelte app; refer to the [example apps](./apps/README.md) for setup. If you hit framework warnings (e.g. Vue “Failed to resolve component”, Svelte resolving the wrong bundle), use the one-time setup in the table above or see [apps/README.md](./apps/README.md).

---

## Supported formats (first wave)

| Format | Extension / Content-Type | Viewer |
|--------|--------------------------|--------|
| Image | jpg, png, gif, webp, svg / `image/*` | `<img>` |
| Video | mp4, webm, ogv / `video/*` | `<video>` |
| Audio | mp3, wav, ogg, weba, m4a / `audio/*` | `<audio>` |
| PDF | pdf / `application/pdf` | pdf.js canvas (or iframe if not set) |
| HTML | html, htm / `text/html` | `<iframe>` |
| Markdown | md, markdown / `text/markdown` | Rendered HTML via marked |
| Office | docx, xlsx, pptx | Unsupported (message + new-tab link) |

Detection order: **extension first**, then **HEAD request** for `Content-Type` when the URL has no or unknown extension.

### Cross-origin (CORS)

URLs that are not same-origin require the server to allow your origin (CORS). If the server does not send the right headers, the viewer will show an error and an “Open in new tab” link. Same-origin URLs and CORS-enabled CDNs work without extra setup.

---

## Main attributes (baro-view)

- **`url`**: Single resource URL (same-origin or CORS-enabled recommended).
- **`urls`**: Multiple URLs (space or comma separated). Rendered in grid, gallery, or slides.
- **`layout`**: `row` | `column` | `columns` | `grid` | `sidebar` | `gallery` | `image-gallery` | `masonry`. Default `grid`.
- **`gallery-style`**: When `layout="gallery"`: `uniform` | `masonry` | `carousel` | `strip` | `list` | `bento` | `billboard` | `slides`. Default `uniform`.
- **`columns`**, **`rows`**: Grid column/row counts.
- **`fit`**: For image viewer: `cover` | `contain` | `fill` | `none`. Default `contain`.
- **`sandbox`**: When set, iframe (HTML/PDF) viewers get a sandbox attribute.

### Slides only (gallery-style="slides")

- **`slides-height`**: Stage min-height in px (e.g. `480`).
- **`slides-pagination`**: `dots` | `fraction` | `progress`.
- **`slides-deep-link`**: Sync with URL hash `#slide=N`.
- **`slides-loop`**: Wrap from last to first and first to last.
- **`slides-transition`**: `fade` | `slide`.
- **`slides-from-markdown`**: Single markdown URL; split by H1 and show each section as a slide.
- **`slides-fullscreen`**: Show fullscreen button.
- **`slides-toolbar`**: `visible` | `hover` | `hidden`.
- **`slides-direction`**: `horizontal` | `vertical`.

### Child elements

- **`<baro-view-item>`**: Define items as children instead of `urls`. Attributes: `url`, `title`. Inline content (e.g. `<pre>`) is supported.

Theme CSS variables: `--baro-bg`, `--baro-color`, `--baro-error-bg`, `--baro-error-color`, `--baro-unsupported-bg`, `--baro-unsupported-color`.

For the full attribute list and gallery/strip/billboard options, see [packages/baroview/README.md](./packages/baroview/README.md).

---

## Build and development

### Requirements

- **Node.js** 20+
- **pnpm** 9.x  
- **Browsers**: Modern evergreen (Chrome, Firefox, Safari, Edge). Custom Elements and Shadow DOM are required.

### Install and build

```bash
pnpm install
pnpm build
```

`pnpm build` builds baroview-core → baroview → baroview-cdn and copies `baroview-cdn.js` into `apps/html/public/`.

### Dev scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev for baroview package (in-package demo) |
| `pnpm dev:html` | Vanilla HTML app (port auto) |
| `pnpm dev:react` | React example app |
| `pnpm dev:vue` | Vue example app |
| `pnpm dev:solid` | Solid example app |
| `pnpm dev:svelte` | Svelte example app |

Run `pnpm build` once before starting apps so they use the built baroview. The HTML app serves `demo.svg`, `demo.md`, `demo.pdf` from `public/` and uses `public/baroview-cdn.js` for CDN samples after build.

---

## Documentation

- [Viewer extension (registry)](./docs/architecture-viewer-extension.md): How to add viewers with `registerViewer`.
- [packages/baroview-core/README.md](./packages/baroview-core/README.md): API, injectable renderers, subpath exports.
- [packages/baroview/README.md](./packages/baroview/README.md): Installation, usage, attribute reference.
- [packages/baroview-cdn/README.md](./packages/baroview-cdn/README.md): CDN usage and deployment.
- [apps/README.md](./apps/README.md): Example apps and how to run them.

---

## License

(Add LICENSE file and reference here if applicable.)
