import { Helmet } from 'react-helmet-async';
import { useLoaderData } from 'react-router-dom';
import { CompositionQuery, CompositionQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from './BlockItem';

export const CompositionPageSkeleton = ArticleSkeleton;

const COMPOSITION_QUERY = /* GraphQL */ `
  query Composition($key: String!) {
    composition(id: $key) {
      id
      title
      summary
      blocks {
        ...BlockItemDetails
      }
    }
  }
`;

export function compositionSlugifyKeySelector(data: CompositionQuery) {
  return data.composition?.title;
}

export function compositionPageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key provided in the url');

  return graphql.query<CompositionQuery, CompositionQueryVariables>(COMPOSITION_QUERY, {
    key,
  });
}

export function CompositionPage() {
  const { data } = useLoaderData() as { data: CompositionQuery };

  if (data.composition == null) throw new Error('404');
  const resource = data.composition;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>
      {resource.blocks?.map((block) => (
        <BlockItem resource={block} key={block.id} />
      ))}
    </>
  );
}
