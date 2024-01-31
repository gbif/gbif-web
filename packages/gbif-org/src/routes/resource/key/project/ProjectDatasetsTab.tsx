import {
  ProjectDatasetsQuery,
  ProjectDatasetsCountsQuery,
  ProjectDatasetsQueryVariables,
  ProjectDatasetsCountsQueryVariables,
  DatasetResultFragment,
  DatasetCountsFragment,
  ProjectQuery,
} from '@/gql/graphql';
import { useEffect } from 'react';
import useQuery from '@/hooks/useQuery';
import { toRecord } from '@/utils/toRecord';
import { fragmentManager } from '@/services/FragmentManager';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { TabListSkeleton } from './TabListSkeleton';

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

  const { data, loading } = useQuery<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>(
    DATASET_QUERY,
    {
      throwAllErrors: true,
      variables: {
        projectId: projectData?.gbifProject?.projectId as string,
      },
    }
  );

  const { data: slowData, load: slowLoad } = useQuery<
    ProjectDatasetsCountsQuery,
    ProjectDatasetsCountsQueryVariables
  >(SLOW_DATASET_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  // load slow dataset search results like counts
  useEffect(() => {
    const projectId = projectData?.gbifProject?.projectId;
    if (typeof projectId !== 'string') return;
    if (!data?.datasetSearch?.count) return;

    slowLoad({
      variables: {
        projectId,
        limit: data?.datasetSearch.limit,
        offset: data?.datasetSearch.offset,
      },
    });
  }, [projectData, data, slowLoad]);

  if (projectData.gbifProject == null) throw new Error('404');

  if (!data?.datasetSearch || loading) return <TabListSkeleton />;

  const { count, results } = data.datasetSearch;

  // map slow results by key for faster lookup
  const slowResults = Array.isArray(slowData?.datasetSearch?.results)
    ? toRecord(slowData.datasetSearch.results, (item) => item.key)
    : {};

  return (
    <>
      {count > 0 && (
        <div className="pt-4 max-w-3xl m-auto">
          {results?.map((item) => (
            <DatasetResult key={item.key} dataset={item} counts={slowResults[item.key]} />
          ))}
        </div>
      )}
    </>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment DatasetResult on DatasetSearchStub {
    key
    title
    excerpt
    type
    publishingOrganizationTitle
    recordCount
    license
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment DatasetCounts on DatasetSearchStub {
    key
    occurrenceCount
    literatureCount
  }
`);

export function DatasetResult({
  dataset,
  counts,
}: {
  dataset: DatasetResultFragment;
  counts?: DatasetCountsFragment;
}) {
  const link = `/dataset/${dataset.key}`;

  return (
    <article className="bg-slate-50 p-4 rounded border mb-4">
      <h3 className="flex-auto text-base font-semibold mb-2">
        <a href={link}>{dataset.title}</a>
      </h3>
      <div className="font-normal text-slate-500 text-sm flex">
        <div className="flex-auto">
          {dataset.excerpt}
          <div className="text-sm text-slate-500 mt-2">
            <div className="flex items-center">
              <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                {dataset.type}
              </span>
              {counts?.literatureCount && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  Citations: {counts?.literatureCount}
                </span>
              )}
              {counts?.occurrenceCount && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  Occurrences: {counts?.occurrenceCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
