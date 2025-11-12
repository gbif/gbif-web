import { OccurrenceDownloadSqlAboutQuery } from '@/gql/graphql';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useLoaderData } from 'react-router-dom';

type Resource = Extract<OccurrenceDownloadSqlAboutQuery['resource'], { __typename: 'Tool' }>;

export function OccurrenceDownloadSqlAbout() {
  const resource = useLoaderData() as Resource;

  return (
    <ArticleContainer>
      <ArticleTextContainer className="g-max-w-4xl">
        <ArticleBody dangerouslySetBody={{ __html: resource!.body as string }} />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
