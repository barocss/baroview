# baroview-cdn

**Single ESM script** to use baroview **without a build**.  
One script load registers `<baro-view>` and `<baro-view-item>`; **marked** and **pdf.js** are **dynamically imported** from **esm.sh** at runtime.

---

## When to use this package

- You have plain HTML and no bundler (Vite/Webpack etc.).
- You want to add one script and use the viewer immediately.
- You want to use a CDN-hosted script (unpkg, jsDelivr, etc.).

For projects that use a bundler, **baroview** (ESM package) is recommended.

---

## Usage

### 1. Load the script

From a CDN:

```html
<script type="module" src="https://unpkg.com/baroview-cdn@latest/dist/baroview-cdn.js"></script>
<baro-view url="/document.pdf"></baro-view>
```

Or from local/self-hosted:

```html
<script type="module" src="/path/to/baroview-cdn.js"></script>
<baro-view url="/document.pdf"></baro-view>
```

You **must** load it with `type="module"`.

### 2. How it works

- On script load, **baroview-core** loads; marked and pdf.js are **dynamically imported from esm.sh** when first needed.
- First time you open a markdown URL: loads `https://esm.sh/marked@11` then renders.
- First time you open a PDF URL: loads `https://esm.sh/pdfjs-dist@4` and worker then renders.

Image, video, audio, and HTML work with core only, so no extra network requests.

### 3. Attributes and layout

Same as baroview.  
Single URL (`url`), multiple URLs (`urls`), `layout`, `gallery-style="slides"`, and all attributes from the [baroview README](../baroview/README.md) are supported.

---

## Build (producing the deployable file)

From monorepo root:

```bash
pnpm build
```

Or this package only:

```bash
pnpm --filter baroview-cdn build
```

Output: **`dist/baroview-cdn.js`** (single ESM file).  
Serve this file; marked and pdf.js are loaded from CDN at runtime.

To use the CDN sample in **apps/html**, run root `pnpm build` so **baroview-cdn.js** is copied to `apps/html/public/`. Then start the HTML app dev server and use `/baroview-cdn.js`.

---

## CDN URLs (esm.sh)

- **marked**: `https://esm.sh/marked@11`
- **pdf.js**: `https://esm.sh/pdfjs-dist@4`
- **pdf.js worker**: `https://esm.sh/pdfjs-dist@4/build/pdf.worker.mjs`

For offline or locked-down environments, prefer bundling with **baroview** (ESM package) instead of this script.

---

## Dependencies

- **Runtime**: baroview-core (included in the bundle). marked and pdf.js are dynamically imported after script load.
- **Dev**: Vite, baroview-core (workspace).

---

## Version and publishing

- **unpkg**: `https://unpkg.com/baroview-cdn@<version>/dist/baroview-cdn.js`
- **jsDelivr**: `https://cdn.jsdelivr.net/npm/baroview-cdn@<version>/dist/baroview-cdn.js`

Run `pnpm build` before publishing to generate `dist/`. With `files: ["dist"]`, only dist is published to npm.
