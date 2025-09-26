import {
  NodeType,
  ParticipantSelectQuery,
  ParticipantSelectQueryVariables,
  ParticipationStatus,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
const PARTICIPANT_SELECT_QUERY = /* GraphQL */ `
  query ParticipantSelect($type: NodeType, $participationStatus: ParticipationStatus, $limit: Int) {
    participantSearch(type: $type, participationStatus: $participationStatus, limit: $limit) {
      endOfRecords
      count
      results {
        id
        name
        country
      }
    }
  }
`;

type Props = {
  filters?: {
    type?: NodeType;
    participationStatus?: ParticipationStatus;
  };
  selected?: ValidParticipant;
  onChange(value: ValidParticipant): void;
};

export function ParticipantSelect({ filters, selected, onChange }: Props) {
  const intl = useIntl();
  const { data, error } = useQuery<ParticipantSelectQuery, ParticipantSelectQueryVariables>(
    PARTICIPANT_SELECT_QUERY,
    {
      variables: {
        ...(filters ?? {}),
        limit: 500,
      },
    }
  );

  const results = useMemo(() => {
    const participants = data?.participantSearch?.results.filter(isValidParticipant);
    participants?.sort((a, b) => a.name.localeCompare(b.name));
    return participants;
  }, [data?.participantSearch?.results]);

  // TODO: How should we handle errors like this?
  if (error) {
    console.error(error);
    return null;
  }

  function handleSelect(id: string) {
    const participant = data?.participantSearch?.results.find(
      (participant) => participant?.id === id
    );
    if (participant != null && isValidParticipant(participant)) {
      onChange(participant);
    }
  }

  return (
    <Select value={selected?.id} onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue
          placeholder={intl.formatMessage({
            id: 'phrases.clickToSelect',
            defaultMessage: 'Click to select',
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {results?.map((participant) => (
          <SelectItem key={participant.id} value={participant.id}>
            {participant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type Participant = NonNullable<ParticipantSelectQuery['participantSearch']>['results'][number];
export type ValidParticipant = { name: string; id: string; country?: string | null | undefined };

function isValidParticipant(participant: Participant): participant is ValidParticipant {
  return participant != null && participant.name !== null;
}
