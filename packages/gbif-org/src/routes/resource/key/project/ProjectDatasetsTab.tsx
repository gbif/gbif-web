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
import { DynamicLink } from '@/components/DynamicLink';
import { isPositiveNumber } from '@/utils/isPositiveNumber';
import { FormattedMessage, FormattedNumber } from 'react-intl';

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
        <DynamicLink to={link}>{dataset.title}</DynamicLink>
      </h3>
      <div className="font-normal text-slate-500 text-sm flex">
        <div className="flex-auto">
          {dataset.excerpt}
          <div className="text-sm text-slate-500 mt-2">
            <div className="flex items-center">
              <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                <FormattedMessage id={`enums.datasetType.${dataset.type}`} />
              </span>
              {isPositiveNumber(counts?.literatureCount) && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  <FormattedMessage id="tableHeaders.citations" />:{' '}
                  <FormattedNumber value={counts.literatureCount} />
                </span>
              )}
              {isPositiveNumber(counts?.occurrenceCount) && (
                <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  <FormattedMessage id="tableHeaders.occurrences" />:{' '}
                  <FormattedNumber value={counts.occurrenceCount} />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
