import { RenderIfChildren } from '@/components/renderIfChildren';
import { Button } from '@/components/ui/button';
import { DocumentPageFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { Helmet } from 'react-helmet-async';
import { MdDownload as DownloadIcon } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { useLoaderData } from 'react-router-dom';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleBody } from '../components/articleBody';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { ArticleIntro } from '../components/articleIntro';
import { ArticleOpenGraph } from '../components/articleOpenGraph';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { ArticleTitle } from '../components/articleTitle';
import { PageContainer } from '../components/pageContainer';
import { PublishedDate } from '../components/publishedDate';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';

export const DocumentPageSkeleton = ArticleSkeleton;

fragmentManager.register(/* GraphQL */ `
  fragment DocumentPage on Document {
    id
    title
    createdAt
    excerpt
    summary
    primaryLink {
      label
      url
    }
    document {
      title
      description
      file {
        fileName
        url
      }
    }
    body
    citation
  }
`);

export const documentPageLoader = createResourceLoaderWithRedirect({
  fragment: 'DocumentPage',
  resourceType: 'Document',
});

export function DocumentPage() {
  const { resource } = useLoaderData() as { resource: DocumentPageFragment };

  return (
    <article>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <PageContainer topPadded bottomPadded className="g-bg-white">
        <div className="g-max-w-4xl g-m-auto g-bg-paperBackground md:g-shadow-2xl md:g-p-8 lg:g-p-16">
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.createdAt && <PublishedDate date={resource.createdAt} />}

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
          )}

          <RenderIfChildren className="g-flex g-gap-4 g-mt-4">
            {resource.primaryLink && (
              <Button asChild>
                <DynamicLink to={resource.primaryLink.url}>
                  {resource.primaryLink.label}
                </DynamicLink>
              </Button>
            )}

            {resource.document?.file?.url && (
              <Button asChild>
                <a className="g-flex g-items-center g-gap-4" href={resource.document.file.url}>
                  <DownloadIcon size={20} />
                  <FormattedMessage id="cms.document.download" />
                </a>
              </Button>
            )}
          </RenderIfChildren>

          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="g-mt-10" />
          )}

          <ArticleFooterWrapper>
            {resource.citation && (
              <ArticleAuxiliary
                label={<FormattedMessage id="cms.auxiliary.citation" />}
                dangerouslySetValue={{
                  __html: resource.citation,
                  classNames: 'underlineLinks',
                }}
              />
            )}
          </ArticleFooterWrapper>
        </div>
      </PageContainer>
    </article>
  );
}
