import { HeaderBlockDetailsFragment } from '@/gql/graphql';
import { ArticleBanner } from '../../components/ArticleBanner';
import { ArticleIntro } from '../../components/ArticleIntro';
import { ArticlePreTitle } from '../../components/ArticlePreTitle';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { fragmentManager } from '@/services/FragmentManager';
import { FormattedMessage } from 'react-intl';
import { BlockContainer } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment HeaderBlockDetails on HeaderBlock {
    __typename
    title
    type
    summary
    primaryImage {
      ...ArticleBanner
    }
  }
`);

type Props = {
  resource: HeaderBlockDetailsFragment;
};

export function HeaderBlock({ resource }: Props) {
  return (
    <BlockContainer className='pb-0'>
      <ArticleTextContainer>
        {resource.type && (
          <ArticlePreTitle>
            <FormattedMessage id={`cms.contentType.${resource.type}`} />
          </ArticlePreTitle>
        )}

        <ArticleTitle>{resource.title}</ArticleTitle>

        {resource.summary && (
          <ArticleIntro dangerouslySetInnerHTML={{ __html: resource.summary }} className="mt-2" />
        )}
      </ArticleTextContainer>

      <ArticleBanner className="mt-8" image={resource?.primaryImage} />
    </BlockContainer>
  );
}
