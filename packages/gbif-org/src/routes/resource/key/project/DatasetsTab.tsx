import { LoaderArgs } from '@/types';
import {
  ProjectIdQuery,
  ProjectIdQueryVariables,
  ProjectDatasetsQuery,
  ProjectDatasetsQueryVariables,
  ProjectDatasetsCountsQuery,
} from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { useEffect } from 'react';
import useQuery from '@/hooks/useQuery';

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProjectIdQuery,
  ProjectIdQueryVariables
>(/* GraphQL */ `
  query ProjectId($key: String!) {
    gbifProject(id: $key) {
      projectId
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
        key
        title
        excerpt
        type
        publishingOrganizationTitle
        recordCount
        license
      }
    }
  }
`;

const SLOW_DATASET_QUERY = /* GraphQL */ `
  query ProjectDatasetsCounts($projectId: ID!, $limit: Int, $offset: Int) {
    datasetSearch(projectId: [$projectId], limit: $limit, offset: $offset) {
      results {
        key
        occurrenceCount
        literatureCount
      }
    }
  }
`;

export function DatasetsTab() {
  const { data: projectData } = useTypedLoaderData();
  const {
    data,
    error,
    loading,
    load,
  }: {
    data?: ProjectDatasetsQuery;
    error: any;
    loading: boolean;
    load: Function;
  } = useQuery(DATASET_QUERY, { lazyLoad: true, throwAllErrors: true });

  const {
    data: slowData,
    error: slowError,
    loading: slowLoading,
    load: slowLoad,
  }: {
    data?: ProjectDatasetsCountsQuery;
    error: any;
    loading: boolean;
    load: Function;
  } = useQuery(SLOW_DATASET_QUERY, { lazyLoad: true, throwAllErrors: true });

  // load dataset search results
  useEffect(() => {
    const projectId = projectData?.gbifProject?.projectId;
    load({
      variables: {
        projectId,
      },
    });
  }, [projectData]);

  // load slow dataset search results like counts
  useEffect(() => {
    if (data?.datasetSearch?.count) {
      const projectId = projectData?.gbifProject?.projectId;
      slowLoad({
        variables: {
          projectId,
          limit: data?.datasetSearch.limit,
          offset: data?.datasetSearch.offset,
        },
      });
    }
  }, [projectData, data]);

  if (projectData.gbifProject == null) throw new Error('404');

  if (!data?.datasetSearch || loading) return null;

  const { count, results } = data.datasetSearch;

  // map slow results by key for faster lookup
  const slowResults = slowData?.datasetSearch?.results.reduce((acc, item) => {
    acc[item.key] = item;
    return acc;
  }, {}) ?? {};

  return (
    <>
      {count > 0 && (
        <div className="pt-4 max-w-3xl m-auto">
          <div>
            {results?.map((item) => {
              return <DatasetResult key={item?.key} dataset={item} counts={slowResults?.[item.key]}/>;
            })}
          </div>
        </div>
      )}
    </>
  );
}

export async function projectDatasetsLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}

type DatasetFragment = {
  key: string;
  title?: string | null;
  excerpt?: string | null;
  type?: string | null;
  publishingOrganizationTitle?: string | null;
  license?: string | null;
};

export function DatasetResult({ dataset, counts }: { dataset: DatasetFragment, counts?: any }) {
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
              {counts?.literatureCount > 0 && <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Citations: {counts?.literatureCount}
              </span>}
              {counts?.occurrenceCount > 0 && <span className="align-middle bg-slate-300/50 text-slate-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Occurrences: {counts?.occurrenceCount}
              </span>}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
