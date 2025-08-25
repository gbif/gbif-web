import { Card, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DirectoryAmbassadorsQuery, DirectoryAmbassadorsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FormattedMessage } from 'react-intl';

const DIRECTORY_AMBASSADORS_QUERY = /* GraphQL */ `
  query {
    directoryAmbassadors(limit: 1000) {
      results {
        term {
          start
        }
        Person {
          firstName
          surname
          email
          orcidId
          institutionName
          countryCode
          areasExpertise
        }
      }
    }
  }
`;

const columns = [
  { key: 'firstName', label: 'Name', sortable: true },
  { key: 'institutionName', label: 'Affiliation', sortable: true },
  { key: 'countryCode', label: 'Country or Area', sortable: true },
  { key: 'areasExpertise', label: 'Area of Expertise', sortable: true },
  { key: 'orcidId', label: 'ORCID ID', sortable: true },
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

export function AmbassadorsList({
  title,
  tableStyle,
  className,
}: {
  title?: string;
  tableStyle?: string;
  className?: string;
}) {
  const { data, error, loading, load } = useQuery<
    DirectoryAmbassadorsQuery,
    DirectoryAmbassadorsQueryVariables
  >(DIRECTORY_AMBASSADORS_QUERY, { lazyLoad: true });
  const [sortKey, setSortKey] = useState('year');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    load();
  }, [load]);

  const isLoading = loading || (!data && !error);

  if (error) {
    return (
      <Prose>
        <p>Error loading Ambassadors : {error.message}</p>
      </Prose>
    );
  }

  const ambassadors = data?.directoryAmbassadors?.results || [];
  if (!isLoading && ambassadors.length === 0) {
    return (
      <Prose>
        <p>No data.</p>
      </Prose>
    );
  }

  const sortedAmbassadors = sortRows(ambassadors, sortKey, sortDir);

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
                  {sortedAmbassadors.map((ambassador, idx) => (
                    <tr
                      key={idx}
                      className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900"
                    >
                      {/* Winner */}
                      <td className="g-px-4 g-py-2">
                        <a
                          href={'mailto:' + ambassador?.Person.email}
                          className="g-text-blue-600 hover:g-text-blue-800"
                        >
                          {ambassador?.Person.firstName} {ambassador?.Person.surname}
                        </a>
                      </td>

                      <td className="g-px-4 g-py-2">{ambassador?.Person.institutionName}</td>

                      {/* Country */}
                      <td className="g-px-4 g-py-2">
                        <FormattedMessage
                          id={`enums.countryCode.${ambassador?.Person?.countryCode}`}
                          defaultMessage={ambassador?.Person?.countryCode}
                        />
                      </td>
                      <td className="g-px-4 g-py-2">{ambassador?.Person?.areasExpertise}</td>
                      {/* Winner */}
                      <td className="g-px-4 g-py-2">
                        <a
                          href={ambassador?.Person.orcidId}
                          className="g-text-blue-600 hover:g-text-blue-800"
                        >
                          {ambassador?.Person.orcidId}
                        </a>
                      </td>
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
