import { BlockItemDetailsFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { CarouselBlock } from './blocks/carouselBlock';
import { CustomComponentBlock } from './blocks/customComponentBlock';
import { FeatureBlock } from './blocks/featureBlock';
import { FeaturedTextBlock } from './blocks/featuredTextBlock';
import { HeaderBlock } from './blocks/headerBlock';
import { MediaBlock } from './blocks/mediaBlock';
import { MediaCountBlock } from './blocks/mediaCountBlock';
import { TextBlock } from './blocks/textBlock';

fragmentManager.register(/* GraphQL */ `
  fragment BlockItemDetails on BlockItem {
    __typename
    ... on HeaderBlock {
      id
      ...HeaderBlockDetails
    }
    ... on FeatureBlock {
      id
      ...FeatureBlockDetails
    }
    ... on FeaturedTextBlock {
      id
      ...FeaturedTextBlockDetails
    }
    ... on CarouselBlock {
      id
      ...CarouselBlockDetails
    }
    ... on MediaBlock {
      id
      ...MediaBlockDetails
    }
    ... on MediaCountBlock {
      id
      ...MediaCountBlockDetails
    }
    ... on CustomComponentBlock {
      id
      ...CustomComponentBlockDetails
    }
    ... on TextBlock {
      id
      ...TextBlockDetails
    }
  }
`);

type Props = {
  resource: BlockItemDetailsFragment;
  resourceType?: string;
  insideCarousel?: boolean;
};

export function BlockItem({ resource, insideCarousel = false, resourceType }: Props) {
  switch (resource.__typename) {
    case 'HeaderBlock':
      return <HeaderBlock resource={resource} resourceType={resourceType} />;
    case 'FeatureBlock':
      return <FeatureBlock resource={resource} />;
    case 'FeaturedTextBlock':
      return <FeaturedTextBlock resource={resource} />;
    case 'CarouselBlock':
      return <CarouselBlock resource={resource} />;
    case 'MediaBlock':
      return <MediaBlock resource={resource} insideCarousel={insideCarousel} />;
    case 'MediaCountBlock':
      return <MediaCountBlock resource={resource} insideCarousel={insideCarousel} />;
    case 'CustomComponentBlock':
      return <CustomComponentBlock resource={resource} />;
    case 'TextBlock':
      return <TextBlock resource={resource} />;
    default:
      return null;
  }
}
