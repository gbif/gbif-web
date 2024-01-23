import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { ProgrammeQuery, ProgrammeQueryVariables } from '@/gql/graphql';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import { ArticleContainer } from '@/routes/resource/key/components/ArticleContainer';
import { ArticleSkeleton } from '../components/ArticleSkeleton';
import { BlockItem } from '../composition/BlockItem';

export const ProgrammeSkeleton = ArticleSkeleton;

const { load, useTypedLoaderData } = createGraphQLHelpers<
  ProgrammeQuery,
  ProgrammeQueryVariables
>(/* GraphQL */ `
  query Programme($key: String!) {
    programme(id: $key) {
      title
      excerpt
      blocks {
        ...BlockItemDetails
      }
    }
  }
`);

export function Programme() {
  const { data } = useTypedLoaderData();

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

export async function programmeLoader({ request, params, config, locale }: LoaderArgs) {
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
