import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProgrammeQuery, ProgrammeQueryVariables } from '@/gql/graphql';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from '../composition/BlockItem';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';

export const ProgrammeSkeleton = ArticleSkeleton;

const PROGRAMME_QUERY = /* GraphQL */ `
  query Programme($key: String!) {
    programme(id: $key) {
      title
      excerpt
      blocks {
        ...BlockItemDetails
      }
    }
  }
`;

export async function programmeLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<ProgrammeQuery, ProgrammeQueryVariables>(PROGRAMME_QUERY, { key });
}

export function Programme() {
  const { data } = useLoaderData() as { data: ProgrammeQuery };

  if (data.programme == null) throw new Error('404');
  const resource = data.programme;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>

      {resource.blocks?.map((block, idx) => (
        <BlockItem resource={block} key={idx} />
      ))}

      <ArticleContainer>Funding should go here, similar to project pages</ArticleContainer>
    </>
  );
}
