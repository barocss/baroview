/**
 * baroview-cdn – Single script that loads baroview + marked and pdf.js from CDN.
 * Use via: <script type="module" src="https://unpkg.com/baroview-cdn/dist/baroview-cdn.js"></script>
 */
import { setMarkdownRenderer } from 'baroview-core/markdown-renderer';
import { setPdfRenderer } from 'baroview-core/pdf-renderer';

const MARKED_CDN = 'https://esm.sh/marked@11';
const PDFJS_CDN = 'https://esm.sh/pdfjs-dist@4';

setMarkdownRenderer(async (text: string) => {
  const mod = await import(/* @vite-ignore */ MARKED_CDN);
  const marked = mod.default ?? mod.marked;
  return typeof marked.parse === 'function' ? marked.parse(text) : marked(text);
});

const PDFJS_WORKER_CDN = 'https://esm.sh/pdfjs-dist@4/build/pdf.worker.mjs';

let pdfjsLib: Awaited<ReturnType<typeof import('pdfjs-dist')>> | null = null;
async function getPdfjs() {
  if (pdfjsLib) return pdfjsLib;
  pdfjsLib = await import(/* @vite-ignore */ PDFJS_CDN);
  // Satisfy pdf.js requirement (avoids "No GlobalWorkerOptions.workerSrc specified").
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
  return pdfjsLib;
}

setPdfRenderer(async (url: string, container: HTMLElement) => {
  const pdfjs = await getPdfjs();
  const pdf = await pdfjs.getDocument({ url }).promise;
  const numPages = pdf.numPages;
  const scale = 1.5;
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) continue;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    container.appendChild(canvas);
    await page.render({ canvasContext: ctx, viewport }).promise;
  }
});

import 'baroview-core';

export * from 'baroview-core';
