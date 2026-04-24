import { Card } from '@/components/ui/largeCard';
import { Fragment, useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdInfo } from 'react-icons/md';

export interface MediaGalleryItem {
  id: string | number;
  /** What to render in the main viewer area */
  content: React.ReactNode;
  /** What to render inside the filmstrip thumbnail button */
  thumbnail: React.ReactNode;
  /** Accessible label for the filmstrip button, e.g. "Image 1" or "Video 2" */
  thumbnailAriaLabel?: string;
  /**
   * If provided, an info (ⓘ) button is shown over the main viewer.
   * Clicking it reveals this node in a small popup.
   */
  info?: React.ReactNode;
}

interface MediaGalleryProps {
  items: MediaGalleryItem[];
  /**
   * Rendered in the bottom-right corner of the main viewer when there are multiple items.
   * The returned node is responsible for its own absolute positioning (g-absolute g-bottom-2 g-end-2).
   */
  renderBottomRight?: (activeIndex: number, total: number) => React.ReactNode;
  id?: string;
}

export function MediaGallery({ items, renderBottomRight, id }: MediaGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const filmstripRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const current = items[activeIndex];

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    setActiveIndex(clamped);
    setShowInfo(false);
    const strip = filmstripRef.current;
    if (strip) {
      const thumb = strip.children[clamped] as HTMLElement | undefined;
      if (thumb) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  return (
    <Card className="g-mb-4 g-overflow-hidden" id={id}>
      {/* Main viewer */}
      <div
        className="g-relative g-bg-neutral-100 g-flex g-items-center g-justify-center"
        style={items.length > 1 ? { height: 400 } : { minHeight: 200 }}
      >
        <Fragment key={String(current.id)}>{current.content}</Fragment>

        {/* Prev / Next buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous"
              className="g-absolute g-top-1/2 g-start-2 -g-translate-y-1/2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-leading-none g-transition-colors disabled:g-opacity-30"
            >
              <MdChevronLeft size={24} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
              aria-label="Next"
              className="g-absolute g-top-1/2 g-end-2 -g-translate-y-1/2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-leading-none g-transition-colors disabled:g-opacity-30"
            >
              <MdChevronRight size={24} />
            </button>

            {renderBottomRight?.(activeIndex, items.length)}
          </>
        )}

        {/* Info button */}
        {current.info != null && (
          <>
            <button
              onClick={() => setShowInfo((v) => !v)}
              aria-label="Show media info"
              className="g-absolute g-bottom-2 g-start-2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-leading-none g-transition-colors"
            >
              <MdInfo size={18} />
            </button>
            {showInfo && (
              <div className="g-absolute g-bottom-10 g-start-2 g-bg-neutral-800/90 g-text-white g-text-xs g-rounded g-px-3 g-py-2 g-max-w-xs g-space-y-1">
                {current.info}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filmstrip */}
      {items.length > 1 && (
        <div
          ref={filmstripRef}
          className="g-flex g-gap-1.5 g-overflow-x-auto g-p-2 g-bg-neutral-50 g-border-t"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              onClick={() => goTo(i)}
              aria-label={item.thumbnailAriaLabel ?? `Item ${i + 1}`}
              className={`g-flex-none g-w-14 g-h-14 g-rounded g-overflow-hidden g-border-2 g-transition-colors ${
                i === activeIndex
                  ? 'g-border-primary'
                  : 'g-border-transparent hover:g-border-neutral-400'
              }`}
            >
              {item.thumbnail}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
