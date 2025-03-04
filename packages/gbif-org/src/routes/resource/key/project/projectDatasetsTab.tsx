import { CardListSkeleton } from '@/components/skeletonLoaders';
import { ProjectDatasetsQuery, ProjectDatasetsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DatasetResult } from '@/routes/dataset/datasetResult';
import { fragmentManager } from '@/services/fragmentManager';
import { useProjectKeyLoaderData } from '.';
import { HelpLine } from '../../../../components/helpText';
import { NoResultsTab } from '../components/noResultsTab';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment ProjectDatasetsTab on Query {
    gbifProject(id: $key) {
      projectId
    }
    datasetsHelp: help(identifier: "how-to-link-datasets-to-my-project-page") {
      title
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
        ...DatasetStubResult
      }
    }
  }
`;

export function ProjectDatasetsTab() {
  const { resource, datasetsHelp } = useProjectKeyLoaderData();

  // Can't happen but TS doesn't know
  if (resource?.__typename !== 'GbifProject') throw new Error('500');

  const projectId = resource?.projectId as string;

  const datasets = useQuery<ProjectDatasetsQuery, ProjectDatasetsQueryVariables>(DATASET_QUERY, {
    throwAllErrors: true,
    variables: {
      projectId,
    },
  });

  if (datasets.loading) return <CardListSkeleton />;
  // TODO: handle error
  if (datasets.data?.datasetSearch == null) return <CardListSkeleton />;

  return (
    <div className="g-pt-4 g-max-w-3xl g-m-auto">
      <p className="g-pb-4 g-text-gray-600 g-text-sm g-text-right">
        <HelpLine title={datasetsHelp?.title} id="how-to-link-datasets-to-my-project-page" icon />
      </p>

      {datasets.data.datasetSearch.results.length === 0 && (
        <NoResultsTab>
          <FormattedMessage id="cms.resource.noDatasets" />
        </NoResultsTab>
      )}

      {datasets.data.datasetSearch.results.map((item) => (
        <DatasetResult key={item.key} dataset={item} />
      ))}
    </div>
  );
}
