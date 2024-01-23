import { fragmentManager } from '@/services/fragmentManager';
import { CarouselBlockDetailsFragment } from '@/gql/graphql';

fragmentManager.register(/* GraphQL */ `
  fragment CarouselBlockDetails on CarouselBlock {
    __typename
    id
    title
    body
    backgroundColour
    features {
      __typename
      ... on MediaBlock {
        ...MediaBlockDetails
      }
      ... on MediaCountBlock {
        ...MediaCountBlockDetails
      }
    }
  }
`);

type Props = {
  resource: CarouselBlockDetailsFragment;
  backgroundColorMap: Record<string, string>;
};

export function CarouselBlock({ resource }: Props) {
  return <>{resource.__typename}</>;
}
