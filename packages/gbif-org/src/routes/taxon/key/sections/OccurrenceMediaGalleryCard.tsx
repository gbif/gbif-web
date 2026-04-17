import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Img } from '@/components/Img';
import { Card } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useRef, useState } from 'react';
import { MdChevronLeft, MdChevronRight, MdImage, MdInfo } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';

type Taxon = NonNullable<NonNullable<TaxonKeyQuery['taxonInfo']>['taxon']>;
type Props = { taxon: Taxon };

function OccurrenceMediaGalleryContent({ taxon }: Props) {
  const results = taxon.occurrenceMedia?.results ?? [];
  const total = taxon.occurrenceMedia?.count ?? 0;
  const taxonKey = taxon.taxonID;

  const [activeIndex, setActiveIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const filmstripRef = useRef<HTMLDivElement>(null);

  if (results.length === 0) return null;

  const current = results[activeIndex];
  const gallerySearchParams = { view: 'GALLERY', taxonKey: [taxonKey] };

  function goTo(index: number) {
    const clamped = Math.max(0, Math.min(results.length - 1, index));
    setActiveIndex(clamped);
    setShowInfo(false);
    const strip = filmstripRef.current;
    if (strip) {
      const thumb = strip.children[clamped] as HTMLElement | undefined;
      if (thumb) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }

  return (
    <Card className="g-mb-4 g-overflow-hidden" id="occurrence-images">
      {/* Main viewer */}
      <div
        className="g-relative g-bg-neutral-100 g-flex g-items-center g-justify-center"
        style={results.length > 1 ? { height: 400 } : { minHeight: 200 }}
      >
        <DynamicLink
          pageId="occurrenceSearch"
          searchParams={{ ...gallerySearchParams, entity: `o_${current.occurrenceKey}` }}
          className="g-flex g-items-center g-justify-center g-w-full g-h-full"
        >
          <Img
            key={current.occurrenceKey}
            src={current.thumbor ?? current.identifier ?? ''}
            style={
              results.length > 1
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
        </DynamicLink>

        {/* Prev / Next buttons */}
        {results.length > 1 && (
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
              disabled={activeIndex === results.length - 1}
              aria-label="Next"
              className="g-absolute g-top-1/2 g-end-2 -g-translate-y-1/2 g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-1 g-leading-none g-transition-colors disabled:g-opacity-30"
            >
              <MdChevronRight size={24} />
            </button>

            {/* Counter badge */}
            {/* <span className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5 g-pointer-events-none">
              {activeIndex + 1} / {results.length}
            </span> */}

            {/* View all */}
            {total > 0 && (
              <DynamicLink
                pageId="occurrenceSearch"
                searchParams={gallerySearchParams}
                className="g-absolute g-bottom-2 g-end-2 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-2 g-py-0.5"
              >
                <MdImage size={12} /> <FormattedMessage id="phrases.viewAllImages" />
              </DynamicLink>
            )}
          </>
        )}

        {/* Info button */}
        {(current.rightsHolder || current.license) && (
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
                {current.rightsHolder && (
                  <p>
                    <span className="g-opacity-70">
                      <FormattedMessage id="occurrenceFieldNames.rightsHolder" />:{' '}
                    </span>
                    {current.rightsHolder}
                  </p>
                )}
                {current.license && (
                  <p>
                    <span className="g-opacity-70">
                      <FormattedMessage id="occurrenceFieldNames.license" />:{' '}
                    </span>
                    {current.license}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filmstrip */}
      {results.length > 1 && (
        <div
          ref={filmstripRef}
          className="g-flex g-gap-1.5 g-overflow-x-auto g-p-2 g-bg-neutral-50 g-border-t"
          style={{ scrollbarWidth: 'thin' }}
        >
          {results.map((item, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Image ${i + 1}`}
              className={`g-flex-none g-w-14 g-h-14 g-rounded g-overflow-hidden g-border-2 g-transition-colors ${
                i === activeIndex
                  ? 'g-border-primary'
                  : 'g-border-transparent hover:g-border-neutral-400'
              }`}
            >
              <img
                src={item.smallThumbnail ?? item.identifier ?? ''}
                alt=""
                className="g-w-full g-h-full g-object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function OccurrenceMediaGalleryCard({ taxon }: Props) {
  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.occurrenceImages" />}
    >
      <OccurrenceMediaGalleryContent taxon={taxon} />
    </ErrorBoundary>
  );
}
