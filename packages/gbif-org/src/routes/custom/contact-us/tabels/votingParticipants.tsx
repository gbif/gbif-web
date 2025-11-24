import { SkeletonBody, Th } from '@/components/clientTable';
import { VotingParticipantsQuery } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { SortDirection, SortingRules, useSortedItems, useSorting } from './utils/sorting';
import { useFilteredItems } from './utils/searching';
import { Container, Header, Table, TableRow } from './utils/components';

type Row = {
  renderId: string;
  id: string;
  name: string;
  role: string;
  participantName: string;
};

const SEARCH_KEYS = ['name', 'role', 'participantName'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  role: (a, b) => a.role.localeCompare(b.role),
  participantName: (a, b) => a.participantName.localeCompare(b.participantName),
};

const VOTING_PARTICIPANTS_QUERY = /* GraphQL */ `
  query VotingParticipants {
    participantSearch(limit: 1000, type: COUNTRY, participationStatus: VOTING) {
      results {
        name
        countryCode
        people {
          id
          role
          firstName
          surname
        }
      }
    }
  }
`;

type Props = {
  q: string;
  onPersonClick: (personId: string) => void;
};

export function VotingParticipantsTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<VotingParticipantsQuery, undefined>(
    VOTING_PARTICIPANTS_QUERY,
    {
      forceLoadingTrueOnMount: true,
    }
  );

  const { sortField, sortDirection, handleSort } = useSorting<Row>({
    initialSortField: 'participantName',
  });

  const people = usePrepareData(data, q, sortField, sortDirection);

  if (!loading && people.length === 0) return null;

  return (
    <Container>
      <Header
        titleId="directory.group.voting.title"
        descriptionId="directory.group.voting.description"
      />
      <Table>
        <thead>
          <tr>
            <Th
              sortable
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="directory.columns.name" />
            </Th>
            <Th
              sortable
              field="role"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="directory.columns.role" />
            </Th>
            <Th
              sortable
              field="participantName"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              <FormattedMessage id="directory.columns.participant" />
            </Th>
          </tr>
        </thead>
        {loading && <SkeletonBody rows={20} columns={3} />}
        {!loading && (
          <tbody>
            {people?.map((person) => (
              <TableRow key={person?.renderId} onClick={() => onPersonClick(person.id)}>
                <td>{person.name}</td>
                <td>{person.role}</td>
                <td>{person.participantName}</td>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  );
}

function usePrepareData(
  data: VotingParticipantsQuery | undefined,
  q: string,
  sortField: keyof Row | null,
  sortDirection: SortDirection
): Row[] {
  const { formatMessage } = useIntl();

  const people: Row[] = useMemo(() => {
    const result: Row[] = [];

    // Create one row per person entry from the API
    for (const participant of data?.participantSearch?.results ?? []) {
      for (const person of participant?.people ?? []) {
        if (!person?.id) continue;

        const name = [person.firstName, person.surname].filter(Boolean).join(' ').trim() || '';
        const translatedRole = person.role
          ? formatMessage({ id: `enums.gbifRole.${person.role}` })
          : '';
        const participantName = participant?.countryCode
          ? formatMessage({ id: `enums.countryCode.${participant.countryCode}` })
          : participant?.name || '';

        result.push({
          renderId: nanoid(),
          id: person.id,
          name,
          role: translatedRole,
          participantName,
        });
      }
    }

    return result;
  }, [data, formatMessage]);

  // Filter based on search
  const filteredPeople = useFilteredItems({ searchKeys: SEARCH_KEYS, items: people, q });

  // Sort the people
  return useSortedItems({
    sortingRules: SORTING_RULES,
    items: filteredPeople,
    sortField,
    sortDirection,
  });
}
