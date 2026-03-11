# baroview

Main ESM package for **URL-based document viewing**.  
It **statically imports** `marked` and `pdfjs-dist`, configures markdown and PDF renderers, then loads **baroview-core**.  
A single import registers `<baro-view>` and `<baro-view-item>` so you can use them immediately.

---

## Install

```bash
pnpm add baroview
```

npm/yarn:

```bash
npm install baroview
```

**Peer / bundled**: marked and pdfjs-dist are in dependencies, so they are installed and bundled with baroview.  
(baroview-core is linked from the workspace or installed at publish time.)

---

## Usage

### In HTML (script only)

```html
<script type="module" src="/node_modules/baroview/dist/baroview.js"></script>
<baro-view url="https://example.com/doc.pdf"></baro-view>
```

### JS/TS (with bundler)

```js
import 'baroview';

document.body.appendChild(
  Object.assign(document.createElement('baro-view'), { url: '/image.png' })
);
```

### React / Vue / Solid / Svelte

Use `<baro-view>` as a component.  
(Vue: register `baro-view`, `baro-view-item` in `compilerOptions.isCustomElement`.  
Svelte 5: you may need Vite `resolve.conditions: ['browser']`.)

```jsx
import 'baroview';

<baro-view url="/demo.pdf" />
<baro-view urls="/a.svg /b.md" layout="grid" columns="2" />
```

---

## Supported formats

| Format | Extensions | Viewer |
|--------|------------|--------|
| Image | jpg, png, gif, webp, svg | `<img>` |
| Video | mp4, webm, ogv | `<video>` |
| Audio | mp3, wav, ogg, weba, m4a | `<audio>` |
| PDF | pdf | pdf.js (canvas) |
| HTML | html, htm | `<iframe>` |
| Markdown | md, markdown | marked → HTML |
| Office | docx, xlsx, pptx | Unsupported (message + link) |

---

## Attributes (baro-view)

### Basic

| Attribute | Description |
|-----------|-------------|
| **url** | Single resource URL (required for single mode). |
| **urls** | Multiple URLs, space or comma separated. Use with `layout`. |
| **layout** | `row` \| `column` \| `columns` \| `grid` \| `sidebar` \| `gallery` \| `image-gallery` \| `masonry`. Default `grid`. |
| **columns** | Grid column count (e.g. `2`, `3`). |
| **rows** | Grid row count (e.g. `2`). |
| **ratios** | Ratios, space or comma separated (e.g. `1 2 1` → 1fr 2fr 1fr). Used with row/column/sidebar. |
| **resizable** | If present, splitter is draggable when there are 2+ URLs. |
| **fit** | For images: `cover` \| `contain` \| `fill` \| `none`. Default `contain`. |
| **aspect-ratio** | Image wrapper ratio (e.g. `1`, `16/9`, `auto`). |
| **sandbox** | If set, sandbox is applied to iframe (HTML/PDF). |

### Gallery (layout="gallery")

| Attribute | Description |
|-----------|-------------|
| **gallery-style** | `uniform` \| `masonry` \| `carousel` \| `strip` \| `list` \| `bento` \| `billboard` \| `slides`. Default `uniform`. |
| **gallery-visible** | For carousel: ratio of visible items (e.g. `2` → 50% width). |
| **strip-hero** | For strip: `top` (hero on top) \| `left` (hero on left). |
| **strip-thumb-size** | Strip thumbnail size. `width height` (px) or single `width` (keeps ratio). Default `80 60`. |
| **billboard-arrange** | Billboard: `circle` \| `random`. |
| **billboard-radius** | Billboard circle radius (px). Default `120`. |
| **billboard-canvas** | Billboard canvas size. `"width height"` (px). Default `600 400`. |
| **billboard-content-size** | Billboard non-image card default size. `"width height"`. Default `220 280`. |
| **billboard-image-max** | Billboard image max size. `"width height"`. Default `360 270`. |

### Slides (gallery-style="slides")

| Attribute | Description |
|-----------|-------------|
| **slides-height** | Stage min height (px). e.g. `480`. Default `420`. |
| **slides-pagination** | `dots` \| `fraction` \| `progress`. |
| **slides-toolbar** | `visible` \| `hover` \| `hidden`. Default `visible`. |
| **slides-toolbar-style** | `solid` \| `frosted`. Default `frosted`. |
| **slides-arrows** | `edges` \| `none`. Default `edges`. |
| **slides-autoplay** | Autoplay interval (seconds). `0` or omit to disable. |
| **slides-fullscreen** | If set, fullscreen button is shown. |
| **slides-direction** | `horizontal` \| `vertical`. Default `horizontal`. |
| **slides-deep-link** | If set, sync with URL hash `#slide=N`. |
| **slides-loop** | If set, wrap last→first and first→last. |
| **slides-transition** | `fade` \| `slide`. |
| **slides-from-markdown** | Markdown URL; split by H1 and show each section as a slide. |

### Child: baro-view-item

You can pass items as children instead of `urls`.

```html
<baro-view layout="gallery" gallery-style="slides">
  <baro-view-item url="/slide1.pdf" title="Intro" />
  <baro-view-item url="/slide2.svg" title="Chart" />
  <baro-view-item>
    <pre>Inline text slide</pre>
  </baro-view-item>
</baro-view>
```

- **url**: URL for that item.
- **title**: Tooltip / accessibility.

---

## Theme (CSS variables)

Set on the host (baro-view) or an ancestor:

- `--baro-bg`: Message area background.
- `--baro-color`: Message text color.
- `--baro-error-bg`, `--baro-error-color`: Error area.
- `--baro-unsupported-bg`, `--baro-unsupported-color`: Unsupported format area.

---

## CORS

Cross-origin URLs require CORS on the server. On failure, an error message and an "Open in new tab" link are shown.

---

## Build (development)

From monorepo root:

```bash
pnpm build
```

Or baroview only:

```bash
pnpm --filter baroview build
```

Output: `dist/baroview.js` (ESM), `dist/baroview.umd.cjs`.  
baroview-core is built and included as a dependency.
