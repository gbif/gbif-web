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
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { CollectionSearchQuery, CollectionSearchQueryVariables } from '@/gql/graphql';
import { useNumberParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { stringify } from '@/utils/querystring';
import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { CollectionResult } from '../collectionResult';
import { useFilters } from './filters';
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
    throwAllErrors: true,
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
        title={<FormattedMessage id="catalogues.collections" defaultMessage="Collections" />}
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
              tsvUrl={tsvUrl}
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
}: {
  loading: boolean;
  collections?: CollectionSearchQuery['collectionSearch'];
  setOffset: (x: number) => void;
  tsvUrl: string;
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
      {!loading && collections?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {collections && collections.count > 0 && (
        <>
          <CardHeader id="collections">
            <CardTitle>
              <FormattedMessage
                id="counts.nCollections"
                values={{ total: collections.count ?? 0 }}
              />
            </CardTitle>
            <CardDescription>
              <a className="g-underline" href={tsvUrl}>
                <FormattedMessage id="phrases.downloadAsTsv" />
              </a>
            </CardDescription>
          </CardHeader>
          <ClientSideOnly>
            {collections &&
              collections.results.map((item) => (
                <CollectionResult key={item.key} collection={item} />
              ))}

            {collections?.count && collections?.count > collections?.limit && (
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

function AboutContent() {
  return (
    <div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is a collection?</AccordionTrigger>
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
        <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Collections">GBIF API</a>. No
        registration or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. Most endpoint
        types support download/export. Use those if you need large data volumes.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all collections <br />
        <a href="https://api.gbif.org/v1/collection/search">
          https://api.gbif.org/v1/collection/search
        </a>
      </Card>
      <Card className="g-p-2">
        First 2 collection published from Denmark with free text "fungi" in the title or description
        <br />
        <a href="https://api.gbif.org/v1/collection/search?q=fungi&publishingCountry=DK&limit=2&offset=0">
          https://api.gbif.org/v1/collection/search?q=fungi&publishingCountry=DK&limit=2&offset=0
        </a>
      </Card>
    </div>
  );
}
