import { IptPageQuery } from '@/gql/graphql';
import { LoaderArgs, RouteObjectWithPlugins } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../../resource/key/components/articleAuxiliary';
import { ArticleBody } from '../../resource/key/components/articleBody';
import { ArticleFooterWrapper } from '../../resource/key/components/articleFooterWrapper';
import { ArticleIntro } from '../../resource/key/components/articleIntro';
import { ArticleSkeleton } from '../../resource/key/components/articleSkeleton';
import { ArticleTags } from '../../resource/key/components/articleTags';
import { ArticleTextContainer } from '../../resource/key/components/articleTextContainer';
import { ArticleTitle } from '../../resource/key/components/articleTitle';
import { Documents } from '../../resource/key/components/documents';
import { PageContainer } from '../../resource/key/components/pageContainer';
import { SecondaryLinks } from '../../resource/key/components/secondaryLinks';
import PageMetaData from '@/components/PageMetaData';
import { IptInstallationsMap } from './iptMap';

const IPT_QUERY = /* GraphQL */ `
  query IptPage {
    resource(alias: "/ipt") {
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
        secondaryLinks {
          label
          url
        }
        documents {
          ...DocumentPreview
        }
        topics
        purposes
        audiences
        citation
        createdAt
      }
    }
  }
`;

function iptPageLoader(args: LoaderArgs) {
  return args.graphql.query<IptPageQuery, undefined>(IPT_QUERY, undefined);
}

function IptPage() {
  const { data } = useLoaderData() as { data: IptPageQuery };
  const resource = data?.resource;

  if (resource?.__typename !== 'Article') {
    throw new Error('Invalid resource type');
  }

  return (
    <article>
      <PageMetaData
        title={resource.title}
        description={resource.excerpt ?? resource.summary}
        path="/ipt"
      />

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer className="g-mb-10">
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}
        </ArticleTextContainer>

        {/* Break out of PageContainer padding on mobile so the map spans full width */}
        <div className="-g-mx-4 lg:g-mx-0">
          <IptInstallationsMap textClassName="g-px-4 lg:g-px-0" />
        </div>

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.secondaryLinks && (
              <ArticleAuxiliary>
                <SecondaryLinks links={resource.secondaryLinks} className="g-mt-8" />
              </ArticleAuxiliary>
            )}

            {resource.documents && (
              <ArticleAuxiliary>
                <Documents documents={resource.documents} className="g-mt-8" />
              </ArticleAuxiliary>
            )}

            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetValue={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}

            <ArticleTags resource={resource} className="g-mt-8" />
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
}

export const iptRoute: RouteObjectWithPlugins = {
  id: 'ipt',
  element: <IptPage />,
  loader: iptPageLoader,
  loadingElement: <ArticleSkeleton />,
  path: 'ipt',
};
