import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ToolQuery, ToolQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/ArticleBanner';
import { ArticlePreTitle } from '../components/ArticlePreTitle';
import { ArticleTitle } from '../components/ArticleTitle';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleIntro } from '../components/ArticleIntro';
import { ArticleTextContainer } from '../components/ArticleTextContainer';
import { ArticleBody } from '../components/ArticleBody';
import { SecondaryLinks } from '../components/SecondaryLinks';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { required } from '@/utils/required';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/components/DynamicLink';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';

const TOOL_QUERY = /* GraphQL */ `
  query Tool($key: String!) {
    tool(id: $key) {
      id
      title
      summary
      body
      primaryImage {
        ...ArticleBanner
      }
      primaryLink {
        label
        url
      }
      secondaryLinks {
        label
        url
      }
      citation
      createdAt
      author
      rights
      rightsHolder
      publicationDate
    }
  }
`;

export function toolSlugifyKeySelector(data: ToolQuery) {
  return data.tool?.title;
}

export async function toolPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ToolQuery, ToolQueryVariables>(TOOL_QUERY, { key });
}

export function ToolPage() {
  const { data } = useLoaderData() as { data: ToolQuery };

  if (data.tool == null) throw new Error('404');
  const resource = data.tool;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.tool" />
          </ArticlePreTitle>

          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.publicationDate && (
            <PublishedDate className="mt-2" date={resource.publicationDate} />
          )}

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
          )}

          {resource.primaryLink && (
            <Button className="mt-4" asChild>
              <DynamicLink to={resource.primaryLink.url}>{resource.primaryLink.label}</DynamicLink>
            </Button>
          )}
        </ArticleTextContainer>

        <ArticleBanner className="mt-8 mb-6" image={resource?.primaryImage} />

        <ArticleTextContainer>
          {resource.body && (
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
          )}

          <ArticleFooterWrapper>
            {resource.secondaryLinks && (
              <ArticleAuxiliary>
                <SecondaryLinks links={resource.secondaryLinks} className="mt-8" />
              </ArticleAuxiliary>
            )}

            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetInnerHTML={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}

            {resource.author && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.author" />}
                dangerouslySetInnerHTML={{ __html: resource.author, classNames: 'underlineLinks' }}
              />
            )}

            {resource.rights && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.rights" />}
                dangerouslySetInnerHTML={{ __html: resource.rights, classNames: 'underlineLinks' }}
              />
            )}

            {resource.rightsHolder && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.rightsHolder" />}
                dangerouslySetInnerHTML={{
                  __html: resource.rightsHolder,
                  classNames: 'underlineLinks',
                }}
              />
            )}
          </ArticleFooterWrapper>
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function ToolPageSkeleton() {
  return <ArticleSkeleton />;
}
