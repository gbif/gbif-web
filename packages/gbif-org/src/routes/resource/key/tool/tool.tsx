import { Helmet } from 'react-helmet-async';
import { ToolPageFragment } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticlePreTitle } from '../components/articlePreTitle';
import { ArticleTitle } from '../components/articleTitle';
import { PublishedDate } from '../components/publishedDate';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleTextContainer } from '../components/articleTextContainer';
import { ArticleBody } from '../components/articleBody';
import { SecondaryLinks } from '../components/secondaryLinks';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/components/dynamicLink';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { fragmentManager } from '@/services/fragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ArticleOpenGraph } from '../components/articleOpenGraph';

export const ToolPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment ToolPage on Tool {
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
`);

export const toolPageLoader = createResourceLoaderWithRedirect({
  fragment: 'ToolPage',
  resourceType: 'Tool',
});

export function ToolPage() {
  const { resource } = useLoaderData() as { resource: ToolPageFragment };

  return (
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <ArticleTextContainer className="mb-10">
          <ArticlePreTitle>
            <FormattedMessage id="cms.contentType.tool" />
          </ArticlePreTitle>

          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.publicationDate && (
            <PublishedDate className="mt-2" date={resource.publicationDate} />
          )}

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="mt-2" />
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
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="mt-2" />
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
                dangerouslySetValue={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}

            {resource.author && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.author" />}
                dangerouslySetValue={{ __html: resource.author, classNames: 'underlineLinks' }}
              />
            )}

            {resource.rights && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.rights" />}
                dangerouslySetValue={{ __html: resource.rights, classNames: 'underlineLinks' }}
              />
            )}

            {resource.rightsHolder && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.resource.rightsHolder" />}
                dangerouslySetValue={{
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
