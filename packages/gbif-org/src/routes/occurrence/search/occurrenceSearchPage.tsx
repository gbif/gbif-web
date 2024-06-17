import React from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import { ExtractPaginatedResult } from '@/types';
import { DataTable } from '@/components/ui/dataTable';
import { columns } from '@/routes/occurrence/search/columns';
import { notNull } from '@/utils/notNull';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { TableFilters } from '@/components/tableFilters/tableFilters';
import { ocurrenceSearchFilterDefinitions } from './filters';
import { useFilters } from '@/hooks/useFilters';
import { useTablePagination } from '@/hooks/useTablePagination';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import useQuery from '@/hooks/useQuery';
import { useConfig } from '@/contexts/config/config';
import { useSearchParams } from 'react-router-dom';

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
  });
}

export function OccurrenceSearchPage(): React.ReactElement {
  const { data } = useOccurrenceSearchQuery();
  const [filters, setFilter] = useFilters(ocurrenceSearchFilterDefinitions);
  const { previousLink, nextLink } = useTablePagination({ pageSize: 20 });

  const occurrences = React.useMemo(
    () => data?.occurrenceSearch?.documents.results.filter(notNull) ?? [],
    [data]
  );

  const totalResults = React.useMemo(() => data?.occurrenceSearch?.documents.total, [data]);

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <h1 className="g-text-2xl g-mb-2 g-font-bold">This page is a crude stub for search. For now it serves as a placeholder and easy access to individual records</h1>

      <InternalScrollHandler headerHeight={21}>
        <div className='g-p-2 g-border-b'>
          <TableFilters filters={filters} setFilter={setFilter} />
        </div>

        <div className='g-bg-gray-100 g-p-2 g-flex g-flex-col g-flex-1 g-min-h-0'>
          <p className='g-text-sm g-pb-1 g-text-gray-500'>
            {typeof totalResults === 'number' && <>{totalResults} results</>}
          </p>
          <DataTable className='g-bg-white g-flex-1 g-min-h-0' columns={columns} data={occurrences} />
          <div className='g-flex g-justify-between g-pt-2'>
            <div>{previousLink && <DynamicLink to={previousLink}>&#x2190; Prev</DynamicLink>}</div>
            <div>{nextLink && <DynamicLink to={nextLink}>Next &#x2192;</DynamicLink>}</div>
          </div>
        </div>
      </InternalScrollHandler>
    </>
  );
}
