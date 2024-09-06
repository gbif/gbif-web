import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { DynamicLink } from '@/components/dynamicLink';
import useQuery from '@/hooks/useQuery';
import { CountMessage, DataHeader, PublisherSearch } from '@/routes/publisher/search/publisherSearch';
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
import { searchConfig } from '@/routes/publisher/search/searchConfig';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { filter2v1 } from '@/dataManagement/filterAdapter';
import { QFilter } from '@/routes/publisher/search/filters/QFilter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';
import { cn } from '@/utils/shadcn';
import { PublisherSearchFilter } from './PublisherSearchFilter';

const DATASET_SEARCH_QUERY = /* GraphQL */ `
  query DatasetSearch($license: [License], $endorsingNodeKey: [ID], $networkKey: [ID], $publishingOrg: [ID], $hostingOrg: [ID], $publishingCountry: [Country], $q: String, $offset: Int, $limit: Int, $type: [DatasetType], $subtype: [DatasetSubtype]){
    datasetSearch(license: $license, endorsingNodeKey:$endorsingNodeKey, networkKey:$networkKey, publishingOrg:$publishingOrg, hostingOrg: $hostingOrg, publishingCountry: $publishingCountry, q: $q, limit: $limit, offset: $offset, type: $type, subtype: $subtype) {
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
        ...v1.filter,
        limit: 20,
        offset,
      },
    });
  }, [offset, filterHash, searchConfig]);

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
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <Filters className="g-flex-none g-w-96" />
          <ArticleTextContainer className="g-flex-auto g-m-0">
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
        </>
      )}
    </>
  );
}

function Filters({ className }: { className: string }) {
  const filterContext = useContext(FilterContext);
  if (!filterContext) {
    console.error('FilterContext not found');
    return null;
  }
  const availableFilter = [
    'q',
    'publishingCountry',
    'publishingOrg',
    'type',
    'license',
    'hostingOrg',
    'projectId',
  ];

  const { filter, setField, negateField, add, remove } = filterContext;

  return (
    <div className={cn('g-border-b g-me-4', className)}>
      <CardHeader id="datasets">
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <div className="" role="search">
        <div className="g-mb-4 g-me-4">
          <QFilter
            className="g-block g-w-full g-bg-white"
            value={filter.must?.q?.[0]}
            onChange={(x) => {
              if (x !== '' && x) {
                setField('q', [x]);
              } else {
                setField('q', []);
              }
            }}
          />
        </div>
        <div className="g-mb-4 g-me-4 g-bg-white g-p-4 g-mt-6 g-rounded g-shadow">
          <h3 className="g-mb-2 g-font-bold g-text-base">Publisher</h3>
          <PublisherSearchFilter searchConfig={searchConfig} filterBeforeChanges={filterContext.filter} currentFilterContext={filterContext} />
        </div>
        {/* {availableFilter.map((x) => (
          <div key={x} className="g-mb-4 g-me-4">
            <QFilter
              className="g-block g-w-full"
              value={x}
              onChange={(v) => {
                if (v !== '' && v) {
                  setField(x, [v]);
                } else {
                  setField(x, []);
                }
              }}
            />
          </div>
        ))} */}
        {/* <QFilter
        className="g-inline-block"
        value={filter.must?.q?.[0]}
        onChange={(x) => {
          if (x !== '' && x) {
            setField('q', [x]);
          } else {
            setField('q', []);
          }
        }}
      /> */}
      </div>
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