import { ResultCard } from '@/components/resultCards/index';
import { ArticleResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { getTextDirection } from '@/utils/textDirection';

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
  const dir = getTextDirection(article.title);

  return (
    <ResultCard.Container className={className} dir={dir}>
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
