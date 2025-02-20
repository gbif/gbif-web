import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useNumberParam, useParam } from '@/hooks/useParam';
import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { searchConfig } from './searchConfig';
import { FilterProvider } from '@/contexts/filter';
import { Tabs } from '@/components/tabs';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import useQuery from '@/hooks/useQuery';
import { ContentType, ResourceSearchQuery, ResourceSearchQueryVariables } from '@/gql/graphql';
import { ResourceSearchResult } from './resourceSearchResult';
import { DataHeader } from '@/components/dataHeader';
import { ArticleContainer } from '../key/components/articleContainer';
import { ArticleTextContainer } from '../key/components/articleTextContainer';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ClientSideOnly } from '@/components/clientSideOnly';
import { PaginationFooter } from '@/components/pagination';
import { HeaderActionButtons } from './headerActionButtons';

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

function isValidTab(tab: unknown): tab is Tab {
  return typeof tab === 'string' && tabs.includes(tab as Tab);
}

const RESOURCE_SEARCH_QUERY = /* GraphQL */ `
  query ResourceSearch($input: ResourceSearchInput!) {
    resourceSearch(input: $input) {
      limit
      count
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
`;

export type Resource = Extract<
  NonNullable<NonNullable<NonNullable<ResourceSearchQuery['resourceSearch']>['results']>[number]>,
  { id: string }
>;

function extractValidResources(data: ResourceSearchQuery | undefined): Resource[] {
  return data?.resourceSearch?.results?.filter((result) => result != null && 'id' in result) || [];
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

      <FilterProvider filter={filter} onChange={setFilter}>
        <ResourceSearchPageInner activeTab={tab} defaultTab={DEFAULT_TAB} />
      </FilterProvider>
    </>
  );
}

type Props = {
  activeTab: Tab;
  defaultTab: Tab;
};

function ResourceSearchPageInner({ activeTab, defaultTab }: Props): React.ReactElement {
  const [offset, setOffset] = useNumberParam({ key: 'offset', defaultValue: 0, hideDefault: true });

  const { data, loading } = useQuery<ResourceSearchQuery, ResourceSearchQueryVariables>(
    RESOURCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      keepDataWhileLoading: true,
      forceLoadingTrueOnMount: true,
      variables: {
        input: {
          contentType: tabsToActiveContentTypeLookup[activeTab],
          offset: offset,
        },
      },
    }
  );

  const resources = useMemo(() => extractValidResources(data), [data]);

  const { count, limit } = data?.resourceSearch || {};

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
                    values={{ total: count ?? 0 }}
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
                {count != null && limit != null && count > limit && (
                  <PaginationFooter
                    offset={offset}
                    count={count}
                    limit={limit}
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
        children: <FormattedMessage id="temp" defaultMessage={tab} />,
      }))}
    />
  );
}
