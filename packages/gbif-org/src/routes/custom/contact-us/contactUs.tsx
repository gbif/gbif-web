import { ContactUsPageQuery } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { Tabs } from '@/components/tabs';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ArticleOpenGraph } from '../../resource/key/components/articleOpenGraph';
import { ArticleTextContainer } from '../../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../../resource/key/components/articleTitle';
import { PageContainer } from '../../resource/key/components/pageContainer';

const CONTACT_US_QUERY = /* GraphQL */ `
  query ContactUsPage {
    resource(alias: "/contact-us") {
      __typename
      ... on Article {
        id
        title
        summary
        excerpt
        body
        primaryImage {
          ...ArticleBanner
        }
        createdAt
      }
    }
  }
`;

export function contactUsPageLoader(args: LoaderArgs) {
  return args.graphql.query<ContactUsPageQuery, undefined>(CONTACT_US_QUERY, undefined);
}

export function ContactUsPage() {
  const { data } = useLoaderData() as { data: ContactUsPageQuery };
  const resource = data.resource;

  // This should not happen as long as the contact-us page is of type Article in Contentful
  if (resource?.__typename !== 'Article') {
    throw new Error('Invalid resource type');
  }

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          <div className="g-border-b g-mt-4"></div>
          <Tabs
            links={[
              {
                to: '.',
                children: (
                  <FormattedMessage id="contactUs.tabs.contactUs" defaultMessage="Contact us" />
                ),
              },
              {
                to: 'directory',
                children: (
                  <FormattedMessage id="contactUs.tabs.directory" defaultMessage="Directory" />
                ),
              },
            ]}
          />
        </ArticleTextContainer>
      </PageContainer>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </article>
  );
}
