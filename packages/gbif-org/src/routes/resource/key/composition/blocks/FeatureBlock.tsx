import { FeatureBlockDetailsFragment, ProseCardImgFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';
import { ArticleBody } from '../../components/ArticleBody';
import { ProseCard } from '../proseCard';
import { fragmentManager } from '@/services/FragmentManager';
import { BlockContainer, backgroundColorMap } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment FeatureBlockDetails on FeatureBlock {
    __typename
    maxPerRow
    title
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
        excerpt
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on DataUse {
        id
        title
        excerpt
        optionalImg: primaryImage {
          ...ProseCardImg
        }
      }
      ... on Event {
        id
        title
        excerpt
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

  return (
    <BlockContainer className={backgroundColor}>
      <ArticleTextContainer>
        <ArticleTitle>{resource.title}</ArticleTitle>
      </ArticleTextContainer>
      <ArticleTextContainer>
        {resource.body && (
          <ArticleBody dangerouslySetInnerHTML={{ __html: resource.body }} className="mt-2" />
        )}
      </ArticleTextContainer>
      <div className="max-w-6xl m-auto p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {resource.features?.map((feature, index) => {
          let image: ProseCardImgFragment | null | undefined;
          if ('optionalImg' in feature) image = feature.optionalImg;
          if ('primaryImage' in feature) image = feature.primaryImage;

          let url: string | undefined;
          if ('url' in feature) url = feature.url;

          let excerpt: string | undefined | null;
          if ('excerpt' in feature) excerpt = feature.excerpt;

          return (
            <ProseCard
              key={index}
              title={feature.title}
              excerpt={excerpt}
              url={url}
              image={image}
            />
          );
        })}
      </div>
    </BlockContainer>
  );
}
