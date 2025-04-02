import { Tag } from '@/components/resultCards';
import { ResultCardHeaderBasic } from '@/components/resultCards/resultCardHeader';
import { Card } from '@/components/ui/largeCard';
import { DynamicLink } from '@/reactRouterPlugins';
import { FormattedMessage } from 'react-intl';

export type CrossSearchParticipant = {
  id: string;
  participationStatus: string;
  participantUrl: string;
  type: string;
  countryCode: string;
  name: string;
  membershipStart: string;
};

export function OtherParticipantResult({ participant }: { participant: CrossSearchParticipant }) {
  return (
    <Card className="g-mb-4">
      <article className="g-p-4 lg:g-p-8">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <ResultCardHeaderBasic>
              <DynamicLink
                className="hover:g-text-primary-500"
                pageId="participantKey"
                variables={{ key: participant.id }}
              >
                {participant.name}
              </DynamicLink>
            </ResultCardHeaderBasic>
          </div>
        </div>
        <div className="-g-m-1 g-mt-2 g-flex g-flex-row g-items-center g-flex-wrap">
          <Tag>
            <FormattedMessage
              id={`participant.participationStatus.longForm.${participant.participationStatus}`}
            />
          </Tag>
        </div>
      </article>
    </Card>
  );
}
