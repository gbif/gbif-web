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

fragmentManager.register(/* GraphQL */ `
  fragment ProjectDatasetsTab on GbifProject {
    projectId
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
  const { data: projectData } = useParentRouteLoaderData(RouteId.Project) as { data: ProjectQuery };
  const projectId = projectData?.gbifProject?.projectId as string;

  const datasets = useQuery<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>(DATASET_QUERY, {
    throwAllErrors: true,
    variables: {
      projectId: projectData?.gbifProject?.projectId as string,
    },
  });

  const datasetsCount = useSlowDatasets(projectId, datasets.data);

  if (datasets.loading) return <TabListSkeleton />;
  // TODO: handle error
  if (datasets.data?.datasetSearch == null) return <TabListSkeleton />;

  return (
    <div className="pt-4 max-w-3xl m-auto">
      <HelpLine
        label="Link a dataset to a project"
        content={
          <>
            <p>
              For <strong>datasets</strong> to be displayed on a project page, you must ensure that
              your project ID has been specified correctly, i.e., under <strong>Metadata</strong>{' '}
              -&gt; <strong>Project Data</strong> -&gt; <strong>Identifier</strong> in the IPT, or{' '}
              <code>&lt;project id="your_project_id"&gt;</code> in the dataset metadata (EML).
            </p>
            <p>
              (If you add a project ID to an existing dataset in the IPT, don't forget to publish a
              new version of the resource to refresh the Darwin Core Archive to be ingested by GBIF)
            </p>
          </>
        }
      />
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
