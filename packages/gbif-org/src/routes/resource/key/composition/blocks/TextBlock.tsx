import { TextBlockDetailsFragment } from '@/gql/graphql';
import { ArticleContainer } from '../../components/ArticleContainer';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleBody } from '../../components/ArticleBody';
import { fragmentManager } from '@/services/_FragmentManager';
import { backgroundColorMap } from './_shared';
import { ArticleTitle } from '../../components/ArticleTitle';

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
    <ArticleContainer className={backgroundColor}>
      <ArticleTextContainer>
        {!resource.hideTitle && resource.title && (
          <ArticleTitle title={resource.title}></ArticleTitle>
        )}
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
