import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import useQuery from '@/hooks/useQuery';
import { MdApps, MdCode, MdInfo } from 'react-icons/md';
import { Tabs } from '@/components/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/shadcn';
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
import { FormattedMessage } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { PublisherSearchQuery, PublisherSearchQueryVariables } from '@/gql/graphql';
import { QFilter } from './filters/QFilter';
import { SingleCountryFilterSuggest } from './filters/SingleCountryFilterSuggest';
import { CountProps, useCount } from '@/components/count';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { searchConfig } from './searchConfig';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';

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
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
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
  }, [offset, filterHash, searchConfig]);

  // call https://graphql.gbif-staging.org/unstable-api/user-info?lang=en to get the users country: response {country, countryName}
  // then use the country code to get a count of publishers from that country
  // useEffect(() => {
  //   fetch('https://graphql.gbif-staging.org/unstable-api/user-info?lang=en')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setUserCountry({country: 'DK', countryName: 'Denmark'});
  //       // setUserCountry(data);
  //     });
  // }, []);

  const publishers = data?.list;
  return (
    <>
      <Helmet>
        <title>Publisher search</title>
      </Helmet>
      <DataHeader title="Publishers" hasBorder aboutContent={<AboutContent />} apiContent={<ApiContent />}>
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
        <Filters />
        <ArticleContainer className="g-bg-slate-100">
          <aside>
            {userCountry?.country && (
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
                </Card>
              </section>
            )}
          </aside>
          <ArticleTextContainer>
            <Results loading={loading} publishers={publishers} setOffset={setOffset} />
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

// a topbar with easy acess to the various catalogues (searchable entities). And it also works as the view navigation for search.
//
// If there is more than one catalogue enabled, then the user can switch between them.
// the catalogues will open in a drawer from the side.
// The name of the current catalogue can be shown next to the catalogue icon. It can also be hidden.

// After the catalogue selector (in the middle section), there is a place for content provided via props. This will be used to change between views (e.g. map, table, images, etc)
// And finally in the end there is room for various small action/info icons. This could be used to have a help icon, API access, DOI of the page, etc.
export function DataHeader({
  children,
  title,
  aboutContent,
  apiContent,
  hasBorder,
}: {
  children?: React.ReactNode;
  title?: string;
  hasBorder?: boolean;
  aboutContent?: React.ReactElement;
  apiContent?: React.ReactElement;
}) {
  return (
    <div
      className={`g-flex g-justify-center g-items-center g-ms-2 ${
        hasBorder ? 'g-border-b g-border-slate-200' : ''
      }`}
    >
      <>
        <div className="g-flex-none g-flex g-items-center g-mx-2">
          <MdApps />
          {title && <span className="g-ms-2">{title}</span>}
        </div>
        <Separator />
      </>
      <div className="g-flex-auto">{children}</div>
      <div className="g-flex-none g-mx-2">
        <div className="g-flex g-justify-center g-text-slate-400">
          {aboutContent && (
            <Popup trigger={<MdInfo className="g-mx-1 hover:g-text-slate-700" />}>{aboutContent}</Popup>
          )}
          {apiContent && (
            <Popup trigger={<MdCode className="g-mx-1 hover:g-text-slate-700" />}>{apiContent}</Popup>
          )}
        </div>
      </div>
    </div>
  );
}

export function Separator() {
  return <div className="g-border-l g-border-slate-200 g-h-6 g-mx-2"></div>;
}

export function Popup({
  trigger,
  children,
  className,
}: {
  trigger: React.ReactElement;
  children: React.ReactElement;
  className?: string;
}) {
  return (
    <Popover>
      <PopoverTrigger>{trigger}</PopoverTrigger>
      <PopoverContent className={cn('g-w-96', className)}>{children}</PopoverContent>
    </Popover>
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
  setOffset: any;
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
  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }

  const { filter, setField } = filterContext;

  return (
    <div className="g-border-b g-py-2 g-px-2" role="search">
      <QFilter
        className="g-inline-block"
        value={filter.must?.q?.[0]}
        onChange={(x) => {
          if (x !== '' && x) {
            setField('q', [x]);
          } else {
            setField('q', []);
          }
        }}
      />
      <SingleCountryFilterSuggest
        className="g-inline-block g-w-auto"
        selected={
          filter?.must?.country?.[0]
            ? { key: filter?.must?.country?.[0], title: filter?.must?.country?.[0] }
            : undefined
        }
        setSelected={(x) => setField('country', [x?.key])}
      />
    </div>
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
