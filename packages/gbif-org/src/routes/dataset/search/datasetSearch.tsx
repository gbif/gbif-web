import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useQuery from '@/hooks/useQuery';
import { DataHeader } from '@/routes/publisher/search/publisherSearch';
import { Tabs } from '@/components/tabs';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { Card } from '@/components/ui/smallCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { DatasetSearchQuery, DatasetSearchQueryVariables } from '@/gql/graphql';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { DatasetResult } from '../datasetResult';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { FilterContext, FilterProvider, FilterType } from '@/contexts/filter';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { QContextFilter } from '@/routes/publisher/search/filters/QFilter';
import { searchConfig } from './searchConfig';
import { filters } from './filters';
import { useConfig } from '@/contexts/config/config';
import { MoreFilters } from './shared/filterTools';

const DATASET_SEARCH_QUERY = /* GraphQL */ `
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
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
  // const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Dataset search</title>
      </Helmet>
      <FilterProvider filter={filter} onChange={setFilter}>
        <DatasetSearch />
      </FilterProvider>
    </>
  );
}

export function DatasetSearch(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const { data, error, load, loading } = useQuery<DatasetSearchQuery, DatasetSearchQueryVariables>(
    DATASET_SEARCH_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const v1 = filter2v1(filter, searchConfig);
    load({
      variables: {
        query: {
          ...v1.filter,
          limit: 20,
          offset,
        },
      },
    });
  }, [load, offset, filterHash, searchConfig]);

  const datasets = data?.datasetSearch;
  return (
    <>
      <DataHeader
        title="Datasets"
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
        <Filters />
        <ArticleContainer className="g-bg-slate-100">
          <ArticleTextContainer className="g-m-0">
            <Results loading={loading} datasets={datasets} setOffset={setOffset} />
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

function Results({
  loading,
  datasets,
  setOffset,
}: {
  loading: boolean;
  datasets?: DatasetSearchQuery['datasetSearch'];
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
      {!loading && datasets?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {datasets && datasets.count > 0 && (
        <>
          <CardHeader id="datasets">
            <CardTitle>
              <FormattedMessage id="counts.nDatasets" values={{ total: datasets.count ?? 0 }} />
            </CardTitle>
          </CardHeader>
          <ClientSideOnly>
            {datasets &&
              datasets.results.map((item) => <DatasetResult key={item.key} dataset={item} />)}

            {datasets?.count && datasets?.count > datasets?.limit && (
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

// Given a set of filters, return a configuration object that can be used to render the filters
// existing filters: the filters that exists as an option in code
// excluded filters: filters that should not be shown - these are decided by the site owner
// highlighted filters: filters that should be shown by default - these are decided by the site owner
// visible filters: the union of (highlighted filters minus excluded) plus filters that have a value set.
// available filters: the existing filters minus those that are excluded
function getFilterConfig({
  currentFilter,
  existingFilters,
  excludedFilters,
  highlightedFilters,
}: {
  currentFilter: FilterType;
  existingFilters: string[]; // a list of filterHandles
  excludedFilters: string[]; // a list of filterHandles
  highlightedFilters: string[]; // a list of filterHandles
}): { visibleFilters: string[], availableFilters: string[] } {
  const visibleFilters = new Set<string>();
  const highlighted = new Set(highlightedFilters);
  const excluded = new Set(excludedFilters);
  const existing = new Set(existingFilters);
  for (const filter of highlighted) {
    if (!excluded.has(filter)) {
      visibleFilters.add(filter);
    }
  }
  for (const filter of existing) {
    if (currentFilter?.must?.[filter]?.length || currentFilter?.mustNot?.[filter]?.length) {
      visibleFilters.add(filter);
    }
  }
  // get available defined as existing minus excluded
  const availableFilters = new Set(existingFilters.filter((x) => !excludedFilters.includes(x)));

  return { visibleFilters: Array.from(visibleFilters), availableFilters: Array.from(availableFilters) };
}

function Filters() {
  const config = useConfig();
  const filterContext = useContext(FilterContext);
  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }

  const { visibleFilters, availableFilters } = getFilterConfig({
    currentFilter: filterContext.filter,
    existingFilters: Object.keys(filters).map(x => filters[x].filterHandle ?? x),
    excludedFilters: config?.datasetSearch?.excludedFilters ?? [],
    highlightedFilters: config?.datasetSearch?.highlightedFilters ?? [],
  });

  // map availableFilters to the form {filterHandle: {Button, Popover, Content}}
  const otherFilters = availableFilters.filter(x => {
    return !visibleFilters.includes(x);
  }).reduce((acc, filterHandle) => {
    const filterConfig = filters[filterHandle];
    return { ...acc, [filterHandle]: filterConfig };
  }, {});

  return (
    <div className="g-border-b g-py-2 g-px-3 -g-mb-1" role="search">
      <QContextFilter />
      
      {visibleFilters.map((filterHandle) => {
        const filterConfig = filters[filterHandle];
        return (
          <filterConfig.Button key={filterHandle} className="g-mx-1 g-mb-1" />
        );
      })}
      
      <MoreFilters
        filters={otherFilters}
      />
    </div>
  );
}

function AboutContent() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is a dataset?</AccordionTrigger>
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
        <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Datasets">GBIF API</a>. No
        registration or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. Most endpoint
        types support download/export. Use those if you need large data volumes.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all datasets <br />
        <a href="https://api.gbif.org/v1/dataset/search">https://api.gbif.org/v1/dataset/search</a>
      </Card>
      <Card className="g-p-2">
        First 2 dataset published from Denmark with free text "fungi" in the title or description
        <br />
        <a href="https://api.gbif.org/v1/dataset/search?q=fungi&publishingCountry=DK&limit=2&offset=0">
          https://api.gbif.org/v1/dataset/search?q=fungi&publishingCountry=DK&limit=2&offset=0
        </a>
      </Card>
    </div>
  );
}
