/**
 * Built-in viewer implementations. Registered on load so baroview can render
 * image, video, audio, html, markdown, pdf without a big switch.
 */
import type { ViewerHost } from './viewer-registry.js';
import { registerViewer } from './viewer-registry.js';
import type { ViewFormat } from './detect-format.js';

function renderImage(url: string, container: HTMLElement, host: ViewerHost): void {
  const fit = (host.getAttribute('fit') || 'contain').toLowerCase();
  const aspectRatio = host.getAttribute('aspect-ratio') || (fit === 'cover' ? '1' : 'auto');
  host.style.setProperty(
    '--baro-object-fit',
    ['cover', 'contain', 'fill', 'none'].includes(fit) ? fit : 'contain'
  );
  host.style.setProperty('--baro-aspect-ratio', aspectRatio);
  const wrap = document.createElement('div');
  wrap.className = 'img-wrap';
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Document preview';
  wrap.appendChild(img);
  container.appendChild(wrap);
}

function renderVideo(url: string, container: HTMLElement): void {
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.setAttribute('title', 'Video player');
  container.appendChild(video);
}

function renderAudio(url: string, container: HTMLElement): void {
  const audio = document.createElement('audio');
  audio.src = url;
  audio.controls = true;
  audio.setAttribute('title', 'Audio player');
  container.appendChild(audio);
}

function renderHtml(url: string, container: HTMLElement, host: ViewerHost): void {
  const sandbox = host.getAttribute('sandbox');
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = 'Content: html';
  if (sandbox !== null) iframe.setAttribute('sandbox', sandbox || '');
  container.appendChild(iframe);
}

function renderMarkdown(url: string, container: HTMLElement): Promise<void> {
  return fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(async (text) => {
      const { getMarkdownRenderer, renderMarkdown } = await import('./markdown-renderer.js');
      const renderer = getMarkdownRenderer();
      if (!renderer) throw new Error('Markdown renderer not set.');
      const html = await renderMarkdown(text);
      const div = document.createElement('div');
      div.className = 'markdown-body';
      div.innerHTML = html;
      container.appendChild(div);
    });
}

function renderPdf(url: string, container: HTMLElement, host: ViewerHost): Promise<void> {
  return import('./pdf-renderer.js').then(({ getPdfRenderer, renderPdf }) => {
    if (getPdfRenderer()) {
      return renderPdf(url, container);
    }
    const sandbox = host.getAttribute('sandbox');
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.title = 'Content: pdf';
    if (sandbox !== null) iframe.setAttribute('sandbox', sandbox || '');
    container.appendChild(iframe);
  });
}

function registerAll(): void {
  registerViewer('image' as ViewFormat, renderImage);
  registerViewer('video' as ViewFormat, renderVideo);
  registerViewer('audio' as ViewFormat, renderAudio);
  registerViewer('html' as ViewFormat, renderHtml);
  registerViewer('markdown' as ViewFormat, renderMarkdown);
  registerViewer('pdf' as ViewFormat, renderPdf);
}

registerAll();
