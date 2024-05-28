import { CollectionQuery } from '@/gql/graphql';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';

export default function About() {
  const { data } = useParentRouteLoaderData(RouteId.Collection) as { data: CollectionQuery };
  return (
    <ArticleContainer className="bg-slate-100 pt-2 md:pt-4">
      <ArticleTextContainer className="max-w-screen-xl">
        About text
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
