import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useQuery from '@/hooks/useQuery';
import { Tabs } from '@/components/tabs';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { Card } from '@/components/ui/smallCard';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { LiteratureSearchQuery, LiteratureSearchQueryVariables } from '@/gql/graphql';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import { PaginationFooter } from '@/components/pagination';
import { NoRecords } from '@/components/noDataMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { CardListSkeleton } from '@/components/skeletonLoaders';
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
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { Button } from '@/components/ui/button';
import { DataHeader } from '@/components/dataHeader';

const LITERATURE_SEARCH_QUERY = /* GraphQL */ `
  query LiteratureSearch($predicate: Predicate, $size: Int, $from: Int) {
    literatureSearch(predicate: $predicate, size: $size, from: $from) {
      documents {
        size
        from
        total
        results {
          title
          excerpt
          countriesOfResearcher
          countriesOfCoverage
          year
          identifiers {
            doi
          }
        }
      }
    }
  }
`;

export function LiteratureSearchPage(): React.ReactElement {
  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset'],
  });
  const config = useConfig();
  return (
    <>
      <Helmet>
        <title>Literature search</title>
      </Helmet>
      <SearchContextProvider searchContext={config.literatureSearch}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <LiteratureSearch />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

export function LiteratureSearch(): React.ReactElement {
  const [offset, setOffset] = useState(0);
  const filterContext = useContext(FilterContext);
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });

  const { filter, filterHash } = filterContext || { filter: { must: {} } };
  const tabClassName = 'g-pt-2 g-pb-1.5';

  const { data, error, load, loading } = useQuery<
    LiteratureSearchQuery,
    LiteratureSearchQueryVariables
  >(LITERATURE_SEARCH_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });
    load({
      variables: {
        predicate: query,
        size: 20,
        from: offset,
      },
    });
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, offset, filterHash, searchContext]);

  const literature = data?.literatureSearch?.documents;

  return (
    <>
      <DataHeader
        title="Literature"
        hasBorder
        aboutContent={<AboutContent />}
        apiContent={<ApiContent />}
      >
        <Tabs
          className="g-border-none"
          links={[
            {
              to: '/literature/search',
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
        <ArticleContainer className="g-bg-slate-100">
          <ArticleTextContainer className="g-m-0">
            <Results loading={loading} literature={literature} setOffset={setOffset} />
          </ArticleTextContainer>
        </ArticleContainer>
      </section>
    </>
  );
}

function Results({
  loading,
  literature,
  setOffset,
}: {
  loading: boolean;
  literature?: LiteratureSearchQuery['literatureSearch']['documents'];
  setOffset: (x: number) => void;
}) {
  return (
    <>
      <div className="g-bg-slate-200 g-text-sm g-p-4 g-mb-4">Crude temporary results view</div>
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
      {!loading && literature?.total === 0 && (
        <>
          <NoRecords />
        </>
      )}
      {literature && literature.total > 0 && (
        <>
          <CardHeader id="literature">
            <CardTitle>
              <FormattedMessage id="counts.nResults" values={{ total: literature.total ?? 0 }} />
            </CardTitle>
          </CardHeader>
          <ClientSideOnly>
            {literature &&
              literature.results.map((item) => (
                <article className="g-m-2 g-border g-p-2 g-bg-white" key={item.key}>
                  <h2 className="g-font-bold">{item.title}</h2>
                  <p className="g-text-slate-600 g-text-sm">{item.excerpt}</p>
                  {item?.identifiers?.doi && (
                    <Button asChild>
                      <a href={`https://doi.org/${item.identifiers.doi}`}>More</a>
                    </Button>
                  )}
                </article>
              ))}

            {literature?.total && literature?.total > literature?.size && (
              <PaginationFooter
                offset={literature.from}
                count={literature.total}
                limit={literature.size}
                onChange={(x) => setOffset(x)}
                anchor="literatures"
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
          <AccordionTrigger>What is a literature?</AccordionTrigger>
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
        <a href="https://techdocs.gbif.org/en/openapi/v1/registry#/Literatures">GBIF API</a>. No
        registration or API key is required.
      </p>
      <p>
        Please remember to properly cite usage and to throttle requests in scripts. Most endpoint
        types support download/export. Use those if you need large data volumes.
      </p>
      <h4>Examples</h4>
      <Card className="g-p-2 g-mb-2">
        Get all literatures <br />
        <a href="https://api.gbif.org/v1/literature/search">
          https://api.gbif.org/v1/literature/search
        </a>
      </Card>
      <Card className="g-p-2">
        First 2 literature published from Denmark with free text "fungi" in the title or description
        <br />
        <a href="https://api.gbif.org/v1/literature/search?q=fungi&publishingCountry=DK&limit=2&offset=0">
          https://api.gbif.org/v1/literature/search?q=fungi&publishingCountry=DK&limit=2&offset=0
        </a>
      </Card>
    </div>
  );
}
