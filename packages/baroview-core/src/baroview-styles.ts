export const STYLES = `
:host {
  display: block;
  min-height: 200px;
  width: 100%;
  box-sizing: border-box;
  --baro-bg: #f0f0f0;
  --baro-color: #333;
  --baro-error-bg: #fee;
  --baro-error-color: #c00;
  --baro-unsupported-bg: #fff8e6;
  --baro-unsupported-color: #8a6d00;
}
#message {
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
  background: var(--baro-bg);
  color: var(--baro-color);
  font-family: system-ui, sans-serif;
  font-size: 14px;
}
#message[hidden] { display: none !important; }
#message.loading { color: #555; }
#message.error { background: var(--baro-error-bg); color: var(--baro-error-color); }
#message.unsupported { background: var(--baro-unsupported-bg); color: var(--baro-unsupported-color); }
#root { min-height: 200px; height: 100%; box-sizing: border-box; }
#viewer {
  width: 100%;
  max-width: 100%;
  min-height: 240px;
  height: 100%;
  min-height: 0;
  box-sizing: border-box;
  display: none;
  overflow: hidden;
}
#viewer.visible { display: block; }
#viewer .img-wrap {
  width: 100%;
  height: 100%;
  min-height: 160px;
  overflow: hidden;
  background: #e8e8e8;
  aspect-ratio: var(--baro-aspect-ratio, auto);
}
#viewer .img-wrap img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: var(--baro-object-fit, contain);
}
#viewer .img-wrap {
  width: 100%;
  overflow: hidden;
  background: #e8e8e8;
}
#viewer .img-wrap img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: var(--baro-object-fit, contain);
}
#viewer img:not(.img-wrap img) {
  max-width: 100%;
  height: auto;
  display: block;
  min-height: 120px;
  background: #e8e8e8;
  object-fit: var(--baro-object-fit, contain);
}
:host([auto-size]) #root { min-height: 0; height: auto; }
:host([auto-size]) #viewer { min-height: 0; height: auto; overflow: visible; }
:host([auto-size]) #viewer .img-wrap { height: auto; min-height: 0; aspect-ratio: auto; }
:host([auto-size]) #viewer .img-wrap img { width: auto; height: auto; max-width: 100%; object-fit: contain; }
:host(.slides-fill) #root { min-height: 0; height: 100%; }
:host(.slides-fill) #viewer { min-height: 0; height: 100%; display: flex; flex-direction: column; }
:host(.slides-fill) #viewer.visible { display: flex; }
:host(.slides-fill) #viewer .img-wrap { min-height: 0; height: 100%; aspect-ratio: auto; flex: 1; }
:host(.slides-fill) #viewer .markdown-body { flex: 1; min-height: 0; height: 100%; overflow: auto; }
:host(.slides-fill) #viewer iframe { flex: 1; min-height: 0; height: 100%; }
#grid.layout-image-gallery baro-view {
  aspect-ratio: 1;
  overflow: hidden;
  min-height: 0;
}
#grid.layout-image-gallery baro-view #viewer,
#grid.layout-image-gallery baro-view #root {
  height: 100%;
  min-height: 0;
}
#viewer video, #viewer audio { max-width: 100%; display: block; }
#viewer iframe {
  width: 100%;
  min-height: 400px;
  border: none;
  display: block;
}
#viewer .markdown-body { padding: 1rem; box-sizing: border-box; overflow: auto; }
.spinner {
  width: 32px; height: 32px;
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: baro-spin 0.8s linear infinite;
  margin-bottom: 0.75rem;
}
@keyframes baro-spin { to { transform: rotate(360deg); } }
.actions { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin-top: 0.75rem; }
.actions a, .actions button {
  min-height: 44px; min-width: 44px;
  padding: 0.5rem 1rem;
  display: inline-flex; align-items: center; justify-content: center;
  font: inherit; cursor: pointer;
  border-radius: 6px;
  text-decoration: none;
  border: 1px solid currentColor;
  background: transparent;
  color: inherit;
}
.actions a:focus, .actions button:focus { outline: 2px solid currentColor; outline-offset: 2px; }
a.open-link { margin-top: 8px; display: inline-block; color: inherit; text-decoration: underline; }
#grid {
  display: grid;
  width: 100%;
  height: 100%;
  min-height: 0;
  gap: 0.5rem;
  box-sizing: border-box;
}
#grid slot, #grid baro-view { min-width: 0; min-height: 120px; }
#grid.resize-horizontal { gap: 0; grid-template-columns: minmax(120px, calc(var(--baro-s1, 33.33) * 1%)) 6px 1fr; }
#grid.resize-horizontal baro-view { min-height: 200px; }
.resize-handle {
  width: 6px;
  min-width: 6px;
  background: #ddd;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
}
.resize-handle:hover, .resize-handle:focus { background: #999; }
.resize-handle::after { content: ''; position: absolute; inset: -4px 0; }
#grid.resize-vertical { gap: 0; grid-template-rows: minmax(80px, calc(var(--baro-s1, 33.33) * 1%)) 6px 1fr; grid-template-columns: 1fr; }
#grid.resize-vertical baro-view { min-width: 0; }
.resize-handle-vertical {
  height: 6px;
  min-height: 6px;
  background: #ddd;
  cursor: row-resize;
  position: relative;
}
.resize-handle-vertical:hover, .resize-handle-vertical:focus { background: #999; }
.resize-handle-vertical::after { content: ''; position: absolute; inset: 0 -4px; }
#grid.layout-image-gallery {
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(160px, auto);
}
#grid.layout-image-gallery baro-view {
  aspect-ratio: 1;
  overflow: hidden;
  min-height: 0;
}
#grid.layout-masonry {
  display: block;
  column-gap: 0.5rem;
  column-fill: balance;
}
#grid.layout-masonry baro-view {
  break-inside: avoid;
  margin-bottom: 0.5rem;
}
#grid.layout-gallery-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 0.5rem;
  scroll-behavior: smooth;
}
#grid.layout-gallery-carousel baro-view {
  flex: 0 0 var(--baro-gallery-visible, 100%);
  min-width: 0;
  scroll-snap-align: start;
}
#grid.layout-gallery-strip {
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}
#grid.layout-gallery-strip .gallery-hero {
  min-height: 0;
  overflow: hidden;
}
#grid.layout-gallery-strip .gallery-hero baro-view {
  height: 100%;
  min-height: 0;
  display: block;
}
#grid.layout-gallery-strip .gallery-strip {
  display: flex;
  overflow-x: auto;
  gap: 0.25rem;
  padding: 0.25rem 0;
  scroll-snap-type: x mandatory;
}
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-cell {
  flex: 0 0 var(--baro-strip-thumb-width, 80px);
  width: var(--baro-strip-thumb-width, 80px);
  height: var(--baro-strip-thumb-height, 60px);
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;
  scroll-snap-align: start;
  cursor: pointer;
  display: block;
}
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-cell.active { outline: 2px solid #396; outline-offset: -1px; }
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-cell baro-view {
  width: 100%;
  height: 100%;
  min-height: 0;
  display: block;
}
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-icon {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--baro-bg);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 4px;
  cursor: pointer;
  padding: 0;
  border: none;
}
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-icon:hover { background: #e0e0e0; }
#grid.layout-gallery-strip .gallery-strip .gallery-thumb-icon svg { width: 28px; height: 28px; fill: currentColor; flex-shrink: 0; }
#grid.layout-gallery-strip.strip-hero-left .gallery-strip .gallery-thumb-cell {
  flex: 0 0 var(--baro-strip-thumb-height, 60px);
  width: var(--baro-strip-thumb-width, 80px);
  height: var(--baro-strip-thumb-height, 60px);
}
#grid.layout-gallery-strip.strip-hero-left {
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
}
#grid.layout-gallery-strip.strip-hero-left .gallery-strip {
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: 100%;
}
#grid.layout-gallery-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
#grid.layout-gallery-list baro-view { min-height: 80px; }
#grid.layout-gallery-bento {
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 120px;
  gap: 0.5rem;
}
#grid.layout-gallery-bento baro-view:nth-child(1) { grid-column: span 2; grid-row: span 2; }
#grid.layout-gallery-billboard {
  padding: 0;
  overflow: hidden;
}
#grid.layout-gallery-billboard .billboard-viewport {
  width: 100%;
  height: 100%;
  min-height: 240px;
  overflow: hidden;
  cursor: grab;
  touch-action: none;
  position: relative;
}
#grid.layout-gallery-billboard .billboard-viewport:active { cursor: grabbing; }
#grid.layout-gallery-billboard .billboard-canvas {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--baro-billboard-canvas-w, 600px);
  height: var(--baro-billboard-canvas-h, 400px);
  transform-origin: 0 0;
  will-change: transform;
}
#grid.layout-gallery-billboard .billboard-item {
  position: absolute;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  overflow: auto;
}
#grid.layout-gallery-billboard .billboard-item--image {
  width: max-content;
  height: max-content;
  max-width: var(--baro-billboard-image-max-w, 360px);
  max-height: var(--baro-billboard-image-max-h, 270px);
}
#grid.layout-gallery-billboard .billboard-item--content {
  width: var(--baro-billboard-content-w, 220px);
  height: var(--baro-billboard-content-h, 280px);
  min-height: 0;
}
#grid.layout-gallery-billboard .billboard-item baro-view {
  min-height: 0;
  display: block;
}
#grid.layout-gallery-billboard .billboard-item--content baro-view {
  width: 100%;
  height: 100%;
}
#grid.layout-gallery-billboard .billboard-item--image baro-view {
  width: max-content;
  height: max-content;
  max-width: 100%;
  max-height: 100%;
}
#grid.layout-gallery-billboard .billboard-toolbar {
  position: absolute;
  bottom: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  z-index: 2;
  padding: 4px;
  background: rgba(255,255,255,0.9);
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
#grid.layout-gallery-billboard .billboard-toolbar button {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
#grid.layout-gallery-billboard .billboard-toolbar button:hover { background: #f0f0f0; }
#grid.layout-gallery-billboard .billboard-toolbar button:focus { outline: 2px solid #396; outline-offset: 1px; }
#grid.layout-gallery-slides {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  min-height: var(--baro-slides-height, 420px);
  height: 100%;
  width: 100%;
}
#grid.layout-gallery-slides .slides-stage-wrap {
  flex: 1;
  position: relative;
  display: flex;
  min-height: 0;
  width: 100%;
}
#grid.layout-gallery-slides .slides-stage {
  flex: 1;
  min-height: var(--baro-slides-height, 420px);
  height: 100%;
  position: relative;
  overflow: hidden;
  width: 100%;
}
#grid.layout-gallery-slides .slides-track {
  display: flex;
  height: 100%;
  min-height: 100%;
  width: 100%;
  transition: transform 0.35s ease-out;
  will-change: transform;
}
#grid.layout-gallery-slides .slides-track { width: calc(100% * var(--baro-slides-count, 1)); }
#grid.layout-gallery-slides .slides-slide {
  flex: 0 0 calc(100% / var(--baro-slides-count, 1));
  width: calc(100% / var(--baro-slides-count, 1));
  height: 100%;
  min-height: 100%;
  position: relative;
}
#grid.layout-gallery-slides .slides-slide baro-view {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 100%;
  display: block;
}
#grid.layout-gallery-slides .slides-slide baro-view[aria-hidden="true"],
#grid.layout-gallery-slides .slides-slide .slides-inline-content[aria-hidden="true"] { visibility: hidden; pointer-events: none; }
/* Edge arrows: icon-sized click area only; hidden until hover */
#grid.layout-gallery-slides .slides-arrow {
  position: absolute;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: rgba(255,255,255,0.7);
  opacity: 0;
  transition: opacity 0.2s, background 0.15s, color 0.15s;
}
#grid.layout-gallery-slides .slides-stage-wrap:hover .slides-arrow,
#grid.layout-gallery-slides .slides-arrow:hover { opacity: 1; }
#grid.layout-gallery-slides .slides-arrow:hover { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.95); }
#grid.layout-gallery-slides.slides-at-start .slides-arrow:first-of-type { visibility: hidden; pointer-events: none; }
#grid.layout-gallery-slides.slides-at-end .slides-arrow:last-of-type { visibility: hidden; pointer-events: none; }
#grid.layout-gallery-slides .slides-arrow svg { width: 24px; height: 24px; display: block; }
#grid.layout-gallery-slides .slides-arrow:first-of-type { left: 12px; top: 50%; transform: translateY(-50%); }
#grid.layout-gallery-slides .slides-arrow:last-of-type { right: 12px; top: 50%; transform: translateY(-50%); }
#grid.layout-gallery-slides .slides-toolbar > button svg { width: 20px; height: 20px; display: block; }
/* Vertical direction: track column, arrows top/bottom */
#grid.layout-gallery-slides.slides-direction-vertical .slides-stage-wrap { flex-direction: column; }
#grid.layout-gallery-slides.slides-direction-vertical .slides-stage { min-height: 0; }
#grid.layout-gallery-slides.slides-direction-vertical .slides-track {
  flex-direction: column;
  width: 100%;
  height: calc(100% * var(--baro-slides-count, 1));
}
#grid.layout-gallery-slides.slides-direction-vertical .slides-slide {
  flex: 0 0 calc(100% / var(--baro-slides-count, 1));
  width: 100%;
  height: calc(100% / var(--baro-slides-count, 1));
  min-height: 0;
}
#grid.layout-gallery-slides.slides-direction-vertical .slides-arrow:first-of-type { left: 50%; top: 12px; right: auto; bottom: auto; transform: translateX(-50%); }
#grid.layout-gallery-slides.slides-direction-vertical .slides-arrow:last-of-type { left: 50%; top: auto; right: auto; bottom: 12px; transform: translateX(-50%); }
#grid.layout-gallery-slides .slides-toolbar {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: var(--baro-slides-toolbar-bg, rgba(0,0,0,0.25));
  transition: opacity 0.2s;
}
#grid.layout-gallery-slides.slides-toolbar-frosted .slides-toolbar {
  background: rgba(0,0,0,0.2);
  backdrop-filter: saturate(1.2) blur(10px);
  -webkit-backdrop-filter: saturate(1.2) blur(10px);
}
#grid.layout-gallery-slides.slides-toolbar-hover .slides-stage-wrap:hover .slides-toolbar,
#grid.layout-gallery-slides.slides-toolbar-hover .slides-toolbar:hover {
  opacity: 1;
}
#grid.layout-gallery-slides.slides-toolbar-hover .slides-toolbar { opacity: 0; }
#grid.layout-gallery-slides.slides-toolbar-hidden .slides-toolbar { display: none; }
#grid.layout-gallery-slides .slides-toolbar > button {
  min-width: 36px;
  min-height: 36px;
  padding: 0 0.5rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  font: inherit;
  transition: background 0.15s, color 0.15s;
}
#grid.layout-gallery-slides .slides-toolbar > button:hover { background: rgba(255,255,255,0.2); color: #fff; }
#grid.layout-gallery-slides .slides-dots {
  display: flex;
  gap: 4px;
  align-items: center;
}
#grid.layout-gallery-slides .slides-dots button {
  width: calc(10px * var(--dot-scale, 1));
  height: calc(10px * var(--dot-scale, 1));
  padding: 0;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.5);
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, transform 0.2s, width 0.2s, height 0.2s;
}
#grid.layout-gallery-slides .slides-dots button:hover { background: rgba(255,255,255,0.3); }
#grid.layout-gallery-slides .slides-dots button.active {
  background: rgba(255,255,255,0.95);
  border-color: rgba(255,255,255,0.95);
}
#grid.layout-gallery-slides .slides-fraction {
  font-variant-numeric: tabular-nums;
  color: rgba(255,255,255,0.95);
  font-size: 0.875rem;
  padding: 0 0.5rem;
}
#grid.layout-gallery-slides .slides-progress-wrap {
  width: 80px;
  height: 4px;
  background: rgba(255,255,255,0.3);
  border-radius: 2px;
  overflow: hidden;
}
#grid.layout-gallery-slides .slides-progress-fill {
  height: 100%;
  background: rgba(255,255,255,0.95);
  border-radius: 2px;
  transition: width 0.2s ease-out;
}
#grid.layout-gallery-slides.slides-transition-fade .slides-slide { opacity: 0; transition: opacity 0.25s ease-out; }
#grid.layout-gallery-slides.slides-transition-fade .slides-slide.slides-active { opacity: 1; }
#grid.layout-gallery-slides.slides-transition-slide .slides-slide { opacity: 0; transform: translateX(8%); transition: opacity 0.25s ease-out, transform 0.25s ease-out; }
#grid.layout-gallery-slides.slides-transition-slide .slides-slide.slides-active { opacity: 1; transform: translateX(0); }
#grid.layout-gallery-slides.slides-direction-vertical.slides-transition-slide .slides-slide { transform: translateY(8%); }
#grid.layout-gallery-slides.slides-direction-vertical.slides-transition-slide .slides-slide.slides-active { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  #grid.layout-gallery-slides.slides-transition-fade .slides-slide,
  #grid.layout-gallery-slides.slides-transition-slide .slides-slide { transition-duration: 0.01s; }
}
#grid.layout-gallery-slides .slides-inline-content {
  position: absolute; inset: 0;
  overflow: auto;
  padding: 1rem;
  box-sizing: border-box;
  white-space: pre-wrap;
  font-family: ui-monospace, monospace;
  font-size: 0.875rem;
}
#grid.layout-gallery-slides .slides-inline-content.slides-code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 6px;
}
#grid.layout-gallery-slides .slides-inline-content.markdown-body {
  white-space: normal;
  font-family: inherit;
  font-size: inherit;
}
`;
