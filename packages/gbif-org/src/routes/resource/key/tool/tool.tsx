import { Helmet } from 'react-helmet-async';
import { ToolPageFragment } from '@/gql/graphql';
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
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/components/DynamicLink';
import { ArticleFooterWrapper } from '../components/ArticleFooterWrapper';
import { fragmentManager } from '@/services/FragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { ArticleOpenGraph } from '../components/ArticleOpenGraph';

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

          <ArticleTitle title={resource.title} />

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
