import { DownloadAsTSVLink } from '@/components/cardHeaderActions/downloadAsTSVLink';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import {
  CollectionSearchQuery,
  CollectionSearchQueryVariables,
  CollectionsSortField,
  SortOrder,
} from '@/gql/graphql';
import { useNumberParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { usePartialDataNotification } from '@/routes/rootErrorPage';
import { notNull } from '@/utils/notNull';
import { stringify } from '@/utils/querystring';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { CollectionResult } from '../collectionResult';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { NoResultsMessage } from './noResultsMessage';
import { searchConfig } from './searchConfig';

const COLLECTION_SEARCH_QUERY = /* GraphQL */ `
  query CollectionSearch($query: CollectionSearchInput) {
    collectionSearch(query: $query) {
      count
      limit
      offset
      results {
        ...CollectionResult
      }
    }
  }
`;

export function CollectionSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="catalogues.collections" defaultMessage="Collections">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.collectionSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <CollectionSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function CollectionSearch(): React.ReactElement {
  const notifyOfPartialData = usePartialDataNotification();
  const [offset, setOffset] = useNumberParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [tsvUrl, setTsvUrl] = useState('');

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, error, load, loading } = useQuery<
    CollectionSearchQuery,
    CollectionSearchQueryVariables
  >(COLLECTION_SEARCH_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
    forceLoadingTrueOnMount: true,
  });

  if (error && !data?.collectionSearch) {
    throw error;
  } else if (error) {
    notifyOfPartialData();
  }

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const downloadUrl = `${import.meta.env.PUBLIC_API_V1}/grscicoll/collection/export?format=TSV&${
      query ? stringify(query) : ''
    }`;
    setTsvUrl(downloadUrl);
    load({
      variables: {
        query: {
          ...query,
          sortBy: CollectionsSortField.NumberSpecimens,
          sortOrder: SortOrder.Desc,
          limit: 20,
          offset,
        },
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

  const collections = data?.collectionSearch;

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.collections" defaultMessage="Collections" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
        hideIfNoCatalogue={true}
      />

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <ArticleTextContainer className="g-flex-auto g-w-full">
            <Results
              tsvUrl={tsvUrl}
              excludedFilters={searchContext.excludedFilters}
              loading={loading}
              collections={collections}
              setOffset={setOffset}
            />
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

function Results({
  loading,
  collections,
  setOffset,
  tsvUrl,
  excludedFilters,
}: {
  loading: boolean;
  collections?: CollectionSearchQuery['collectionSearch'];
  setOffset: (x: number) => void;
  tsvUrl: string;
  excludedFilters?: string[];
}) {
  const excludeInstitution = excludedFilters?.includes('institutionKey');

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
      {!loading && collections?.count === 0 && <NoResultsMessage />}
      {collections && collections.count > 0 && (
        <>
          <CardHeader
            id="collections"
            className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between"
          >
            <CardTitle>
              <FormattedMessage
                id="counts.nCollections"
                values={{ total: collections.count ?? 0 }}
              />
            </CardTitle>
            <DownloadAsTSVLink tsvUrl={tsvUrl} />
          </CardHeader>
          {collections.results.filter(notNull).map((item) => (
            <CollectionResult key={item.key} collection={item} {...{ excludeInstitution }} />
          ))}
          <ClientSideOnly>
            {collections.count && collections.count > collections.limit && (
              <PaginationFooter
                offset={collections.offset}
                count={collections.count}
                limit={collections.limit}
                onChange={(x) => {
                  setOffset(x);
                }}
              />
            )}
          </ClientSideOnly>
        </>
      )}
    </>
  );
}
