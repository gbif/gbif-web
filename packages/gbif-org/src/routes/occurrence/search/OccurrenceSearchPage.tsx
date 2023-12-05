import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MyLink } from '@/components/MyLink';
import { ExtractPaginatedResult, LoaderArgs } from '@/types';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/routes/occurrence/search/columns';
import { notNull } from '@/utils/notNull';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { TableFilters } from '@/components/TableFilters/TableFilters';
import { ocurrenceSearchFilterDefinitions } from './filters';
import { useFilters } from '@/hooks/useFilters';
import { useTablePagination } from '@/hooks/useTablePagination';
import { InternalScrollHandler } from '@/components/InternalScrollHandler';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  OccurrenceSearchQuery,
  OccurrenceSearchQueryVariables
>(/* GraphQL */ `
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
`);

export type SingleOccurrenceSearchResult = ExtractPaginatedResult<
  OccurrenceSearchQuery['occurrenceSearch']
>;

export function OccurrenceSearchPage(): React.ReactElement {
  const { data } = useTypedLoaderData();
  const [filters, setFilter] = useFilters(ocurrenceSearchFilterDefinitions);
  const { previousLink, nextLink } = useTablePagination({ pageSize: 20 });

  if (data.occurrenceSearch?.documents == null) throw new Error('No data');
  const occurrences = data.occurrenceSearch?.documents.results.filter(notNull) ?? [];

  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>

      <InternalScrollHandler headerHeight={21}>
        <div className="p-2 border-b">
          <TableFilters filters={filters} setFilter={setFilter} />
        </div>

        <div className="bg-gray-100 p-2 flex flex-col flex-1 min-h-0">
          <p className="text-sm pb-1 text-gray-500">
            {data.occurrenceSearch?.documents.total} results
          </p>
          <DataTable className="bg-white flex-1 min-h-0" columns={columns} data={occurrences} />
          <div className="flex justify-between pt-2">
            <div>{previousLink && <MyLink to={previousLink}>&#x2190; Prev</MyLink>}</div>
            <div>{nextLink && <MyLink to={nextLink}>Next &#x2192;</MyLink>}</div>
          </div>
        </div>
      </InternalScrollHandler>
    </>
  );
}

export async function loader({ request, config }: LoaderArgs) {
  const url = new URL(request.url);
  const from = parseInt(url.searchParams.get('from') ?? '0');
  const status = url.searchParams.get('occurrenceStatus')?.split(',') ?? [];

  const predicate = JSON.parse(JSON.stringify(config.occurrencePredicate));

  if (status.length > 0) {
    predicate.predicates.push({
      type: 'in',
      key: 'occurrenceStatus',
      values: status,
    });
  }

  return load({
    endpoint: config.graphqlEndpoint,
    request,
    variables: {
      from,
      predicate,
    },
  });
}
