/**
 * Format type supported by baroview (1st wave).
 */
export type ViewFormat =
  | 'image'
  | 'video'
  | 'audio'
  | 'pdf'
  | 'html'
  | 'markdown'
  | 'office'
  | 'unsupported';

const EXT_TO_FORMAT: Record<string, ViewFormat> = {
  jpg: 'image',
  jpeg: 'image',
  png: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  mp4: 'video',
  webm: 'video',
  ogv: 'video',
  mp3: 'audio',
  wav: 'audio',
  ogg: 'audio',
  weba: 'audio',
  m4a: 'audio',
  pdf: 'pdf',
  html: 'html',
  htm: 'html',
  md: 'markdown',
  markdown: 'markdown',
  docx: 'office',
  xlsx: 'office',
  pptx: 'office',
};

function getExtension(url: string): string {
  try {
    const pathname = new URL(url, window.location.origin).pathname;
    const last = pathname.split('/').pop() ?? '';
    const dot = last.lastIndexOf('.');
    if (dot <= 0) return '';
    return last.slice(dot + 1).toLowerCase();
  } catch {
    return '';
  }
}

/**
 * Resolve format from Content-Type header (e.g. from HEAD response).
 */
export function formatFromContentType(contentType: string): ViewFormat {
  const normalized = contentType.split(';')[0].trim().toLowerCase();
  if (normalized.startsWith('image/')) return 'image';
  if (normalized.startsWith('video/')) return 'video';
  if (normalized.startsWith('audio/')) return 'audio';
  if (normalized === 'application/pdf') return 'pdf';
  if (normalized === 'text/html') return 'html';
  if (normalized === 'text/markdown') return 'markdown';
  if (normalized.includes('vnd.openxmlformats-officedocument')) return 'office';
  return 'unsupported';
}

function getFormatFromDataUrl(url: string): ViewFormat | null {
  if (!url.startsWith('data:')) return null;
  const comma = url.indexOf(',');
  if (comma === -1) return null;
  const header = url.slice(5, comma).split(';')[0].trim();
  return formatFromContentType(header);
}

/**
 * Detect format from URL synchronously (extension + data URL only; no HEAD).
 * Use for thumbnail/icon decisions where async is not desired.
 */
export function getFormatFromUrlSync(url: string): ViewFormat {
  const fromData = getFormatFromDataUrl(url);
  if (fromData && fromData !== 'unsupported') return fromData;
  const ext = getExtension(url);
  if (ext && EXT_TO_FORMAT[ext]) return EXT_TO_FORMAT[ext];
  return 'unsupported';
}

/**
 * Detect viewer format from URL: data URL → extension → HEAD request for Content-Type.
 */
export async function getFormatFromUrl(url: string): Promise<ViewFormat> {
  const fromData = getFormatFromDataUrl(url);
  if (fromData && fromData !== 'unsupported') return fromData;

  const ext = getExtension(url);
  if (ext && EXT_TO_FORMAT[ext]) return EXT_TO_FORMAT[ext];

  try {
    const res = await fetch(url, { method: 'HEAD' });
    const ct = res.headers.get('Content-Type');
    if (ct) return formatFromContentType(ct);
  } catch {
    // CORS or network failure; fall back to extension or unsupported
  }

  return ext ? 'unsupported' : 'unsupported';
}
