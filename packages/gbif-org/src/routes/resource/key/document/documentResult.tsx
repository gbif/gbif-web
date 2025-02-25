import { ResultCard } from '@/components/resultCards/index';
import { DocumentResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment DocumentResult on Document {
    id
    title
    excerpt
  }
`);

type Props = {
  document: DocumentResultFragment;
  className?: string;
};

export function DocumentResult({ document, className }: Props) {
  const link = `/document/${document.id}`;
  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={document.title} link={link} contentType="document" />
      <ResultCard.Content>{document.excerpt}</ResultCard.Content>
    </ResultCard.Container>
  );
}
