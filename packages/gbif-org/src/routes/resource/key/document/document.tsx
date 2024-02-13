import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { DocumentQuery, DocumentQueryVariables } from '@/gql/graphql';
import { useLoaderData } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArticleContainer } from '../components/ArticleContainer';
import { FormattedMessage } from 'react-intl';
import { ArticleTitle } from '../components/ArticleTitle';
import { ArticleIntro } from '../components/ArticleIntro';
import { Button } from '@/components/ui/button';
import { DynamicLink } from '@/components/DynamicLink';
import { MdDownload as DownloadIcon } from 'react-icons/md';
import { ArticleBody } from '../components/ArticleBody';
import { PublishedDate } from '../components/PublishedDate';
import { ArticleAuxiliary } from '../components/ArticleAuxiliary';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { RenderIfChildren } from '@/components/RenderIfChildren';

const DOCUMENT_QUERY = /* GraphQL */ `
  query Document($key: String!) {
    gbifDocument(id: $key) {
      id
      title
      createdAt
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
  }
`;

export function documentPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');
  return graphql.query<DocumentQuery, DocumentQueryVariables>(DOCUMENT_QUERY, { key });
}

export function DocumentPage() {
  const { data } = useLoaderData() as { data: DocumentQuery };

  if (data.gbifDocument == null) throw new Error('404');
  const resource = data.gbifDocument;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      <ArticleContainer>
        <div className="max-w-4xl m-auto bg-paperBackground md:shadow-2xl md:p-8 lg:p-16">
          <ArticleTitle>{resource.title}</ArticleTitle>

          {resource.createdAt && <PublishedDate date={resource.createdAt} />}

          {resource.summary && (
            <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
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
            <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-10" />
          )}

          {resource.citation && (
            <>
              <hr className="my-8" />

              <ArticleAuxiliary label={<FormattedMessage id="cms.auxiliary.citation" />}>
                <div dangerouslySetInnerHTML={{ __html: resource.citation }} />
              </ArticleAuxiliary>
            </>
          )}
        </div>
      </ArticleContainer>
    </>
  );
}

export function DocumentPageSkeleton() {
  return <ArticleSkeleton />;
}
