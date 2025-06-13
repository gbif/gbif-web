import { FormattedDateRange } from '@/components/message';
import { NoRecords } from '@/components/noDataMessages';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ViewHeader } from '@/components/ViewHeader';
import { useCallback, useState } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MdBrokenImage, MdEvent } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function MediaPresentation({
  mediaTypes,
  results,
  total,
  endOfRecords,
  loading,
  error,
  next,
  onSelect,
}: {
  mediaTypes: any;
  results: any;
  total: number;
  endOfRecords: boolean;
  loading: boolean;
  error: any;
  next: () => void;
  onSelect: ({ key }: { key: string }) => void;
}) {
  return (
    <div className="">
      <ViewHeader total={total} loading={loading} message="counts.nResultsWithImages" />
      {total === 0 && !loading && <NoRecords />}
      <div className="g-flex g-flex-wrap g-mb-12 -g-mx-2 -g-mt-2">
        {results.map((result) => {
          const identifier = result.primaryImage?.identifier;

          return (
            <GalleryItem
              onClick={() => onSelect({ key: result.key })}
              key={result.key}
              identifier={identifier}
              formattedName={
                result?.classification?.taxonMatch.name ?? result?.verbatimScientificName
              }
              countryCode={result.countryCode}
              eventDate={result.eventDate}
            />
          );
        })}
        {loading && (
          <>
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
            <GalleryItemSkeleton />
          </>
        )}
        {results.length > 0 && !endOfRecords && (
          <div className="g-flex g-flex-col g-justify-center g-w-36 g-mx-2 g-mt-4">
            <Button disabled={loading} variant="primaryOutline" onClick={() => next()}>
              {loading ? <Spinner /> : <FormattedMessage id="search.loadMore" />}
            </Button>
          </div>
        )}
        <div className="g-flex-1 g-flex-grow-[1000]"></div>
      </div>
    </div>
  );
}

function GalleryItem({
  identifier,
  formattedName,
  countryCode,
  eventDate,
  height = 150,
  minWidth,
  onClick = () => {},
}: {
  identifier: string;
  formattedName: string;
  countryCode: string;
  eventDate: string;
  height: number;
  minWidth: number;
  onClick: () => void;
}) {
  const [ratio, setRatio] = useState(1);
  const [failed, setFailed] = useState(false);

  const onLoad = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    const ratio = event.currentTarget.naturalWidth / event.currentTarget.naturalHeight;
    setRatio(ratio);
  }, []);

  let width = ratio * height;
  const coverClass = 'g-object-contain';
  // let coverClass = 'g-object-cover g-w-full';

  if (ratio > 2) {
    width = height * 2;
    // coverClass = '';
  } else if (ratio < 0.4) {
    width = height * 0.4;
    // coverClass = '';
  }
  if (minWidth) width = Math.max(minWidth, width);

  const about = (
    <div>
      <div
        className="g-font-semibold g-overflow-hidden g-text-ellipsis"
        dangerouslySetInnerHTML={{ __html: formattedName }}
      ></div>
      {countryCode && (
        <div className="g-overflow-hidden g-text-ellipsis g-flex g-items-center g-opacity-60">
          <FaGlobeAfrica className="g-flex-shrink-0" />
          <span className="g-ms-1 g-flex-grow g-overflow-hidden g-text-ellipsis">
            <FormattedMessage id={`enums.countryCode.${countryCode}`} />
          </span>
        </div>
      )}
      {eventDate && (
        <div className="g-overflow-hidden g-text-ellipsis g-flex g-items-center g-opacity-60">
          <MdEvent className="g-flex-shrink-0" />
          <span className="g-ms-1 g-flex-grow g-overflow-hidden g-text-ellipsis">
            <FormattedDateRange date={eventDate} />
          </span>
        </div>
      )}
    </div>
  );
  return (
    <div
      className="g-m-2 g-flex-grow g-inline-flex g-flex-col g-overflow-hidden"
      style={{ flexBasis: width }}
    >
      <button
        className="g-inline-block g-rounded-lg g-bg-gray-200/50 g-overflow-hidden g-text-center g-border g-border-solid g-border-transparent hover:g-border-slate-500/20"
        onClick={onClick}
      >
        {failed && (
          <div className="gb-image-failed g-h-36 g-mx-auto g-flex g-items-center g-justify-center">
            <MdBrokenImage />
          </div>
        )}
        {!failed && (
          <img
            src={identifier}
            alt=""
            className={`g-h-36 g-mx-auto g-rounded-lg ${coverClass}`}
            onLoad={onLoad}
            onError={() => setFailed(true)}
          />
        )}
      </button>
      <div>
        <div className="g-text-xs g-whitespace-nowrap g-mt-1 g-font-medium">
          <SimpleTooltip title={about} delayDuration={1000} disableHoverableContent asChild>
            {about}
          </SimpleTooltip>
        </div>
      </div>
    </div>
  );
}

function GalleryItemSkeleton() {
  return (
    <div className="g-animate-pulse g-m-2 g-flex-grow g-inline-flex g-flex-col g-overflow-hidden g-w-36">
      <div className="g-inline-block g-rounded-lg g-bg-slate-900/10 g-overflow-hidden g-h-36"></div>
      <div>
        <div className="g-text-xs g-whitespace-nowrap g-mt-1 g-font-medium">
          <div className="g-w-full g-h-4 g-bg-slate-900/10 g-mt-1 g-rounded"></div>
          <div className="g-w-1/2 g-h-4 g-bg-slate-900/10 g-mt-1 g-rounded"></div>
        </div>
      </div>
    </div>
  );
}
