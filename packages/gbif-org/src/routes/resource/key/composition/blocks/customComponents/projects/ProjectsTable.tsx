import { Card } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { PredicateType, ProjectTableQuery, ProjectTableQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { useEffect, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';

const PROJECTS_QUERY = /* GraphQL */ `
  query ProjectTable($from: Int, $size: Int, $predicate: Predicate) {
    resourceSearch(predicate: $predicate) {
      documents(from: $from, size: $size) {
        from
        size
        total
        results {
          __typename
          ... on GbifProject {
            id
            title
            grantType
            start
            end
            fundsAllocated
            matchingFunds
            status
            contractCountry
            projectId
            call {
              title
            }
            excerpt
            primaryImage {
              file {
                url: thumbor(width: 128, height: 128)
              }
            }
            createdAt

            purposes
          }
        }
      }
    }
  }
`;

const columns = [
  { key: 'image', label: '', sortable: false },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'grantType', label: 'Grant Type', sortable: true },
  { key: 'start', label: 'Start', sortable: true },
  { key: 'end', label: 'End', sortable: true },
  { key: 'fundsAllocated', label: 'Funds Allocated', sortable: true },
  { key: 'matchingFunds', label: 'Matching Funds', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'contractCountry', label: 'Country', sortable: true },
  { key: 'projectId', label: 'Project ID', sortable: true },
  { key: 'call', label: 'Call', sortable: true },
];

function sortRows(rows, sortKey, sortDir) {
  if (!sortKey) return rows;
  return [...rows].sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];
    // Special handling for nested call.title
    if (sortKey === 'call') {
      aValue = a.call?.title || '';
      bValue = b.call?.title || '';
    }
    // Dates
    if (sortKey === 'start' || sortKey === 'end' || sortKey === 'createdAt') {
      aValue = aValue || '';
      bValue = bValue || '';
      return sortDir === 'asc'
        ? new Date(aValue).getTime() - new Date(bValue).getTime()
        : new Date(bValue).getTime() - new Date(aValue).getTime();
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

export function ProjectsTable({
  programmeId,
  tableStyle,
  className,
}: {
  programmeId?: string;
  tableStyle?: string;
  className?: string;
}) {
  const { data, error, loading, load } = useQuery<ProjectTableQuery, ProjectTableQueryVariables>(
    PROJECTS_QUERY,
    { lazyLoad: true }
  );
  const [sortKey, setSortKey] = useState('title');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const predicates = [
      {
        type: PredicateType.In,
        key: 'contentType',
        values: ['project'],
      },
    ];
    if (programmeId) {
      predicates.push({
        type: PredicateType.Nested,
        key: 'gbifProgramme',
        predicate: {
          type: PredicateType.And,
          predicates: [
            {
              type: PredicateType.Equals,
              key: 'id',
              value: programmeId,
            },
          ],
        },
      });
    }
    load({
      variables: {
        predicate: {
          type: PredicateType.And,
          predicates,
        },
        size: 200,
        from: 0,
      },
    });
  }, [load, programmeId]);

  const isLoading = loading || (!data && !error);

  if (error) {
    return (
      <Prose>
        <p>Error loading projects: {error.message}</p>
      </Prose>
    );
  }

  const projects = data?.resourceSearch?.documents?.results || [];
  if (!isLoading && projects.length === 0) {
    return (
      <Prose>
        <p>No projects found for this call.</p>
      </Prose>
    );
  }

  const sortedProjects = sortRows(projects, sortKey, sortDir);

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
          <div className="g-overflow-auto g-max-h-[80vh]">
            <table className="g-text-sm g-p">
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
                  {sortedProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900"
                    >
                      {/* Image */}
                      <td className="g-px-4 g-py-2 g-min-w-20 ">
                        {project.primaryImage?.file?.url ? (
                          <img
                            src={project.primaryImage.file.url}
                            alt={project.title}
                            className="g-w-12 g-h-12 g-rounded-full g-border g-border-gray-200"
                          />
                        ) : (
                          <div className="g-w-12 g-h-12 g-rounded-full g-bg-gray-200" />
                        )}
                      </td>
                      {/* Title */}
                      <td className="g-min-w-[300px] g-max-w-[400px] g-px-4 g-py-2 g-font-medium">
                        <div className="g-line-clamp-2 g-underline">
                          <DynamicLink pageId="projectKey" variables={{ key: project.id }}>
                            {project.title}
                          </DynamicLink>
                        </div>
                      </td>
                      {/* Grant Type */}
                      <td className="g-min-w-[250px] g-max-w-[400px] g-px-4 g-py-2">
                        <FormattedMessage
                          id={`enums.cms.projectGrantType.${project.grantType}`}
                          defaultMessage={project.grantType}
                        />
                      </td>
                      {/* Start */}
                      <td className="g-min-w-[200px] g-max-w-[400px] g-px-4 g-py-2">
                        <FormattedDate
                          value={project.start}
                          year="numeric"
                          month="short"
                          day="2-digit"
                        />
                      </td>
                      {/* End */}
                      <td className="g-min-w-[200px] g-max-w-[400px] g-px-4 g-py-2">
                        <FormattedDate
                          value={project.end}
                          year="numeric"
                          month="short"
                          day="2-digit"
                        />
                      </td>
                      {/* Funds Allocated */}
                      <td className="g-px-4 g-py-2">
                        <FormattedNumber
                          value={project.fundsAllocated}
                          style="currency"
                          currency="EUR"
                        />
                      </td>
                      {/* Matching Funds */}
                      <td className="g-px-4 g-py-2">
                        <FormattedNumber
                          value={project.matchingFunds}
                          style="currency"
                          currency="EUR"
                        />
                      </td>
                      {/* Status */}
                      <td className="g-px-4 g-py-2">
                        <FormattedMessage
                          id={`enums.cms.projectStatus.${project.status}`}
                          defaultMessage={project.status}
                        />
                      </td>
                      {/* Country */}
                      <td className="g-px-4 g-py-2">
                        <FormattedMessage
                          id={`enums.countryCode.${project.contractCountry}`}
                          defaultMessage={project.contractCountry}
                        />
                      </td>
                      {/* Project ID */}
                      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{project.projectId}</td>
                      {/* Call */}
                      <td className="g-px-4 g-py-2 g-whitespace-nowrap">{project.call?.title}</td>
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
