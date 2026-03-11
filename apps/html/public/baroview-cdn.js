let ye = null;
function Ee(o) {
  ye = o;
}
function Pe() {
  return ye;
}
async function Ne(o) {
  if (!ye)
    throw new Error(
      'Markdown renderer not set. Install "marked" and use the baroview package, or use baroview-cdn for CDN mode.'
    );
  return ye(o);
}
const _e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getMarkdownRenderer: Pe,
  renderMarkdown: Ne,
  setMarkdownRenderer: Ee
}, Symbol.toStringTag, { value: "Module" }));
let ve = null;
function Me(o) {
  ve = o;
}
function $e() {
  return ve;
}
async function Ie(o, e) {
  if (!ve)
    throw new Error(
      'PDF renderer not set. Install "pdfjs-dist" and use the baroview package, or use baroview-cdn for CDN mode.'
    );
  return ve(o, e);
}
const De = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getPdfRenderer: $e,
  renderPdf: Ie,
  setPdfRenderer: Me
}, Symbol.toStringTag, { value: "Module" })), Le = /* @__PURE__ */ new Map();
function he(o, e) {
  Le.set(o, e);
}
function je(o) {
  return Le.get(o);
}
function He(o, e, t) {
  const l = (t.getAttribute("fit") || "contain").toLowerCase(), s = t.getAttribute("aspect-ratio") || (l === "cover" ? "1" : "auto");
  t.style.setProperty(
    "--baro-object-fit",
    ["cover", "contain", "fill", "none"].includes(l) ? l : "contain"
  ), t.style.setProperty("--baro-aspect-ratio", s);
  const d = document.createElement("div");
  d.className = "img-wrap";
  const c = document.createElement("img");
  c.src = o, c.alt = "Document preview", d.appendChild(c), e.appendChild(d);
}
function Be(o, e) {
  const t = document.createElement("video");
  t.src = o, t.controls = !0, t.setAttribute("title", "Video player"), e.appendChild(t);
}
function Fe(o, e) {
  const t = document.createElement("audio");
  t.src = o, t.controls = !0, t.setAttribute("title", "Audio player"), e.appendChild(t);
}
function Xe(o, e, t) {
  const l = t.getAttribute("sandbox"), s = document.createElement("iframe");
  s.src = o, s.title = "Content: html", l !== null && s.setAttribute("sandbox", l || ""), e.appendChild(s);
}
function Ye(o, e) {
  return fetch(o).then((t) => {
    if (!t.ok) throw new Error(`HTTP ${t.status}`);
    return t.text();
  }).then(async (t) => {
    const { getMarkdownRenderer: l, renderMarkdown: s } = await Promise.resolve().then(() => _e);
    if (!l()) throw new Error("Markdown renderer not set.");
    const c = await s(t), n = document.createElement("div");
    n.className = "markdown-body", n.innerHTML = c, e.appendChild(n);
  });
}
function Oe(o, e, t) {
  return Promise.resolve().then(() => De).then(({ getPdfRenderer: l, renderPdf: s }) => {
    if (l())
      return s(o, e);
    const d = t.getAttribute("sandbox"), c = document.createElement("iframe");
    c.src = o, c.title = "Content: pdf", d !== null && c.setAttribute("sandbox", d || ""), e.appendChild(c);
  });
}
function Ve() {
  he("image", He), he("video", Be), he("audio", Fe), he("html", Xe), he("markdown", Ye), he("pdf", Oe);
}
Ve();
const we = {
  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  mp4: "video",
  webm: "video",
  ogv: "video",
  mp3: "audio",
  wav: "audio",
  ogg: "audio",
  weba: "audio",
  m4a: "audio",
  pdf: "pdf",
  html: "html",
  htm: "html",
  md: "markdown",
  markdown: "markdown",
  docx: "office",
  xlsx: "office",
  pptx: "office"
};
function ze(o) {
  try {
    const t = new URL(o, window.location.origin).pathname.split("/").pop() ?? "", l = t.lastIndexOf(".");
    return l <= 0 ? "" : t.slice(l + 1).toLowerCase();
  } catch {
    return "";
  }
}
function Re(o) {
  const e = o.split(";")[0].trim().toLowerCase();
  return e.startsWith("image/") ? "image" : e.startsWith("video/") ? "video" : e.startsWith("audio/") ? "audio" : e === "application/pdf" ? "pdf" : e === "text/html" ? "html" : e === "text/markdown" ? "markdown" : e.includes("vnd.openxmlformats-officedocument") ? "office" : "unsupported";
}
function Te(o) {
  if (!o.startsWith("data:")) return null;
  const e = o.indexOf(",");
  if (e === -1) return null;
  const t = o.slice(5, e).split(";")[0].trim();
  return Re(t);
}
function Ce(o) {
  const e = Te(o);
  if (e && e !== "unsupported") return e;
  const t = ze(o);
  return t && we[t] ? we[t] : "unsupported";
}
async function We(o) {
  const e = Te(o);
  if (e && e !== "unsupported") return e;
  const t = ze(o);
  if (t && we[t]) return we[t];
  try {
    const s = (await fetch(o, { method: "HEAD" })).headers.get("Content-Type");
    if (s) return Re(s);
  } catch {
  }
  return "unsupported";
}
const Ue = `
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
function qe(o) {
  return !o || !o.trim() ? [] : o.split(/[\s,]+/).map((e) => e.trim()).filter(Boolean);
}
function Ge(o) {
  return !o || !o.trim() ? [] : o.split(/[\s,]+/).map((e) => parseFloat(e.trim())).filter((e) => !Number.isNaN(e) && e > 0);
}
function fe(o) {
  const e = { w: "80px", h: "60px" };
  if (!o || !o.trim()) return e;
  const t = o.trim().split(/\s+/), l = (s) => {
    const d = parseFloat(s);
    return Number.isNaN(d) || d <= 0 ? null : d;
  };
  if (t.length >= 2) {
    const s = l(t[0]), d = l(t[1]);
    if (s != null && d != null) return { w: `${s}px`, h: `${d}px` };
  }
  if (t.length === 1) {
    const s = l(t[0]);
    if (s != null) {
      const d = Math.round(s * 60 / 80);
      return { w: `${s}px`, h: `${d}px` };
    }
  }
  return e;
}
function Ze(o, e) {
  if (o === "image-gallery") return "uniform";
  if (o === "masonry") return "masonry";
  if (o !== "gallery") return null;
  const t = (e ?? "uniform").toLowerCase();
  return ["uniform", "masonry", "carousel", "strip", "list", "bento", "billboard", "slides"].includes(t) ? t : "uniform";
}
function Ke(o) {
  const e = "baro-view-item", t = Array.from(o.children).filter(
    (s) => s instanceof HTMLElement && s.tagName.toLowerCase() === e
  );
  if (t.length > 0)
    return t.map((s) => {
      const c = { url: s.getAttribute("url") ?? "" };
      s.getAttribute("title") && (c.title = s.getAttribute("title"));
      const n = s.querySelector("code pre, pre");
      n && (c.content = n.innerText ?? n.textContent ?? "", c.contentType = s.querySelector("code pre") ? "code" : "text");
      for (const i of s.getAttributeNames())
        if (i.startsWith("data-") && i.length > 5) {
          const x = s.getAttribute(i);
          x != null && (c[i] = x);
        }
      return c;
    }).filter((s) => s.url.trim() !== "" || s.content != null && s.content !== "");
  const l = o.getAttribute("urls");
  return l && l.trim() ? qe(l).map((s) => ({ url: s })) : [];
}
function Je(o) {
  switch (o) {
    case "pdf":
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 13h2v5H8v-5zm4 0h2v5h-2v-5zm-4-3h2v2H8v-2zm4 0h2v2h-2v-2z"/></svg>';
    case "video":
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5zM6 5v14H4V5h2z"/></svg>';
    case "audio":
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>';
    case "markdown":
    case "html":
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v4h-2V6h-4v12h-2V6H6v2H4V4zm0 10h2v6H4v-6zm14 0h2v6h-2v-6z"/></svg>';
    case "office":
    case "unsupported":
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4z"/></svg>';
  }
}
class Qe extends HTMLElement {
  constructor() {
    super(...arguments), this._url = "", this._abort = null, this._messageRoot = null, this._viewerRoot = null, this._currentFormat = null, this._root = null, this._childObserver = null, this._slidesFromMarkdownItems = null;
  }
  static get observedAttributes() {
    return ["url", "urls", "layout", "columns", "rows", "ratios", "resizable", "fit", "aspect-ratio", "sandbox", "gallery-style", "gallery-visible", "strip-hero", "strip-thumb-size", "billboard-arrange", "billboard-radius", "billboard-canvas", "billboard-content-size", "billboard-image-max", "billboard-item-size", "slides-toolbar", "slides-toolbar-style", "slides-arrows", "slides-autoplay", "slides-fullscreen", "slides-height", "slides-direction", "slides-pagination", "slides-deep-link", "slides-loop", "slides-transition", "slides-from-markdown"];
  }
  connectedCallback() {
    this.attachShadow({ mode: "open" }), this.setAttribute("role", "region"), this.setAttribute("aria-label", "Document viewer");
    const e = document.createElement("style");
    e.textContent = Ue, this.shadowRoot.appendChild(e), this._root = document.createElement("div"), this._root.id = "root", this.shadowRoot.appendChild(this._root), this._childObserver = new MutationObserver((t) => {
      t.some(
        (s) => [...s.addedNodes, ...s.removedNodes].some((d) => d instanceof HTMLElement && d.tagName.toLowerCase() === "baro-view-item")
      ) && this._root && this._render();
    }), this._childObserver.observe(this, { childList: !0 }), this._render();
  }
  attributeChangedCallback(e, t, l) {
    if (this._root && e !== "fit" && e !== "aspect-ratio" && this._render(), (e === "fit" || e === "aspect-ratio") && this._viewerRoot && this._currentFormat === "image") {
      const s = (this.getAttribute("fit") || "contain").toLowerCase(), d = this.getAttribute("aspect-ratio") || (s === "cover" ? "1" : "auto");
      this.style.setProperty("--baro-object-fit", ["cover", "contain", "fill", "none"].includes(s) ? s : "contain"), this.style.setProperty("--baro-aspect-ratio", d);
    }
  }
  _render() {
    var l;
    if (!this._root) return;
    const e = Ke(this), t = this.getAttribute("url") ?? ((l = e[0]) == null ? void 0 : l.url) ?? "";
    if (this._root.innerHTML = "", e.length > 1) {
      this._renderGrid(e);
      return;
    }
    this._url = t, this._messageRoot = document.createElement("div"), this._messageRoot.id = "message", this._messageRoot.setAttribute("aria-live", "polite"), this._viewerRoot = document.createElement("div"), this._viewerRoot.id = "viewer", this._root.appendChild(this._messageRoot), this._root.appendChild(this._viewerRoot), this._load();
  }
  _renderGrid(e) {
    var ge, q, a;
    const t = e.map((p) => p.url), l = this.getAttribute("layout") ?? "grid", s = this.getAttribute("columns"), d = this.getAttribute("rows"), c = this.getAttribute("ratios") ?? "", n = Ge(c), i = document.createElement("div");
    i.id = "grid", this._root.appendChild(i);
    const A = ["row", "column", "columns", "grid", "sidebar", "gallery", "image-gallery", "masonry"].includes(l) ? l : "grid", w = Ze(A, this.getAttribute("gallery-style")), se = A === "gallery" || A === "image-gallery" || A === "masonry", ne = !se && this.hasAttribute("resizable") && t.length >= 2, R = A === "column" || A === "columns";
    if (ne) {
      const p = t.length, v = 100 / p, f = 5;
      for (let g = 0; g < p - 1; g++) {
        const k = n.length >= p ? n[g] / n.reduce((C, S) => C + S, 0) * 100 : v;
        this.style.setProperty(`--baro-s${g + 1}`, String(k));
      }
      i.classList.add(R ? "resize-vertical" : "resize-horizontal");
      const m = () => {
        const g = [];
        for (let k = 0; k < p - 1; k++)
          g.push(parseFloat(this.style.getPropertyValue(`--baro-s${k + 1}`)) || v);
        return g;
      };
      for (let g = 0; g < t.length; g++) {
        const k = document.createElement("baro-view");
        if (k.setAttribute("url", t[g]), i.appendChild(k), g < t.length - 1) {
          const C = document.createElement("div"), S = g;
          C.setAttribute("role", "separator"), C.setAttribute("aria-label", `Resize panels ${g + 1} and ${g + 2}`), C.tabIndex = 0, C.className = R ? "resize-handle-vertical" : "resize-handle", this._setupResize(C, this, R, ($) => {
            const E = m().slice(0, S).reduce((O, K) => O + K, 0), G = $ - E, Z = 100 - f * (p - S) - E, le = Math.min(Z, Math.max(f, G));
            this.style.setProperty(`--baro-s${S + 1}`, String(le)), C.setAttribute("aria-valuenow", String(Math.round(le)));
          }), i.appendChild(C);
        }
      }
      const _ = [];
      for (let g = 0; g < p - 1; g++)
        _.push(`minmax(${R ? "80px" : "120px"}, calc(var(--baro-s${g + 1}, ${v}) * 1%))`), _.push("6px");
      _.push("1fr"), R ? (i.style.gridTemplateRows = _.join(" "), i.style.gridTemplateColumns = "1fr") : (i.style.gridTemplateColumns = _.join(" "), i.style.gridTemplateRows = "none"), this.setAttribute("aria-label", "Document viewers grid (resizable)");
      return;
    }
    if (se && w) {
      this.setAttribute("aria-label", "Document viewers grid");
      const p = this.getAttribute("fit") || (w === "uniform" || w === "bento" ? "cover" : "contain"), v = this.getAttribute("aspect-ratio") || (w === "uniform" ? "1" : "auto");
      if (w === "carousel") {
        i.classList.add("layout-gallery-carousel");
        const f = this.getAttribute("gallery-visible"), m = f ? parseInt(f, 10) : 1, _ = m > 0 ? 100 / m : 100;
        this.style.setProperty("--baro-gallery-visible", `${_}%`);
        for (const g of t) {
          const k = document.createElement("baro-view");
          k.setAttribute("url", g), k.setAttribute("fit", p), k.setAttribute("aspect-ratio", v), i.appendChild(k);
        }
        return;
      }
      if (w === "strip") {
        i.classList.add("layout-gallery-strip");
        const f = fe(this.getAttribute("strip-thumb-size"));
        this.style.setProperty("--baro-strip-thumb-width", f.w), this.style.setProperty("--baro-strip-thumb-height", f.h), (this.getAttribute("strip-hero") ?? "top").toLowerCase() === "left" && i.classList.add("strip-hero-left");
        const m = document.createElement("div");
        m.className = "gallery-hero";
        const _ = document.createElement("baro-view");
        _.setAttribute("url", t[0]), _.setAttribute("fit", p), _.setAttribute("aspect-ratio", v), m.appendChild(_), i.appendChild(m);
        const g = document.createElement("div");
        g.className = "gallery-strip", g.setAttribute("role", "tablist"), g.setAttribute("aria-label", "Gallery thumbnails"), t.forEach((k, C) => {
          const S = Ce(k), $ = S === "image", z = document.createElement("div");
          if (z.className = "gallery-thumb-cell" + (C === 0 ? " active" : ""), z.setAttribute("role", "tab"), z.setAttribute("aria-selected", C === 0 ? "true" : "false"), z.setAttribute("aria-label", $ ? `Image ${C + 1}` : `Item ${C + 1}, ${S}`), z.addEventListener("click", () => {
            _.setAttribute("url", k);
            for (let E = 0; E < g.children.length; E++) {
              const G = g.children[E];
              G.classList.toggle("active", E === C), G.setAttribute("aria-selected", E === C ? "true" : "false");
            }
          }), $) {
            const E = document.createElement("baro-view");
            E.setAttribute("url", k), E.setAttribute("fit", "cover"), E.setAttribute("aspect-ratio", "1"), z.appendChild(E);
          } else {
            const E = document.createElement("button");
            E.type = "button", E.className = "gallery-thumb-icon", E.setAttribute("aria-hidden", "true"), E.innerHTML = Je(S), z.appendChild(E);
          }
          g.appendChild(z);
        }), i.appendChild(g);
        return;
      }
      if (w === "billboard") {
        i.classList.add("layout-gallery-billboard");
        const m = (this.getAttribute("billboard-arrange") ?? "circle").toLowerCase() === "circle", _ = Math.max(40, parseInt(this.getAttribute("billboard-radius") ?? "120", 10) || 120), g = this.getAttribute("billboard-canvas"), k = g ? fe(g) : null, C = k ? parseInt(k.w, 10) : 600, S = k ? parseInt(k.h, 10) : 400, $ = this.getAttribute("billboard-content-size") ? fe(this.getAttribute("billboard-content-size")) : { w: "220px", h: "280px" }, z = this.getAttribute("billboard-image-max") ? fe(this.getAttribute("billboard-image-max")) : { w: "360px", h: "270px" }, E = parseInt($.w, 10) || 220, G = parseInt($.h, 10) || 280, Z = parseInt(z.w, 10) || 360, le = parseInt(z.h, 10) || 270;
        this.style.setProperty("--baro-billboard-canvas-w", `${C}px`), this.style.setProperty("--baro-billboard-canvas-h", `${S}px`), this.style.setProperty("--baro-billboard-content-w", $.w), this.style.setProperty("--baro-billboard-content-h", $.h), this.style.setProperty("--baro-billboard-image-max-w", z.w), this.style.setProperty("--baro-billboard-image-max-h", z.h);
        const O = document.createElement("div");
        O.className = "billboard-viewport", O.setAttribute("aria-label", "Billboard canvas, drag to pan, scroll to zoom");
        const K = document.createElement("div");
        K.className = "billboard-canvas";
        const H = t.length, de = 12, J = t.map((P) => {
          const L = Ce(P) === "image";
          return { w: L ? Z : E, h: L ? le : G, isImage: L };
        });
        let Q = _;
        if (m && H > 1) {
          const P = Math.sin(Math.PI / H);
          for (let F = 0; F < H; F++) {
            const L = (F + 1) % H, N = (J[F].w + J[L].w) / (4 * P), X = (J[F].h + J[L].h) / (4 * P);
            Q = Math.max(Q, N, X);
          }
        }
        const I = C / 2, V = S / 2;
        let te = 0, B = 0, M = 0;
        if (t.forEach((P, F) => {
          const { w: L, h: N, isImage: X } = J[F];
          let ue, D;
          if (m && H > 0) {
            const re = F / H * 2 * Math.PI - Math.PI / 2;
            ue = I + Q * Math.cos(re) - L / 2, D = V + Q * Math.sin(re) - N / 2;
          } else
            M + L + de > C && B > 0 && (M = 0, te += B + de, B = 0), ue = M, D = te, M += L + de, B = Math.max(B, N);
          const ae = document.createElement("div");
          ae.className = "billboard-item " + (X ? "billboard-item--image" : "billboard-item--content"), ae.style.left = `${ue}px`, ae.style.top = `${D}px`;
          const Y = document.createElement("baro-view");
          Y.setAttribute("url", P), Y.setAttribute("fit", "contain"), Y.setAttribute("aspect-ratio", "auto"), X && Y.setAttribute("auto-size", ""), ae.appendChild(Y), K.appendChild(ae);
        }), !m && H > 0) {
          const P = te + B + de;
          P > S && (K.style.height = `${P}px`);
        }
        O.appendChild(K);
        const W = document.createElement("div");
        W.className = "billboard-toolbar", W.setAttribute("aria-label", "Billboard zoom controls");
        const ee = document.createElement("button");
        ee.type = "button", ee.setAttribute("aria-label", "Zoom in"), ee.textContent = "+";
        const ie = document.createElement("button");
        ie.type = "button", ie.setAttribute("aria-label", "Zoom out"), ie.textContent = "−";
        const b = document.createElement("button");
        b.type = "button", b.setAttribute("aria-label", "Reset zoom"), b.textContent = "⟲", W.appendChild(ie), W.appendChild(ee), W.appendChild(b), O.appendChild(W), i.appendChild(O), this._setupBillboardZoomPan(O, K, C, S, { zoomInBtn: ee, zoomOutBtn: ie, resetBtn: b });
        return;
      }
      if (w === "slides") {
        const f = (ge = this.getAttribute("slides-from-markdown")) == null ? void 0 : ge.trim();
        if (f)
          if (this._slidesFromMarkdownItems)
            e = this._slidesFromMarkdownItems;
          else {
            i.classList.add("layout-gallery-slides");
            const r = document.createElement("div");
            r.className = "spinner", r.setAttribute("aria-busy", "true"), r.textContent = "Loading…", i.appendChild(r), fetch(f).then((u) => u.ok ? u.text() : Promise.reject(new Error(String(u.status)))).then(async (u) => {
              const { renderMarkdown: h } = await Promise.resolve().then(() => _e), y = new RegExp("(?=^# .+$)", "m"), ce = u.split(y).map((U) => U.trim()).filter(Boolean), T = await Promise.all(ce.map((U) => h(U)));
              this._slidesFromMarkdownItems = T.map((U) => ({ url: "", content: U, contentType: "markdown" })), this._render();
            }).catch(() => {
              r.textContent = "Failed to load";
            });
            return;
          }
        const m = (r) => {
          const u = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          u.setAttribute("viewBox", "0 0 24 24"), u.setAttribute("fill", "none"), u.setAttribute("stroke", "currentColor"), u.setAttribute("stroke-width", "2"), u.setAttribute("stroke-linecap", "round"), u.setAttribute("stroke-linejoin", "round"), u.setAttribute("aria-hidden", "true");
          const h = document.createElementNS("http://www.w3.org/2000/svg", "path"), y = r === "left" ? "M15 18l-6-6 6-6" : r === "right" ? "M9 18l6-6-6-6" : r === "up" ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6";
          return h.setAttribute("d", y), u.appendChild(h), u;
        };
        i.classList.add("layout-gallery-slides");
        const g = (this.getAttribute("slides-direction") ?? "horizontal").toLowerCase() === "vertical";
        g && i.classList.add("slides-direction-vertical"), this.style.setProperty("--baro-slides-count", String(e.length));
        const k = this.getAttribute("slides-height");
        k && /^\d+$/.test(k) && this.style.setProperty("--baro-slides-height", `${k}px`);
        const C = (this.getAttribute("slides-toolbar") ?? "hover").toLowerCase();
        C === "hover" ? i.classList.add("slides-toolbar-hover") : C === "hidden" && i.classList.add("slides-toolbar-hidden"), (this.getAttribute("slides-toolbar-style") ?? "frosted").toLowerCase() === "frosted" && i.classList.add("slides-toolbar-frosted");
        const $ = (this.getAttribute("slides-arrows") ?? "edges").toLowerCase() !== "none", z = parseInt(this.getAttribute("slides-autoplay") ?? "0", 10) || 0, E = this.hasAttribute("slides-fullscreen"), G = (this.getAttribute("slides-pagination") ?? "dots").toLowerCase(), Z = G === "dots", le = G === "fraction", O = G === "progress", K = this.hasAttribute("slides-deep-link"), H = this.hasAttribute("slides-loop"), de = (this.getAttribute("slides-transition") ?? "none").toLowerCase();
        de === "fade" ? i.classList.add("slides-transition-fade") : de === "slide" && i.classList.add("slides-transition-slide");
        const J = document.createElement("div");
        J.className = "slides-stage", J.setAttribute("aria-live", "polite");
        const Q = document.createElement("div");
        Q.className = "slides-track", e.forEach((r, u) => {
          const h = document.createElement("div");
          if (h.className = "slides-slide" + (u === 0 ? " slides-active" : ""), r.content != null && r.content !== "") {
            const y = document.createElement("div");
            y.className = "slides-inline-content " + (r.contentType === "code" ? "slides-code-block" : r.contentType === "markdown" ? "markdown-body" : ""), r.contentType === "markdown" ? y.innerHTML = r.content : y.textContent = r.content, y.setAttribute("aria-hidden", u === 0 ? "false" : "true"), h.appendChild(y);
          } else {
            const y = document.createElement("baro-view");
            y.setAttribute("url", r.url), y.setAttribute("fit", "cover"), y.setAttribute("aspect-ratio", "auto"), y.classList.add("slides-fill"), y.setAttribute("aria-hidden", u === 0 ? "false" : "true"), h.appendChild(y);
          }
          Q.appendChild(h);
        }), J.appendChild(Q);
        const I = document.createElement("div");
        if (I.className = "slides-stage-wrap", $) {
          const r = document.createElement("button");
          r.type = "button", r.className = "slides-arrow", r.setAttribute("aria-label", "Previous slide"), r.appendChild(m(g ? "up" : "left")), I.appendChild(r);
        }
        if (I.appendChild(J), $) {
          const r = document.createElement("button");
          r.type = "button", r.className = "slides-arrow", r.setAttribute("aria-label", "Next slide"), r.appendChild(m(g ? "down" : "right")), I.appendChild(r);
        }
        const V = document.createElement("div");
        V.className = "slides-toolbar", V.setAttribute("aria-label", "Slide navigation");
        const te = document.createElement("button");
        te.type = "button", te.setAttribute("aria-label", "Previous"), te.appendChild(m(g ? "up" : "left"));
        const B = document.createElement("button");
        B.type = "button", B.setAttribute("aria-label", "Next"), B.appendChild(m(g ? "down" : "right"));
        const M = document.createElement("div");
        M.className = "slides-dots", M.setAttribute("role", "tablist"), M.setAttribute("aria-label", "Slides"), Z && e.forEach((r, u) => {
          const h = document.createElement("button");
          h.type = "button", h.setAttribute("aria-label", `Slide ${u + 1}`), h.setAttribute("role", "tab"), h.setAttribute("aria-selected", u === 0 ? "true" : "false"), u === 0 && h.classList.add("active"), h.addEventListener("click", () => D(u)), M.appendChild(h);
        });
        const W = document.createElement("span");
        W.className = "slides-fraction", W.setAttribute("aria-live", "polite");
        const ee = document.createElement("div");
        ee.className = "slides-progress-wrap", ee.setAttribute("aria-hidden", "true");
        const ie = document.createElement("div");
        ie.className = "slides-progress-fill", ee.appendChild(ie);
        let b = 0, P = null;
        const F = () => {
          const r = e.length > 0 ? b * 100 / e.length : 0, u = g ? "Y" : "X";
          Q.style.transform = `translate${u}(-${r}%)`;
        }, L = 10;
        let N = 0, X = null;
        const ue = () => {
          if (!Z) return;
          const r = e.length, u = N;
          r > L && (b < N ? N = b : b >= N + L && (N = Math.max(0, b - L + 1)), N = Math.max(0, Math.min(N, r - L)));
          const h = r <= L ? 0 : N, y = h + L, ce = r > L && u !== N;
          for (let T = 0; T < M.children.length; T++) {
            const U = M.children[T], me = Math.abs(T - b), be = Math.max(0.45, 1 - me * 0.08);
            U.style.setProperty("--dot-scale", String(be)), U.style.display = r <= L || ce || T >= h && T < y ? "" : "none";
          }
          ce ? (X && clearTimeout(X), X = setTimeout(() => {
            X = null;
            for (let T = 0; T < M.children.length; T++)
              M.children[T].style.display = T >= h && T < y ? "" : "none";
          }, 700)) : X && (clearTimeout(X), X = null);
        };
        F();
        const D = (r) => {
          var y, ce, T, U, me, be;
          const u = Math.max(0, Math.min(r, e.length - 1));
          if (u === b) return;
          const h = Q.children;
          (y = h[b].firstElementChild) == null || y.setAttribute("aria-hidden", "true"), b = u, (ce = h[b].firstElementChild) == null || ce.setAttribute("aria-hidden", "false");
          for (let j = 0; j < h.length; j++) h[j].classList.toggle("slides-active", j === b);
          if (F(), Z) {
            (T = M.children[b]) == null || T.classList.add("active"), (U = M.children[b]) == null || U.setAttribute("aria-selected", "true");
            for (let j = 0; j < M.children.length; j++)
              j !== b && ((me = M.children[j]) == null || me.classList.remove("active"), (be = M.children[j]) == null || be.setAttribute("aria-selected", "false"));
          }
          if (ae(), P && (clearInterval(P), P = setInterval(() => D((b + 1) % e.length), z * 1e3)), H || (i.classList.toggle("slides-at-start", b === 0), i.classList.toggle("slides-at-end", b === e.length - 1)), K) {
            const j = `#slide=${b}`;
            location.hash !== j && history.replaceState(null, "", j);
          }
          Z && ue();
        }, ae = () => {
          le && (W.textContent = `${b + 1} / ${e.length}`), O && (ie.style.width = e.length > 0 ? `${(b + 1) / e.length * 100}%` : "0%");
        }, Y = () => D(H ? (b - 1 + e.length) % e.length : b - 1), re = () => D(H ? (b + 1) % e.length : b + 1);
        te.addEventListener("click", Y), B.addEventListener("click", re), $ && ((q = I.querySelector(".slides-arrow:first-of-type")) == null || q.addEventListener("click", Y), (a = I.querySelector(".slides-arrow:last-of-type")) == null || a.addEventListener("click", re));
        const Se = (r) => {
          if (!(r.target instanceof HTMLButtonElement && r.target.closest(".slides-toolbar")))
            switch (r.key) {
              case "ArrowLeft":
                g || (Y(), r.preventDefault());
                break;
              case "ArrowRight":
                g || (re(), r.preventDefault());
                break;
              case "ArrowUp":
                g && (Y(), r.preventDefault());
                break;
              case "ArrowDown":
                g && (re(), r.preventDefault());
                break;
              case "Home":
                D(0), r.preventDefault();
                break;
              case "End":
                D(e.length - 1), r.preventDefault();
                break;
            }
        };
        i.addEventListener("keydown", Se), i.setAttribute("tabindex", "0"), i.setAttribute("role", "application"), i.setAttribute("aria-roledescription", "Slide deck");
        const ke = 50;
        let xe = 0, Ae = 0, oe = null;
        if (I.addEventListener("touchstart", (r) => {
          r.changedTouches.length !== 0 && (xe = r.changedTouches[0].clientX, Ae = r.changedTouches[0].clientY, oe = null);
        }, { passive: !0 }), I.addEventListener("touchmove", (r) => {
          if (r.changedTouches.length === 0) return;
          const u = r.changedTouches[0].clientX - xe, h = r.changedTouches[0].clientY - Ae;
          oe === null && (Math.abs(u) > 10 || Math.abs(h) > 10) && (oe = g ? Math.abs(h) >= Math.abs(u) ? "vertical" : "horizontal" : Math.abs(u) >= Math.abs(h) ? "horizontal" : "vertical"), oe === "horizontal" && Math.abs(u) > Math.abs(h) && r.preventDefault(), oe === "vertical" && Math.abs(h) > Math.abs(u) && r.preventDefault();
        }, { passive: !1 }), I.addEventListener("touchend", (r) => {
          if (r.changedTouches.length === 0) return;
          const u = r.changedTouches[0].clientX - xe, h = r.changedTouches[0].clientY - Ae;
          oe === null && (Math.abs(u) > 10 || Math.abs(h) > 10) && (oe = g ? Math.abs(h) >= Math.abs(u) ? "vertical" : "horizontal" : Math.abs(u) >= Math.abs(h) ? "horizontal" : "vertical"), oe === "horizontal" && Math.abs(u) >= ke ? u > 0 ? Y() : re() : oe === "vertical" && Math.abs(h) >= ke && (h > 0 ? Y() : re());
        }, { passive: !0 }), z > 0 && (P = setInterval(() => D((b + 1) % e.length), z * 1e3)), H || (i.classList.toggle("slides-at-start", b === 0), i.classList.toggle("slides-at-end", b === e.length - 1)), K) {
          const r = location.hash.match(/^#slide=(\d+)$/);
          if (r) {
            const h = parseInt(r[1], 10);
            h >= 0 && h < e.length && D(h);
          }
          const u = () => {
            const h = location.hash.match(/^#slide=(\d+)$/);
            if (h) {
              const y = parseInt(h[1], 10);
              y >= 0 && y < e.length && y !== b && D(y);
            }
          };
          window.addEventListener("hashchange", u);
        }
        if (Z && ue(), ae(), V.appendChild(te), Z && V.appendChild(M), le && V.appendChild(W), O && V.appendChild(ee), V.appendChild(B), E) {
          const r = document.createElement("button");
          r.type = "button", r.setAttribute("aria-label", "Fullscreen"), r.textContent = "⛶";
          const u = this;
          r.addEventListener("click", () => {
            var h, y;
            document.fullscreenElement ? (y = document.exitFullscreen) == null || y.call(document) : (h = u.requestFullscreen) == null || h.call(u);
          }), V.appendChild(r);
        }
        I.appendChild(V), i.appendChild(I);
        return;
      }
      if (w === "list") {
        i.classList.add("layout-gallery-list");
        for (const f of t) {
          const m = document.createElement("baro-view");
          m.setAttribute("url", f), m.setAttribute("fit", p), m.setAttribute("aspect-ratio", v), i.appendChild(m);
        }
        return;
      }
      if (w === "bento") {
        i.classList.add("layout-gallery-bento");
        for (const f of t) {
          const m = document.createElement("baro-view");
          m.setAttribute("url", f), m.setAttribute("fit", p), m.setAttribute("aspect-ratio", v), i.appendChild(m);
        }
        return;
      }
      if (w === "uniform") {
        i.classList.add("layout-image-gallery");
        for (const f of t) {
          const m = document.createElement("baro-view");
          m.setAttribute("url", f), m.setAttribute("fit", p), m.setAttribute("aspect-ratio", v), i.appendChild(m);
        }
        return;
      }
      if (w === "masonry") {
        i.classList.add("layout-masonry");
        const f = s ? parseInt(s, 10) : 3;
        i.style.columnCount = String(f);
        for (const m of t) {
          const _ = document.createElement("baro-view");
          _.setAttribute("url", m), i.appendChild(_);
        }
        return;
      }
    }
    if (A === "row")
      i.style.gridTemplateColumns = n.length >= t.length ? n.slice(0, t.length).join("fr ") + "fr" : Array(t.length).fill("1fr").join(" "), i.style.gridTemplateRows = "none", i.style.gridAutoFlow = "column";
    else if (A === "column" || A === "columns")
      i.style.gridTemplateRows = n.length >= t.length ? n.slice(0, t.length).join("fr ") + "fr" : Array(t.length).fill("1fr").join(" "), i.style.gridTemplateColumns = "none", i.style.gridAutoFlow = "row";
    else if (A === "sidebar")
      i.style.gridTemplateColumns = n.length >= 2 ? n.slice(0, 2).join("fr ") + "fr" : "1fr 2fr";
    else {
      const p = s ? parseInt(s, 10) : 0, v = d ? parseInt(d, 10) : 0;
      if (p > 0 && v > 0)
        i.style.gridTemplateColumns = `repeat(${p}, 1fr)`, i.style.gridTemplateRows = `repeat(${v}, 1fr)`;
      else if (p > 0)
        i.style.gridTemplateColumns = `repeat(${p}, 1fr)`, i.style.gridAutoRows = "1fr";
      else if (v > 0)
        i.style.gridTemplateRows = `repeat(${v}, 1fr)`, i.style.gridAutoColumns = "1fr";
      else {
        const f = Math.min(t.length, 2);
        i.style.gridTemplateColumns = `repeat(${f}, 1fr)`, i.style.gridAutoRows = "1fr";
      }
    }
    this.setAttribute("aria-label", "Document viewers grid");
    for (const p of t) {
      const v = document.createElement("baro-view");
      v.setAttribute("url", p), i.appendChild(v);
    }
  }
  _setupResize(e, t, l, s) {
    const d = (i) => {
      const x = t.getBoundingClientRect(), A = l ? x.height : x.width, w = l ? i.clientY : i.clientX, se = 10, ne = 90, R = l ? Math.min(ne, Math.max(se, (w - x.top) / A * 100)) : Math.min(ne, Math.max(se, (w - x.left) / A * 100));
      s(R);
    }, c = (i) => {
      i.preventDefault();
      const x = (w) => d(w), A = () => {
        document.removeEventListener("mousemove", x), document.removeEventListener("mouseup", A), document.body.style.cursor = "", document.body.style.userSelect = "";
      };
      document.body.style.cursor = l ? "row-resize" : "col-resize", document.body.style.userSelect = "none", document.addEventListener("mousemove", x), document.addEventListener("mouseup", A);
    }, n = (i) => {
      const x = (w) => {
        w.cancelable && w.preventDefault(), d(w.touches[0]);
      }, A = () => {
        document.removeEventListener("touchmove", x, { capture: !0 }), document.removeEventListener("touchend", A);
      };
      document.addEventListener("touchmove", x, { passive: !1, capture: !0 }), document.addEventListener("touchend", A);
    };
    e.addEventListener("mousedown", c), e.addEventListener("touchstart", n, { passive: !0 });
  }
  _setupBillboardZoomPan(e, t, l, s, d) {
    let c = 1, n = 0, i = 0;
    const x = () => {
      t.style.transform = `translate(${n}px,${i}px) scale(${c})`;
    }, A = (a, p, v) => {
      const f = (a - n) / c, m = (p - i) / c;
      n = a - f * v, i = p - m * v, c = v, x();
    };
    requestAnimationFrame(() => {
      const a = e.getBoundingClientRect();
      n = a.width / 2 - l / 2, i = a.height / 2 - s / 2, x();
    }), e.addEventListener("wheel", (a) => {
      a.preventDefault();
      const p = e.getBoundingClientRect(), v = a.clientX - p.left, f = a.clientY - p.top, m = a.deltaY > 0 ? 0.9 : 1.1, _ = Math.min(4, Math.max(0.15, c * m));
      A(v, f, _);
    }, { passive: !1 }), d && (d.zoomInBtn.addEventListener("click", (a) => {
      a.stopPropagation();
      const p = e.getBoundingClientRect();
      A(p.width / 2, p.height / 2, Math.min(4, c * 1.2));
    }), d.zoomOutBtn.addEventListener("click", (a) => {
      a.stopPropagation();
      const p = e.getBoundingClientRect();
      A(p.width / 2, p.height / 2, Math.max(0.15, c * 0.8));
    }), d.resetBtn.addEventListener("click", (a) => {
      a.stopPropagation();
      const p = e.getBoundingClientRect();
      c = 1, n = p.width / 2 - l / 2, i = p.height / 2 - s / 2, x();
    }));
    let w = { x: 0, y: 0, tx: 0, ty: 0 };
    const se = (a) => {
      n = w.tx + (a.clientX - w.x), i = w.ty + (a.clientY - w.y), x();
    }, ne = () => {
      document.removeEventListener("mousemove", se), document.removeEventListener("mouseup", ne), e.style.cursor = "grab";
    };
    e.addEventListener("mousedown", (a) => {
      var p, v, f, m;
      (v = (p = a.target).closest) != null && v.call(p, ".billboard-item") || (m = (f = a.target).closest) != null && m.call(f, ".billboard-toolbar") || (a.preventDefault(), w = { x: a.clientX, y: a.clientY, tx: n, ty: i }, e.style.cursor = "grabbing", document.addEventListener("mousemove", se), document.addEventListener("mouseup", ne));
    });
    let R = null, ge = 0, q = null;
    e.addEventListener("touchstart", (a) => {
      a.touches.length === 2 ? (a.preventDefault(), ge = Math.hypot(a.touches[0].clientX - a.touches[1].clientX, a.touches[0].clientY - a.touches[1].clientY), R = { x: (a.touches[0].clientX + a.touches[1].clientX) / 2, y: (a.touches[0].clientY + a.touches[1].clientY) / 2, tx: n, ty: i, scale: c }) : a.touches.length === 1 && (q = { x: a.touches[0].clientX, y: a.touches[0].clientY, tx: n, ty: i });
    }, { passive: !0 }), e.addEventListener("touchmove", (a) => {
      if (a.touches.length === 2 && R) {
        a.preventDefault();
        const p = Math.hypot(a.touches[0].clientX - a.touches[1].clientX, a.touches[0].clientY - a.touches[1].clientY);
        c = Math.min(4, Math.max(0.15, R.scale * (p / ge)));
        const v = (a.touches[0].clientX + a.touches[1].clientX) / 2, f = (a.touches[0].clientY + a.touches[1].clientY) / 2;
        n = R.tx + (v - R.x), i = R.ty + (f - R.y), x();
      } else a.touches.length === 1 && q && (n = q.tx + (a.touches[0].clientX - q.x), i = q.ty + (a.touches[0].clientY - q.y), x());
    }, { passive: !1 }), e.addEventListener("touchend", (a) => {
      a.touches.length < 2 && (R = null), a.touches.length < 1 && (q = null);
    });
  }
  _load() {
    this._abort && this._abort.abort(), this._abort = new AbortController();
    const e = this._abort.signal;
    if (!this._url.trim()) {
      this._showState("error", "No URL provided.");
      return;
    }
    this.setAttribute("aria-busy", "true"), this._showState("loading", "Loading…");
    const t = 200;
    Promise.all([
      We(this._url),
      new Promise((l) => setTimeout(l, t))
    ]).then(([l]) => {
      e.aborted || (this._currentFormat = l, this.setAttribute("aria-busy", "false"), this._renderViewer(this._url, l));
    }).catch((l) => {
      if (e.aborted) return;
      this.setAttribute("aria-busy", "false");
      const s = l instanceof TypeError && l.message.includes("fetch") ? "Could not load (CORS or network). Try opening the link in a new tab." : `Failed to load: ${l instanceof Error ? l.message : String(l)}`;
      this._showState("error", s, !0);
    });
  }
  _showState(e, t, l = !1) {
    if (!this._messageRoot || !this._viewerRoot) return;
    if (this._messageRoot.hidden = !1, this._viewerRoot.classList.remove("visible"), this._viewerRoot.innerHTML = "", this._messageRoot.className = ` ${e}`.trim(), this._messageRoot.innerHTML = "", e === "loading") {
      const d = document.createElement("div");
      d.className = "spinner", d.setAttribute("aria-hidden", "true"), this._messageRoot.appendChild(d);
    }
    const s = document.createElement("p");
    if (s.textContent = t, this._messageRoot.appendChild(s), l) {
      const d = document.createElement("div");
      d.className = "actions";
      const c = document.createElement("a");
      c.href = this._url, c.target = "_blank", c.rel = "noopener noreferrer", c.className = "open-link", c.textContent = "Open in new tab", c.setAttribute("tabindex", "0"), d.appendChild(c);
      const n = document.createElement("button");
      n.type = "button", n.textContent = "Retry", n.addEventListener("click", () => this._load()), d.appendChild(n), this._messageRoot.appendChild(d);
    }
    this._messageRoot.hidden = !1;
  }
  _renderViewer(e, t) {
    if (!this._messageRoot || !this._viewerRoot) return;
    this._messageRoot.hidden = !0, this._viewerRoot.innerHTML = "", this._viewerRoot.classList.add("visible");
    const l = t === "markdown" ? "Markdown" : t;
    if (this.setAttribute("aria-label", `Document viewer: ${l}`), t === "office" || t === "unsupported") {
      this._messageRoot.hidden = !1, this._viewerRoot.classList.remove("visible"), this._messageRoot.className = "unsupported", this._messageRoot.innerHTML = "";
      const d = document.createElement("p");
      d.textContent = t === "office" ? "Office documents (DOCX, XLSX, PPTX) are not yet supported." : "Unsupported format.", this._messageRoot.appendChild(d);
      const c = document.createElement("div");
      c.className = "actions";
      const n = document.createElement("a");
      n.href = e, n.target = "_blank", n.rel = "noopener noreferrer", n.className = "open-link", n.textContent = "Open in new tab", n.setAttribute("tabindex", "0"), c.appendChild(n), this._messageRoot.appendChild(c);
      return;
    }
    const s = je(t);
    if (!s) {
      this._messageRoot.hidden = !1, this._viewerRoot.classList.remove("visible"), this._messageRoot.className = "unsupported", this._messageRoot.innerHTML = "";
      const d = document.createElement("p");
      d.textContent = "Unsupported format.", this._messageRoot.appendChild(d);
      const c = document.createElement("div");
      c.className = "actions";
      const n = document.createElement("a");
      n.href = e, n.target = "_blank", n.rel = "noopener noreferrer", n.className = "open-link", n.textContent = "Open in new tab", n.setAttribute("tabindex", "0"), c.appendChild(n), this._messageRoot.appendChild(c);
      return;
    }
    Promise.resolve(s(e, this._viewerRoot, this)).catch((d) => {
      var n;
      if (!this._messageRoot) return;
      this._messageRoot.hidden = !1, (n = this._viewerRoot) == null || n.classList.remove("visible"), this._messageRoot.className = "error", this._messageRoot.innerHTML = "";
      const c = document.createElement("p");
      c.textContent = d instanceof Error ? d.message : String(d), this._messageRoot.appendChild(c);
    });
  }
  disconnectedCallback() {
    var e;
    (e = this._childObserver) == null || e.disconnect(), this._childObserver = null, this._abort && this._abort.abort();
  }
  get url() {
    return this._url;
  }
  set url(e) {
    this.setAttribute("url", e);
  }
}
class et extends HTMLElement {
  static get observedAttributes() {
    return ["url", "title"];
  }
}
typeof window < "u" && (customElements.get("baro-view") || customElements.define("baro-view", Qe), customElements.get("baro-view-item") || customElements.define("baro-view-item", et));
const tt = "https://esm.sh/marked@11", it = "https://esm.sh/pdfjs-dist@4";
Ee(async (o) => {
  const e = await import(
    /* @vite-ignore */
    tt
  ), t = e.default ?? e.marked;
  return typeof t.parse == "function" ? t.parse(o) : t(o);
});
const rt = "https://esm.sh/pdfjs-dist@4/build/pdf.worker.mjs";
let pe = null;
async function ot() {
  return pe || (pe = await import(
    /* @vite-ignore */
    it
  ), pe.GlobalWorkerOptions.workerSrc = rt, pe);
}
Me(async (o, e) => {
  const l = await (await ot()).getDocument({ url: o }).promise, s = l.numPages, d = 1.5;
  for (let c = 1; c <= s; c++) {
    const n = await l.getPage(c), i = n.getViewport({ scale: d }), x = document.createElement("canvas"), A = x.getContext("2d");
    A && (x.height = i.height, x.width = i.width, e.appendChild(x), await n.render({ canvasContext: A, viewport: i }).promise);
  }
});
export {
  Qe as BaroViewElement,
  et as BaroViewItemElement,
  Re as formatFromContentType,
  We as getFormatFromUrl,
  Pe as getMarkdownRenderer,
  $e as getPdfRenderer,
  je as getViewer,
  he as registerViewer,
  Ee as setMarkdownRenderer,
  Me as setPdfRenderer
};
//# sourceMappingURL=baroview-cdn.js.map
