import { MaybeList, SkeletonBody, Th } from '@/components/clientTable';
import { ScienceCommitteeQuery } from '@/gql/graphql';
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
};

const SEARCH_KEYS = ['name', 'roles'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  roles: (a, b) => (a.roles[0] || '').localeCompare(b.roles[0] || ''),
};

const SCIENCE_COMMITTEE_QUERY = /* GraphQL */ `
  query ScienceCommittee {
    scienceCommittee {
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

export function ScienceCommitteeTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<ScienceCommitteeQuery, undefined>(SCIENCE_COMMITTEE_QUERY, {
    forceLoadingTrueOnMount: true,
  });

  const { sortField, sortDirection, handleSort } = useSorting<Row>({
    initialSortField: 'name',
  });

  const people = usePrepareData(data, q, sortField, sortDirection);

  if (!loading && people.length === 0) return null;

  return (
    <Container>
      <Header
        titleId="directory.group.scienceCommittee.title"
        descriptionId="directory.group.scienceCommittee.description"
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
  data: ScienceCommitteeQuery | undefined,
  q: string,
  sortField: keyof Row,
  sortDirection: SortDirection
): Row[] {
  const { formatMessage } = useIntl();

  const people: Row[] = useMemo(() => {
    const members = data?.scienceCommittee ?? [];
    return members.map((member) => ({
      renderId: nanoid(),
      personId: member?.personId || '',
      name: member?.name || '',
      roles: (member?.roles ?? [])
        .filter(notNull)
        .map((role) => formatMessage({ id: `enums.gbifRole.${role}` }))
        .sort((a, b) => a.localeCompare(b)),
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
