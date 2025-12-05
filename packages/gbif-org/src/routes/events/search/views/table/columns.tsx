import { InlineLineClamp } from '@/components/inlineLineClamp';
import { FormattedDateRange } from '@/components/message';
import { ColumnDef, SetAsFilter } from '@/components/searchTable';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { SingleEventSearchResult } from './eventTable';

export function useEventColumns(): ColumnDef<SingleEventSearchResult>[] {
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
            <div>
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
        cell: ({ countryCode }) => (
          <SetAsFilter field="country" value={countryCode}>
            {countryCode && <FormattedMessage id={`enums.countryCode.${countryCode}`} />}
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
                date={eventDate}
                format={{ year: 'numeric', month: 'short', day: 'numeric' }}
              />
            </span>
          );
        },
      },
      {
        id: 'locationId',
        header: 'filters.locationID.name',
        cell: ({ locationID }) => (
          <SetAsFilter field="locationID" value={locationID}>
            {locationID}
          </SetAsFilter>
        ),
      },
      // {
      //   id: 'datasetKey',
      //   sort: { localStorageKey: 'eventSort', sortBy: 'datasetKey' },
      //   header: 'filters.datasetKey.name',
      //   minWidth: 350,
      //   cell: ({ datasetKey, datasetTitle }) => (
      //     <InlineLineClamp className="-g-ml-0.5">
      //       <LinkOption to={`/dataset/${datasetKey}`}>
      //         <SetAsFilter field="datasetKey" value={datasetKey}>
      //           {datasetTitle}
      //         </SetAsFilter>
      //       </LinkOption>
      //     </InlineLineClamp>
      //   ),
      // },
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
