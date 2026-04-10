import { Img } from '@/components/Img';
import { Card } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type Taxon = NonNullable<NonNullable<TaxonKeyQuery['taxonInfo']>['taxon']>;
type Props = { taxon: Taxon };

export function SidebarImageCarousel({ taxon }: Props) {
  const results = taxon.occurrenceMedia?.results ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (results.length === 0) return null;

  const current = results[activeIndex];
  const taxonKey = taxon.taxonID;
  const gallerySearchParams = { view: 'GALLERY', taxonKey: [taxonKey] };

  return (
    <Card className="g-mb-4 g-overflow-hidden">
      {/* 4:3 aspect ratio container */}
      <div className="g-relative g-w-full" style={{ paddingBottom: '75%' }}>
        <div className="g-absolute g-inset-0 g-bg-neutral-100 g-flex g-items-center g-justify-center">
          <DynamicLink
            pageId="occurrenceSearch"
            searchParams={{ ...gallerySearchParams, entity: `o_${current.occurrenceKey}` }}
            className="g-flex g-items-center g-justify-center g-w-full g-h-full"
          >
            <Img
              src={current.thumbor ?? current.identifier ?? ''}
              alt=""
              style={{
                maxWidth: '100%',
                height: '100%',
                maxHeight: '100%',
                display: 'block',
                objectFit: 'contain',
              }}
              failedClassName="g-w-full g-h-24"
            />
          </DynamicLink>

          {results.length > 1 && (
            <>
              {/* Left 30% = prev (transparent hit area, arrow has circular bg) */}
              <button
                className="g-absolute g-inset-y-0 g-start-0 g-w-[30%] g-flex g-items-center g-justify-start g-ps-1 disabled:g-opacity-30"
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                aria-label="Previous image"
              >
                <span className="g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-0.5 g-leading-none g-transition-colors">
                  <MdChevronLeft size={18} />
                </span>
              </button>

              {/* Right 30% = next */}
              <button
                className="g-absolute g-inset-y-0 g-end-0 g-w-[30%] g-flex g-items-center g-justify-end g-pe-1 disabled:g-opacity-30"
                onClick={() => setActiveIndex((i) => Math.min(results.length - 1, i + 1))}
                disabled={activeIndex === results.length - 1}
                aria-label="Next image"
              >
                <span className="g-bg-neutral-800/70 hover:g-bg-neutral-800 g-text-white g-rounded-full g-p-0.5 g-leading-none g-transition-colors">
                  <MdChevronRight size={18} />
                </span>
              </button>

              {/* Counter badge */}
              <span className="g-absolute g-bottom-1 g-end-1 g-bg-neutral-800/70 g-text-white g-text-xs g-rounded g-px-1.5 g-py-0.5 g-pointer-events-none">
                {activeIndex + 1} / {results.length}
              </span>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
