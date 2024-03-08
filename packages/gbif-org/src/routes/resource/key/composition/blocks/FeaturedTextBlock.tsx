import { FeaturedTextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { ArticleBody } from '../../components/ArticleBody';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment FeaturedTextBlockDetails on FeaturedTextBlock {
    __typename
    id
    title
    hideTitle
    body
    backgroundColour
  }
`);

type Props = {
  resource: FeaturedTextBlockDetailsFragment;
};

export function FeaturedTextBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      {!resource.hideTitle && resource.title && (
        <ArticleTextContainer className="mb-16">
          <ArticleTitle title={resource.title}></ArticleTitle>
        </ArticleTextContainer>
      )}
      {resource.body && (
        <ArticleTextContainer>
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        </ArticleTextContainer>
      )}
    </BlockContainer>
  );
}
