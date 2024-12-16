import { TextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { ArticleBody } from '../../components/articleBody';
import { fragmentManager } from '@/services/fragmentManager';
import { BlockContainer, BlockHeading, backgroundColorMap } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment TextBlockDetails on TextBlock {
    title
    body
    hideTitle
    id
    backgroundColour
  }
`);

type Props = {
  resource: TextBlockDetailsFragment;
};

export function TextBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
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
