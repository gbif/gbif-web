import { Card, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DirectoryMentorsQuery, DirectoryMentorsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';

const DIRECTORY_MENTORS_QUERY = /* GraphQL */ `
  query DirectoryMentors {
    directoryMentors {
      results {
        award
        Person {
          firstName
          surname
          email
          countryCode
          areasExpertise
        }
      }
    }
  }
`;

const columns = [
  { key: 'firstName', label: 'Name', sortable: true },
  { key: 'countryCode', label: 'Country or Area', sortable: true },
  { key: 'areasExpertise', label: 'Area of Expertise', sortable: true },
];

function sortRows(rows, sortKey, sortDir) {
  if (!sortKey) return rows;
  return [...rows].sort((a, b) => {
    let aValue = a?.Person?.[sortKey];
    let bValue = b?.Person?.[sortKey];
    // Special handling for nested call.title
    if (sortKey === 'year') {
      aValue = a.roles?.[0]?.term?.start || '';
      bValue = b.roles?.[0]?.term?.start || '';
    }

    // Numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
    }
    // Strings
    aValue = (aValue || '').toString().toLowerCase();
    bValue = (bValue || '').toString().toLowerCase();
    if (aValue < bValue) return sortDir === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
}

export function MentorsList({
  title,
  tableStyle,
  className,
}: {
  title?: string;
  tableStyle?: string;
  className?: string;
}) {
  const { data, error, loading, load } = useQuery<
    DirectoryMentorsQuery,
    DirectoryMentorsQueryVariables
  >(DIRECTORY_MENTORS_QUERY, { lazyLoad: true });
  const [sortKey, setSortKey] = useState('year');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    load();
  }, [load]);

  const isLoading = loading || (!data && !error);

  if (error) {
    return (
      <Prose>
        <p>Error loading GRA winners: {error.message}</p>
      </Prose>
    );
  }

  const mentors = data?.directoryMentors?.results || [];
  if (!isLoading && mentors.length === 0) {
    return (
      <Prose>
        <p>No data.</p>
      </Prose>
    );
  }

  const sortedMentors = sortRows(mentors, sortKey, sortDir);

  function handleSort(col) {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  }

  return (
    <>
      <div className={cn('g-max-w-full g-m-auto g-p-8', className)}>
        <Card>
          {title && <CardTitle className="g-p-4">{title || ''}</CardTitle>}
          <div className="g-overflow-auto g-max-h-[80vh]">
            <table className="g-text-sm g-p g-w-full" style={tableStyle || {}}>
              <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={`g-p-4 g-text-left g-whitespace-nowrap ${
                        col.sortable ? 'g-cursor-pointer hover:g-bg-gray-100' : ''
                      }`}
                      onClick={() => handleSort(col)}
                    >
                      {col.label}
                      {col.sortable && (
                        <span className="g-ml-1 g-inline-block">
                          {sortKey === col.key ? (
                            sortDir === 'asc' ? (
                              <FaCaretUp />
                            ) : (
                              <FaCaretDown />
                            )
                          ) : null}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              {isLoading && <SkeletonBody />}
              {!isLoading && (
                <tbody>
                  {sortedMentors.map((mentor, idx) => (
                    <tr
                      key={idx}
                      className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900"
                    >
                      {/* Winner */}
                      <td className="g-px-4 g-py-2">
                        <a
                          href={mentor?.Person.orcidId}
                          className="g-text-blue-600 hover:g-text-blue-800"
                        >
                          {mentor?.Person.firstName} {mentor?.Person.surname}
                        </a>
                      </td>

                      {/* Country */}
                      <td className="g-px-4 g-py-2">
                        <FormattedMessage
                          id={`enums.countryCode.${mentor?.Person?.countryCode}`}
                          defaultMessage={mentor?.Person?.countryCode}
                        />
                      </td>
                      <td className="g-px-4 g-py-2">{mentor?.Person?.areasExpertise}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose">{children}</div>;
}

function SkeletonBody() {
  return (
    <tbody>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index} className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900">
          {columns.map((col) => (
            <td key={col.key} className="g-px-4 g-py-2">
              <Skeleton className="g-w-48">Loading</Skeleton>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
