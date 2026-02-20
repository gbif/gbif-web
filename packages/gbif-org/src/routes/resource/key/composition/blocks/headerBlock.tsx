import { HeaderBlockDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { FormattedMessage } from 'react-intl';
import { ArticleBanner } from '../../components/articleBanner';
import { ArticleIntro } from '../../components/articleIntro';
import { ArticlePreTitle } from '../../components/articlePreTitle';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { ArticleTitle } from '../../components/articleTitle';
import { BlockContainer, getAnchorId } from './_shared';
import { ConditionalWrapper } from '@/components/conditionalWrapper';
import { DynamicLink } from '@/reactRouterPlugins';

fragmentManager.register(/* GraphQL */ `
  fragment HeaderBlockDetails on HeaderBlock {
    __typename
    title
    summary
    hideTitle
    primaryImage {
      ...ArticleBanner
    }
  }
`);

type Props = {
  resource: HeaderBlockDetailsFragment;
  resourceType?: string;
  resourceLink?: string;
};

export function HeaderBlock({ resource, resourceType, resourceLink }: Props) {
  return (
    <BlockContainer id={getAnchorId(resource.title)}>
      <ArticleTextContainer>
        {resourceType && (
          <ArticlePreTitle clickable={!!resourceLink}>
            <ConditionalWrapper
              condition={!!resourceLink}
              wrapper={(children) => <DynamicLink to={resourceLink}>{children}</DynamicLink>}
            >
              <FormattedMessage id={`cms.contentType.${resourceType}`} />
            </ConditionalWrapper>
          </ArticlePreTitle>
        )}

        {!resource.hideTitle && resource.title && (
          <ArticleTitle dangerouslySetTitle={{ __html: resource.title }} />
        )}

        {resource.summary && (
          <ArticleIntro dangerouslySetIntro={{ __html: resource.summary }} className="g-mt-2" />
        )}
      </ArticleTextContainer>

      <ArticleBanner className="g-mt-8" image={resource?.primaryImage} />
    </BlockContainer>
  );
}
