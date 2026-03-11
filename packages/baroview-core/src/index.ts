/**
 * baroview-core – shared logic; no markdown/PDF deps.
 * Set markdown renderer via setMarkdownRenderer() then use exported components.
 */
import './built-in-viewers.js';
export * from './baroview.js';
export { registerViewer, getViewer } from './viewer-registry.js';
export type { ViewerHost, ViewerRenderFn } from './viewer-registry.js';
export { setMarkdownRenderer, getMarkdownRenderer } from './markdown-renderer.js';
export { setPdfRenderer, getPdfRenderer } from './pdf-renderer.js';
