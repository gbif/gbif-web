import { ResultCard } from '@/components/resultCards/index';
import { DataUseResultFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { MdCalendarToday } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { MediumDate } from '@/components/dateFormats';

fragmentManager.register(/* GraphQL */ `
  fragment DataUseResult on DataUse {
    id
    title
    excerpt
    primaryImage {
      ...ResultCardImage
    }
    createdAt
  }
`);

type Props = {
  dataUse: DataUseResultFragment;
  className?: string;
};

export function DataUseResult({ dataUse, className }: Props) {
  const link = `/data-use/${dataUse.id}`;

  return (
    <ResultCard.Container className={className}>
      <ResultCard.Header title={dataUse.title} link={link} contentType="cms.contentType.dataUse" />
      <div className="g-flex g-gap-4">
        <ResultCard.Content>
          {dataUse.excerpt}
          <ResultCard.Metadata className="g-flex g-items-center">
            <MdCalendarToday className="g-me-2" /> <FormattedMessage id="cms.resource.published" />{' '}
            <MediumDate value={dataUse.createdAt} />
          </ResultCard.Metadata>
        </ResultCard.Content>
        {dataUse.primaryImage && (
          <ResultCard.Image image={dataUse.primaryImage} link={link} hideOnSmall />
        )}
      </div>
    </ResultCard.Container>
  );
}
