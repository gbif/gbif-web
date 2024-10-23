import { Drawer } from '@/components/drawer/drawer';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import { TableFilters } from '@/components/tableFilters/tableFilters';
import { DataTable } from '@/components/ui/dataTable';
import { useConfig } from '@/config/config';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { useFilters } from '@/hooks/useFilters';
import useQuery from '@/hooks/useQuery';
import { useColumns } from '@/routes/occurrence/search/columns';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { StandaloneOccurrenceKeyPage } from '../key/standalone';
import { ocurrenceSearchFilterDefinitions } from './filters';

const OCCURRENCE_SEARCH_QUERY = /* GraphQL */ `
  query OccurrenceSearch($from: Int, $predicate: Predicate) {
    occurrenceSearch(predicate: $predicate) {
      documents(from: $from) {
        from
        size
        total
        results {
          key
          scientificName
          eventDate
          coordinates
          county
          basisOfRecord
          datasetName
          publisherTitle
        }
      }
    }
  }
`;

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

function useOccurrenceSearchQuery() {
  const config = useConfig();
  const [searchParams] = useSearchParams();
  const queryVariabels = React.useMemo<OccurrenceSearchQueryVariables>(() => {
    const from = parseInt(searchParams.get('from') ?? '0');
    const status = searchParams.get('occurrenceStatus')?.split(',') ?? [];

    const predicate = JSON.parse(JSON.stringify(config.occurrencePredicate));

    if (status.length > 0) {
      predicate.predicates.push({
        type: 'in',
        key: 'occurrenceStatus',
        values: status,
      });
    }

    return {
      from,
      predicate,
    };
  }, [config.occurrencePredicate, searchParams]);

  return useQuery<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>(OCCURRENCE_SEARCH_QUERY, {
    variables: queryVariabels,
    keepDataWhileLoading: true,
  });
}

const PAGE_SIZE = 20;

export function OccurrenceSearchPage(): React.ReactElement {
  const { data, loading } = useOccurrenceSearchQuery();
  const [filters, setFilter] = useFilters(ocurrenceSearchFilterDefinitions);
  const [previewKey, setPreviewKey] = useState<string | null>();

  const columns = useColumns({ showPreview: setPreviewKey });

  const occurrences = React.useMemo(
    () => data?.occurrenceSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  const totalResults = React.useMemo(() => data?.occurrenceSearch?.documents.total, [data]);

  const currentPageNumber = data?.occurrenceSearch?.documents.from
    ? Math.floor(data.occurrenceSearch.documents.from / PAGE_SIZE)
    : 0;
  const totalPagesCount = data?.occurrenceSearch?.documents.total
    ? Math.ceil(data.occurrenceSearch.documents.total / PAGE_SIZE)
    : 0;

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <h1 className="g-text-2xl g-mb-2 g-font-bold">
        This page is a crude stub for search. For now it serves as a placeholder and easy access to
        individual records
      </h1>

      <Drawer
        isOpen={typeof previewKey === 'string'}
        close={() => setPreviewKey(null)}
        viewOnGbifHref={`/occurrence/${previewKey}`}
        next={() => {
          const currentIndex = occurrences.findIndex((o) => o.key?.toString() === previewKey);
          const nextIndex = currentIndex + 1;
          if (nextIndex < occurrences.length) {
            setPreviewKey(occurrences[nextIndex].key?.toString());
          }
        }}
        previous={() => {
          const currentIndex = occurrences.findIndex((o) => o.key?.toString() === previewKey);
          const previousIndex = currentIndex - 1;
          if (previousIndex >= 0) {
            setPreviewKey(occurrences[previousIndex].key?.toString());
          }
        }}
      >
        <StandaloneOccurrenceKeyPage occurrenceKey={previewKey} />
      </Drawer>

      <InternalScrollHandler headerHeight={70}>
        <div className="g-p-2 g-border-b">
          <TableFilters filters={filters} setFilter={setFilter} />
        </div>

        <div className="g-bg-gray-100 g-p-2 g-flex g-flex-col g-flex-1 g-min-h-0">
          <p className="g-text-sm g-pb-1 g-text-gray-500">
            {typeof totalResults === 'number' && <>{totalResults} results</>}
          </p>
          <DataTable
            className="g-bg-white g-flex-1 g-min-h-0"
            columns={columns}
            data={occurrences}
            loading={loading}
            pageSize={PAGE_SIZE}
            currentPageNumber={currentPageNumber}
            totalPagesCount={totalPagesCount}
          />
        </div>
      </InternalScrollHandler>
    </>
  );
}
