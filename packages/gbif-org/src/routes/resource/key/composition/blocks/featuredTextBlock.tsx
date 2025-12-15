import { FeaturedTextBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { ArticleBody } from '../../components/articleBody';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { backgroundColorMap, BlockContainer, BlockHeading } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment FeaturedTextBlockDetails on FeaturedTextBlock {
    __typename
    id
    title
    hideTitle
    body
    backgroundColour
    primaryImage {
      file {
        url
      }
    }
  }
`);

type Props = {
  resource: FeaturedTextBlockDetailsFragment;
};

export function FeaturedTextBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor} backgroundImage={resource.primaryImage?.file?.url}>
      {!resource.hideTitle && resource.title && (
        <BlockHeading dangerouslySetHeading={{ __html: resource.title }} />
      )}
      {resource.body && (
        <ArticleTextContainer className="g-mt-2 g-mb-10">
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} />
        </ArticleTextContainer>
      )}
    </BlockContainer>
  );
}
