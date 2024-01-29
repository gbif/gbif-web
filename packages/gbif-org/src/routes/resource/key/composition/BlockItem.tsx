import { BlockItemDetailsFragment } from '@/gql/graphql';
import { HeaderBlock } from './blocks/HeaderBlock';
import { FeatureBlock } from './blocks/FeatureBlock';
import { FeaturedTextBlock } from './blocks/FeaturedTextBlock';
import { CarouselBlock } from './blocks/CarouselBlock';
import { MediaBlock } from './blocks/MediaBlock';
import { MediaCountBlock } from './blocks/MediaCountBlock';
import { CustomComponentBlock } from './blocks/CustomComponentBlock';
import { TextBlock } from './blocks/TextBlock';
import { fragmentManager } from '@/services/FragmentManager';

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
  insideCarousel?: boolean;
};

export function BlockItem({ resource, insideCarousel = false }: Props) {
  switch (resource.__typename) {
    case 'HeaderBlock':
      return <HeaderBlock resource={resource} />;
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
