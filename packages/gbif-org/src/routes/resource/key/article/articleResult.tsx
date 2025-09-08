import { ResultCard } from '@/components/resultCards/index';
import { ArticleResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment ArticleResult on Article {
    id
    title
    excerpt
    urlAlias
    primaryImage {
      ...ResultCardImage
    }
  }
`);

type Props = {
  article: ArticleResultFragment;
  className?: string;
};

export function ArticleResult({ article, className }: Props) {
  const link = article.urlAlias ?? `/article/${article.id}`;

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={article.title} link={link} />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{article.excerpt}</ResultCard.Content>
        {article.primaryImage && (
          <ResultCard.Image image={article.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
