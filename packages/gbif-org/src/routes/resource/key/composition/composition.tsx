import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { CompositionQuery, CompositionQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from './BlockItem';

export const CompositionSkeleton = ArticleSkeleton;

const { load, useTypedLoaderData } = createGraphQLHelpers<
  CompositionQuery,
  CompositionQueryVariables
>(/* GraphQL */ `
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
`);

export function Composition() {
  const { data } = useTypedLoaderData();

  if (data.composition == null) throw new Error('404');
  const resource = data.composition;

  return (
    <>
      <Helmet>
        <title>{resource.title}</title>
      </Helmet>
      {resource.blocks?.map((block, idx) => (
        <BlockItem resource={block} key={idx} />
      ))}
    </>
  );
}

export async function compositionLoader({ request, params, config, locale }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return load({
    endpoint: config.graphqlEndpoint,
    signal: request.signal,
    variables: {
      key,
    },
    locale: locale.cmsLocale || locale.code,
  });
}
