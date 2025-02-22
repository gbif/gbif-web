import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useNumberParam, useParam } from '@/hooks/useParam';
import React, { useContext, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { searchConfig } from './searchConfig';
import { FilterContext, FilterProvider } from '@/contexts/filter';
import { Tabs } from '@/components/tabs';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import useQuery from '@/hooks/useQuery';
import { ContentType, ResourceSearchQuery, ResourceSearchQueryVariables } from '@/gql/graphql';
import { ResourceSearchResult } from './resourceSearchResult';
import { DataHeader } from '@/components/dataHeader';
import { ArticleContainer } from '../key/components/articleContainer';
import { ArticleTextContainer } from '../key/components/articleTextContainer';
import { Card, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { PaginationFooter } from '@/components/pagination';
import { HeaderActionButtons } from './headerActionButtons';
import { useFilters } from './filters';
import { FilterBar, FilterButtons, getAsQuery } from '@/components/filters/filterTools';
import { SearchContextProvider, useSearchContext } from '@/contexts/search';
import { useResourceSearchMetadata } from './resourceSearchMetadata';
import { ExtractPaginatedResult } from '@/types';

const tabs = [
  'all',
  'news',
  'dataUse',
  'event',
  'project',
  'programme',
  'tool',
  'document',
] as const;

export type Tab = (typeof tabs)[number];

const tabsToActiveContentTypeLookup: Record<Tab, ContentType[]> = {
  all: [
    ContentType.News,
    ContentType.DataUse,
    ContentType.Event,
    ContentType.Project,
    ContentType.Programme,
    ContentType.Tool,
    ContentType.Document,
  ],
  news: [ContentType.News],
  dataUse: [ContentType.DataUse],
  event: [ContentType.Event],
  project: [ContentType.Project],
  programme: [ContentType.Programme],
  tool: [ContentType.Tool],
  document: [ContentType.Document],
};

const tabsToCountLookup: Record<Tab, string> = {
  all: 'counts.nResults',
  news: 'counts.nNews',
  dataUse: 'counts.nDataUse',
  event: 'counts.nEvents',
  project: 'counts.nProjects',
  programme: 'counts.nProgrammes',
  tool: 'counts.nTools',
  document: 'counts.nDocuments',
};

const tabsToTranslationLookup: Record<Tab, string> = {
  all: 'resourceSearch.types.all',
  news: 'resourceSearch.types.news',
  dataUse: 'resourceSearch.types.dataUse',
  event: 'resourceSearch.types.events',
  project: 'resourceSearch.types.projects',
  programme: 'resourceSearch.types.programmes',
  tool: 'resourceSearch.types.tools',
  document: 'resourceSearch.types.documents',
};

function isValidTab(tab: unknown): tab is Tab {
  return typeof tab === 'string' && tabs.includes(tab as Tab);
}

const RESOURCE_SEARCH_QUERY = /* GraphQL */ `
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
          ... on News {
            ...NewsResult
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
        }
      }
    }
  }
`;

export type Resource = Extract<
  ExtractPaginatedResult<ResourceSearchQuery['resourceSearch']>,
  { id: string }
>;

function extractValidResources(data: ResourceSearchQuery | undefined): Resource[] {
  return (
    data?.resourceSearch?.documents?.results?.filter(
      (result) => result != null && 'id' in result
    ) || []
  );
}

const DEFAULT_TAB: Tab = 'all';

export function ResourceSearchPage(): React.ReactElement {
  const [tab] = useParam({
    hideDefault: true,
    key: 'contentType',
    parse: (value) => (isValidTab(value) ? value : DEFAULT_TAB),
  });

  const [filter, setFilter] = useFilterParams({
    filterConfig: searchConfig,
    paramsToRemove: ['offset', 'from'],
  });

  const searchMetadata = useResourceSearchMetadata(tab);

  return (
    <>
      {/* TODO transalte */}
      <FormattedMessage id="resourceSearch.pageTitle" defaultMessage="Resource search">
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
  activeTab: Tab;
  defaultTab: Tab;
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
        contentType: tabsToActiveContentTypeLookup[activeTab],
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
          {!loading && resources.length === 0 && (
            <>
              {/* TODO create a pretty and translated message */}
              <p>No results</p>
            </>
          )}
          {!loading && resources.length > 0 && (
            <>
              <CardHeader className="g-flex-col md:g-flex-row g-items-start md:g-items-center g-justify-between">
                <CardTitle>
                  {/* TODO translate and pick the correct phrase based on the tab */}
                  <FormattedMessage
                    id={tabsToCountLookup[activeTab]}
                    values={{ total: total ?? 0 }}
                  />
                </CardTitle>

                <HeaderActionButtons activeTab={activeTab} />
              </CardHeader>
              <ul>
                {resources.map((resource) => (
                  <li>
                    <ResourceSearchResult
                      key={resource.id}
                      resource={resource}
                      className="g-bg-white"
                    />
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
          )}
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

type ResourceSearchTabsProps = {
  activeTab: Tab;
  defaultTab: Tab;
};

function ResourceSearchTabs({
  activeTab,
  defaultTab,
}: ResourceSearchTabsProps): React.ReactElement {
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset'], 'contentType'); // Removes 'from' and 'sort'

  return (
    <Tabs
      disableAutoDetectActive
      links={tabs.map((tab) => ({
        isActive: activeTab === tab,
        to: { search: getParams(tab, defaultTab).toString() },
        // TODO translate
        children: <FormattedMessage id={tabsToTranslationLookup[tab]} defaultMessage={tab} />,
      }))}
    />
  );
}
