import { FormattedDateRange } from '@/components/message';
import { NoRecords } from '@/components/noDataMessages';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownMenu';
import { Spinner } from '@/components/ui/spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { ViewHeader } from '@/components/ViewHeader';
import { FilterContext } from '@/contexts/filter';
import { useCallback, useContext, useState } from 'react';
import { FaGlobeAfrica } from 'react-icons/fa';
import { LuSettings2 as FilterIcon } from 'react-icons/lu';
import { MdBrokenImage, MdEvent } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { MediaGroupDropdown } from './mediaSort';
import { MediaGroupState, getFormattedName } from './mediaGroupConfig';

export function MediaPresentation({
  mediaTypes,
  results,
  total,
  endOfRecords,
  loading,
  error,
  next,
  onSelect,
  groupState,
  onGroupStateChange,
  children,
}: {
  mediaTypes: any;
  results: any;
  total?: number;
  endOfRecords: boolean;
  loading: boolean;
  error: any;
  next: () => void;
  onSelect: ({ key }: { key: string }) => void;
  groupState: MediaGroupState;
  onGroupStateChange: (next: MediaGroupState) => void;
  children?: React.ReactNode;
}) {
  const isGrouped = groupState.mode === 'group' && !!groupState.groupBy;
  return (
    <div id="gbif-media-view-top" className="">
      <div className="g-flex g-items-center g-justify-between g-mb-1">
        <ViewHeader
          className="g-mb-0"
          total={total}
          loading={loading}
          message="counts.nResultsWithImages"
        />
        <MediaGroupDropdown state={groupState} onChange={onGroupStateChange} />
      </div>
      {isGrouped ? (
        children
      ) : (
        <FlatGallery
          results={results}
          loading={loading}
          endOfRecords={endOfRecords}
          total={total}
          next={next}
          onSelect={onSelect}
        />
      )}
    </div>
  );
}

function FlatGallery({
  results,
  loading,
  endOfRecords,
  total,
  next,
  onSelect,
}: {
  results: any;
  loading: boolean;
  endOfRecords: boolean;
  total?: number;
  next: () => void;
  onSelect: ({ key }: { key: string }) => void;
}) {
  return (
    <>
      {total === 0 && !loading && <NoRecords />}
      <div className="g-flex g-flex-wrap g-mb-12 -g-mx-2 -g-mt-2">
        {results.map((result: any) => {
          const identifier = result.primaryImage?.identifier;
          return (
            <GalleryItem
              onClick={() => onSelect({ key: result.key })}
              key={result.key}
              identifier={identifier}
              formattedName={getFormattedName(result)}
              countryCode={result.countryCode}
              eventDate={result.eventDate}
              taxonKey={result?.classification?.usage?.key}
              recordedBy={result.recordedBy}
              datasetKey={result.datasetKey}
              datasetTitle={result.datasetTitle}
              height={150}
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
    </>
  );
}

export function GalleryItem({
  identifier,
  formattedName,
  countryCode,
  eventDate,
  taxonKey,
  recordedBy,
  datasetKey,
  datasetTitle,
  height = 150,
  minWidth,
  dense = false,
  onClick = () => {},
}: {
  identifier: string;
  formattedName: string;
  countryCode: string;
  eventDate: string;
  taxonKey?: string | number | null;
  recordedBy?: (string | null)[] | null;
  datasetKey?: string | null;
  datasetTitle?: string | null;
  height: number;
  minWidth?: number;
  dense?: boolean;
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
      className="g-m-2 g-inline-flex g-flex-col g-overflow-hidden"
      style={dense ? { width, flexShrink: 0 } : { flexBasis: width, flexGrow: 1 }}
    >
      <div className="g-relative g-group/gallery">
        <button
          className="g-inline-block g-rounded-lg g-bg-gray-200/50 g-overflow-hidden g-text-center g-border g-border-solid g-border-transparent hover:g-border-slate-500/20"
          style={{ width, height }}
          onClick={onClick}
        >
          {failed && (
            <div
              className="gb-image-failed g-mx-auto g-flex g-items-center g-justify-center"
              style={{ height }}
            >
              <MdBrokenImage />
            </div>
          )}
          {!failed && (
            <img
              src={identifier}
              alt=""
              className={`g-mx-auto g-rounded-lg ${coverClass}`}
              style={{ height }}
              onLoad={onLoad}
              onError={() => setFailed(true)}
            />
          )}
        </button>
        {!failed && (
          <div className="g-absolute g-bottom-1 g-right-1 g-opacity-0 group-hover/gallery:g-opacity-100 g-transition-opacity">
            <FilterPopover
              taxonKey={taxonKey}
              taxonName={formattedName}
              countryCode={countryCode}
              eventDate={eventDate}
              recordedBy={recordedBy}
              datasetKey={datasetKey}
              datasetTitle={datasetTitle}
            />
          </div>
        )}
      </div>
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

export function GalleryItemSkeleton() {
  return (
    <div className="g-m-2 g-inline-flex g-flex-col g-overflow-hidden g-w-36">
      <Skeleton className="g-h-36 g-w-full" />
      <div className="g-mt-1">
        <Skeleton className="g-w-full g-h-3.5 g-mt-1">&nbsp;</Skeleton>
        <Skeleton className="g-w-1/2 g-h-3.5 g-mt-1">&nbsp;</Skeleton>
      </div>
    </div>
  );
}

// Configure which fields are checked by default in the filter popover
const DEFAULT_CHECKED_FIELDS = {
  taxonKey: true,
  countryCode: false,
  eventDate: false,
  recordedBy: false,
  datasetKey: false,
};

function FilterPopover({
  taxonKey,
  taxonName,
  countryCode,
  eventDate,
  recordedBy,
  datasetKey,
  datasetTitle,
}: {
  taxonKey?: string | number | null;
  taxonName?: string | null;
  countryCode?: string | null;
  eventDate?: string | null;
  recordedBy?: (string | null)[] | null;
  datasetKey?: string | null;
  datasetTitle?: string | null;
}) {
  const { filter, setFilter } = useContext(FilterContext);
  const { formatMessage } = useIntl();
  const [open, setOpen] = useState(false);

  const cleanRecordedBy = recordedBy?.filter(Boolean) as string[] | undefined;
  const datePart = eventDate ? eventDate.split('T')[0] : undefined;
  const validEventDate = datePart && /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : undefined;

  const [checked, setChecked] = useState({
    taxonKey: DEFAULT_CHECKED_FIELDS.taxonKey && !!taxonKey,
    countryCode: DEFAULT_CHECKED_FIELDS.countryCode && !!countryCode,
    eventDate: DEFAULT_CHECKED_FIELDS.eventDate && !!validEventDate,
    recordedBy: DEFAULT_CHECKED_FIELDS.recordedBy && !!cleanRecordedBy?.length,
    datasetKey: DEFAULT_CHECKED_FIELDS.datasetKey && !!datasetKey,
  });

  const hasAnyValue =
    taxonKey || countryCode || validEventDate || cleanRecordedBy?.length || datasetKey;
  if (!hasAnyValue) return null;

  const handleApply = () => {
    const newMust = { ...(filter?.must || {}) };
    if (checked.taxonKey && taxonKey) newMust.taxonKey = [taxonKey];
    if (checked.countryCode && countryCode) newMust.country = [countryCode];
    if (checked.eventDate && validEventDate)
      newMust.eventDate = [{ type: 'equals', value: validEventDate }];
    if (checked.recordedBy && cleanRecordedBy?.length) newMust.recordedBy = cleanRecordedBy;
    if (checked.datasetKey && datasetKey) newMust.datasetKey = [datasetKey];
    setFilter({ ...filter, must: newMust });
    setOpen(false);
    document.getElementById('gbif-media-view-top')?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggle = (field: keyof typeof checked) =>
    setChecked((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="g-flex g-items-center g-justify-center g-w-6 g-h-6 g-rounded g-bg-slate-900/80 g-text-white hover:g-bg-slate-900 g-transition-colors"
          onClick={(e) => e.stopPropagation()}
          title={formatMessage({ id: 'search.addFilters', defaultMessage: 'Add filters' })}
        >
          <FilterIcon className="g-w-3 g-h-3" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        side="top"
        className="g-w-56 g-bg-slate-900 g-text-white g-border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="g-px-2 g-pt-1.5 g-pb-1 g-text-xs g-font-semibold g-text-slate-300 g-uppercase g-tracking-wider">
          <FormattedMessage id="search.addFilters" defaultMessage="Add filters" />
        </div>
        <DropdownMenuSeparator className="g-bg-slate-700" />

        {taxonKey && (
          <DropdownMenuCheckboxItem
            checked={checked.taxonKey}
            onCheckedChange={() => toggle('taxonKey')}
            onSelect={(e) => e.preventDefault()}
            className="g-text-white focus:g-bg-slate-700 focus:g-text-white g-cursor-pointer"
          >
            <span className="g-flex g-flex-col g-min-w-0">
              <span className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="filters.taxonKey.name" defaultMessage="Scientific name" />
              </span>
              <span
                className="g-truncate g-text-xs"
                dangerouslySetInnerHTML={{ __html: taxonName ?? String(taxonKey) }}
              />
            </span>
          </DropdownMenuCheckboxItem>
        )}

        {countryCode && (
          <DropdownMenuCheckboxItem
            checked={checked.countryCode}
            onCheckedChange={() => toggle('countryCode')}
            onSelect={(e) => e.preventDefault()}
            className="g-text-white focus:g-bg-slate-700 focus:g-text-white g-cursor-pointer"
          >
            <span className="g-flex g-flex-col g-min-w-0">
              <span className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="filters.country.name" defaultMessage="Country" />
              </span>
              <span className="g-truncate g-text-xs">
                <FormattedMessage
                  id={`enums.countryCode.${countryCode}`}
                  defaultMessage={countryCode}
                />
              </span>
            </span>
          </DropdownMenuCheckboxItem>
        )}

        {validEventDate && (
          <DropdownMenuCheckboxItem
            checked={checked.eventDate}
            onCheckedChange={() => toggle('eventDate')}
            onSelect={(e) => e.preventDefault()}
            className="g-text-white focus:g-bg-slate-700 focus:g-text-white g-cursor-pointer"
          >
            <span className="g-flex g-flex-col g-min-w-0">
              <span className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="filters.eventDate.name" defaultMessage="Date" />
              </span>
              <span className="g-truncate g-text-xs">
                <FormattedDateRange date={validEventDate} />
              </span>
            </span>
          </DropdownMenuCheckboxItem>
        )}

        {cleanRecordedBy?.length ? (
          <DropdownMenuCheckboxItem
            checked={checked.recordedBy}
            onCheckedChange={() => toggle('recordedBy')}
            onSelect={(e) => e.preventDefault()}
            className="g-text-white focus:g-bg-slate-700 focus:g-text-white g-cursor-pointer"
          >
            <span className="g-flex g-flex-col g-min-w-0">
              <span className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="filters.recordedBy.name" defaultMessage="Recorded by" />
              </span>
              <span className="g-truncate g-text-xs">{cleanRecordedBy.join(', ')}</span>
            </span>
          </DropdownMenuCheckboxItem>
        ) : null}

        {datasetKey && (
          <DropdownMenuCheckboxItem
            checked={checked.datasetKey}
            onCheckedChange={() => toggle('datasetKey')}
            onSelect={(e) => e.preventDefault()}
            className="g-text-white focus:g-bg-slate-700 focus:g-text-white g-cursor-pointer"
          >
            <span className="g-flex g-flex-col g-min-w-0">
              <span className="g-text-slate-400 g-text-xs">
                <FormattedMessage id="filters.datasetKey.name" defaultMessage="Dataset" />
              </span>
              <span className="g-truncate g-text-xs g-font-mono">{datasetTitle}</span>
            </span>
          </DropdownMenuCheckboxItem>
        )}

        <DropdownMenuSeparator className="g-bg-slate-700" />
        <div className="g-flex g-gap-1 g-px-1 g-pb-1 g-pt-0.5">
          <Button
            size="sm"
            className="g-flex-1 g-bg-primary g-text-white hover:g-bg-primary/90 g-h-7 g-text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleApply();
            }}
          >
            <FormattedMessage id="search.apply" defaultMessage="Apply" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="g-flex-1 g-text-slate-300 hover:g-bg-slate-700 hover:g-text-white g-h-7 g-text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
          >
            <FormattedMessage id="search.cancel" defaultMessage="Cancel" />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
