import { getFormatFromUrl, getFormatFromUrlSync, type ViewFormat } from './detect-format.js';
import { getViewer } from './viewer-registry.js';
import { STYLES } from './baroview-styles.js';
import type { BaroViewItemData, GalleryStyle, LayoutType } from './baroview-types.js';
import {
  collectItems,
  formatToIconSvg,
  parseRatios,
  parseStripThumbSize,
  resolveGalleryStyle,
} from './baroview-utils.js';

export type { BaroViewItemData, GalleryStyle, LayoutType } from './baroview-types.js';

export class BaroViewElement extends HTMLElement {
  static get observedAttributes() {
    return ['url', 'urls', 'layout', 'columns', 'rows', 'ratios', 'resizable', 'fit', 'aspect-ratio', 'sandbox', 'gallery-style', 'gallery-visible', 'strip-hero', 'strip-thumb-size', 'billboard-arrange', 'billboard-radius', 'billboard-canvas', 'billboard-content-size', 'billboard-image-max', 'billboard-item-size', 'slides-toolbar', 'slides-toolbar-style', 'slides-arrows', 'slides-autoplay', 'slides-fullscreen', 'slides-height', 'slides-direction', 'slides-pagination', 'slides-deep-link', 'slides-loop', 'slides-transition', 'slides-from-markdown'];
  }

  private _url = '';
  private _abort: AbortController | null = null;
  private _messageRoot: HTMLDivElement | null = null;
  private _viewerRoot: HTMLDivElement | null = null;
  private _currentFormat: ViewFormat | null = null;
  private _root: HTMLDivElement | null = null;

  private _childObserver: MutationObserver | null = null;
  private _slidesFromMarkdownItems: BaroViewItemData[] | null = null;

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.setAttribute('role', 'region');
    this.setAttribute('aria-label', 'Document viewer');
    const style = document.createElement('style');
    style.textContent = STYLES;
    this.shadowRoot!.appendChild(style);
    this._root = document.createElement('div');
    this._root.id = 'root';
    this.shadowRoot!.appendChild(this._root);
    this._childObserver = new MutationObserver((list) => {
      const hasItemChange = list.some((m) =>
        [...m.addedNodes, ...m.removedNodes].some((n) => n instanceof HTMLElement && n.tagName.toLowerCase() === 'baro-view-item')
      );
      if (hasItemChange && this._root) this._render();
    });
    this._childObserver.observe(this, { childList: true });
    this._render();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (this._root && name !== 'fit' && name !== 'aspect-ratio') this._render();
    if ((name === 'fit' || name === 'aspect-ratio') && this._viewerRoot && this._currentFormat === 'image') {
      const fit = (this.getAttribute('fit') || 'contain').toLowerCase();
      const aspectRatio = this.getAttribute('aspect-ratio') || (fit === 'cover' ? '1' : 'auto');
      this.style.setProperty('--baro-object-fit', ['cover', 'contain', 'fill', 'none'].includes(fit) ? fit : 'contain');
      this.style.setProperty('--baro-aspect-ratio', aspectRatio);
    }
  }

  private _render() {
    if (!this._root) return;
    const items = collectItems(this);
    const singleUrl = this.getAttribute('url') ?? items[0]?.url ?? '';
    this._root.innerHTML = '';

    if (items.length > 1) {
      this._renderGrid(items);
      return;
    }

    this._url = singleUrl;
    this._messageRoot = document.createElement('div');
    this._messageRoot.id = 'message';
    this._messageRoot.setAttribute('aria-live', 'polite');
    this._viewerRoot = document.createElement('div');
    this._viewerRoot.id = 'viewer';
    this._root.appendChild(this._messageRoot);
    this._root.appendChild(this._viewerRoot);
    this._load();
  }

  private _renderGrid(items: BaroViewItemData[]) {
    const urls = items.map((i) => i.url);
    const layout = (this.getAttribute('layout') ?? 'grid') as LayoutType;
    const cols = this.getAttribute('columns');
    const rows = this.getAttribute('rows');
    const ratiosAttr = this.getAttribute('ratios') ?? '';
    const ratios = parseRatios(ratiosAttr);

    const grid = document.createElement('div');
    grid.id = 'grid';
    this._root!.appendChild(grid);

    const validLayouts: LayoutType[] = ['row', 'column', 'columns', 'grid', 'sidebar', 'gallery', 'image-gallery', 'masonry'];
    const layoutType = validLayouts.includes(layout) ? layout : 'grid';
    const galleryStyle = resolveGalleryStyle(layoutType, this.getAttribute('gallery-style'));
    const isGallery = layoutType === 'gallery' || layoutType === 'image-gallery' || layoutType === 'masonry';
    const isResizable = !isGallery && this.hasAttribute('resizable') && urls.length >= 2;
    const isVerticalSplit = layoutType === 'column' || layoutType === 'columns';

    if (isResizable) {
      const N = urls.length;
      const defaultPct = 100 / N;
      const minPct = 5;
      for (let i = 0; i < N - 1; i++) {
        const val = ratios.length >= N ? (ratios[i]! / ratios.reduce((a, b) => a + b, 0)) * 100 : defaultPct;
        this.style.setProperty(`--baro-s${i + 1}`, String(val));
      }
      grid.classList.add(isVerticalSplit ? 'resize-vertical' : 'resize-horizontal');

      const getSizes = (): number[] => {
        const out: number[] = [];
        for (let i = 0; i < N - 1; i++) {
          out.push(parseFloat(this.style.getPropertyValue(`--baro-s${i + 1}`)) || defaultPct);
        }
        return out;
      };

      const parts: (HTMLElement | HTMLDivElement)[] = [];
      for (let i = 0; i < urls.length; i++) {
        const cell = document.createElement('baro-view') as HTMLElement;
        cell.setAttribute('url', urls[i]!);
        grid.appendChild(cell);
        parts.push(cell);
        if (i < urls.length - 1) {
          const handle = document.createElement('div');
          const handleIndex = i;
          handle.setAttribute('role', 'separator');
          handle.setAttribute('aria-label', `Resize panels ${i + 1} and ${i + 2}`);
          handle.tabIndex = 0;
          handle.className = isVerticalSplit ? 'resize-handle-vertical' : 'resize-handle';
          this._setupResize(handle, this, isVerticalSplit, (positionPct) => {
            const sizes = getSizes();
            const sumBefore = sizes.slice(0, handleIndex).reduce((a, b) => a + b, 0);
            const newSi = positionPct - sumBefore;
            const maxSi = 100 - minPct * (N - handleIndex) - sumBefore;
            const clamped = Math.min(maxSi, Math.max(minPct, newSi));
            this.style.setProperty(`--baro-s${handleIndex + 1}`, String(clamped));
            handle.setAttribute('aria-valuenow', String(Math.round(clamped)));
          });
          grid.appendChild(handle);
        }
      }

      const templateParts: string[] = [];
      for (let i = 0; i < N - 1; i++) {
        templateParts.push(`minmax(${isVerticalSplit ? '80px' : '120px'}, calc(var(--baro-s${i + 1}, ${defaultPct}) * 1%))`);
        templateParts.push(isVerticalSplit ? '6px' : '6px');
      }
      templateParts.push('1fr');
      if (isVerticalSplit) {
        grid.style.gridTemplateRows = templateParts.join(' ');
        grid.style.gridTemplateColumns = '1fr';
      } else {
        grid.style.gridTemplateColumns = templateParts.join(' ');
        grid.style.gridTemplateRows = 'none';
      }
      this.setAttribute('aria-label', 'Document viewers grid (resizable)');
      return;
    }

    if (isGallery && galleryStyle) {
      this.setAttribute('aria-label', 'Document viewers grid');
      const fit = this.getAttribute('fit') || (galleryStyle === 'uniform' || galleryStyle === 'bento' ? 'cover' : 'contain');
      const aspectRatio = this.getAttribute('aspect-ratio') || (galleryStyle === 'uniform' ? '1' : 'auto');

      if (galleryStyle === 'carousel') {
        grid.classList.add('layout-gallery-carousel');
        const visible = this.getAttribute('gallery-visible');
        const n = visible ? parseInt(visible, 10) : 1;
        const pct = n > 0 ? 100 / n : 100;
        this.style.setProperty('--baro-gallery-visible', `${pct}%`);
        for (const u of urls) {
          const cell = document.createElement('baro-view') as HTMLElement;
          cell.setAttribute('url', u);
          cell.setAttribute('fit', fit);
          cell.setAttribute('aspect-ratio', aspectRatio);
          grid.appendChild(cell);
        }
        return;
      }

      if (galleryStyle === 'strip') {
        grid.classList.add('layout-gallery-strip');
        const thumbSize = parseStripThumbSize(this.getAttribute('strip-thumb-size'));
        this.style.setProperty('--baro-strip-thumb-width', thumbSize.w);
        this.style.setProperty('--baro-strip-thumb-height', thumbSize.h);
        if ((this.getAttribute('strip-hero') ?? 'top').toLowerCase() === 'left') {
          grid.classList.add('strip-hero-left');
        }
        const hero = document.createElement('div');
        hero.className = 'gallery-hero';
        const heroView = document.createElement('baro-view') as HTMLElement;
        heroView.setAttribute('url', urls[0]!);
        heroView.setAttribute('fit', fit);
        heroView.setAttribute('aspect-ratio', aspectRatio);
        hero.appendChild(heroView);
        grid.appendChild(hero);
        const strip = document.createElement('div');
        strip.className = 'gallery-strip';
        strip.setAttribute('role', 'tablist');
        strip.setAttribute('aria-label', 'Gallery thumbnails');
        urls.forEach((u, i) => {
          const format = getFormatFromUrlSync(u);
          const isImage = format === 'image';
          const cell = document.createElement('div');
          cell.className = 'gallery-thumb-cell' + (i === 0 ? ' active' : '');
          cell.setAttribute('role', 'tab');
          cell.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
          cell.setAttribute('aria-label', isImage ? `Image ${i + 1}` : `Item ${i + 1}, ${format}`);
          cell.addEventListener('click', () => {
            heroView.setAttribute('url', u);
            for (let j = 0; j < strip.children.length; j++) {
              const el = strip.children[j] as HTMLElement;
              el.classList.toggle('active', j === i);
              el.setAttribute('aria-selected', j === i ? 'true' : 'false');
            }
          });
          if (isImage) {
            const view = document.createElement('baro-view') as HTMLElement;
            view.setAttribute('url', u);
            view.setAttribute('fit', 'cover');
            view.setAttribute('aspect-ratio', '1');
            cell.appendChild(view);
          } else {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'gallery-thumb-icon';
            btn.setAttribute('aria-hidden', 'true');
            btn.innerHTML = formatToIconSvg(format);
            cell.appendChild(btn);
          }
          strip.appendChild(cell);
        });
        grid.appendChild(strip);
        return;
      }

      if (galleryStyle === 'billboard') {
        grid.classList.add('layout-gallery-billboard');
        const arrange = (this.getAttribute('billboard-arrange') ?? 'circle').toLowerCase();
        const isCircle = arrange === 'circle';
        const radius = Math.max(40, parseInt(this.getAttribute('billboard-radius') ?? '120', 10) || 120);
        const canvasAttr = this.getAttribute('billboard-canvas');
        const canvasSize = canvasAttr ? parseStripThumbSize(canvasAttr) : null;
        const canvasW = canvasSize ? parseInt(canvasSize.w, 10) : 600;
        const canvasH = canvasSize ? parseInt(canvasSize.h, 10) : 400;
        const contentSize = this.getAttribute('billboard-content-size')
          ? parseStripThumbSize(this.getAttribute('billboard-content-size'))
          : { w: '220px', h: '280px' };
        const imageMax = this.getAttribute('billboard-image-max')
          ? parseStripThumbSize(this.getAttribute('billboard-image-max'))
          : { w: '360px', h: '270px' };
        const contentW = parseInt(contentSize.w, 10) || 220;
        const contentH = parseInt(contentSize.h, 10) || 280;
        const imageMaxW = parseInt(imageMax.w, 10) || 360;
        const imageMaxH = parseInt(imageMax.h, 10) || 270;
        this.style.setProperty('--baro-billboard-canvas-w', `${canvasW}px`);
        this.style.setProperty('--baro-billboard-canvas-h', `${canvasH}px`);
        this.style.setProperty('--baro-billboard-content-w', contentSize.w);
        this.style.setProperty('--baro-billboard-content-h', contentSize.h);
        this.style.setProperty('--baro-billboard-image-max-w', imageMax.w);
        this.style.setProperty('--baro-billboard-image-max-h', imageMax.h);

        const viewport = document.createElement('div');
        viewport.className = 'billboard-viewport';
        viewport.setAttribute('aria-label', 'Billboard canvas, drag to pan, scroll to zoom');
        const canvas = document.createElement('div');
        canvas.className = 'billboard-canvas';

        const n = urls.length;
        const gap = 12;
        const itemSizes = urls.map((u) => {
          const format = getFormatFromUrlSync(u);
          const isImage = format === 'image';
          return { w: isImage ? imageMaxW : contentW, h: isImage ? imageMaxH : contentH, isImage };
        });

        let minRadius = radius;
        if (isCircle && n > 1) {
          const sinHalf = Math.sin(Math.PI / n);
          for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            const rw = (itemSizes[i]!.w + itemSizes[j]!.w) / (4 * sinHalf);
            const rh = (itemSizes[i]!.h + itemSizes[j]!.h) / (4 * sinHalf);
            minRadius = Math.max(minRadius, rw, rh);
          }
        }
        const cx = canvasW / 2;
        const cy = canvasH / 2;
        let flowY = 0;
        let flowRowH = 0;
        let flowX = 0;

        urls.forEach((u, i) => {
          const { w: itemW, h: itemH, isImage } = itemSizes[i]!;
          let left: number;
          let top: number;
          if (isCircle && n > 0) {
            const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            left = cx + minRadius * Math.cos(angle) - itemW / 2;
            top = cy + minRadius * Math.sin(angle) - itemH / 2;
          } else {
            if (flowX + itemW + gap > canvasW && flowRowH > 0) {
              flowX = 0;
              flowY += flowRowH + gap;
              flowRowH = 0;
            }
            left = flowX;
            top = flowY;
            flowX += itemW + gap;
            flowRowH = Math.max(flowRowH, itemH);
          }
          const item = document.createElement('div');
          item.className = 'billboard-item ' + (isImage ? 'billboard-item--image' : 'billboard-item--content');
          item.style.left = `${left}px`;
          item.style.top = `${top}px`;
          const view = document.createElement('baro-view') as HTMLElement;
          view.setAttribute('url', u);
          view.setAttribute('fit', 'contain');
          view.setAttribute('aspect-ratio', 'auto');
          if (isImage) view.setAttribute('auto-size', '');
          item.appendChild(view);
          canvas.appendChild(item);
        });

        if (!isCircle && n > 0) {
          const totalH = flowY + flowRowH + gap;
          if (totalH > canvasH) canvas.style.height = `${totalH}px`;
        }

        viewport.appendChild(canvas);
        const toolbar = document.createElement('div');
        toolbar.className = 'billboard-toolbar';
        toolbar.setAttribute('aria-label', 'Billboard zoom controls');
        const zoomInBtn = document.createElement('button');
        zoomInBtn.type = 'button';
        zoomInBtn.setAttribute('aria-label', 'Zoom in');
        zoomInBtn.textContent = '+';
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.type = 'button';
        zoomOutBtn.setAttribute('aria-label', 'Zoom out');
        zoomOutBtn.textContent = '−';
        const resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.setAttribute('aria-label', 'Reset zoom');
        resetBtn.textContent = '⟲';
        toolbar.appendChild(zoomOutBtn);
        toolbar.appendChild(zoomInBtn);
        toolbar.appendChild(resetBtn);
        viewport.appendChild(toolbar);
        grid.appendChild(viewport);
        this._setupBillboardZoomPan(viewport, canvas, canvasW, canvasH, { zoomInBtn, zoomOutBtn, resetBtn });
        return;
      }

      if (galleryStyle === 'slides') {
        const mdUrl = this.getAttribute('slides-from-markdown')?.trim();
        if (mdUrl) {
          if (this._slidesFromMarkdownItems) {
            items = this._slidesFromMarkdownItems;
          } else {
            grid.classList.add('layout-gallery-slides');
            const loading = document.createElement('div');
            loading.className = 'spinner';
            loading.setAttribute('aria-busy', 'true');
            loading.textContent = 'Loading…';
            grid.appendChild(loading);
            fetch(mdUrl)
              .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
              .then(async (text) => {
                const { renderMarkdown } = await import('./markdown-renderer.js');
                const re = new RegExp('(?=^# .+$)', 'm');
                const chunks = text.split(re).map((s) => s.trim()).filter(Boolean);
                const htmlChunks = await Promise.all(chunks.map((c: string) => renderMarkdown(c)));
                this._slidesFromMarkdownItems = htmlChunks.map((content: string) => ({ url: '', content, contentType: 'markdown' as const }));
                this._render();
              })
              .catch(() => {
                loading.textContent = 'Failed to load';
              });
            return;
          }
        }
        const createArrowSvg = (dir: 'left' | 'right' | 'up' | 'down') => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 24 24');
          svg.setAttribute('fill', 'none');
          svg.setAttribute('stroke', 'currentColor');
          svg.setAttribute('stroke-width', '2');
          svg.setAttribute('stroke-linecap', 'round');
          svg.setAttribute('stroke-linejoin', 'round');
          svg.setAttribute('aria-hidden', 'true');
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = dir === 'left' ? 'M15 18l-6-6 6-6' : dir === 'right' ? 'M9 18l6-6-6-6' : dir === 'up' ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6';
          path.setAttribute('d', d);
          svg.appendChild(path);
          return svg;
        };
        grid.classList.add('layout-gallery-slides');
        const slidesDir = (this.getAttribute('slides-direction') ?? 'horizontal').toLowerCase();
        const isVertical = slidesDir === 'vertical';
        if (isVertical) grid.classList.add('slides-direction-vertical');
        this.style.setProperty('--baro-slides-count', String(items.length));
        const slidesHeight = this.getAttribute('slides-height');
        if (slidesHeight && /^\d+$/.test(slidesHeight)) this.style.setProperty('--baro-slides-height', `${slidesHeight}px`);
        const toolbarMode = (this.getAttribute('slides-toolbar') ?? 'hover').toLowerCase();
        if (toolbarMode === 'hover') grid.classList.add('slides-toolbar-hover');
        else if (toolbarMode === 'hidden') grid.classList.add('slides-toolbar-hidden');
        if ((this.getAttribute('slides-toolbar-style') ?? 'frosted').toLowerCase() === 'frosted') grid.classList.add('slides-toolbar-frosted');
        const arrowsMode = (this.getAttribute('slides-arrows') ?? 'edges').toLowerCase();
        const showArrows = arrowsMode !== 'none';
        const autoplaySec = parseInt(this.getAttribute('slides-autoplay') ?? '0', 10) || 0;
        const showFullscreen = this.hasAttribute('slides-fullscreen');
        const paginationMode = (this.getAttribute('slides-pagination') ?? 'dots').toLowerCase();
        const showDots = paginationMode === 'dots';
        const showFraction = paginationMode === 'fraction';
        const showProgress = paginationMode === 'progress';
        const deepLink = this.hasAttribute('slides-deep-link');
        const loop = this.hasAttribute('slides-loop');
        const transitionMode = (this.getAttribute('slides-transition') ?? 'none').toLowerCase();
        if (transitionMode === 'fade') grid.classList.add('slides-transition-fade');
        else if (transitionMode === 'slide') grid.classList.add('slides-transition-slide');

        const stage = document.createElement('div');
        stage.className = 'slides-stage';
        stage.setAttribute('aria-live', 'polite');
        const track = document.createElement('div');
        track.className = 'slides-track';
        items.forEach((it, i) => {
          const slide = document.createElement('div');
          slide.className = 'slides-slide' + (i === 0 ? ' slides-active' : '');
          if (it.content != null && it.content !== '') {
            const inline = document.createElement('div');
            inline.className = 'slides-inline-content ' + (it.contentType === 'code' ? 'slides-code-block' : it.contentType === 'markdown' ? 'markdown-body' : '');
            if (it.contentType === 'markdown') inline.innerHTML = it.content;
            else inline.textContent = it.content;
            inline.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
            slide.appendChild(inline);
          } else {
            const view = document.createElement('baro-view') as HTMLElement;
            view.setAttribute('url', it.url);
            view.setAttribute('fit', 'cover');
            view.setAttribute('aspect-ratio', 'auto');
            view.classList.add('slides-fill');
            view.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
            slide.appendChild(view);
          }
          track.appendChild(slide);
        });
        stage.appendChild(track);

        const stageWrap = document.createElement('div');
        stageWrap.className = 'slides-stage-wrap';
        if (showArrows) {
          const prevArrow = document.createElement('button');
          prevArrow.type = 'button';
          prevArrow.className = 'slides-arrow';
          prevArrow.setAttribute('aria-label', 'Previous slide');
          prevArrow.appendChild(createArrowSvg(isVertical ? 'up' : 'left'));
          stageWrap.appendChild(prevArrow);
        }
        stageWrap.appendChild(stage);
        if (showArrows) {
          const nextArrow = document.createElement('button');
          nextArrow.type = 'button';
          nextArrow.className = 'slides-arrow';
          nextArrow.setAttribute('aria-label', 'Next slide');
          nextArrow.appendChild(createArrowSvg(isVertical ? 'down' : 'right'));
          stageWrap.appendChild(nextArrow);
        }

        const toolbar = document.createElement('div');
        toolbar.className = 'slides-toolbar';
        toolbar.setAttribute('aria-label', 'Slide navigation');
        const prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.setAttribute('aria-label', 'Previous');
        prevBtn.appendChild(createArrowSvg(isVertical ? 'up' : 'left'));
        const nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.setAttribute('aria-label', 'Next');
        nextBtn.appendChild(createArrowSvg(isVertical ? 'down' : 'right'));
        const dots = document.createElement('div');
        dots.className = 'slides-dots';
        dots.setAttribute('role', 'tablist');
        dots.setAttribute('aria-label', 'Slides');
        if (showDots) {
          items.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goSlide(i));
            dots.appendChild(dot);
          });
        }
        const fractionEl = document.createElement('span');
        fractionEl.className = 'slides-fraction';
        fractionEl.setAttribute('aria-live', 'polite');
        const progressWrap = document.createElement('div');
        progressWrap.className = 'slides-progress-wrap';
        progressWrap.setAttribute('aria-hidden', 'true');
        const progressFill = document.createElement('div');
        progressFill.className = 'slides-progress-fill';
        progressWrap.appendChild(progressFill);
        let current = 0;
        let autoplayTimer: ReturnType<typeof setInterval> | null = null;

        const updateTrackTransform = () => {
          const pct = items.length > 0 ? (current * 100) / items.length : 0;
          const axis = isVertical ? 'Y' : 'X';
          (track as HTMLElement).style.transform = `translate${axis}(-${pct}%)`;
        };
        const MAX_VISIBLE_DOTS = 10;
        let dotsWindowStart = 0;
        let dotsRevealTimer: ReturnType<typeof setTimeout> | null = null;
        const updateDotsVisibility = () => {
          if (!showDots) return;
          const n = items.length;
          const prevStart = dotsWindowStart;
          if (n > MAX_VISIBLE_DOTS) {
            if (current < dotsWindowStart) dotsWindowStart = current;
            else if (current >= dotsWindowStart + MAX_VISIBLE_DOTS) dotsWindowStart = Math.max(0, current - MAX_VISIBLE_DOTS + 1);
            dotsWindowStart = Math.max(0, Math.min(dotsWindowStart, n - MAX_VISIBLE_DOTS));
          }
          const start = n <= MAX_VISIBLE_DOTS ? 0 : dotsWindowStart;
          const end = start + MAX_VISIBLE_DOTS;
          const blockChanged = n > MAX_VISIBLE_DOTS && prevStart !== dotsWindowStart;
          for (let i = 0; i < dots.children.length; i++) {
            const el = dots.children[i] as HTMLElement;
            const distance = Math.abs(i - current);
            const scale = Math.max(0.45, 1 - distance * 0.08);
            el.style.setProperty('--dot-scale', String(scale));
            el.style.display = n <= MAX_VISIBLE_DOTS || blockChanged || (i >= start && i < end) ? '' : 'none';
          }
          if (blockChanged) {
            if (dotsRevealTimer) clearTimeout(dotsRevealTimer);
            dotsRevealTimer = setTimeout(() => {
              dotsRevealTimer = null;
              for (let i = 0; i < dots.children.length; i++) {
                (dots.children[i] as HTMLElement).style.display = i >= start && i < end ? '' : 'none';
              }
            }, 700);
          } else if (dotsRevealTimer) {
            clearTimeout(dotsRevealTimer);
            dotsRevealTimer = null;
          }
        };
        updateTrackTransform();

        const goSlide = (index: number) => {
          const idx = Math.max(0, Math.min(index, items.length - 1));
          if (idx === current) return;
          const slides = track.children;
          (slides[current]!.firstElementChild as HTMLElement)?.setAttribute('aria-hidden', 'true');
          current = idx;
          (slides[current]!.firstElementChild as HTMLElement)?.setAttribute('aria-hidden', 'false');
          for (let i = 0; i < slides.length; i++) (slides[i] as HTMLElement).classList.toggle('slides-active', i === current);
          updateTrackTransform();
          if (showDots) {
            (dots.children[current] as HTMLElement)?.classList.add('active');
            (dots.children[current] as HTMLElement)?.setAttribute('aria-selected', 'true');
            for (let i = 0; i < dots.children.length; i++) {
              if (i !== current) {
                (dots.children[i] as HTMLElement)?.classList.remove('active');
                (dots.children[i] as HTMLElement)?.setAttribute('aria-selected', 'false');
              }
            }
          }
          updatePaginationDisplay();
          if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = setInterval(() => goSlide((current + 1) % items.length), autoplaySec * 1000);
          }
          if (!loop) {
            grid.classList.toggle('slides-at-start', current === 0);
            grid.classList.toggle('slides-at-end', current === items.length - 1);
          }
          if (deepLink) {
            const hash = `#slide=${current}`;
            if (location.hash !== hash) history.replaceState(null, '', hash);
          }
          if (showDots) updateDotsVisibility();
        };
        const updatePaginationDisplay = () => {
          if (showFraction) fractionEl.textContent = `${current + 1} / ${items.length}`;
          if (showProgress) progressFill.style.width = items.length > 0 ? `${((current + 1) / items.length) * 100}%` : '0%';
        };

        const prevSlide = () => goSlide(loop ? (current - 1 + items.length) % items.length : current - 1);
        const nextSlide = () => goSlide(loop ? (current + 1) % items.length : current + 1);
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        if (showArrows) {
          (stageWrap.querySelector('.slides-arrow:first-of-type') as HTMLButtonElement)?.addEventListener('click', prevSlide);
          (stageWrap.querySelector('.slides-arrow:last-of-type') as HTMLButtonElement)?.addEventListener('click', nextSlide);
        }

        const onKey = (e: KeyboardEvent) => {
          if (e.target instanceof HTMLButtonElement && e.target.closest('.slides-toolbar')) return;
          switch (e.key) {
            case 'ArrowLeft': if (!isVertical) { prevSlide(); e.preventDefault(); } break;
            case 'ArrowRight': if (!isVertical) { nextSlide(); e.preventDefault(); } break;
            case 'ArrowUp': if (isVertical) { prevSlide(); e.preventDefault(); } break;
            case 'ArrowDown': if (isVertical) { nextSlide(); e.preventDefault(); } break;
            case 'Home': goSlide(0); e.preventDefault(); break;
            case 'End': goSlide(items.length - 1); e.preventDefault(); break;
          }
        };
        grid.addEventListener('keydown', onKey);
        grid.setAttribute('tabindex', '0');
        grid.setAttribute('role', 'application');
        grid.setAttribute('aria-roledescription', 'Slide deck');

        const MIN_SWIPE_PX = 50;
        let touchStartX = 0, touchStartY = 0;
        let swipeDecided: 'horizontal' | 'vertical' | null = null;
        stageWrap.addEventListener('touchstart', (e: TouchEvent) => {
          if (e.changedTouches.length === 0) return;
          touchStartX = e.changedTouches[0]!.clientX;
          touchStartY = e.changedTouches[0]!.clientY;
          swipeDecided = null;
        }, { passive: true });
        stageWrap.addEventListener('touchmove', (e: TouchEvent) => {
          if (e.changedTouches.length === 0) return;
          const x = e.changedTouches[0]!.clientX - touchStartX;
          const y = e.changedTouches[0]!.clientY - touchStartY;
          if (swipeDecided === null && (Math.abs(x) > 10 || Math.abs(y) > 10)) {
            swipeDecided = isVertical
              ? (Math.abs(y) >= Math.abs(x) ? 'vertical' : 'horizontal')
              : (Math.abs(x) >= Math.abs(y) ? 'horizontal' : 'vertical');
          }
          if (swipeDecided === 'horizontal' && Math.abs(x) > Math.abs(y)) e.preventDefault();
          if (swipeDecided === 'vertical' && Math.abs(y) > Math.abs(x)) e.preventDefault();
        }, { passive: false });
        stageWrap.addEventListener('touchend', (e: TouchEvent) => {
          if (e.changedTouches.length === 0) return;
          const x = e.changedTouches[0]!.clientX - touchStartX;
          const y = e.changedTouches[0]!.clientY - touchStartY;
          if (swipeDecided === null && (Math.abs(x) > 10 || Math.abs(y) > 10)) {
            swipeDecided = isVertical ? (Math.abs(y) >= Math.abs(x) ? 'vertical' : 'horizontal') : (Math.abs(x) >= Math.abs(y) ? 'horizontal' : 'vertical');
          }
          if (swipeDecided === 'horizontal' && Math.abs(x) >= MIN_SWIPE_PX) {
            if (x > 0) prevSlide(); else nextSlide();
          } else if (swipeDecided === 'vertical' && Math.abs(y) >= MIN_SWIPE_PX) {
            if (y > 0) prevSlide(); else nextSlide();
          }
        }, { passive: true });

        if (autoplaySec > 0) autoplayTimer = setInterval(() => goSlide((current + 1) % items.length), autoplaySec * 1000);

        if (!loop) {
          grid.classList.toggle('slides-at-start', current === 0);
          grid.classList.toggle('slides-at-end', current === items.length - 1);
        }
        if (deepLink) {
          const hashMatch = location.hash.match(/^#slide=(\d+)$/);
          if (hashMatch) {
            const idx = parseInt(hashMatch[1]!, 10);
            if (idx >= 0 && idx < items.length) goSlide(idx);
          }
          const onHashChange = () => {
            const m = location.hash.match(/^#slide=(\d+)$/);
            if (m) {
              const idx = parseInt(m[1]!, 10);
              if (idx >= 0 && idx < items.length && idx !== current) goSlide(idx);
            }
          };
          window.addEventListener('hashchange', onHashChange);
        }
        if (showDots) updateDotsVisibility();
        updatePaginationDisplay();

        toolbar.appendChild(prevBtn);
        if (showDots) toolbar.appendChild(dots);
        if (showFraction) toolbar.appendChild(fractionEl);
        if (showProgress) toolbar.appendChild(progressWrap);
        toolbar.appendChild(nextBtn);
        if (showFullscreen) {
          const fsBtn = document.createElement('button');
          fsBtn.type = 'button';
          fsBtn.setAttribute('aria-label', 'Fullscreen');
          fsBtn.textContent = '⛶';
          const host = this;
          fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) {
              host.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          });
          toolbar.appendChild(fsBtn);
        }

        stageWrap.appendChild(toolbar);
        grid.appendChild(stageWrap);
        return;
      }

      if (galleryStyle === 'list') {
        grid.classList.add('layout-gallery-list');
        for (const u of urls) {
          const cell = document.createElement('baro-view') as HTMLElement;
          cell.setAttribute('url', u);
          cell.setAttribute('fit', fit);
          cell.setAttribute('aspect-ratio', aspectRatio);
          grid.appendChild(cell);
        }
        return;
      }

      if (galleryStyle === 'bento') {
        grid.classList.add('layout-gallery-bento');
        for (const u of urls) {
          const cell = document.createElement('baro-view') as HTMLElement;
          cell.setAttribute('url', u);
          cell.setAttribute('fit', fit);
          cell.setAttribute('aspect-ratio', aspectRatio);
          grid.appendChild(cell);
        }
        return;
      }

      if (galleryStyle === 'uniform') {
        grid.classList.add('layout-image-gallery');
        for (const u of urls) {
          const cell = document.createElement('baro-view') as HTMLElement;
          cell.setAttribute('url', u);
          cell.setAttribute('fit', fit);
          cell.setAttribute('aspect-ratio', aspectRatio);
          grid.appendChild(cell);
        }
        return;
      }

      if (galleryStyle === 'masonry') {
        grid.classList.add('layout-masonry');
        const colCount = cols ? parseInt(cols, 10) : 3;
        grid.style.columnCount = String(colCount);
        for (const u of urls) {
          const cell = document.createElement('baro-view') as HTMLElement;
          cell.setAttribute('url', u);
          grid.appendChild(cell);
        }
        return;
      }
    }

    if (layoutType === 'row') {
      grid.style.gridTemplateColumns = ratios.length >= urls.length
        ? ratios.slice(0, urls.length).join('fr ') + 'fr'
        : Array(urls.length).fill('1fr').join(' ');
      grid.style.gridTemplateRows = 'none';
      grid.style.gridAutoFlow = 'column';
    } else if (layoutType === 'column' || layoutType === 'columns') {
      grid.style.gridTemplateRows = ratios.length >= urls.length
        ? ratios.slice(0, urls.length).join('fr ') + 'fr'
        : Array(urls.length).fill('1fr').join(' ');
      grid.style.gridTemplateColumns = 'none';
      grid.style.gridAutoFlow = 'row';
    } else if (layoutType === 'sidebar') {
      grid.style.gridTemplateColumns = ratios.length >= 2
        ? ratios.slice(0, 2).join('fr ') + 'fr'
        : '1fr 2fr';
    } else {
      const c = cols ? parseInt(cols, 10) : 0;
      const r = rows ? parseInt(rows, 10) : 0;
      if (c > 0 && r > 0) {
        grid.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${r}, 1fr)`;
      } else if (c > 0) {
        grid.style.gridTemplateColumns = `repeat(${c}, 1fr)`;
        grid.style.gridAutoRows = '1fr';
      } else if (r > 0) {
        grid.style.gridTemplateRows = `repeat(${r}, 1fr)`;
        grid.style.gridAutoColumns = '1fr';
      } else {
        const n = Math.min(urls.length, 2);
        grid.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
        grid.style.gridAutoRows = '1fr';
      }
    }

    this.setAttribute('aria-label', 'Document viewers grid');
    for (const u of urls) {
      const cell = document.createElement('baro-view') as HTMLElement;
      cell.setAttribute('url', u);
      grid.appendChild(cell);
    }
  }

  private _setupResize(
    handle: HTMLElement,
    host: BaroViewElement,
    isVertical: boolean,
    onUpdate: (pct: number) => void
  ) {
    const move = (e: MouseEvent | Touch) => {
      const rect = host.getBoundingClientRect();
      const size = isVertical ? rect.height : rect.width;
      const pos = isVertical ? e.clientY : e.clientX;
      const min = 10;
      const max = 90;
      const pct = isVertical
        ? Math.min(max, Math.max(min, ((pos - rect.top) / size) * 100))
        : Math.min(max, Math.max(min, ((pos - rect.left) / size) * 100));
      onUpdate(pct);
    };

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      const onMouseMove = (e2: MouseEvent) => move(e2);
      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      document.body.style.cursor = isVertical ? 'row-resize' : 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    const onTouchStart = (_e: TouchEvent) => {
      const onTouchMove = (e2: TouchEvent) => {
        if (e2.cancelable) e2.preventDefault();
        move(e2.touches[0]);
      };
      const onTouchEnd = () => {
        document.removeEventListener('touchmove', onTouchMove, { capture: true });
        document.removeEventListener('touchend', onTouchEnd);
      };
      document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
      document.addEventListener('touchend', onTouchEnd);
    };

    handle.addEventListener('mousedown', onMouseDown);
    handle.addEventListener('touchstart', onTouchStart, { passive: true });
  }

  private _setupBillboardZoomPan(
    viewport: HTMLElement,
    canvas: HTMLElement,
    canvasW: number,
    canvasH: number,
    toolbar?: { zoomInBtn: HTMLButtonElement; zoomOutBtn: HTMLButtonElement; resetBtn: HTMLButtonElement }
  ) {
    let scale = 1;
    let tx = 0;
    let ty = 0;
    const apply = () => {
      canvas.style.transform = `translate(${tx}px,${ty}px) scale(${scale})`;
    };

    const zoomToward = (viewportX: number, viewportY: number, newScale: number) => {
      const canvasX = (viewportX - tx) / scale;
      const canvasY = (viewportY - ty) / scale;
      tx = viewportX - canvasX * newScale;
      ty = viewportY - canvasY * newScale;
      scale = newScale;
      apply();
    };

    requestAnimationFrame(() => {
      const r = viewport.getBoundingClientRect();
      tx = r.width / 2 - canvasW / 2;
      ty = r.height / 2 - canvasH / 2;
      apply();
    });

    viewport.addEventListener('wheel', (e: WheelEvent) => {
      e.preventDefault();
      const r = viewport.getBoundingClientRect();
      const vx = e.clientX - r.left;
      const vy = e.clientY - r.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(4, Math.max(0.15, scale * factor));
      zoomToward(vx, vy, newScale);
    }, { passive: false });

    if (toolbar) {
      toolbar.zoomInBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = viewport.getBoundingClientRect();
        zoomToward(r.width / 2, r.height / 2, Math.min(4, scale * 1.2));
      });
      toolbar.zoomOutBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = viewport.getBoundingClientRect();
        zoomToward(r.width / 2, r.height / 2, Math.max(0.15, scale * 0.8));
      });
      toolbar.resetBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const r = viewport.getBoundingClientRect();
        scale = 1;
        tx = r.width / 2 - canvasW / 2;
        ty = r.height / 2 - canvasH / 2;
        apply();
      });
    }

    let panStart = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPanMove = (e: MouseEvent) => {
      tx = panStart.tx + (e.clientX - panStart.x);
      ty = panStart.ty + (e.clientY - panStart.y);
      apply();
    };
    const onPanEnd = () => {
      document.removeEventListener('mousemove', onPanMove);
      document.removeEventListener('mouseup', onPanEnd);
      viewport.style.cursor = 'grab';
    };
    viewport.addEventListener('mousedown', (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest?.('.billboard-item') || (e.target as HTMLElement).closest?.('.billboard-toolbar')) return;
      e.preventDefault();
      panStart = { x: e.clientX, y: e.clientY, tx, ty };
      viewport.style.cursor = 'grabbing';
      document.addEventListener('mousemove', onPanMove);
      document.addEventListener('mouseup', onPanEnd);
    });

    let touchStart: { x: number; y: number; tx: number; ty: number; scale: number } | null = null;
    let pinchStart = 0;
    let singleTouchStart: { x: number; y: number; tx: number; ty: number } | null = null;
    viewport.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        pinchStart = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        touchStart = { x: (e.touches[0].clientX + e.touches[1].clientX) / 2, y: (e.touches[0].clientY + e.touches[1].clientY) / 2, tx, ty, scale };
      } else if (e.touches.length === 1) {
        singleTouchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY, tx, ty };
      }
    }, { passive: true });
    viewport.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2 && touchStart) {
        e.preventDefault();
        const pinch = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        scale = Math.min(4, Math.max(0.15, touchStart.scale * (pinch / pinchStart)));
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        tx = touchStart.tx + (cx - touchStart.x);
        ty = touchStart.ty + (cy - touchStart.y);
        apply();
      } else if (e.touches.length === 1 && singleTouchStart) {
        tx = singleTouchStart.tx + (e.touches[0].clientX - singleTouchStart.x);
        ty = singleTouchStart.ty + (e.touches[0].clientY - singleTouchStart.y);
        apply();
      }
    }, { passive: false });
    viewport.addEventListener('touchend', (e: TouchEvent) => {
      if (e.touches.length < 2) touchStart = null;
      if (e.touches.length < 1) singleTouchStart = null;
    });
  }

  private _load() {
    if (this._abort) this._abort.abort();
    this._abort = new AbortController();
    const signal = this._abort.signal;

    if (!this._url.trim()) {
      this._showState('error', 'No URL provided.');
      return;
    }

    this.setAttribute('aria-busy', 'true');
    this._showState('loading', 'Loading…');
    const minLoadingMs = 200;
    Promise.all([
      getFormatFromUrl(this._url),
      new Promise<void>((r) => setTimeout(r, minLoadingMs)),
    ])
      .then(([format]) => {
        if (signal.aborted) return;
        this._currentFormat = format;
        this.setAttribute('aria-busy', 'false');
        this._renderViewer(this._url, format);
      })
      .catch((err) => {
        if (signal.aborted) return;
        this.setAttribute('aria-busy', 'false');
        const msg =
          err instanceof TypeError && err.message.includes('fetch')
            ? 'Could not load (CORS or network). Try opening the link in a new tab.'
            : `Failed to load: ${err instanceof Error ? err.message : String(err)}`;
        this._showState('error', msg, true);
      });
  }

  private _showState(
    kind: 'loading' | 'error' | 'unsupported',
    message: string,
    showActions = false
  ) {
    if (!this._messageRoot || !this._viewerRoot) return;
    this._messageRoot.hidden = false;
    this._viewerRoot.classList.remove('visible');
    this._viewerRoot.innerHTML = '';
    this._messageRoot.className = ` ${kind}`.trim();
    this._messageRoot.innerHTML = '';
    if (kind === 'loading') {
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      spinner.setAttribute('aria-hidden', 'true');
      this._messageRoot.appendChild(spinner);
    }
    const p = document.createElement('p');
    p.textContent = message;
    this._messageRoot.appendChild(p);
    if (showActions) {
      const actions = document.createElement('div');
      actions.className = 'actions';
      const openLink = document.createElement('a');
      openLink.href = this._url;
      openLink.target = '_blank';
      openLink.rel = 'noopener noreferrer';
      openLink.className = 'open-link';
      openLink.textContent = 'Open in new tab';
      openLink.setAttribute('tabindex', '0');
      actions.appendChild(openLink);
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Retry';
      retry.addEventListener('click', () => this._load());
      actions.appendChild(retry);
      this._messageRoot.appendChild(actions);
    }
    this._messageRoot.hidden = false;
  }

  private _renderViewer(url: string, format: ViewFormat) {
    if (!this._messageRoot || !this._viewerRoot) return;
    this._messageRoot.hidden = true;
    this._viewerRoot.innerHTML = '';
    this._viewerRoot.classList.add('visible');
    const formatLabel = format === 'markdown' ? 'Markdown' : format;
    this.setAttribute('aria-label', `Document viewer: ${formatLabel}`);

    if (format === 'office' || format === 'unsupported') {
      this._messageRoot.hidden = false;
      this._viewerRoot.classList.remove('visible');
      this._messageRoot.className = 'unsupported';
      this._messageRoot.innerHTML = '';
      const p = document.createElement('p');
      p.textContent =
        format === 'office'
          ? 'Office documents (DOCX, XLSX, PPTX) are not yet supported.'
          : 'Unsupported format.';
      this._messageRoot.appendChild(p);
      const actions = document.createElement('div');
      actions.className = 'actions';
      const a = document.createElement('a');
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = 'open-link';
      a.textContent = 'Open in new tab';
      a.setAttribute('tabindex', '0');
      actions.appendChild(a);
      this._messageRoot.appendChild(actions);
      return;
    }

    const render = getViewer(format);
    if (!render) {
      this._messageRoot.hidden = false;
      this._viewerRoot.classList.remove('visible');
      this._messageRoot.className = 'unsupported';
      this._messageRoot.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = 'Unsupported format.';
      this._messageRoot.appendChild(p);
      const actions = document.createElement('div');
      actions.className = 'actions';
      const openLink = document.createElement('a');
      openLink.href = url;
      openLink.target = '_blank';
      openLink.rel = 'noopener noreferrer';
      openLink.className = 'open-link';
      openLink.textContent = 'Open in new tab';
      openLink.setAttribute('tabindex', '0');
      actions.appendChild(openLink);
      this._messageRoot.appendChild(actions);
      return;
    }

    Promise.resolve(render(url, this._viewerRoot, this)).catch((err) => {
      if (!this._messageRoot) return;
      this._messageRoot.hidden = false;
      this._viewerRoot?.classList.remove('visible');
      this._messageRoot.className = 'error';
      this._messageRoot.innerHTML = '';
      const p = document.createElement('p');
      p.textContent = err instanceof Error ? err.message : String(err);
      this._messageRoot.appendChild(p);
    });
  }

  disconnectedCallback() {
    this._childObserver?.disconnect();
    this._childObserver = null;
    if (this._abort) this._abort.abort();
  }

  get url(): string {
    return this._url;
  }
  set url(value: string) {
    this.setAttribute('url', value);
  }
}

/** Data-only element for declaring items when using baro-view with multiple URLs. Use as child of <baro-view>. */
export class BaroViewItemElement extends HTMLElement {
  static get observedAttributes() {
    return ['url', 'title'];
  }
}

if (typeof window !== 'undefined') {
  if (!customElements.get('baro-view')) customElements.define('baro-view', BaroViewElement);
  if (!customElements.get('baro-view-item')) customElements.define('baro-view-item', BaroViewItemElement);
}

export { getFormatFromUrl, formatFromContentType } from './detect-format.js';
export type { ViewFormat } from './detect-format.js';
