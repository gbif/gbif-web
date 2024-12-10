import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import country from '@/enums/basic/country.json';
import hash from 'object-hash';
import useQuery from '@/hooks/useQuery';
import { Tabs } from '@/components/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PublisherResult } from '../publisherResult';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage, useIntl } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { PublisherSearchQuery, PublisherSearchQueryVariables } from '@/gql/graphql';
import { CountProps, useCount } from '@/components/count';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { searchConfig } from './searchConfig';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { QInlineButtonFilter } from '@/components/filters/QInlineButtonFilter';
import { FilterBar } from '@/components/filters/filterTools';
import { FilterButton } from '@/components/filters/filterButton';
import { FilterPopover } from '@/components/filters/filterPopover';
import { CountryLabel } from '@/components/filters/displayNames';
import { SearchCommand } from '../../../components/filters/SearchCommand';
import { matchSorter } from 'match-sorter';
import { DataHeader } from '@/components/dataHeader';

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
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig, paramsToRemove: ['offset'] });
  return (
    <FilterProvider filter={filter} onChange={setFilter}>
      <PublisherSearch />
    </FilterProvider>
  );
}

export function PublisherSearch(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const filterContext = useContext(FilterContext);
  const [userCountry, setUserCountry] = useState<{ country: string; countryName: string }>();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const { data, error, load, loading } = useQuery<
    PublisherSearchQuery,
    PublisherSearchQueryVariables
  >(PUBLISHER_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    const v1 = filter2v1(filter, searchConfig);
    load({
      variables: {
        ...v1.filter,
        limit: 20,
        offset,
        isEndorsed: true,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset, filterHash, load]);

  // call https://graphql.gbif-staging.org/unstable-api/user-info?lang=en to get the users country: response {country, countryName}
  // then use the country code to get a count of publishers from that country
  useEffect(() => {
    fetch('https://graphql.gbif-staging.org/unstable-api/user-info?lang=en')
      .then((res) => res.json())
      .then((data) => {
        // setUserCountry({ country: 'DK', countryName: 'Denmark' });
        setUserCountry(data);
      });
  }, []);

  const publishers = data?.list;
  return (
    <>
      <Helmet>
        <title>Publisher search</title>
      </Helmet>
      <DataHeader
        title="Publishers"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <Tabs
          className="g-border-none"
          links={[
            {
              to: '/publisher/search',
              children: 'List',
              className: tabClassName,
            },
            {
              to: '/publisher/search/map',
              children: 'Map',
              className: tabClassName,
            },
          ]}
        />
      </DataHeader>

      <section className="">
        <FilterBar>
          <Filters />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <ArticleTextContainer className="g-flex-auto">
            <Results loading={loading} publishers={publishers} setOffset={setOffset} />
          </ArticleTextContainer>
          {/* {userCountry?.country && (
            <aside className="g-flex-none">
              <section>
                <h2>Did you know?</h2>
                <Card>
                  <p>
                    <CountMessage
                      message="counts.nPublishersInCountry"
                      messageValues={{ country: userCountry?.countryName }}
                      countProps={{
                        v1Endpoint: '/organization',
                        params: { country: userCountry?.country },
                      }}
                    />
                  </p>
                  <Button onClick={() => setField('country', [userCountry?.country])}>View</Button>
                </Card>
              </section>
            </aside>
          )} */}
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
}: {
  loading: boolean;
  publishers: PublisherSearchQuery['list'];
  setOffset: (x: number) => void;
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
      {!loading && publishers?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {publishers && publishers.count > 0 && (
        <>
          <CardHeader id="publishers">
            <CardTitle>
              <FormattedMessage id="counts.nPublishers" values={{ total: publishers.count ?? 0 }} />
            </CardTitle>
          </CardHeader>
          {publishers &&
            publishers.results.map((item) => <PublisherResult key={item.key} publisher={item} />)}

          {publishers?.count && publishers?.count > publishers?.limit && (
            <PaginationFooter
              offset={publishers.offset}
              count={publishers.count}
              limit={publishers.limit}
              onChange={(x) => setOffset(x)}
              anchor="publishers"
            />
          )}
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
            DisplayName={CountryLabel}
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
