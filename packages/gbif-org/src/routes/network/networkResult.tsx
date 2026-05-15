import { ResultCard } from '@/components/resultCards/index';
import { NetworkProseResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { getTextDirection } from '@/utils/textDirection';

fragmentManager.register(/* GraphQL */ `
  fragment NetworkProseResult on NetworkProse {
    id
    title
    excerpt
    networkKey
    primaryImage {
      ...ResultCardImage
    }
    createdAt
  }
`);

type Props = {
  network: NetworkProseResultFragment;
  className?: string;
};

export function NetworkProseResult({ network, className }: Props) {
  const link = `/network/${network.networkKey}`;
  const dir = getTextDirection(network.title);

  return (
    <ResultCard.Container className={className} dir={dir}>
      <ResultCard.Header title={network.title} link={link} contentType="cms.contentType.network" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{network.excerpt}</ResultCard.Content>
        {network.primaryImage && <ResultCard.Image image={network.primaryImage} link={link} />}
      </div>
    </ResultCard.Container>
  );
}
