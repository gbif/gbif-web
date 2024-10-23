import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useQuery from '@/hooks/useQuery';
import { DataHeader } from '@/routes/publisher/search/publisherSearch';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { Card } from '@/components/ui/smallCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { CollectionSearchQuery, CollectionSearchQueryVariables } from '@/gql/graphql';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CollectionResult } from '../collectionResult';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpText } from '@/components/helpText';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { searchConfig } from './searchConfig';
import { useFilters } from './filters';
import { useConfig } from '@/config/config';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { FilterBar, getAsQuery } from '@/components/filters/filterTools';

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
  const [filter, setFilter] = useFilterParams({ filterConfig: searchConfig });
  const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Collection search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.collectionSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <CollectionSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function CollectionSearch(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const { data, error, load, loading } = useQuery<CollectionSearchQuery, CollectionSearchQueryVariables>(
    COLLECTION_SEARCH_QUERY,
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
  }, [load, offset, filterHash, searchConfig]);

  const collections = data?.collectionSearch;
  
  return (
    <>
      <DataHeader
        title="Collections"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      ></DataHeader>

      <section className="">
        <FilterBar filters={filters} />
        <ArticleContainer className="g-bg-slate-100">
          <ArticleTextContainer className="g-m-0">
            <Results loading={loading} collections={collections} setOffset={setOffset} />
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
}: {
  loading: boolean;
  collections?: CollectionSearchQuery['collectionSearch'];
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
      {!loading && collections?.count === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {collections && collections.count > 0 && (
        <>
          <CardHeader id="collections">
            <CardTitle>
              <FormattedMessage id="counts.nCollections" values={{ total: collections.count ?? 0 }} />
            </CardTitle>
          </CardHeader>
          <ClientSideOnly>
            {collections &&
              collections.results.map((item) => <CollectionResult key={item.key} collection={item} />)}

            {collections?.count && collections?.count > collections?.limit && (
              <PaginationFooter
                offset={collections.offset}
                count={collections.count}
                limit={collections.limit}
                onChange={(x) => setOffset(x)}
                anchor="collections"
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
        <a href="https://api.gbif.org/v1/collection/search">https://api.gbif.org/v1/collection/search</a>
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
