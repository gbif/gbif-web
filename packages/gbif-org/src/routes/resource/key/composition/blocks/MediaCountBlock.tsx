import { fragmentManager } from '@/services/fragmentManager';
import { MediaCountBlockDetailsFragment } from '@/gql/graphql';

fragmentManager.register(/* GraphQL */ `
  fragment MediaCountBlockDetails on MediaCountBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
    }
    reverse
    subtitle
    titleCountPart
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }
`);

type Props = {
  resource: MediaCountBlockDetailsFragment;
};

export function MediaCountBlock({ resource }: Props) {
  return <>{resource.__typename}</>;
}
