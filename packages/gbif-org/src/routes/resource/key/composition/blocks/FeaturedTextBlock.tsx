import { FeaturedTextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleContainer } from '../../components/ArticleContainer';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { ArticleBody } from '../../components/ArticleBody';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment FeaturedTextBlockDetails on FeaturedTextBlock {
    __typename
    id
    title
    body
    backgroundColour
  }
`);

type Props = {
  resource: FeaturedTextBlockDetailsFragment;
  backgroundColorMap: Record<string, string>;
};

export function FeaturedTextBlock({ resource, backgroundColorMap }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <ArticleContainer className={backgroundColor}>
      {resource.title && (
        <ArticleTextContainer className="mb-16">
          <ArticleTitle title={resource.title}></ArticleTitle>
        </ArticleTextContainer>
      )}
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
