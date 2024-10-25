import { ColumnDef } from '@tanstack/react-table';
import { SingleOccurrenceSearchResult } from '@/routes/occurrence/search/occurrenceSearchPage';
import { useMemo } from 'react';
import { FilterSetting } from '@/components/filters/filterTools';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';

type Args = {
  showPreview(id: string): void;
  filters: Record<string, FilterSetting>;
};

export function useColumns({ showPreview, filters }: Args): ColumnDef<SingleOccurrenceSearchResult>[] {
  return useMemo(
    () => [
      {
        header: 'Scientific name',
        cell: ({ row }) => (
          <button onClick={() => row.original.key && showPreview(row.original.key.toString())}>
            {row.original.scientificName}
          </button>
          // <DynamicLink to={`/occurrence/${row.original.key}`}>
          //   {row.original.scientificName}
          // </DynamicLink>
        ),
      },
      {
        header: <filters.country.Popover trigger={<span>Country (filter trigger)</span>} />,
        accessorKey: 'countryCode',
        cell: ({ row }) => (
          <FormattedMessage id={`enums.countryCode.${row.original.countryCode}`} />
          // <DynamicLink to={`/occurrence/${row.original.key}`}>
          //   {row.original.scientificName}
          // </DynamicLink>
        ),
      },
      {
        header: 'County or area',
        accessorKey: 'county',
      },
      {
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
        header: 'Year',
        accessorFn: ({ eventDate }) => (eventDate ? new Date(eventDate).getFullYear() : ''),
      },
      {
        header: 'Basis of record',
        accessorKey: 'basisOfRecord',
      },
      {
        header: 'Dataset',
        accessorFn: ({ datasetName }) => datasetName?.join(', '),
      },
      {
        header: 'Publisher',
        accessorKey: 'publisherTitle',
      },
    ],
    [showPreview]
  );
}
