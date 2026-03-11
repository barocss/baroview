# Viewer extension: registry pattern

## Current implementation (pre-release)

Viewers are registered and looked up via a **registry**.

- **`viewer-registry.ts`**: `registerViewer(format, fn)`, `getViewer(format)`, types `ViewerRenderFn`, `ViewerHost`.
- **`built-in-viewers.ts`**: Implements image, video, audio, html, markdown, pdf and calls `registerViewer()` on load.
- **`baroview.ts`**: `_renderViewer()` gets the render function with `getViewer(format)` and calls it. Only `office` and `unsupported` are handled as fallback in core.

To add a new viewer: add the format in detect-format, then call `registerViewer('xxx', renderXxx)` once. No need to change `_renderViewer` in core.

---

## Previous approach (reference)

Previously, each format was handled in a **`switch (format)`** inside `_renderViewer()`.

- **Light viewers** (image, video, audio, html): Implemented in core with `case 'image':` etc.
- **Heavy viewers** (markdown, pdf): **Injectable** — baroview/baroview-cdn call `setMarkdownRenderer()` / `setPdfRenderer()`.

Adding a viewer meant:

1. Extend `ViewFormat` and mapping in detect-format.ts.
2. **Light**: add a `case 'xxx':` in `_renderViewer()`.
3. **Heavy**: add `xxx-renderer.ts` with `setXxxRenderer()` / `getXxxRenderer()` and have core call `import('./xxx-renderer.js').then(...)`.

That was fine for adding a few more viewers.

---

## Limitations (as the number of viewers grows)

- The switch in `_renderViewer()` gets long and core must be edited every time.
- Each new format touches detect-format, baroview.ts, baroview-utils.ts (icons), etc.
- Third parties cannot add a format without forking or patching core.

---

## Better approach: viewer registry

Register viewers in a **format → render function** map; core only calls into that map.

### 1) Registry API (baroview-core)

```ts
// viewer-registry.ts
export type ViewerRenderFn = (url: string, container: HTMLElement, options?: ViewerOptions) => void | Promise<void>;

const registry = new Map<ViewFormat, ViewerRenderFn>();

export function registerViewer(format: ViewFormat, fn: ViewerRenderFn): void {
  registry.set(format, fn);
}

export function getViewer(format: ViewFormat): ViewerRenderFn | undefined {
  return registry.get(format);
}
```

### 2) Built-in registration

- **Light** viewers (image, video, audio, html) are registered at init with `registerViewer('image', renderImage)` etc.
- **Markdown and PDF** stay injectable: baroview/baroview-cdn register their renderers on load.

### 3) _renderViewer simplified

```ts
private _renderViewer(url: string, format: ViewFormat) {
  const render = getViewer(format);
  if (render) {
    Promise.resolve(render(url, this._viewerRoot!)).catch(...);
    return;
  }
  // fallback: unsupported
}
```

Benefits:

- **New viewer**: call `registerViewer('docx', renderDocx)` from a new module; no change to core switch.
- **Third party**: one `registerViewer()` call after loading baroview to add a format.
- **baroview-cdn**: dynamically import and register only the formats it needs.

### 4) Format type extension

Either extend `ViewFormat` (e.g. `| 'docx'`) or keep format as a string and support “any registered format”. Detection stays in detect-format; unregistered formats fall through to unsupported.

---

## Summary

With the registry in place:

- **New viewer**: extend `ViewFormat` and detection, then call `registerViewer('format', (url, container, host) => { ... })`.
- **Third party**: `import { registerViewer } from 'baroview-core'` and register a custom render function.
