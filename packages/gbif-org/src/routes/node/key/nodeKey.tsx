import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import PageMetaData from '@/components/PageMetaData';
import { NotFoundLoaderResponse } from '@/errors';
import { NodeDetailsQuery, NodeDetailsQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ParticipantHeaderInfo } from '@/routes/participant/key/participantKey';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors, useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
import { required } from '@/utils/required';
import { FormattedMessage } from 'react-intl';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

const NODE_QUERY = /* GraphQL */ `
  query NodeDetails($key: ID!) {
    node(key: $key) {
      ...NodeDetails
      participant {
        ...ParticipantDetails
      }
    }
  }
`;

export async function nodeLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  // if the key === '02c40d2a-1cba-4633-90b7-e36e5e97aba8' then go to next route
  if (key === '02c40d2a-1cba-4633-90b7-e36e5e97aba8') {
    throw new NotFoundLoaderResponse();
  }

  const response = await graphql.query<NodeDetailsQuery, NodeDetailsQueryVariables>(NODE_QUERY, {
    key,
  });
  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['node'],
    errors,
    requiredObjects: [data?.node],
    query: NODE_QUERY,
    variables: { key },
  });

  if (data?.node?.participant) {
    // if the node is a participant, then redirect to the participant route with the participant id
    return redirect(`/participant/${data.node.participant.id}`);
  }

  return { errors, node: data.node! };
}

export type NodeKeyLoaderResult = Exclude<Awaited<ReturnType<typeof nodeLoader>>, Response>;

export function NodePage() {
  const { node, errors } = useLoaderData() as NodeKeyLoaderResult;
  useNotifyOfPartialDataIfErrors(errors);

  return (
    <article className="g-bg-background">
      <PageMetaData title={node.title} path={`/participant/${node.key}`} />

      <DataHeader aboutContent={<AboutContent />} apiContent={<ApiContent id={node.key} />} />
      <PageContainer topPadded hasDataHeader>
        <ArticleTextContainer className="g-max-w-screen-lg">
          <ArticlePreTitle>
            <FormattedMessage id={`participant.node`} />
          </ArticlePreTitle>
          <ArticleTitle>{node.title}</ArticleTitle>
          <ParticipantHeaderInfo url={node.homepage?.[0]} node={node} />
        </ArticleTextContainer>
      </PageContainer>

      <div className="g-bg-slate-100">
        <ArticleContainer>
          <ArticleTextContainer className="g-max-w-screen-lg">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </ArticleTextContainer>
        </ArticleContainer>
      </div>
    </article>
  );
}

export const NodePageSkeleton = ArticleSkeleton;
