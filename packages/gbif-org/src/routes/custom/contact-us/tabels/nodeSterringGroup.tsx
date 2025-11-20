import { SkeletonBody, Th } from '@/components/clientTable';
import { NodeSteeringGroupQuery } from '@/gql/graphql';
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
};

const SEARCH_KEYS = ['name', 'role'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  role: (a, b) => a.role.localeCompare(b.role),
};

const NODE_STEERING_GROUP_QUERY = /* GraphQL */ `
  query NodeSteeringGroup {
    nodeSteeringGroup {
      id
      name
      role
    }
  }
`;

type Props = {
  q: string;
  onPersonClick: (personId: string) => void;
};

export function NodeSteeringGroupTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<NodeSteeringGroupQuery, undefined>(NODE_STEERING_GROUP_QUERY, {
    forceLoadingTrueOnMount: true,
  });

  const { sortField, sortDirection, handleSort } = useSorting<Row>({
    initialSortField: 'name',
  });

  const people = usePrepareData(data, q, sortField, sortDirection);

  if (!loading && people.length === 0) return null;

  return (
    <Container>
      <Header titleId="directory.group.nsg.title" descriptionId="directory.group.nsg.description" />
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
              field="role"
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
              <TableRow key={person?.renderId} onClick={() => onPersonClick(person.id)}>
                <td>{person.name}</td>
                <td>{person.role}</td>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  );
}

function usePrepareData(
  data: NodeSteeringGroupQuery | undefined,
  q: string,
  sortField: keyof Row,
  sortDirection: SortDirection
): Row[] {
  const { formatMessage } = useIntl();

  const people: Row[] = useMemo(() => {
    const members = data?.nodeSteeringGroup ?? [];
    return members.map((member) => ({
      renderId: nanoid(),
      id: member?.id || '',
      name: member?.name || '',
      role: member?.role ? formatMessage({ id: `enums.gbifRole.${member.role}` }) : '',
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
