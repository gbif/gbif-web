import { BlockItemDetailsFragment } from '@/gql/graphql';
import { HeaderBlock } from './blocks/HeaderBlock';
import { FeatureBlock } from './blocks/FeatureBlock';
import { FeaturedTextBlock } from './blocks/FeaturedTextBlock';
import { CarouselBlock } from './blocks/CarouselBlock';
import { MediaBlock } from './blocks/MediaBlock';
import { MediaCountBlock } from './blocks/MediaCountBlock';
import { CustomComponentBlock } from './blocks/CustomComponentBlock';
import { TextBlock } from './blocks/TextBlock';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment BlockItemDetails on BlockItem {
    __typename
    ... on HeaderBlock {
      ...HeaderBlockDetails
    }
    ... on FeatureBlock {
      ...FeatureBlockDetails
    }
    ... on FeaturedTextBlock {
      ...FeaturedTextBlockDetails
    }
    ... on CarouselBlock {
      ...CarouselBlockDetails
    }
    ... on MediaBlock {
      ...MediaBlockDetails
    }
    ... on MediaCountBlock {
      ...MediaCountBlockDetails
    }
    ... on CustomComponentBlock {
      ...CustomComponentBlockDetails
    }
    ... on TextBlock {
      ...TextBlockDetails
    }
  }
`);

type Props = {
  resource: BlockItemDetailsFragment;
  insideCarousel?: boolean;
};

const backgroundColorMap: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-slate-50',
  gray: 'bg-slate-100',
};

export function BlockItem({ resource, insideCarousel = false }: Props) {
  switch (resource.__typename) {
    case 'HeaderBlock':
      return <HeaderBlock resource={resource} />;
    case 'FeatureBlock':
      return <FeatureBlock resource={resource} backgroundColorMap={backgroundColorMap} />;
    case 'FeaturedTextBlock':
      return <FeaturedTextBlock resource={resource} backgroundColorMap={backgroundColorMap} />;
    case 'CarouselBlock':
      return <CarouselBlock resource={resource} backgroundColorMap={backgroundColorMap} />;
    case 'MediaBlock':
      return <MediaBlock resource={resource} />;
    case 'MediaCountBlock':
      return (
        <MediaCountBlock
          resource={resource}
          insideCarousel={insideCarousel}
          backgroundColorMap={backgroundColorMap}
        />
      );
    case 'CustomComponentBlock':
      return <CustomComponentBlock resource={resource} backgroundColorMap={backgroundColorMap} />;
    case 'TextBlock':
      return <TextBlock resource={resource} backgroundColorMap={backgroundColorMap} />;
    default:
      return null;
  }
}
