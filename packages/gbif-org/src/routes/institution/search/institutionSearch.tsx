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
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import {
  CollectionsSortField,
  InstitutionSearchQuery,
  InstitutionSearchQueryVariables,
  SortOrder,
} from '@/gql/graphql';
import { useNumberParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { CANCEL_REQUEST, fetchWithCancel } from '@/utils/fetchWithCancel';
import { stringify } from '@/utils/querystring';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { useFilters } from './filters';
import { AboutContent, ApiContent } from './help';
import { InstitutionResult } from './institutionResult';
import { Map } from './map/map';
import { searchConfig } from './searchConfig';

const INSTITUTION_SEARCH_QUERY = /* GraphQL */ `
  query InstitutionSearch($query: InstitutionSearchInput, $collectionScope: CollectionSearchInput) {
    institutionSearch(query: $query) {
      count
      limit
      offset
      results {
        ...InstitutionResult
      }
    }
  }
`;

export function InstitutionSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();

  return (
    <>
      <FormattedMessage id="catalogues.institutions" defaultMessage="Institutions">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <SearchContextProvider searchContext={config.institutionSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <InstitutionSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function InstitutionSearch(): React.ReactElement {
  const [offset, setOffset] = useNumberParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);
  const config = useConfig();
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | undefined>();
  const [geojsonError, setGeojsonError] = useState(false);
  const [geojsonLoading, setGeojsonLoading] = useState(true);
  const [tsvUrl, setTsvUrl] = useState('');

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, error, load, loading } = useQuery<
    InstitutionSearchQuery,
    InstitutionSearchQueryVariables
  >(INSTITUTION_SEARCH_QUERY, {
    throwAllErrors: false,
    lazyLoad: true,
    forceLoadingTrueOnMount: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    const downloadUrl = `${import.meta.env.PUBLIC_API_V1}/grscicoll/institution/export?format=TSV&${
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
        collectionScope: config.collectionSearch?.scope ?? {},
      },
    });

    setGeojsonLoading(true);
    setGeojsonError(false);
    const { promise, cancel } = fetchWithCancel(
      `${import.meta.env.PUBLIC_API_V1}/grscicoll/institution/geojson?${stringify(query)}`
    );
    promise
      .then((res) => res.json())
      .then((data) => {
        setGeojson(data);
        setGeojsonLoading(false);
        setGeojsonError(false);
      })
      .catch((err) => {
        if (err.reason === CANCEL_REQUEST) {
          return;
        } else {
          setGeojsonLoading(false);
          setGeojsonError(true);
        }
      });

    return () => cancel();
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

  const institutions = data?.institutionSearch;
  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.institutions" defaultMessage="Institutions" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
        hideIfNoCatalogue={true}
      />

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
        <ErrorBoundary>
          <ArticleContainer className="g-bg-slate-100 g-flex">
            <ArticleTextContainer className="g-flex-auto g-w-full">
              <Results
                excludedFilters={searchContext.excludedFilters}
                tsvUrl={tsvUrl}
                loading={loading}
                error={error}
                institutions={institutions}
                setOffset={setOffset}
                {...{ geojson, geojsonLoading, geojsonError }}
              />
            </ArticleTextContainer>
          </ArticleContainer>
        </ErrorBoundary>
      </section>
    </>
  );
}

function Results({
  loading,
  error,
  institutions,
  setOffset,
  geojson,
  geojsonLoading,
  geojsonError,
  tsvUrl,
  excludedFilters,
}: {
  loading: boolean;
  error?: Error;
  institutions?: InstitutionSearchQuery['institutionSearch'];
  setOffset: (x: number) => void;
  geojson?: GeoJSON.FeatureCollection;
  geojsonLoading: boolean;
  geojsonError: boolean;
  tsvUrl: string;
  excludedFilters?: string[];
}) {
  const excludeCode = excludedFilters?.includes('code');
  const excludeCountry = excludedFilters?.includes('country');
  if (error) {
    throw error;
  }
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
      {!loading && institutions?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {institutions && institutions.count > 0 && (
        <>
          <CardHeader
            id="institutions"
            className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between"
          >
            <CardTitle>
              <FormattedMessage
                id="counts.nInstitutions"
                values={{ total: institutions.count ?? 0 }}
              />
            </CardTitle>
            <DownloadAsTSVLink tsvUrl={tsvUrl} />
          </CardHeader>
          <ClientSideOnly>
            {institutions &&
              institutions.results
                .slice(0, 2)
                .map((item) => (
                  <InstitutionResult
                    key={item.key}
                    institution={item}
                    {...{ excludeCode, excludeCountry }}
                  />
                ))}
            {institutions.offset === 0 && geojson?.features?.length > 0 && (
              <div className="g-relative">
                <div className="g-absolute g-top-0 g-start-0 g-text-xs g-border g-border-solid g-rounded g-z-10 g-bg-slate-100 g-text-slate-800 g-py-0 g-px-1 g-m-2">
                  <FormattedMessage
                    id="counts.nResultsWithCoordinates"
                    values={{ total: geojson.features.length ?? 0 }}
                  />
                </div>
                <Map
                  className="g-z-0"
                  {...{ geojson, geojsonLoading, geojsonError }}
                  PopupContent={PopupContent}
                />
              </div>
            )}

            {institutions &&
              institutions.results
                .slice(2)
                .map((item) => (
                  <InstitutionResult
                    key={item.key}
                    institution={item}
                    {...{ excludeCode, excludeCountry }}
                  />
                ))}

            {institutions?.count && institutions?.count > institutions?.limit && (
              <PaginationFooter
                offset={institutions.offset}
                count={institutions.count}
                limit={institutions.limit}
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

function PopupContent({ features }: { features: { key: string; name: string }[] }) {
  return (
    <ul className="g-list-disc g-px-2">
      {features.map((x) => (
        <li key={x.key}>
          <DynamicLink
            className="g-underline"
            to={`/institution/${x.key}`}
            pageId="institutionKey"
            variables={{ key: x.key }}
          >
            {x.name}
          </DynamicLink>
        </li>
      ))}
    </ul>
  );
}
