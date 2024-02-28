import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment CustomComponentBlockDetails on CustomComponentBlock {
    id
    componentType
    title
    width
    backgroundColour
    settings
  }
`);

type Props = {
  resource: CustomComponentBlockDetailsFragment;
};

export function CustomComponentBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      <ArticleTextContainer>{resource.__typename} - not implemented yet</ArticleTextContainer>
    </BlockContainer>
  );
}
