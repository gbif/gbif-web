import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArticleContainer } from '../components/articleContainer';
import { FormattedMessage } from 'react-intl';
import { ArticleTitle } from '../components/articleTitle';
import { ArticleIntro } from '../components/articleIntro';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/components/dynamicLink';
import { MdDownload as DownloadIcon } from 'react-icons/md';
import { ArticleBody } from '../components/articleBody';
import { PublishedDate } from '../components/publishedDate';
import { ArticleAuxiliary } from '../components/articleAuxiliary';
import { ArticleSkeleton } from '../components/articleSkeleton';
import { RenderIfChildren } from '@/components/renderIfChildren';
import { ArticleFooterWrapper } from '../components/articleFooterWrapper';
import { fragmentManager } from '@/services/fragmentManager';
import { createResourceLoaderWithRedirect } from '../createResourceLoaderWithRedirect';
import { DocumentPageFragment } from '@/gql/graphql';
import { ArticleOpenGraph } from '../components/articleOpenGraph';

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
    <>
      <ArticleOpenGraph resource={resource} />

      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <div className="max-w-4xl m-auto bg-paperBackground md:shadow-2xl md:p-8 lg:p-16">
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />

          {resource.createdAt && <PublishedDate date={resource.createdAt} />}

          {resource.summary && (
            <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="mt-2" />
          )}

          <RenderIfChildren className="flex gap-4 mt-4">
            {resource.primaryLink && (
              <Button asChild>
                <DynamicLink to={resource.primaryLink.url}>
                  {resource.primaryLink.label}
                </DynamicLink>
              </Button>
            )}

            {resource.document?.file?.url && (
              <Button asChild>
                <a className="flex items-center gap-4" href={resource.document.file.url}>
                  <DownloadIcon size={20} />
                  <FormattedMessage id="cms.document.download" />
                </a>
              </Button>
            )}
          </RenderIfChildren>

          {resource.body && (
            <ArticleBody dangerouslySetBody={{ __html: resource.body }} className="mt-10" />
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
      </ArticleContainer>
    </>
  );
}
