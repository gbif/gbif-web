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

const PROJECT_QUERY = /* GraphQL */ `
  query Project($key: String!) {
    gbifProject(id: $key) {
      projectId
      id
      title
      summary
      body
      primaryImage {
        file {
          url
          normal: thumbor(width: 1200, height: 500)
          mobile: thumbor(width: 800, height: 400)
        }
        description
        title
      }
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      start
      end
      documents {
        file {
          url
          fileName
          contentType
          volatile_documentType
          details {
            size
          }
        }
        title
      }
      createdAt
      status
    }
  }
`;

export async function projectLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ProjectQuery, ProjectQueryVariables>(PROJECT_QUERY, { key });
}

export function Project() {
  const { data } = useLoaderData() as { data: ProjectQuery };

  if (data.gbifProject == null) throw new Error('404');
  const resource = data.gbifProject;

  // if end date is in the past, the project is closed
  const closed = resource.status === 'CLOSED' || resource.status === 'DISCONTINUED';

  const tabLinks: Array<{ to: string; children: React.ReactNode }> = [
    { to: '.', children: <FormattedMessage id="cms.resource.about" /> },
    { to: 'datasets', children: <FormattedMessage id="cms.resource.datasets" /> },
    { to: 'news', children: <FormattedMessage id="cms.project.newsAndEvents" /> },
  ];

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
            {closed && (
              <>
                {' '}
                <span className="align-middle bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                  <FormattedMessage id={`enums.cms.projectStatus.${resource.status}`} />
                </span>
              </>
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
