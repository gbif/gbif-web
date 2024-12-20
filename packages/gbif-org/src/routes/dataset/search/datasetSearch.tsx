import { ClientSideOnly } from '@/components/clientSideOnly';
import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';
import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Tabs } from '@/components/tabs';
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
import { DatasetSearchQuery, DatasetSearchQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import React, { useContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { DatasetResult } from '../datasetResult';
import { useFilters } from './filters';
import { searchConfig } from './searchConfig';
import { Button } from '@/components/ui/button';
import { MdDownload } from 'react-icons/md';
import { ParamQuery, stringify } from '@/utils/querystring';
import { useIntParam } from '@/hooks/useParam';

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
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Dataset search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.datasetSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <DatasetSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function DatasetSearch(): React.ReactElement {
  const [offset, setOffset] = useIntParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });

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
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

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
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
        <ArticleContainer className="g-bg-slate-100 g-flex">
          <ArticleTextContainer className="g-flex-auto">
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
  setOffset: (x: number) => void;
}) {
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const config = useConfig();

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const downloadLink = useMemo(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig, queryType: 'V1' });
    const queryString = stringify(query as ParamQuery);
    return `${config.v1Endpoint}/dataset/search/export?format=TSV&${filter ? queryString : ''}`;
  }, [filterHash, searchContext, config.v1Endpoint]);

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
          <CardHeader id="datasets" className="g-flex-row g-items-center g-justify-between">
            <CardTitle>
              <FormattedMessage id="counts.nDatasets" values={{ total: datasets.count ?? 0 }} />
            </CardTitle>

            <Button size="sm" variant="link" asChild>
              <a className="g-inline g-cursor-pointer hover:g-underline" href={downloadLink}>
                <MdDownload size={16} />
                <span className="g-ml-1">
                  <FormattedMessage id="phrases.downloadAsTsv" defaultMessage="Download as TSV" />
                </span>
              </a>
            </Button>
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
