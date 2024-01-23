import { CustomComponentBlockDetailsFragment } from '@/gql/graphql';
import { ArticleContainer } from '../../components/ArticleContainer';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { fragmentManager } from '@/services/fragmentManager';

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
  backgroundColorMap: Record<string, string>;
};

export function CustomComponentBlock({ resource, backgroundColorMap }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <ArticleContainer className={backgroundColor}>
      <ArticleTextContainer>{resource.__typename} - not implemented yet</ArticleTextContainer>
    </ArticleContainer>
  );
}
