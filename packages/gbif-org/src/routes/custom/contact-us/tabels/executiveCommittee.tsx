import { MaybeList, SkeletonBody, Th } from '@/components/clientTable';
import { ExecutiveCommitteeQuery } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { SortDirection, SortingRules, useSortedItems, useSorting } from './utils/sorting';
import { useFilteredItems } from './utils/searching';
import { Container, Header, Table, TableRow } from './utils/components';

type Row = {
  renderId: string;
  personId: string;
  name: string;
  roles: string[];
};

const SEARCH_KEYS = ['name', 'roles'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  roles: (a, b) => (a.roles[0] || '').localeCompare(b.roles[0] || ''),
};

const EXECUTIVE_COMMITTEE_QUERY = /* GraphQL */ `
  query ExecutiveCommittee {
    executiveCommittee {
      personId
      name
      roles
    }
  }
`;

type Props = {
  q: string;
  onPersonClick: (personId: string) => void;
};

export function ExecutiveCommitteeTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<ExecutiveCommitteeQuery, undefined>(
    EXECUTIVE_COMMITTEE_QUERY,
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
        titleId="directory.group.executiveCommittee.title"
        descriptionId="directory.group.executiveCommittee.description"
      />
      <Table>
        <thead>
          <tr>
            <Th
              sortable
              field="name"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.name" />
            </Th>
            <Th
              sortable
              field="roles"
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort as (field: string) => void}
            >
              <FormattedMessage id="directory.columns.role" />
            </Th>
          </tr>
        </thead>
        {loading && <SkeletonBody rows={20} columns={2} />}
        {!loading && (
          <tbody>
            {people?.map((person) => (
              <TableRow key={person?.renderId} onClick={() => onPersonClick(person.personId)}>
                <td>{person.name}</td>
                <td>
                  <MaybeList items={person.roles} />
                </td>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  );
}

function usePrepareData(
  data: ExecutiveCommitteeQuery | undefined,
  q: string,
  sortField: keyof Row | null,
  sortDirection: SortDirection
): Row[] {
  const { formatMessage } = useIntl();

  const people: Row[] = useMemo(() => {
    const result: Row[] = [];

    // Create one row per API member entry
    for (const member of data?.executiveCommittee ?? []) {
      if (!member?.personId) continue;

      const roles = (member.roles ?? [])
        .map((role) => formatMessage({ id: `enums.gbifRole.${role}` }))
        .sort((a, b) => a.localeCompare(b));

      result.push({
        renderId: nanoid(),
        personId: member.personId,
        name: member.name || '',
        roles,
      });
    }

    return result;
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
