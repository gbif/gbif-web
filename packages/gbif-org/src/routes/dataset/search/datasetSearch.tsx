import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { DatasetSearchQuery, DatasetSearchQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { stringify } from '@/utils/querystring';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { DatasetResult } from '../datasetResult';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { searchConfig } from './searchConfig';

export const DATASET_SEARCH_QUERY = /* GraphQL */ `
  query DatasetSearch($query: DatasetSearchInput) {
    datasetSearch(query: $query) {
      count
      limit
      offset
      results {
        ...DatasetStubResult
      }
    }
  }
`;

export function DatasetSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="catalogues.datasets" defaultMessage="Datasets">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.datasetSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <DatasetSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function DatasetSearch(): React.ReactElement {
  const { toast } = useToast();
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [tsvUrl, setTsvUrl] = useState('');

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const { data, error, load, loading } = useQuery<DatasetSearchQuery, DatasetSearchQueryVariables>(
    DATASET_SEARCH_QUERY,
    {
      throwAllErrors: false,
      lazyLoad: true,
      forceLoadingTrueOnMount: true,
    }
  );

  // if there is an error and there are no data.datasetSearch.results, then throw an error, else try to show the entries we have and inform the user it was a partially loaded page
  useEffect(() => {
    if (error && (!data || !data.datasetSearch.results)) {
      throw error;
    } else if (error) {
      toast({
        title: 'Unable to load all content',
        variant: 'destructive',
      });
    }
  }, [data, error, toast]);

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const downloadUrl = `${import.meta.env.PUBLIC_API_V1}/dataset/search/export?format=TSV&${
      query ? stringify(query as any) : ''
    }`;
    setTsvUrl(downloadUrl);

    load({
      variables: {
        query: {
          ...query,
          limit: 20,
          offset,
        },
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

  const datasets = data?.datasetSearch;

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.datasets" defaultMessage="Datasets" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
        hideIfNoCatalogue={true}
      >
        {/* <Tabs
          className="g-border-none"
          links={[
            {
              to: '/dataset/search',
              children: <FormattedMessage id="search.tabs.list" defaultMessage="List" />,
              className: tabClassName,
            },
          ]}
        /> */}
      </DataHeader>

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <ArticleTextContainer className="g-flex-auto g-w-full">
            <ErrorBoundary>
              <DatasetResults
                loading={loading}
                datasets={datasets}
                setOffset={setOffset}
                tsvUrl={tsvUrl}
              />
            </ErrorBoundary>
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

export function DatasetResults({
  loading,
  datasets,
  setOffset,
  tsvUrl,
}: {
  loading: boolean;
  datasets?: DatasetSearchQuery['datasetSearch'];
  setOffset: (x: number) => void;
  tsvUrl: string;
}) {
  const config = useConfig();

  const hidePublisher =
    config.datasetSearch?.availableTableColumns?.includes('publishingOrg') === false;

  return (
    <>
      {loading && (
        <>
          <CardHeader>
            <Skeleton className="g-max-w-64">
              <CardTitle>
                <FormattedMessage id="phrases.loading" />
              </CardTitle>
            </Skeleton>
          </CardHeader>
          <CardListSkeleton />
        </>
      )}
      {!loading && datasets?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {datasets && datasets.count > 0 && (
        <>
          <CardHeader
            id="datasets"
            className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between"
          >
            <CardTitle>
              <FormattedMessage id="counts.nDatasets" values={{ total: datasets.count }} />
            </CardTitle>

            <DownloadAsTSVLink tsvUrl={tsvUrl} />
          </CardHeader>

          {datasets.results.map((item) => (
            <DatasetResult key={item.key} dataset={item} hidePublisher={hidePublisher} />
          ))}

          <ClientSideOnly>
            {datasets.count > datasets.limit && (
              <PaginationFooter
                offset={datasets.offset}
                count={datasets.count}
                limit={datasets.limit}
                onChange={(x) => setOffset(x)}
                anchor="datasets"
              />
            )}
          </ClientSideOnly>
        </>
      )}
    </>
  );
}
