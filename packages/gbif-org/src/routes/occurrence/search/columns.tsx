import { SetAsFilter } from '@/components/searchTable/components/setAsFilter';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { DynamicLink } from '@/reactRouterPlugins';
import { SingleOccurrenceSearchResult } from '@/routes/occurrence/search/occurrenceSearchPage';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { GoSidebarExpand } from 'react-icons/go';
import { FilterSetting } from '@/components/filters/filterTools';
import { FormattedMessage } from 'react-intl';

type Args = {
  showPreview?: ((id: string) => void) | false;
  filters: Record<string, FilterSetting>;
};

export function useOccurrenceColumns({
  showPreview,
  filters,
}: Args): ColumnDef<SingleOccurrenceSearchResult>[] {
  return useMemo(
    () => [
      {
        id: 'scientificName',
        header: 'Scientific name',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DynamicLink
              to={`/occurrence/${row.original.key}`}
              className="g-inline-flex g-items-center g-w-full g-h-full g-p-2"
            >
              {typeof showPreview === 'function' && (
                <button
                  className="g-pr-3 g-pl-1 hover:g-text-primary-500 g-flex g-items-center"
                  onClick={(e) => {
                    // Prevent the parent link from being triggered
                    e.preventDefault();
                    if (row.original.key) showPreview(row.original.key.toString());
                  }}
                >
                  <SimpleTooltip title="View details" side="right">
                    <div className="g-flex g-items-center">
                      <GoSidebarExpand size={16} />
                    </div>
                  </SimpleTooltip>
                </button>
              )}
              <div>
                <SetAsFilter value={row.original.scientificName} />
              </div>
            </DynamicLink>
          );
        },
        minWidth: 250,
        meta: {
          noCellPadding: true,
        },
      },
      {
        id: 'countryOrArea',
        cell: ({ row }) => {
          return (
            <SetAsFilter
              value={
                row?.original?.countryCode ? (
                  <FormattedMessage id={`enums.countryCode.${row.original.countryCode}`} />
                ) : null
              }
            />
          );
        },
        // TODO: obviously a mess. Some test of weather the popover is available is needed
        header: () => {
          if (filters?.country?.Popover)
            return <filters.country.Popover trigger={<span>Country</span>} />;

          return 'Country tmp';
        },
      },
      {
        header: 'County or area',
        accessorKey: 'county',
      },
      {
        id: 'coordinates',
        header: 'Coordinates',
        accessorFn: ({ coordinates }) => {
          // Return null if coordinates are not valid
          if (typeof coordinates?.lat !== 'number' || typeof coordinates?.lon !== 'number') {
            return null;
          }

          const latitude =
            coordinates.lat > 0
              ? `${coordinates.lat.toFixed(2)}°N`
              : `${(-coordinates.lat).toFixed(2)}°S`;

          const longitude =
            coordinates.lon > 0
              ? `${coordinates.lon.toFixed(2)}°E`
              : `${(-coordinates.lon).toFixed(2)}°W`;

          return `${latitude}, ${longitude}`;
        },
      },
      {
        id: 'year',
        header: 'Year',
        cell: ({ row }) => {
          // TODO: This should also handle date ranges
          const year = row.original.eventDate
            ? new Date(row.original.eventDate).getFullYear().toString()
            : null;

          return <SetAsFilter value={year} />;
        },
      },
      {
        id: 'basisOfRecord',
        header: 'Basis of record',
        accessorKey: 'basisOfRecord',
      },
      {
        id: 'dataset',
        header: 'Dataset',
        cell: ({ row }) => <SetAsFilter value={row.original.datasetName?.join(', ')} />,
      },
      {
        id: 'publisher',
        header: 'Publisher',
        accessorKey: 'publisherTitle',
      },
    ],
    [showPreview, filters]
  );
}
