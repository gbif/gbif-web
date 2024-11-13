import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ViewHeader } from '@/components/ViewHeader';
import { useCallback, useState } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { MdEvent } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function MediaPresentation({ mediaTypes, results, total, loading, error, next }) {
  return (
    <div className="g-mx-2 g-my-4">
      <ViewHeader total={total} loading={loading} message="counts.nResultsWithImages" />
      <div className="g-flex g-flex-wrap g-mb-12">
        {loading && (!results || results.length === 0) && <h1>loading</h1>}
        {results.map((result) => {
          let identifier = result.primaryImage?.identifier;
          if (result.key === 4028668553) {
            identifier = 'https://placehold.co/1000x50';
          }
          if (result.key === 1318519005) {
            identifier = 'https://placehold.co/50x1000';
          }

          return (
            <GalleryItem
              key={result.key}
              identifier={identifier}
              formattedName={result.gbifClassification.usage.formattedName}
              countryCode={result.countryCode}
              eventDate={result.eventDate}
            />
          );
        })}
        {results.length > 0 && (
          <div className="g-m-2 g-flex g-flex-col g-justify-center g-w-36">
            <Button disabled={loading} variant="secondary" onClick={() => next()}>
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
}: {
  identifier: string;
  formattedName: string;
  countryCode: string;
  eventDate: string;
  locality: string;
  height: number;
  minWidth: number;
}) {
  const [ratio, setRatio] = useState(1);
  const [isValid, setValid] = useState(false);

  const onLoad = useCallback((event) => {
    setValid(true);
    const ratio = event.target.naturalWidth / event.target.naturalHeight;
    setRatio(ratio);
  }, []);

  let width = ratio * height;
  let coverClass = 'g-object-contain';
  // let coverClass = 'g-object-cover g-w-full';

  if (ratio > 2) {
    width = height * 2;
    coverClass = '';
  } else if (ratio < 0.4) {
    width = height * 0.4;
    coverClass = '';
  }
  if (minWidth) width = Math.max(minWidth, width);

  return (
    <div
      className="g-m-2 g-flex-grow g-inline-flex g-flex-col g-overflow-hidden"
      style={{ flexBasis: width }}
    >
      <div className="g-inline-block g-rounded-lg g-bg-gray-50 g-overflow-hidden g-text-center hover:g-shadow-md">
        <img
          src={identifier}
          alt=""
          className={`g-h-36 g-mx-auto g-rounded-lg ${coverClass}`}
          onLoad={onLoad}
        />
        {/* <img src="https://placehold.co/1000x50" alt="" className={`g-h-36 g-mx-auto ${cover ?? 'g-object-cover'}`} onLoad={onLoad} /> */}
      </div>
      <div className="g-text-xs g-whitespace-nowrap g-mt-1 g-font-medium">
        <div
          className="g-font-semibold g-overflow-hidden g-text-ellipsis"
          dangerouslySetInnerHTML={{ __html: formattedName }}
        ></div>
        {countryCode && (
          <div className="g-overflow-hidden g-text-ellipsis g-flex g-items-center g-text-slate-500">
            <FaGlobeAfrica />
            <span className="g-ms-1">
              <FormattedMessage id={`enums.countryCode.${countryCode}`} />
            </span>
          </div>
        )}
        {eventDate && (
          <div className="g-overflow-hidden g-text-ellipsis g-flex g-items-center g-text-slate-500">
            <MdEvent />
            <span className="g-ms-1">{eventDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
