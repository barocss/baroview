/**
 * baroview – ESM package with static import of marked and pdfjs-dist.
 * Importing this module registers <baro-view> and <baro-view-item>; markdown and PDF work via these libs.
 */
import { setMarkdownRenderer } from 'baroview-core/markdown-renderer';
import { setPdfRenderer } from 'baroview-core/pdf-renderer';
import { marked } from 'marked';
import * as pdfjsLib from 'pdfjs-dist';

// Satisfy pdf.js requirement (avoids "No GlobalWorkerOptions.workerSrc specified").
// Worker runs parsing off the main thread. Use CDN worker so no extra asset is needed.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4/build/pdf.worker.mjs';

setMarkdownRenderer((text: string) => Promise.resolve(marked.parse(text) as string));

setPdfRenderer(async (url: string, container: HTMLElement) => {
  const pdf = await pdfjsLib.getDocument({ url }).promise;
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
