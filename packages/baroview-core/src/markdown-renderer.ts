/**
 * Injectable markdown renderer. Set via setMarkdownRenderer() before using markdown features.
 * baroview (ESM) sets it with marked; baroview-cdn sets it with a CDN-loaded marked.
 */
let renderer: ((text: string) => Promise<string>) | null = null;

export function setMarkdownRenderer(fn: (text: string) => Promise<string>): void {
  renderer = fn;
}

export function getMarkdownRenderer(): ((text: string) => Promise<string>) | null {
  return renderer;
}

export async function renderMarkdown(text: string): Promise<string> {
  if (!renderer) {
    throw new Error(
      'Markdown renderer not set. Install "marked" and use the baroview package, or use baroview-cdn for CDN mode.'
    );
  }
  return renderer(text);
}
