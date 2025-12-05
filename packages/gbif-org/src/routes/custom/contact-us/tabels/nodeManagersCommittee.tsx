import { MaybeList, SkeletonBody, Th } from '@/components/clientTable';
import { NodeManagersCommitteeQuery } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { SortDirection, SortingRules, useSortedItems, useSorting } from './utils/sorting';
import { useFilteredItems } from './utils/searching';
import { Container, Header, Table, TableRow } from './utils/components';
import { notNull } from '@/utils/notNull';

type Row = {
  renderId: string;
  personId: string;
  name: string;
  roles: string[];
  participant: string;
  participationStatus: string;
};

const SEARCH_KEYS = ['name', 'roles', 'participant', 'participationStatus'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  roles: (a, b) => (a.roles[0] || '').localeCompare(b.roles[0] || ''),
  participant: (a, b) => a.participant.localeCompare(b.participant),
  participationStatus: (a, b) => a.participationStatus.localeCompare(b.participationStatus),
};

const NODE_MANAGERS_COMMITTEE_QUERY = /* GraphQL */ `
  query NodeManagersCommittee {
    nodeManagersCommittee {
      personId
      name
      roles
      participant
      participationStatus
    }
  }
`;

type Props = {
  q: string;
  onPersonClick: (personId: string) => void;
};

export function NodeManagersCommitteeTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<NodeManagersCommitteeQuery, undefined>(
    NODE_MANAGERS_COMMITTEE_QUERY,
    {
      forceLoadingTrueOnMount: true,
    }
  );

  const { sortField, sortDirection, handleSort } = useSorting<Row>({
    initialSortField: 'name',
  });

  const people = usePrepareData(data, q, sortField, sortDirection);

  if (!loading && people.length === 0) return null;

  return (
    <Container>
      <Header
        titleId="directory.group.nodesCommittee.title"
        descriptionId="directory.group.nodesCommittee.description"
      />
      <Table>
        <thead>
          <tr>
            <Th
              sortable
              field="name"
              sortField={sortField ?? undefined}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.name" />
            </Th>
            <Th
              sortable
              field="roles"
              sortField={sortField ?? undefined}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.role" />
            </Th>
            <Th
              sortable
              field="participant"
              sortField={sortField ?? undefined}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.participant" />
            </Th>
            <Th
              sortable
              field="participationStatus"
              sortField={sortField ?? undefined}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.participationStatus" />
            </Th>
          </tr>
        </thead>
        {loading && <SkeletonBody rows={20} columns={4} />}
        {!loading && (
          <tbody>
            {people?.map((person) => (
              <TableRow key={person?.renderId} onClick={() => onPersonClick(person.personId)}>
                <td>{person.name}</td>
                <td>
                  <MaybeList items={person.roles} />
                </td>
                <td>{person.participant}</td>
                <td>{person.participationStatus}</td>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  );
}

function usePrepareData(
  data: NodeManagersCommitteeQuery | undefined,
  q: string,
  sortField: keyof Row | null,
  sortDirection: SortDirection
): Row[] {
  const { formatMessage } = useIntl();

  const people: Row[] = useMemo(() => {
    const members = data?.nodeManagersCommittee ?? [];
    return members.map((member) => ({
      renderId: nanoid(),
      personId: member?.personId || '',
      name: member?.name || '',
      roles: (member?.roles ?? [])
        .filter(notNull)
        .map((role) => formatMessage({ id: `enums.gbifRole.${role}` }))
        .sort((a, b) => a.localeCompare(b)),
      participant: member?.participant || '',
      participationStatus: member?.participationStatus
        ? formatMessage({
            id: `enums.participationStatus.${member.participationStatus}`,
            defaultMessage: member.participationStatus,
          })
        : '',
    }));
  }, [data, formatMessage]);

  // Filter based on search
  const filteredPeople = useFilteredItems({
    searchKeys: SEARCH_KEYS,
    items: people,
    q,
  });

  // Sort the people
  return useSortedItems({
    sortingRules: SORTING_RULES,
    items: filteredPeople,
    sortField,
    sortDirection,
  });
}
