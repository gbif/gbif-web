import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProjectQuery, ProjectQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { Tabs } from '@/components/Tabs';
import { Outlet, useLoaderData } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { MdLink } from 'react-icons/md';
import { required } from '@/utils/required';
import { ArticleSkeleton } from '../components/ArticleSkeleton';

const PROJECT_QUERY = /* GraphQL */ `
  query Project($key: String!) {
    gbifProject(id: $key) {
      # Define the values used by this page
      title
      status
      primaryLink {
        label
        url
      }
      # The Project About tab uses the data from this loader and defines its own data needs in this fragment
      ...ProjectAboutTab
      # The Project Datasets tab also uses some data from this loader and defines its own data needs in this fragment
      ...ProjectDatasetsTab
    }
  }
`;

export async function projectPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ProjectQuery, ProjectQueryVariables>(PROJECT_QUERY, { key });
}

export function ProjectPage() {
  const { data } = useLoaderData() as { data: ProjectQuery };

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  // if end date is in the past, the project is closed
  const isClosed = resource.status === 'CLOSED' || resource.status === 'DISCONTINUED';

  const tabLinks = createTabLinks(resource);

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.project" />
          </ArticlePreTitle>

          <ArticleTitle title={resource.title}>
            {isClosed && (
              <span className="align-middle bg-red-100 text-red-800 text-sm font-medium ml-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                <FormattedMessage id={`enums.cms.projectStatus.${resource.status}`} />
              </span>
            )}
          </ArticleTitle>
        </ArticleTextContainer>
        <ArticleTextContainer>
          <Tabs links={tabLinks} />
        </ArticleTextContainer>
        <Outlet />
      </ArticleContainer>
    </>
  );
}

export function ProjectPageSkeleton() {
  return <ArticleSkeleton />;
}

const staticTabLinks: Array<{ to: string; children: React.ReactNode }> = [
  { to: '.', children: <FormattedMessage id="cms.resource.about" /> },
  { to: 'datasets', children: <FormattedMessage id="cms.resource.datasets" /> },
  { to: 'news', children: <FormattedMessage id="cms.project.newsAndEvents" /> },
];

function createTabLinks(resource: ProjectQuery['gbifProject']) {
  const tabLinks = [...staticTabLinks];

  if (resource?.primaryLink) {
    tabLinks.push({
      to: resource.primaryLink.url,
      children: (
        <span className="flex items-center">
          {resource.primaryLink.label} <MdLink className="ms-1" />
        </span>
      ),
    });
  }

  return tabLinks;
}
