import Properties, { Property } from '@/components/properties';
import { ParticipantSummaryFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

type Props = {
  participant: ParticipantSummaryFragment;
  className?: string;
};

export function ParticipantSummary({ participant, className }: Props) {
  const headOfDelegation = participant.headOfDelegation?.[0];
  const participantNodeManager = participant.participantNodeManager?.[0];

  return (
    <Properties className={cn('[&_a]:g-text-primary-500', className)}>
      <Property
        labelId="Memeber status"
        value={participant.participationStatus}
        formatter={(value) => (
          <FormattedMessage id={`enums.participationStatus.${value}`} defaultMessage={value} />
        )}
      />
      <Property labelId="GBIF participant since" value={participant.participant?.membershipStart} />
      <Property
        labelId="GBIF region"
        value={participant.gbifRegion}
        formatter={(v) => <FormattedMessage id={`enums.region.${v}`} defaultMessage={v} />}
      />
      {headOfDelegation && (
        <Property
          labelId="Head of delegation"
          value={`${headOfDelegation.firstName} ${headOfDelegation.lastName}`}
          formatter={(v) => <Link to={`#contact${headOfDelegation.key}`}>{v}</Link>}
        />
      )}
      <Property
        labelId="Node name"
        value={participant.title}
        formatter={(v) => <Link to={`#nodeAddress`}>{v}</Link>}
      />
      <Property labelId="Node established" value={participant.participant?.nodeEstablishmentDate} />
      {/* TODO: Why is this not the same as portal16? */}
      <Property
        labelId="Website"
        value={participant.homepage}
        formatter={(v) => <a href={v}>{v}</a>}
      />
      {participantNodeManager && (
        <Property
          labelId="Participant node manager"
          value={`${participantNodeManager.firstName} ${participantNodeManager.lastName}`}
          formatter={(v) => <Link to={`#contact${participantNodeManager.key}`}>{v}</Link>}
        />
      )}
    </Properties>
  );
}

fragmentManager.register(/* GraphQL */ `
  fragment ParticipantSummary on Node {
    title
    gbifRegion
    homepage
    participationStatus
    participant {
      membershipStart
      nodeEstablishmentDate
      participantUrl
    }
    headOfDelegation: contacts(type: "HEAD_OF_DELEGATION") {
      key
      firstName
      lastName
    }
    participantNodeManager: contacts(type: "NODE_MANAGER") {
      key
      firstName
      lastName
    }
  }
`);
