import { CountProps, useCount } from '@/components/count';
import { DataHeader } from '@/components/dataHeader';
import { CountryLabel } from '@/components/filters/displayNames';
import { FilterButton } from '@/components/filters/filterButton';
import { FilterPopover } from '@/components/filters/filterPopover';
import { FilterBar, getAsQuery } from '@/components/filters/filterTools';
import { QInlineButtonFilter } from '@/components/filters/QInlineButtonFilter';
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
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader as SmallHeader,
  CardTitle as SmallTitle,
} from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import country from '@/enums/basic/country.json';
import { PublisherSearchQuery, PublisherSearchQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { CANCEL_REQUEST, fetchWithCancel } from '@/utils/fetchWithCancel';
import { stringify } from '@/utils/querystring';
import { matchSorter } from 'match-sorter';
import hash from 'object-hash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage, useIntl } from 'react-intl';
import { SearchCommand } from '../../../components/filters/SearchCommand';
import { PublisherResult } from '../publisherResult';
import { Map } from './map/map';
import { searchConfig } from './searchConfig';

const PUBLISHER_SEARCH_QUERY = /* GraphQL */ `
  query PublisherSearch(
    $country: Country
    $q: String
    $isEndorsed: Boolean
    $limit: Int
    $offset: Int
  ) {
    list: organizationSearch(
      isEndorsed: $isEndorsed
      country: $country
      q: $q
      offset: $offset
      limit: $limit
    ) {
      limit
      count
      offset
      results {
        key
        title
        created
        country
        logoUrl
        excerpt
      }
    }
  }
`;

export function PublisherSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();

  return (
    <SearchContextProvider searchContext={config.publisherSearch}>
      <FilterProvider filter={filter} onChange={setFilter}>
        <PublisherSearch />
      </FilterProvider>
    </SearchContextProvider>
  );
}

export function PublisherSearch(): React.ReactElement {
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const [geojson, setGeojson] = useState<GeoJSON.FeatureCollection | undefined>();
  const [geojsonError, setGeojsonError] = useState(false);
  const [geojsonLoading, setGeojsonLoading] = useState(true);
  const [userCountry, setUserCountry] = useState<{ country: string; countryName: string }>();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, error, load, loading } = useQuery<
    PublisherSearchQuery,
    PublisherSearchQueryVariables
  >(PUBLISHER_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
    forceLoadingTrueOnMount: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        ...query,
        limit: 20,
        offset,
        isEndorsed: true,
      },
    });

    setGeojsonLoading(true);
    setGeojsonError(false);
    const { promise, cancel } = fetchWithCancel(
      `${import.meta.env.PUBLIC_API_V1}/organization/geojson?${stringify(query)}`
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
  }, [offset, filterHash, load]);

  // call https://graphql.gbif-staging.org/unstable-api/user-info?lang=en to get the users country: response {country, countryName}
  // then use the country code to get a count of publishers from that country
  useEffect(() => {
    fetch('https://graphql.gbif-staging.org/unstable-api/user-info?lang=en')
      .then((res) => res.json())
      .then((data) => {
        setUserCountry({ country: 'DK', countryName: 'Denmark' });
        // setUserCountry(data);
      });
  }, []);

  //decide if we should show the info about the country. This is only relevant if there is no country filter already set
  const showCountryInfo = !filter?.must?.country && userCountry?.country;

  const publishers = data?.list;
  return (
    <>
      <FormattedMessage id="catalogues.publishers" defaultMessage="Publishers">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>

      <DataHeader
        title={<FormattedMessage id="catalogues.publishers" defaultMessage="Publishers" />}
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      ></DataHeader>

      <section className="">
        <FilterBar>
          <Filters />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100">
          <Results
            setField={filterContext?.setField}
            loading={loading}
            publishers={publishers}
            setOffset={setOffset}
            userCountry={showCountryInfo ? userCountry : undefined}
            {...{ geojson, geojsonLoading, geojsonError }}
          />
        </ArticleContainer>
      </section>
    </>
  );
}

export function CountMessage({
  countProps,
  message,
  messageValues,
}: {
  countProps: CountProps;
  message: string;
  messageValues?: Record<string, string>;
}) {
  const { count } = useCount(countProps);
  if (typeof count === 'number' && count > 0) {
    return <FormattedMessage id={message} values={{ ...messageValues, total: count }} />;
  }
  return false;
}

function Results({
  loading,
  publishers,
  setOffset,
  geojson,
  geojsonLoading,
  geojsonError,
  userCountry,
  setField,
}: {
  loading: boolean;
  publishers: PublisherSearchQuery['list'];
  setOffset: (x: number) => void;
  geojson: GeoJSON.FeatureCollection | undefined;
  geojsonLoading: boolean;
  geojsonError: boolean;
  userCountry: { country: string; countryName: string } | undefined;
  setField: (field: string, value: string[]) => void;
}) {
  const sidebarContent = !userCountry?.countryName ? null : (
    <section className="g-ms-4 g-text-sm g-max-w-96">
      <SmallHeader className="!g-px-0 !g-pt-0">
        <SmallTitle className="g-text-slate-500">
          <FormattedMessage id="phrases.didYouKnow" />
        </SmallTitle>
      </SmallHeader>
      <CardContent className="!g-px-0">
        <p>
          <CountMessage
            message="counts.nPublishersInCountry"
            messageValues={{ country: userCountry?.countryName }}
            countProps={{
              v1Endpoint: '/organization',
              params: { country: userCountry?.country, isEndorsed: 'true' },
            }}
          />
        </p>
        <Button
          className="g-mt-2"
          variant="primaryOutline"
          size="sm"
          onClick={() => setField('country', [userCountry?.country])}
        >
          <FormattedMessage id="phrases.explore" />
        </Button>
      </CardContent>
    </section>
  );

  return (
    <>
      {loading && (
        <ArticleTextContainer>
          <CardHeader>
            <Skeleton className="g-max-w-64">
              <CardTitle>
                <FormattedMessage id="phrases.loading" />
              </CardTitle>
            </Skeleton>
          </CardHeader>
          <CardListSkeleton />
        </ArticleTextContainer>
      )}
      {!loading && publishers?.count === 0 && (
        <ArticleTextContainer>
          <NoRecords />
        </ArticleTextContainer>
      )}
      {publishers && publishers.count > 0 && (
        <>
          <SideBarWrapper sidebar={<span></span>}>
            <CardHeader id="publishers">
              <CardTitle>
                <FormattedMessage
                  id="counts.nPublishers"
                  values={{ total: publishers.count ?? 0 }}
                />
              </CardTitle>
            </CardHeader>
          </SideBarWrapper>
          <SideBarWrapper sidebar={sidebarContent}>
            {publishers &&
              publishers.results
                .slice(0, 2)
                .map((item) => <PublisherResult key={item.key} publisher={item} />)}

            {publishers.offset === 0 &&
              geojson?.features?.length &&
              geojson?.features?.length > 0 && (
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

            {publishers &&
              publishers.results
                .slice(2)
                .map((item) => <PublisherResult key={item.key} publisher={item} />)}

            {publishers?.count && publishers?.count > publishers?.limit && (
              <PaginationFooter
                offset={publishers.offset}
                count={publishers.count}
                limit={publishers.limit}
                onChange={(x) => setOffset(x)}
              />
            )}
          </SideBarWrapper>
        </>
      )}
    </>
  );
}

function Filters() {
  const filterContext = useContext(FilterContext);
  const { formatMessage } = useIntl();
  const [countries, setCountries] = useState<{ key: string; title: string }[]>([]);
  const [results, setResults] = useState<{ key: string; title: string }[]>([]);

  // first translate relevant enums
  useEffect(() => {
    const countryValues = country.map((code) => ({
      key: code,
      title: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
    if (hash(countries) !== hash(countryValues)) {
      setCountries(countryValues);
    }
  }, [formatMessage, countries]);

  const countrySearch = useCallback(
    (q: string) => {
      const filtered = matchSorter(countries, q, { keys: ['title', 'key'] });
      setResults(filtered);
    },
    [countries]
  );

  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }

  const { filter, setField } = filterContext;

  return (
    <>
      <QInlineButtonFilter className="g-min-w-36" />
      <FilterPopover
        trigger={
          <FilterButton
            className="g-mx-1 g-mb-1 g-max-w-md g-text-slate-600"
            filterHandle="country"
            displayName={CountryLabel}
            titleTranslationKey="filters.country.name"
          />
        }
      >
        <SearchCommand<{ key: string; title: string }>
          setSelected={(x) => setField('country', x ? [x.key] : [])}
          selectedKey={filter?.must?.country?.[0]}
          search={countrySearch}
          results={results ?? []}
          labelSelector={(value) => value.title}
          keySelector={(value) => value.key}
          noSearchResultsPlaceholder={<span>No countries found</span>}
          noSelectionPlaceholder={<span>Country</span>}
          searchInputPlaceholder="Search countries..."
        />
      </FilterPopover>
    </>
  );
}

function AboutContent() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is a publisher?</AccordionTrigger>
          <AccordionContent className="g-prose g-text-sm">
            Data is loaded from contentful help items async. E.g.
            <HelpText
              identifier={'which-coordinate-systems-are-used-for-gbif-occurence-downloads'}
            />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How to search for publishers</AccordionTrigger>
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
        <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Publishing%20organizations">
          GBIF API
        </a>
        . No registration or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. Most endpoint
        types support download/export. Use those if you need large data volumes.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all publishers <br />
        <a href="https://api.gbif.org/v1/organization">https://api.gbif.org/v1/organization</a>
      </Card>
      <Card className="g-p-2">
        First 2 German publishers with free text "animals"
        <br />
        <a href="https://api.gbif.org/v1/organization?country=DE&q=animals&limit=2&offset=0">
          https://api.gbif.org/v1/organization?country=DE&q=animals&limit=2&offset=0
        </a>
      </Card>
    </div>
  );
}

function PopupContent({ features }: { features: { key: string; title: string }[] }) {
  return (
    <ul className="g-list-disc g-px-2">
      {features.map((x) => (
        <li key={x.key}>
          <DynamicLink
            className="g-underline"
            to={`/publisher/${x.key}`}
            pageId="publisherKey"
            variables={{ key: x.key }}
          >
            {x.title}
          </DynamicLink>
        </li>
      ))}
    </ul>
  );
}

function SideBarWrapper({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div className="g-flex">
      {sidebar && <div className="g-hidden xl:g-block g-flex-grow g-flex-shrink g-w-full"></div>}
      <ArticleTextContainer className="g-flex-auto g-flex-grow-0 g-flex-shrink-0 g-w-full">
        {children}
      </ArticleTextContainer>
      {sidebar && (
        <aside className="g-flex-grow g-flex-shrink g-w-full g-hidden lg:g-block">{sidebar}</aside>
      )}
    </div>
  );
}
