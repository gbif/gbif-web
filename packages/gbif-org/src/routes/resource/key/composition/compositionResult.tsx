import { ResultCard } from '@/components/resultCards/index';
import { CompositionResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment CompositionResult on Composition {
    id
    title
    excerpt
    urlAlias
    primaryImage {
      ...ResultCardImage
    }
  }
`);

type Props = {
  composition: CompositionResultFragment;
  className?: string;
};

export function CompositionResult({ composition, className }: Props) {
  const link = composition.urlAlias ?? `/composition/${composition.id}`;

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={composition.title} link={link} />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{composition.excerpt}</ResultCard.Content>
        {composition.primaryImage && (
          <ResultCard.Image image={composition.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
