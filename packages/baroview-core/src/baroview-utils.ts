import type { BaroViewItemData, GalleryStyle, LayoutType } from './baroview-types.js';
import type { ViewFormat } from './detect-format.js';

export function parseUrls(value: string): string[] {
  if (!value || !value.trim()) return [];
  return value.split(/[\s,]+/).map((u) => u.trim()).filter(Boolean);
}

export function parseRatios(value: string): number[] {
  if (!value || !value.trim()) return [];
  return value.split(/[\s,]+/).map((s) => parseFloat(s.trim())).filter((n) => !Number.isNaN(n) && n > 0);
}

export function parseStripThumbSize(value: string | null): { w: string; h: string } {
  const def = { w: '80px', h: '60px' };
  if (!value || !value.trim()) return def;
  const parts = value.trim().split(/\s+/);
  const num = (s: string) => {
    const n = parseFloat(s);
    return Number.isNaN(n) || n <= 0 ? null : n;
  };
  if (parts.length >= 2) {
    const w = num(parts[0]!);
    const h = num(parts[1]!);
    if (w != null && h != null) return { w: `${w}px`, h: `${h}px` };
  }
  if (parts.length === 1) {
    const n = num(parts[0]!);
    if (n != null) {
      const h = Math.round((n * 60) / 80);
      return { w: `${n}px`, h: `${h}px` };
    }
  }
  return def;
}

export function resolveGalleryStyle(layout: LayoutType, galleryStyleAttr: string | null): GalleryStyle | null {
  if (layout === 'image-gallery') return 'uniform';
  if (layout === 'masonry') return 'masonry';
  if (layout !== 'gallery') return null;
  const style = (galleryStyleAttr ?? 'uniform').toLowerCase();
  const allowed: GalleryStyle[] = ['uniform', 'masonry', 'carousel', 'strip', 'list', 'bento', 'billboard', 'slides'];
  return allowed.includes(style as GalleryStyle) ? (style as GalleryStyle) : 'uniform';
}

export function collectItems(host: HTMLElement): BaroViewItemData[] {
  const itemTag = 'baro-view-item';
  const children = Array.from(host.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el.tagName.toLowerCase() === itemTag
  );
  if (children.length > 0) {
    return children
      .map((el) => {
        const url = el.getAttribute('url') ?? '';
        const data: BaroViewItemData = { url };
        if (el.getAttribute('title')) data.title = el.getAttribute('title')!;
        const codePre = el.querySelector('code pre, pre');
        if (codePre) {
          data.content = (codePre as HTMLElement).innerText ?? (codePre as HTMLElement).textContent ?? '';
          data.contentType = el.querySelector('code pre') ? 'code' : 'text';
        }
        for (const name of el.getAttributeNames()) {
          if (name.startsWith('data-') && name.length > 5) {
            const val = el.getAttribute(name);
            if (val != null) data[name] = val;
          }
        }
        return data;
      })
      .filter((i) => i.url.trim() !== '' || (i.content != null && i.content !== ''));
  }
  const urlsAttr = host.getAttribute('urls');
  if (urlsAttr && urlsAttr.trim()) return parseUrls(urlsAttr).map((url) => ({ url }));
  return [];
}

export function formatToIconSvg(format: ViewFormat): string {
  switch (format) {
    case 'pdf':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4zM8 13h2v5H8v-5zm4 0h2v5h-2v-5zm-4-3h2v2H8v-2zm4 0h2v2h-2v-2z"/></svg>';
    case 'video':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7L8 5zM6 5v14H4V5h2z"/></svg>';
    case 'audio':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v9.28c-.47-.17-.97-.28-1.5-.28C8.01 12 6 14.01 6 16.5S8.01 21 10.5 21c2.31 0 4.2-1.75 4.45-4H15V6h4V3h-7z"/></svg>';
    case 'markdown':
    case 'html':
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v4h-2V6h-4v12h-2V6H6v2H4V4zm0 10h2v6H4v-6zm14 0h2v6h-2v-6z"/></svg>';
    case 'office':
    case 'unsupported':
    default:
      return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4z"/></svg>';
  }
}
