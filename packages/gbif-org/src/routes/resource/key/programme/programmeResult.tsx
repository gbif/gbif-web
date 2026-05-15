import { ResultCard } from '@/components/resultCards/index';
import { ProgrammeResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { getTextDirection } from '@/utils/textDirection';

fragmentManager.register(/* GraphQL */ `
  fragment ProgrammeResult on Programme {
    id
    title
    excerpt
    primaryImage {
      ...ResultCardImage
    }
  }
`);

type Props = {
  programme: ProgrammeResultFragment;
  className?: string;
};

export function ProgrammeResult({ programme, className }: Props) {
  const link = `/programme/${programme.id}`;
  const dir = getTextDirection(programme.title);

  return (
    <ResultCard.Container className={className} dir={dir}>
      <ResultCard.Header
        title={programme.title}
        link={link}
        contentType="cms.contentType.programme"
      />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>{programme.excerpt}</ResultCard.Content>
        {programme.primaryImage && (
          <ResultCard.Image image={programme.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
