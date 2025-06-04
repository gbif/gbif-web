import { ClientSideOnly } from '@/components/clientSideOnly';
import { DataHeader } from '@/components/dataHeader';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { ResourceSearchQuery, ResourceSearchQueryVariables } from '@/gql/graphql';
import { useNumberParam, useParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import useUpdateEffect from '@/hooks/useUpdateEffect';
import { ExtractPaginatedResult } from '@/types';
import React, { useContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { ArticleContainer } from '../key/components/articleContainer';
import { ArticleTextContainer } from '../key/components/articleTextContainer';
import { useFilters } from './filters';
import { HeaderActionButtons } from './headerActionButtons';
import { useResourceSearchMetadata } from './resourceSearchMetadata';
import { ResourceSearchResult } from './resourceSearchResult';
import { ResourceSearchTabs } from './resourceSearchTabs';
import { searchConfig } from './searchConfig';
import { orderedTabs, tabsConfig } from './tabsConfig';

export const RESOURCE_SEARCH_QUERY = /* GraphQL */ `
  query ResourceSearch(
    $from: Int
    $size: Int
    $predicate: Predicate
    $contentType: [ContentType!]
  ) {
    resourceSearch(predicate: $predicate, contentType: $contentType) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          __typename
          ... on Composition {
            ...CompositionResult
          }
          ... on News {
            ...NewsResult
          }
          ... on Article {
            ...ArticleResult
          }
          ... on DataUse {
            ...DataUseResult
          }
          ... on MeetingEvent {
            ...EventResult
          }
          ... on GbifProject {
            ...ProjectResult
          }
          ... on Programme {
            ...ProgrammeResult
          }
          ... on Tool {
            ...ToolResult
          }
          ... on Document {
            ...DocumentResult
          }
          ... on Document {
            ...DocumentResult
          }
          ... on NetworkProse {
            ...NetworkProseResult
          }
        }
      }
    }
  }
`;

export type Resource = Extract<
  ExtractPaginatedResult<ResourceSearchQuery['resourceSearch']>,
  { id: string }
>;

export function extractValidResources(data: ResourceSearchQuery | undefined): Resource[] {
  return (
    data?.resourceSearch?.documents?.results?.filter(
      (result) => result != null && 'id' in result
    ) || []
  );
}

const DEFAULT_TAB = 'all';

export function ResourceSearchPage(): React.ReactElement {
  const [tab] = useParam({
    hideDefault: true,
    key: 'contentType',
    parse: (value) =>
      typeof value === 'string' && orderedTabs.includes(value) ? value : DEFAULT_TAB,
  });

  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
  });

  const searchMetadata = useResourceSearchMetadata(tab);

  return (
    <>
      <FormattedMessage id="resourceSearch.title">
        {(title) => (
          <Helmet>
            <title>{title}</title>
          </Helmet>
        )}
      </FormattedMessage>
      <SearchContextProvider searchContext={searchMetadata}>
        <FilterProvider filter={filter} onChange={setFilter}>
          <ResourceSearchPageInner activeTab={tab} defaultTab={DEFAULT_TAB} />
        </FilterProvider>
      </SearchContextProvider>
    </>
  );
}

type Props = {
  activeTab: string;
  defaultTab: string;
};

function ResourceSearchPageInner({ activeTab, defaultTab }: Props): React.ReactElement {
  const searchContext = useSearchContext();
  const { filters } = useFilters({ searchConfig });
  const [offset, setOffset] = useNumberParam({ key: 'offset', defaultValue: 0, hideDefault: true });
  const filterContext = useContext(FilterContext);

  const { filter, filterHash } = filterContext || { filter: { must: {} } };

  const { data, load, loading } = useQuery<ResourceSearchQuery, ResourceSearchQueryVariables>(
    RESOURCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      keepDataWhileLoading: true,
      forceLoadingTrueOnMount: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const query = getAsQuery({ filter, searchContext, searchConfig });

    load({
      variables: {
        predicate: {
          ...query,
        },
        size: 20,
        from: offset,
      },
    });

    // We use a filterHash to trigger a reload when the filter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, filterHash, searchContext, activeTab, offset]);

  // Scroll to top when changing filter or offset
  useUpdateEffect(() => {
    window.scrollTo(0, 0);
  }, [filterHash, offset]);

  const resources = useMemo(() => extractValidResources(data), [data]);

  const { total, size } = data?.resourceSearch?.documents || {};

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.resources" defaultMessage="Resources" />}
        hasBorder
        // aboutContent={<AboutContent />}
        // apiContent={<ApiContent />}
      >
        <ResourceSearchTabs activeTab={activeTab} defaultTab={defaultTab} />
      </DataHeader>

      <Card>
        <FilterBar>
          <FilterButtons filters={filters} searchContext={searchContext} />
        </FilterBar>
      </Card>

      <ArticleContainer className="g-bg-slate-100 g-flex">
        <ArticleTextContainer className="g-flex-auto g-w-full">
          <ResourceSearchResults
            loading={loading}
            resources={resources}
            activeTab={activeTab}
            total={total}
            size={size}
            offset={offset}
            setOffset={setOffset}
          />
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

type ResourceSearchResultsProps = {
  loading: boolean;
  resources: Resource[];
  activeTab: string;
  total: number;
  size?: number;
  offset: number;
  setOffset: (offset: number) => void;
  disableHeaderActionButtons?: boolean;
  noResultsMessage?: React.ReactNode;
};

export function ResourceSearchResults({
  loading,
  resources,
  activeTab,
  total,
  size,
  offset,
  setOffset,
  disableHeaderActionButtons,
  noResultsMessage,
}: ResourceSearchResultsProps) {
  if (loading) {
    return (
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
    );
  }

  if (resources.length === 0) {
    return (
      <div className="g-min-h-52 g-flex g-items-center g-justify-center">
        {noResultsMessage ?? <FormattedMessage id="resourceSearch.noResults" />}
      </div>
    );
  }

  if (resources.length > 0) {
    return (
      <>
        <CardHeader className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between">
          <CardTitle>
            <FormattedMessage id={tabsConfig[activeTab].countKey} values={{ total: total ?? 0 }} />
          </CardTitle>

          {!disableHeaderActionButtons && <HeaderActionButtons activeTab={activeTab} />}
        </CardHeader>
        <ul>
          {resources.map((resource) => (
            <li key={resource.id}>
              <ResourceSearchResult resource={resource} className="g-bg-white" />
            </li>
          ))}
        </ul>
        <ClientSideOnly>
          {total != null && size != null && total > size && (
            <PaginationFooter
              offset={offset}
              count={total}
              limit={size}
              onChange={(x) => {
                setOffset(x);
              }}
            />
          )}
        </ClientSideOnly>
      </>
    );
  }

  return null;
}
