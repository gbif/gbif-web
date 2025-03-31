import { FeatureBlockDetailsFragment, ProseCardImgFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { slugify } from '@/utils/slugify';
import { ArticleBody } from '../../components/articleBody';
import { ArticleTextContainer } from '../../components/articleTextContainer';
import { redirectMapper } from '../../createResourceLoaderWithRedirect';
import { ProseCard } from '../proseCard';
import { backgroundColorMap, BlockContainer, BlockHeading } from './_shared';

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
      ... on MeetingEvent {
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
        <BlockHeading dangerouslySetHeading={{ __html: resource.title }} />
      )}
      {resource.body && (
        <ArticleTextContainer className="g-mt-2 g-mb-10">
          <ArticleBody dangerouslySetBody={{ __html: resource.body }} />
        </ArticleTextContainer>
      )}
      <div
        className={cn('g-max-w-6xl g-m-auto md:g-px-10 g-my-10 g-grid g-grid-cols-1 g-gap-5', {
          'sm:g-grid-cols-2': maxPerRow >= 2,
          'lg:g-grid-cols-3': maxPerRow >= 3,
          'xl:g-grid-cols-4': maxPerRow >= 4,
        })}
      >
        {resource.features?.map((feature, index) => {
          let image: ProseCardImgFragment | null | undefined;
          if ('optionalImg' in feature) image = feature.optionalImg;
          if ('primaryImage' in feature) image = feature.primaryImage;

          let url: string | undefined;
          if ('url' in feature) url = feature.url;
          if (!url && feature.__typename !== 'Feature') {
            url = redirectMapper[feature.__typename](feature.id, slugify(feature.title));
          }

          return <ProseCard key={index} title={feature.title} url={url} image={image} />;
        })}
      </div>
    </BlockContainer>
  );
}
