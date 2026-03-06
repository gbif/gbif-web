import { InlineLineClamp } from '@/components/inlineLineClamp';
import { FormattedDateRange } from '@/components/message';
import { ColumnDef, SetAsFilter } from '@/components/searchTable';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SingleEventSearchResult } from './eventTable';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { GoSidebarExpand } from 'react-icons/go';

type Args = {
  showPreview?: ((id: string) => void) | false;
};

export function useEventColumns({ showPreview }: Args): ColumnDef<SingleEventSearchResult>[] {
  return useMemo(() => {
    const columns: ColumnDef<SingleEventSearchResult>[] = [
      {
        id: 'eventId',
        header: 'filters.eventId.name',
        filterKey: 'eventId', // default is same as id
        disableHiding: true,
        minWidth: 250,
        cell: ({ eventID, eventTypeHierarchyJoined }) => {
          return (
            <div className="g-inline-flex g-items-start g-w-full">
              {showPreview && typeof showPreview === 'function' && (
                <button
                  // Used to refocus this button after closing the preview dialog
                  data-entity-trigger={eventID}
                  className="g-pr-3 g-mt-0.5 g-pl-1 hover:g-text-primary-500 g-flex g-items-center g-pointer-events-auto"
                  onClick={() => showPreview(eventID)}
                >
                  <SimpleTooltip i18nKey="filterSupport.viewDetails" side="right" asChild>
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}

              <SetAsFilter field="eventId" value={eventID}>
                {eventID}
              </SetAsFilter>
              <div className="g-text-sm g-text-slate-500">{eventTypeHierarchyJoined}</div>
            </div>
          );
        },
      },
      {
        id: 'country',
        header: 'filters.country.name',
        minWidth: 150,
        cell: ({ country }) => (
          <SetAsFilter field="country" value={country}>
            {country && <FormattedMessage id={`enums.countryCode.${country}`} />}
          </SetAsFilter>
        ),
      },
      {
        id: 'measurementOrFactTypes',
        header: 'filters.measurementOrFactTypes.name',
        cell: ({ measurementOrFactTypes }) => {
          if (!measurementOrFactTypes) return null;
          return <span className="g-text-nowrap">{measurementOrFactTypes.join(', ')}</span>;
        },
      },
      {
        id: 'coordinates',
        header: 'filters.coordinates.name',
        cell: ({ formattedCoordinates }) => {
          if (!formattedCoordinates) return null;
          return <span className="g-text-nowrap">{formattedCoordinates}</span>;
        },
      },
      {
        id: 'year',
        header: 'filters.year.name',
        cell: ({ year }) => (
          <SetAsFilter field="year" value={year}>
            {year}
          </SetAsFilter>
        ),
      },
      {
        id: 'eventDate',
        header: 'filters.eventDate.name',
        cell: ({ eventDate }) => {
          if (!eventDate) return null;
          return (
            <span className="g-text-nowrap">
              <FormattedDateRange
                start={eventDate?.from}
                end={eventDate?.to}
                format={{ year: 'numeric', month: 'short', day: 'numeric' }}
              />
            </span>
          );
        },
      },

      {
        id: 'locality',
        header: 'occurrenceFieldNames.locality',
        minWidth: 200,
        cell: ({ locality }) => (
          <InlineLineClamp className="-g-ml-0.5">
            <SetAsFilter field="locality" value={locality} className="g-ml-0">
              {locality}
            </SetAsFilter>
          </InlineLineClamp>
        ),
      },
      {
        id: 'stateProvince',
        header: 'occurrenceFieldNames.stateProvince',
        cell: ({ stateProvince }) => {
          if (!stateProvince) return null;

          return (
            <SetAsFilter field="stateProvince" value={stateProvince}>
              {stateProvince}
            </SetAsFilter>
          );
        },
      },
    ];

    return columns;
  }, []);
}
