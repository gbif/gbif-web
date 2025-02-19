import { useFilterParams } from '@/dataManagement/filterAdapter/useFilterParams';
import { useStringParam } from '@/hooks/useParam';
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

type Tab = (typeof tabs)[number];

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

function isValidTab(tab: string | undefined): tab is Tab {
  return tab != null && tabs.includes(tab as Tab);
}

const RESOURCE_SEARCH_QUERY = /* GraphQL */ `
  query ResourceSearch($input: ResourceSearchInput!) {
    resourceSearch(input: $input) {
      count
      endOfRecords
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
  const [_tab] = useStringParam({
    hideDefault: true,
    defaultValue: DEFAULT_TAB,
    key: 'contentType',
  });
  const tab = isValidTab(_tab) ? _tab : DEFAULT_TAB;
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
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset'], 'contentType'); // Removes 'from' and 'sort'

  const { data, loading } = useQuery<ResourceSearchQuery, ResourceSearchQueryVariables>(
    RESOURCE_SEARCH_QUERY,
    {
      throwAllErrors: true,
      keepDataWhileLoading: true,
      variables: {
        input: {
          contentType: tabsToActiveContentTypeLookup[activeTab],
        },
      },
    }
  );

  const resources = useMemo(() => extractValidResources(data), [data]);

  return (
    <>
      <DataHeader
        className="g-bg-white"
        title={<FormattedMessage id="catalogues.resources" defaultMessage="Resources" />}
        hasBorder
        // aboutContent={<AboutContent />}
        // apiContent={<ApiContent />}
      >
        <Tabs
          disableAutoDetectActive
          links={tabs.map((tab) => ({
            isActive: activeTab === tab,
            to: { search: getParams(tab, defaultTab).toString() },
            // TODO translate
            children: <FormattedMessage id="temp" defaultMessage={tab} />,
          }))}
        />
      </DataHeader>

      <ArticleContainer className="g-bg-slate-100 g-flex">
        <ArticleTextContainer className="g-flex-auto g-w-full">
          {resources.map((resource) => (
            <ResourceSearchResult key={resource.id} resource={resource} className="g-bg-white" />
          ))}
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}
