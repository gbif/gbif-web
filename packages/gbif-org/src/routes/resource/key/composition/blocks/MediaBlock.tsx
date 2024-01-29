import { fragmentManager } from '@/services/FragmentManager';
import { MediaBlockDetailsFragment } from '@/gql/graphql';

fragmentManager.register(/* GraphQL */ `
  fragment MediaBlockDetails on MediaBlock {
    __typename
    id
    mediaTitle: title
    body
    reverse
    subtitle
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
  }
`);

type Props = {
  resource: MediaBlockDetailsFragment;
};

export function MediaBlock({ resource }: Props) {
  return <>{resource.__typename}</>;
}
