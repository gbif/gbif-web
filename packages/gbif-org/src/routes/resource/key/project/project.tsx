import { Helmet } from 'react-helmet-async';
import { ProjectPageFragment } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { Tabs } from '@/components/Tabs';
import { Outlet, useLoaderData } from 'react-router-dom';
import { FormattedMessage, FormattedDateTimeRange, FormattedNumber } from 'react-intl';
import { MdLink } from 'react-icons/md';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { MdCalendarMonth as CalendarIcon } from 'react-icons/md';
import { MdEuro as EuroIcon } from 'react-icons/md';
import { RenderIfChildren } from '@/components/RenderIfChildren';
import { FundingBanner } from '../components/FundingBanner';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';

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
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer>
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.project" />
          </ArticlePreTitle>

          <ArticleTitle title={resource.title}>
            {isClosed && (
              <span className="align-middle bg-red-100 text-red-800 text-sm font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                <FormattedMessage id={`enums.cms.projectStatus.${resource.status}`} />
              </span>
            )}
          </ArticleTitle>

          <RenderIfChildren className="mt-2 text-slate-500 dark:text-gray-400 text-sm font-medium flex items-center gap-6">
            {resource.start && resource.end && (
              <p className="flex items-center gap-1">
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
              <p className="flex items-center gap-1">
                <EuroIcon size={18} />
                <FormattedNumber value={resource.fundsAllocated} />
              </p>
            )}
          </RenderIfChildren>

          <Tabs className="mt-6" links={tabLinks} />
        </ArticleTextContainer>

        <Outlet />
      </ArticleContainer>

      <FundingBanner resource={resource} />
    </>
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
        <span className="flex items-center">
          {resource.primaryLink.label} <MdLink className="ms-1" />
        </span>
      ),
    });
  }

  return tabLinks;
}
