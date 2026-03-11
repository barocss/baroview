/**
 * Injectable PDF renderer. Set via setPdfRenderer() to use pdf.js (or similar).
 * If not set, baroview falls back to an iframe with the PDF URL.
 */
export type PdfRenderFn = (url: string, container: HTMLElement) => Promise<void>;

let renderer: PdfRenderFn | null = null;

export function setPdfRenderer(fn: PdfRenderFn): void {
  renderer = fn;
}

export function getPdfRenderer(): PdfRenderFn | null {
  return renderer;
}

export async function renderPdf(url: string, container: HTMLElement): Promise<void> {
  if (!renderer) {
    throw new Error(
      'PDF renderer not set. Install "pdfjs-dist" and use the baroview package, or use baroview-cdn for CDN mode.'
    );
  }
  return renderer(url, container);
}
