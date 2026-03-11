/**
 * Viewer registry: format → render function.
 * Register viewers with registerViewer(); baroview calls getViewer(format) in _renderViewer.
 */
import type { ViewFormat } from './detect-format.js';

export interface ViewerHost {
  getAttribute(name: string): string | null;
  style: CSSStyleDeclaration;
}

export type ViewerRenderFn = (
  url: string,
  container: HTMLElement,
  host: ViewerHost
) => void | Promise<void>;

const registry = new Map<ViewFormat, ViewerRenderFn>();

export function registerViewer(format: ViewFormat, fn: ViewerRenderFn): void {
  registry.set(format, fn);
}

export function getViewer(format: ViewFormat): ViewerRenderFn | undefined {
  return registry.get(format);
}
