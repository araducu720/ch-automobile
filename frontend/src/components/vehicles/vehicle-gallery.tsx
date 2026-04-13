'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  ChevronLeft, ChevronRight, Maximize2, X,
  Grid3X3, GalleryHorizontal, ZoomIn, ZoomOut,
  Download, Play, Pause, RotateCcw,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { MediaItem } from '@/types';

interface VehicleGalleryProps {
  images: MediaItem[];
  vehicleName: string;
}

type GalleryView = 'slider' | 'grid';

export function VehicleGallery({ images, vehicleName }: VehicleGalleryProps) {
  const t = useTranslations('accessibility');
  const tg = useTranslations('gallery');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [view, setView] = useState<GalleryView>('slider');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPanPos = useRef({ x: 0, y: 0 });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const next = (index + images.length) % images.length;
      setCurrentIndex(next);
      setIsLoading(true);
      setImgError(false);
      setZoom(1);
      setPan({ x: 0, y: 0 });
    },
    [images.length],
  );

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (view !== 'slider' || !thumbnailsRef.current) return;
    const activeThumb = thumbnailsRef.current.querySelector('[aria-current="true"]');
    activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentIndex, view]);

  // Preload adjacent images
  const preloadUrls = useMemo(() => {
    if (!images.length) return [];
    const urls: string[] = [];
    for (const offset of [-1, 1, 2]) {
      const idx = (currentIndex + offset + images.length) % images.length;
      if (idx !== currentIndex) {
        urls.push(images[idx]?.large || images[idx]?.original);
      }
    }
    return urls;
  }, [images, currentIndex]);

  useEffect(() => {
    preloadUrls.forEach((url) => {
      if (url) {
        const img = new window.Image();
        img.src = url;
      }
    });
  }, [preloadUrls]);

  // Autoplay slideshow (respects prefers-reduced-motion)
  useEffect(() => {
    if (autoplay && images.length > 1) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setAutoplay(false);
        return;
      }
      autoplayRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsLoading(true);
        setImgError(false);
      }, 3500);
    }
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, images.length]);

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => !prev);
  }, []);

  // Download current image
  const handleDownload = useCallback(async () => {
    const url = images[currentIndex]?.original || images[currentIndex]?.large;
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${vehicleName.replace(/\s+/g, '-')}-${currentIndex + 1}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  }, [images, currentIndex, vehicleName]);

  // Touch swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, [zoom]);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || zoom > 1) return;
      const diffX = touchStartX.current - e.changedTouches[0].clientX;
      const diffY = touchStartY.current! - e.changedTouches[0].clientY;
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) goNext();
        else goPrev();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [goNext, goPrev, zoom],
  );

  // Lightbox open/close
  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) setCurrentIndex(index);
    setLightboxOpen(true);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => {
      const next = Math.max(z - 0.5, 1);
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2.5);
    }
  }, [zoom]);

  // Pan when zoomed (mouse drag)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom <= 1) return;
      isDragging.current = true;
      lastPanPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    },
    [zoom],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current || zoom <= 1) return;
      const dx = e.clientX - lastPanPos.current.x;
      const dy = e.clientY - lastPanPos.current.y;
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      lastPanPos.current = { x: e.clientX, y: e.clientY };
    },
    [zoom],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Scroll to zoom in lightbox
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoom((z) => Math.min(z + 0.25, 4));
    } else {
      setZoom((z) => {
        const next = Math.max(z - 0.25, 1);
        if (next === 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  }, []);

  // Lightbox focus trap and keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      lightboxRef.current?.querySelector<HTMLElement>('button')?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === '+' || e.key === '=') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0') { setZoom(1); setPan({ x: 0, y: 0 }); }
      if (e.key === ' ') { e.preventDefault(); toggleAutoplay(); }
      if (e.key === 'd' || e.key === 'D') handleDownload();
      // Focus trap
      if (e.key === 'Tab' && lightboxRef.current) {
        const focusable = lightboxRef.current.querySelectorAll<HTMLElement>('button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [lightboxOpen, goNext, goPrev, closeLightbox, handleZoomIn, handleZoomOut, toggleAutoplay, handleDownload]);

  if (!images.length) {
    return (
      <div className="aspect-[16/9] rounded-xl bg-tertiary flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <GalleryHorizontal className="mx-auto h-12 w-12 mb-2 opacity-50" />
          <p>{t('noImages')}</p>
        </div>
      </div>
    );
  }

  const current = images[currentIndex];

  return (
    <>
      {/* View toggle + Image count */}
      {images.length > 1 && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {images.length} {tg('photos')}
          </span>
          <div className="flex gap-1">
            {images.length > 1 && (
              <button
                onClick={toggleAutoplay}
                className={cn(
                  'rounded-lg p-1.5 transition-colors',
                  autoplay
                    ? 'bg-brand text-white'
                    : 'text-muted-foreground hover:bg-tertiary',
                )}
                aria-label={autoplay ? tg('pauseSlideshow') : tg('playSlideshow')}
                title={autoplay ? tg('pauseSlideshow') : tg('playSlideshow')}
              >
                {autoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={() => setView('slider')}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                view === 'slider'
                  ? 'bg-brand text-white'
                  : 'text-muted-foreground hover:bg-tertiary',
              )}
              aria-label={tg('sliderView')}
            >
              <GalleryHorizontal className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn(
                'rounded-lg p-1.5 transition-colors',
                view === 'grid'
                  ? 'bg-brand text-white'
                  : 'text-muted-foreground hover:bg-tertiary',
              )}
              aria-label={tg('gridView')}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Slider View */}
      {view === 'slider' && (
        <div className="space-y-3">
          {/* Main Image */}
          <div
            className="relative aspect-[16/9] rounded-xl overflow-hidden bg-tertiary group cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => openLightbox()}
          >
            {/* Loading skeleton */}
            {isLoading && (
              <div className="absolute inset-0 z-10 animate-pulse bg-tertiary" />
            )}

            {imgError ? (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <GalleryHorizontal className="mx-auto h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">{tg('imageLoadError')}</p>
                </div>
              </div>
            ) : (
              <Image
                src={current.large || current.original}
                alt={`${vehicleName} – ${t('imageOf', { current: currentIndex + 1, total: images.length })}`}
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className={cn(
                  'object-cover transition-all duration-500',
                  isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
                )}
                priority={currentIndex === 0}
                onLoad={() => setIsLoading(false)}
                onError={() => { setIsLoading(false); setImgError(true); }}
              />
            )}

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className={cn(
                    'absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-2.5',
                    'bg-black/50 text-white backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    'hover:bg-black/70 focus-visible:opacity-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  )}
                  aria-label={t('previousImage')}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2.5',
                    'bg-black/50 text-white backdrop-blur-sm',
                    'opacity-0 group-hover:opacity-100 transition-opacity',
                    'hover:bg-black/70 focus-visible:opacity-100',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                  )}
                  aria-label={t('nextImage')}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Fullscreen button */}
            <button
              onClick={(e) => { e.stopPropagation(); openLightbox(); }}
              className={cn(
                'absolute right-3 bottom-3 rounded-lg p-2',
                'bg-black/50 text-white backdrop-blur-sm',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'hover:bg-black/70',
              )}
              aria-label={t('fullscreenOpen')}
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Counter */}
            <div className="absolute left-3 bottom-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* Autoplay progress bar */}
            {autoplay && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
                <div className="h-full bg-brand animate-[progress_3.5s_linear_infinite]" />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div
              ref={thumbnailsRef}
              className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scroll-smooth"
            >
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => { setCurrentIndex(i); setIsLoading(true); setImgError(false); }}
                  className={cn(
                    'relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200',
                    i === currentIndex
                      ? 'border-brand ring-1 ring-brand scale-105'
                      : 'border-transparent hover:border-border-secondary opacity-60 hover:opacity-100',
                  )}
                  aria-label={t('showImage', { number: i + 1 })}
                  aria-current={i === currentIndex ? 'true' : undefined}
                >
                  <Image
                    src={img.thumbnail}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => openLightbox(i)}
              className={cn(
                'relative aspect-[4/3] rounded-lg overflow-hidden bg-tertiary',
                'group/grid cursor-pointer transition-all hover:ring-2 hover:ring-brand',
              )}
            >
              <Image
                src={img.medium || img.thumbnail}
                alt={`${vehicleName} – ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover/grid:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover/grid:bg-black/10 transition-colors" />
              <div className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover/grid:opacity-100 transition-opacity">
                {i + 1}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('imageGallery')}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white shrink-0">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-1">
              {/* Zoom controls */}
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                className={cn(
                  'rounded-full p-2 transition-colors',
                  zoom <= 1 ? 'text-white/30' : 'text-white hover:bg-white/10',
                )}
                aria-label={t('zoomOut')}
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-xs w-12 text-center tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 4}
                className={cn(
                  'rounded-full p-2 transition-colors',
                  zoom >= 4 ? 'text-white/30' : 'text-white hover:bg-white/10',
                )}
                aria-label={t('zoomIn')}
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button
                onClick={handleDownload}
                className="rounded-full p-2 text-white hover:bg-white/10"
                aria-label={tg('downloadImage')}
                title={tg('downloadImage')}
              >
                <Download className="h-5 w-5" />
              </button>
              {images.length > 1 && (
                <button
                  onClick={toggleAutoplay}
                  className={cn(
                    'rounded-full p-2 transition-colors',
                    autoplay ? 'text-brand bg-white/10' : 'text-white hover:bg-white/10',
                  )}
                  aria-label={autoplay ? tg('pauseSlideshow') : tg('playSlideshow')}
                >
                  {autoplay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </button>
              )}
              <button
                onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                disabled={zoom === 1}
                className={cn(
                  'rounded-full p-2 transition-colors',
                  zoom === 1 ? 'text-white/30' : 'text-white hover:bg-white/10',
                )}
                aria-label={tg('resetZoom')}
              >
                <RotateCcw className="h-5 w-5" />
              </button>
              <div className="w-px h-6 bg-white/20 mx-2" />
              <button
                onClick={closeLightbox}
                className="rounded-full p-2 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={t('fullscreenClose')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Main lightbox image area */}
          <div
            className="relative flex-1 flex items-center justify-center overflow-hidden"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDoubleClick={handleDoubleClick}
            style={{ cursor: zoom > 1 ? (isDragging.current ? 'grabbing' : 'grab') : 'zoom-in' }}
          >
            <div
              className="relative w-full h-full transition-transform duration-150 ease-out"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              }}
            >
              <Image
                src={current.original || current.large}
                alt={`${vehicleName} – ${t('imageOf', { current: currentIndex + 1, total: images.length })}`}
                fill
                sizes="100vw"
                className="object-contain select-none"
                draggable={false}
                priority
              />
            </div>
          </div>

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={t('previousImage')}
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label={t('nextImage')}
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Bottom thumbnails strip */}
          {images.length > 1 && (
            <div className="px-4 py-3 overflow-x-auto shrink-0">
              <div className="flex gap-2 justify-center">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => goTo(i)}
                    className={cn(
                      'relative h-12 w-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all duration-200',
                      i === currentIndex
                        ? 'border-white ring-1 ring-white scale-110'
                        : 'border-transparent opacity-50 hover:opacity-80',
                    )}
                  >
                    <Image
                      src={img.thumbnail}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );}
