import { FeatureBlockDetailsFragment, ProseCardImgFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { ArticleBody } from '../../components/ArticleBody';
import { ProseCard } from '../proseCard';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';
import { cn } from '@/utils/shadcn';

fragmentManager.register(/* GraphQL */ `
  fragment FeatureBlockDetails on FeatureBlock {
    __typename
    maxPerRow
    title
    hideTitle
    body
    backgroundColour
    features {
      __typename
      ... on Feature {
        id
        title
        url
        primaryImage {
          ...ProseCardImg
        }
      }
      ... on News {
        id
        title
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on DataUse {
        id
        title
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on Event {
        id
        title
        start
        end
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
    }
  }
`);

type Props = {
  resource: FeatureBlockDetailsFragment;
};

export function FeatureBlock({ resource }: Props) {
  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];
  const maxPerRow = resource.maxPerRow ?? 4;

  return (
    <BlockContainer className={backgroundColor}>
      {!resource.hideTitle && resource.title && (
        <ArticleTextContainer>
          <ArticleTitle>{resource.title}</ArticleTitle>
        </ArticleTextContainer>
      )}
      {resource.body && (
        <ArticleTextContainer>
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        </ArticleTextContainer>
      )}
      <div
        className={cn('max-w-6xl m-auto p-10 grid grid-cols-1 gap-5', {
          'sm:grid-cols-2': maxPerRow >= 2,
          'lg:grid-cols-3': maxPerRow >= 3,
          'xl:grid-cols-4': maxPerRow >= 4,
        })}
      >
        {resource.features?.map((feature, index) => {
          let image: ProseCardImgFragment | null | undefined;
          if ('optionalImg' in feature) image = feature.optionalImg;
          if ('primaryImage' in feature) image = feature.primaryImage;

          let url: string | undefined;
          if ('url' in feature) url = feature.url;

          return <ProseCard key={index} title={feature.title} url={url} image={image} />;
        })}
      </div>
    </BlockContainer>
  );
}
