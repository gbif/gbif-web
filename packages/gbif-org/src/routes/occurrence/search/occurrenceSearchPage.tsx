import { Drawer } from '@/components/drawer/drawer';
import { InternalScrollHandler } from '@/components/internalScrollHandler';
import { TableFilters } from '@/components/tableFilters/tableFilters';
import { DataTable } from '@/components/ui/dataTable';
import { useConfig } from '@/config/config';
import { OccurrenceSearchQuery, OccurrenceSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useColumns } from '@/routes/occurrence/search/columns';
import { ExtractPaginatedResult } from '@/types';
import { notNull } from '@/utils/notNull';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { StandaloneOccurrenceKeyPage } from '../key/standalone';
import { DataHeader } from '@/components/dataHeader';
import { Tabs } from '@/components/tabs';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { searchConfig } from './searchConfig';
import { useFilters } from './filters';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { AboutContent, ApiContent } from './helpTexts';

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
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
  const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Occurrence search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.occurrenceSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <OccurrenceSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function OccurrenceSearch(): React.ReactElement {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const [previewKey, setPreviewKey] = useState<string | null>();

  const { data, error, load, loading } = useQuery<OccurrenceSearchQuery, OccurrenceSearchQueryVariables>(
    OCCURRENCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        predicate: {
          ...query,
        },
        limit: 20,
      },
    });
  }, [load, filterHash, searchContext]);


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

      <DataHeader
        title="Occurrences"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <Tabs
          className="g-border-none"
          links={[
            {
              to: '/dataset/search',
              children: 'List',
              className: tabClassName,
            },
          ]}
        />
      </DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext}/>
        </FilterBar>
      </section>

      <InternalScrollHandler headerHeight={200}>
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
