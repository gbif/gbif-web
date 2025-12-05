import { SkeletonBody, Th } from '@/components/clientTable';
import { SecretariatReportQuery } from '@/gql/graphql';
import { useQuery } from '@/hooks/useQuery';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { nanoid } from 'nanoid';
import { SortDirection, SortingRules, useSortedItems, useSorting } from './utils/sorting';
import { useFilteredItems } from './utils/searching';
import { Container, Header, Table, TableRow } from './utils/components';

type Row = {
  renderId: string;
  id: string;
  name: string;
  jobTitle: string;
};

const SEARCH_KEYS = ['name', 'jobTitle'];

const SORTING_RULES: SortingRules<Row> = {
  name: (a, b) => a.name.localeCompare(b.name),
  jobTitle: (a, b) => a.jobTitle.localeCompare(b.jobTitle),
};

const GET_SECRETARIAT_REPORT = /* GraphQL */ `
  query SecretariatReport {
    secretariat {
      id
      firstName
      surname
      jobTitle
    }
  }
`;

type Props = {
  q: string;
  onPersonClick: (personId: string) => void;
};

export function SecretariatTable({ q, onPersonClick }: Props) {
  const { loading, data } = useQuery<SecretariatReportQuery, undefined>(GET_SECRETARIAT_REPORT, {
    forceLoadingTrueOnMount: true,
  });

  const { sortField, sortDirection, handleSort } = useSorting<Row>();

  const people = usePrepareData(data, q, sortField, sortDirection);

  if (!loading && people.length === 0) return null;

  return (
    <Container>
      <Header
        titleId="directory.group.secretariat.title"
        descriptionId="directory.group.secretariat.description"
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
              field="jobTitle"
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
                <td>{person.jobTitle}</td>
              </TableRow>
            ))}
          </tbody>
        )}
      </Table>
    </Container>
  );
}

function usePrepareData(
  data: SecretariatReportQuery | undefined,
  q: string,
  sortField: keyof Row | null,
  sortDirection: SortDirection
): Row[] {
  const people: Row[] = useMemo(() => {
    const members = data?.secretariat ?? [];
    return members.map((member) => {
      const firstName = member?.firstName || '';
      const surname = member?.surname || '';
      const name = [firstName, surname].filter(Boolean).join(' ').trim() || '';
      return {
        renderId: nanoid(),
        id: member?.id || '',
        name,
        jobTitle: member?.jobTitle || '',
      };
    });
  }, [data]);

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
