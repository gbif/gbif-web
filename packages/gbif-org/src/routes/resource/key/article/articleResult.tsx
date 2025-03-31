import { ResultCard } from '@/components/resultCards/index';
import { NewsResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment ArticleResult on Article {
    id
    title
    excerpt
    primaryImage {
      ...ResultCardImage
    }
  }
`);

type Props = {
  article: NewsResultFragment;
  className?: string;
};

export function ArticleResult({ article, className }: Props) {
  const link = `/article/${article.id}`;

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={article.title} link={link} contentType="news" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{article.excerpt}</ResultCard.Content>
        {article.primaryImage && <ResultCard.Image image={article.primaryImage} link={link} />}
      </div>
    </ResultCard.Container>
  );
}
