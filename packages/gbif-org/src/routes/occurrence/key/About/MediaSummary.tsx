import { Card } from '@/components/ui/largeCard';
import { useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdVideocam } from 'react-icons/md';
import { Img } from '@/components/Img';

const PLAYABLE_VIDEO_FORMATS = ['video/mp4', 'video/ogg'];

type MediaItem =
  | { kind: 'image'; thumbor: string; identifier: string; smallThumbnail: string }
  | { kind: 'video'; identifier: string; format: string };

export function MediaSummary({ occurrence }: { occurrence: any }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Build a unified list: still images first, then playable videos
  const items: MediaItem[] = [];
  (occurrence?.stillImages ?? []).forEach((img: any) => {
    if (img.thumbor) {
      items.push({
        kind: 'image',
        thumbor: img.thumbor,
        identifier: img.identifier,
        smallThumbnail: img.smallThumbnail,
      });
    }
  });
  (occurrence?.movingImages ?? []).forEach((v: any) => {
    if (PLAYABLE_VIDEO_FORMATS.includes(v.format)) {
      items.push({ kind: 'video', identifier: v.identifier, format: v.format });
    }
  });

  if (items.length === 0) return null;

  const current = items[activeIndex];

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    setActiveIndex(clamped);
    // Scroll the filmstrip so the active thumbnail is visible
    const strip = filmstripRef.current;
    if (strip) {
      const thumb = strip.children[clamped] as HTMLElement | undefined;
      if (thumb) {
        thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    }
  }

  return (
    <Card className="g-mb-4 g-overflow-hidden">
      {/* Main viewer */}
      <div
        className="g-relative g-bg-neutral-100 g-flex g-items-center g-justify-center"
        style={items.length > 1 ? { height: 400 } : { minHeight: 200 }}
      >
        {current.kind === 'video' ? (
          <video
            key={current.identifier}
            controls
            style={{ maxWidth: '100%', height: '100%', maxHeight: 400, display: 'block' }}
          >
            <source src={current.identifier} type={current.format} />
            Unable to play
          </video>
        ) : (
          <Img
            key={current.identifier}
            src={current.thumbor}
            style={
              items.length > 1
                ? {
                    maxWidth: '100%',
                    height: '100%',
                    maxHeight: 400,
                    display: 'block',
                    objectFit: 'contain',
                  }
                : {
                    maxWidth: '100%',
                    maxHeight: 400,
                    display: 'block',
                    margin: 'auto',
                    minHeight: 50,
                  }
            }
            failedClassName="g-w-full g-h-24"
          />
        )}

        {/* Prev / Next buttons */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous"
              className="g-absolute g-top-1/2 g-start-2 -g-translate-y-1/2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-transition-colors disabled:g-opacity-30"
            >
              <MdChevronLeft size={24} />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === items.length - 1}
              aria-label="Next"
              className="g-absolute g-top-1/2 g-end-2 -g-translate-y-1/2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-transition-colors disabled:g-opacity-30"
            >
              <MdChevronRight size={24} />
            </button>

            {/* Counter badge */}
            <span className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5 g-pointer-events-none">
              {activeIndex + 1} / {items.length}
            </span>
          </>
        )}
      </div>

      {/* Filmstrip */}
      {items.length > 1 && (
        <div
          ref={filmstripRef}
          className="g-flex g-gap-1.5 g-overflow-x-auto g-p-2 g-bg-neutral-50"
          style={{ scrollbarWidth: 'thin' }}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={item.kind === 'video' ? `Video ${i + 1}` : `Image ${i + 1}`}
              className={`g-flex-none g-w-14 g-h-14 g-rounded g-overflow-hidden g-border-2 g-transition-colors ${
                i === activeIndex
                  ? 'g-border-primary'
                  : 'g-border-transparent hover:g-border-neutral-400'
              }`}
            >
              {item.kind === 'video' ? (
                <div className="g-w-full g-h-full g-bg-neutral-200 g-flex g-items-center g-justify-center g-text-neutral-500">
                  <MdVideocam size={22} />
                </div>
              ) : (
                <img
                  src={item.smallThumbnail}
                  alt=""
                  className="g-w-full g-h-full g-object-cover"
                  loading="lazy"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
