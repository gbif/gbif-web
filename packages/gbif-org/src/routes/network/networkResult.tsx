import { ResultCard } from '@/components/resultCards/index';
import { NetworkProseResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

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

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={network.title} link={link} contentType="network" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{network.excerpt}</ResultCard.Content>
        {network.primaryImage && <ResultCard.Image image={network.primaryImage} link={link} />}
      </div>
    </ResultCard.Container>
  );
}
