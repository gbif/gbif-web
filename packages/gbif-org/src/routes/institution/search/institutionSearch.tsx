import { ClientSideOnly } from '@/components/clientSideOnly';
import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';
import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { InstitutionSearchQuery, InstitutionSearchQueryVariables } from '@/gql/graphql';
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
import { InstitutionResult } from './institutionResult';
import { Map } from './map/map';
import { searchConfig } from './searchConfig';

const INSTITUTION_SEARCH_QUERY = /* GraphQL */ `
  query InstitutionSearch($query: InstitutionSearchInput) {
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
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | undefined>();
  const [geojsonError, setGeojsonError] = useState(false);
  const [geojsonLoading, setGeojsonLoading] = useState(true);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, error, load, loading } = useQuery<
    InstitutionSearchQuery,
    InstitutionSearchQueryVariables
  >(INSTITUTION_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        query: {
          ...query,
          limit: 20,
          offset,
        },
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

    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => cancel();
  }, [load, offset, filterHash, searchContext]);

  const institutions = data?.institutionSearch;

  return (
    <>
      <DataHeader
        title={<FormattedMessage id="catalogues.institutions" defaultMessage="Institutions" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      />

      <section className="">
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <ArticleTextContainer className="g-flex-auto g-w-full">
            <Results
              loading={loading}
              institutions={institutions}
              setOffset={setOffset}
              {...{ geojson, geojsonLoading, geojsonError }}
            />
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

function Results({
  loading,
  institutions,
  setOffset,
  geojson,
  geojsonLoading,
  geojsonError,
}: {
  loading: boolean;
  institutions?: InstitutionSearchQuery['institutionSearch'];
  setOffset: (x: number) => void;
  geojson?: GeoJSON.FeatureCollection;
  geojsonLoading: boolean;
  geojsonError: boolean;
}) {
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
          <CardHeader id="institutions">
            <CardTitle>
              <FormattedMessage
                id="counts.nInstitutions"
                values={{ total: institutions.count ?? 0 }}
              />
            </CardTitle>
          </CardHeader>
          <ClientSideOnly>
            {institutions &&
              institutions.results
                .slice(0, 2)
                .map((item) => <InstitutionResult key={item.key} institution={item} />)}
            {institutions.offset === 0 && geojson?.features?.length > 0 && (
              <div className="g-relative">
                <div className="g-absolute g-top-0 g-start-0 g-text-xs g-border g-rounded g-z-10 g-bg-slate-100 g-text-slate-800 g-py-0 g-px-1 g-m-2">
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
                .map((item) => <InstitutionResult key={item.key} institution={item} />)}

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

function AboutContent() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is a institution?</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            Data is loaded from contentful help items async. E.g.
            <HelpText
              identifier={'which-coordinate-systems-are-used-for-gbif-occurence-downloads'}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Other example entry</AccordionTrigger>
          <AccordionContent>Data is loaded from contentful help items async</AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ApiContent() {
  return (
    <div className="g-text-sm g-prose">
      <h3>API access</h3>
      <p>
        All data is available via the{' '}
        <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Institutions">GBIF API</a>. No
        registration or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. Most endpoint
        types support download/export. Use those if you need large data volumes.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all institutions <br />
        <a href="https://api.gbif.org/v1/institution/search">
          https://api.gbif.org/v1/institution/search
        </a>
      </Card>
      <Card className="g-p-2">
        First 2 institution published from Denmark with free text "fungi" in the title or
        description
        <br />
        <a href="https://api.gbif.org/v1/institution/search?q=fungi&publishingCountry=DK&limit=2&offset=0">
          https://api.gbif.org/v1/institution/search?q=fungi&publishingCountry=DK&limit=2&offset=0
        </a>
      </Card>
    </div>
  );
}

function PopupContent({ features }: { features: { key: string; name: string }[] }) {
  return (
    <ul className="g-list-disc g-px-2">
      {features.map((x) => (
        <li key={x.key}>
          <DynamicLink className="g-underline" to={`/institution/${x.key}`}>
            {x.name}
          </DynamicLink>
        </li>
      ))}
    </ul>
  );
}
