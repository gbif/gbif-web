import { RenderIfChildren } from '@/components/renderIfChildren';
import { Tabs } from '@/components/tabs';
import { ProjectPageFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { MdCalendarMonth as CalendarIcon, MdEuro as EuroIcon, MdLink } from 'react-icons/md';
import { FormattedDateTimeRange, FormattedMessage, FormattedNumber } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticlePreTitle } from '../components/articlePreTitle';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleTitle } from '../components/articleTitle';
import { FundingBanner } from '../components/fundingBanner';
import { PageContainer } from '../components/pageContainer';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';

export const ProjectPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment ProjectPage on GbifProject {
    # Define the values used by this page
    title
    excerpt
    status
    start
    end
    fundsAllocated
    primaryLink {
      label
      url
    }
    ...ProjectFundingBanner
    # The Project About tab uses the data from this loader and defines its own data needs in this fragment
    ...ProjectAboutTab
  }
`);

export const projectPageLoader = createResourceLoaderWithRedirect({
  resourceType: 'GbifProject',
  query: /* GraphQL */ `
    query Project($key: String!) {
      resource(id: $key) {
        ...ResourceRedirectDetails
        ... on GbifProject {
          ...ProjectPage
        }
      }
      # The Project Datasets tab also uses some data from this loader and defines its own data needs in this fragment
      ...ProjectDatasetsTab
    }
  `,
});

export function ProjectPage() {
  const { resource } = useLoaderData() as { resource: ProjectPageFragment };

  // if end date is in the past, the project is closed
  const isClosed = resource.status === 'CLOSED' || resource.status === 'DISCONTINUED';

  const tabLinks = createTabLinks(resource);

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.project" />
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }}>
            {isClosed && (
              <span className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                <FormattedMessage id={`enums.cms.projectStatus.${resource.status}`} />
              </span>
            )}
          </ArticleTitle>

          <RenderIfChildren className="g-mt-2 g-text-slate-500 dark:g-text-gray-400 g-text-sm g-font-medium g-flex g-items-center g-gap-6">
            {resource.start && resource.end && (
              <p className="g-flex g-items-center g-gap-1">
                <CalendarIcon size={18} />
                <FormattedDateTimeRange
                  from={new Date(resource.start)}
                  to={new Date(resource.end)}
                  month="long"
                  day="numeric"
                  year="numeric"
                />
              </p>
            )}

            {resource.fundsAllocated && (
              <p className="g-flex g-items-center g-gap-1">
                <EuroIcon size={18} />
                <FormattedNumber value={resource.fundsAllocated} />
              </p>
            )}
          </RenderIfChildren>

          <Tabs className="g-mt-6" links={tabLinks} />
        </ArticleTextContainer>

        <Outlet />
      </PageContainer>

      <FundingBanner resource={resource} />
    </article>
  );
}

const staticTabLinks: Array<{ to: string; children: React.ReactNode }> = [
  { to: '.', children: <FormattedMessage id="cms.resource.about" /> },
  { to: 'datasets', children: <FormattedMessage id="cms.resource.datasets" /> },
  { to: 'news', children: <FormattedMessage id="cms.project.newsAndEvents" /> },
];

function createTabLinks(resource: ProjectPageFragment) {
  const tabLinks = [...staticTabLinks];

  if (resource?.primaryLink) {
    tabLinks.push({
      to: resource.primaryLink.url,
      children: (
        <span className="g-flex g-items-center">
          {resource.primaryLink.label} <MdLink className="g-ms-1" />
        </span>
      ),
    });
  }

  return tabLinks;
}
