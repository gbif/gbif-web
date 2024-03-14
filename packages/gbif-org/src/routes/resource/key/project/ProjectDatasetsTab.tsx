import {
  ProjectDatasetsQuery,
  ProjectDatasetsCountsQuery,
  ProjectDatasetsQueryVariables,
  ProjectDatasetsCountsQueryVariables,
  ProjectQuery,
} from '@/gql/graphql';
import { useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import { toRecord } from '@/utils/toRecord';
import { fragmentManager } from '@/services/FragmentManager';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { TabListSkeleton } from './TabListSkeleton';
import { DatasetResult } from '@/routes/dataset/DatasetResult';
import { HelpLine } from '../components/HelpLine';
import { NoResultsTab } from '../components/NoResultsTab';

fragmentManager.register(/* GraphQL */ `
  fragment ProjectDatasetsTab on Query {
    gbifProject(id: $key) {
      projectId
    }
    datasetsHelp: help(identifier: "how-to-link-datasets-to-my-project-page") {
      ...HelpLineDetails
    }
  }
`);

const DATASET_QUERY = /* GraphQL */ `
  query ProjectDatasets($projectId: ID!) {
    datasetSearch(projectId: [$projectId], limit: 500) {
      count
      limit
      offset
      results {
        ...DatasetResult
      }
    }
  }
`;

const SLOW_DATASET_QUERY = /* GraphQL */ `
  query ProjectDatasetsCounts($projectId: ID!, $limit: Int, $offset: Int) {
    datasetSearch(projectId: [$projectId], limit: $limit, offset: $offset) {
      results {
        ...DatasetCounts
      }
    }
  }
`;

export function ProjectDatasetsTab() {
  const { resource, datasetsHelp } = useParentRouteLoaderData(RouteId.Project) as ProjectQuery;

  // Can't happen but TS doesn't know
  if (resource?.__typename !== 'GbifProject') throw new Error('500');

  const projectId = resource?.projectId as string;

  const datasets = useQuery<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>(DATASET_QUERY, {
    throwAllErrors: true,
    variables: {
      projectId,
    },
  });

  const datasetsCount = useSlowDatasets(projectId, datasets.data);

  if (datasets.loading) return <TabListSkeleton />;
  // TODO: handle error
  if (datasets.data?.datasetSearch == null) return <TabListSkeleton />;

  return (
    <div className="pt-4 max-w-3xl m-auto">
      {datasetsHelp && <HelpLine help={datasetsHelp} />}

      {/* TODO: Needs translation */}
      {datasets.data.datasetSearch.results.length === 0 && (
        <NoResultsTab>No datasets linked to this project</NoResultsTab>
      )}

      {datasets.data.datasetSearch.results.map((item) => (
        <DatasetResult key={item.key} dataset={item} counts={datasetsCount[item.key]} />
      ))}
    </div>
  );
}

function useSlowDatasets(projectId: string, datasetsData: ProjectDatasetsQuery | undefined) {
  const datasetsCount = useQuery<ProjectDatasetsCountsQuery, ProjectDatasetsCountsQueryVariables>(
    SLOW_DATASET_QUERY,
    {
      lazyLoad: true,
      throwAllErrors: true,
    }
  );

  const load = datasetsCount.load;
  const limit = datasetsData?.datasetSearch.limit;
  const offset = datasetsData?.datasetSearch.offset;
  const count = datasetsData?.datasetSearch.count;

  useEffect(() => {
    if (typeof projectId !== 'string') return;
    if (!count) return;

    load({
      variables: {
        projectId,
        limit,
        offset,
      },
    });
  }, [projectId, limit, offset, count, load]);

  return Array.isArray(datasetsCount.data?.datasetSearch?.results)
    ? toRecord(datasetsCount.data.datasetSearch.results, (item) => item.key)
    : {};
}
