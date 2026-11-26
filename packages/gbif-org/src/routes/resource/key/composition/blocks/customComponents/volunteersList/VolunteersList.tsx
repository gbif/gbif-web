import { Tag } from '@/components/resultCards';
import { Card, CardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { DirectoryVolunteersQuery, DirectoryVolunteersQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { DirectoryContactDialog } from '@/routes/custom/contact-us/directoryContactDialog';
import { parseTableStyle } from '../tableUtils';
import { getBadgeYears, isActiveTerm, parseBoolean, parsePositiveInt } from './volunteerUtils';

const DIRECTORY_VOLUNTEERS_QUERY = /* GraphQL */ `
  query DirectoryVolunteers($role: String!) {
    directoryVolunteers(role: $role, limit: 1000) {
      results {
        personId
        term {
          end
        }
        Person {
          firstName
          surname
          countryCode
          languages
          badges {
            title
            year
          }
        }
      }
    }
  }
`;

// The settings a Contentful editor can configure on the custom component block.
export type VolunteersListSettings = {
  // The directory role to list, e.g. TRANSLATOR, AMBASSADOR, MENTOR, TRAINER or REVIEWER
  role?: string;
  // Only badges with this title count in the badge column. The badge title doesn't always match the role.
  badgeType?: string;
  // Only show badges from the last X years
  badgeMaxAgeYears?: number | string;
  // Only list volunteers with at least one counted badge
  onlyWithBadges?: boolean | string;
  tablestyle?: string | null;
};

type ColumnKey = 'name' | 'countryCode' | 'languages' | 'badgeYears';

const columns: { key: ColumnKey; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'countryCode', label: 'Country or Area' },
  { key: 'languages', label: 'Languages' },
  { key: 'badgeYears', label: 'Badge years' },
];

export function VolunteersList({
  title,
  settings,
  className,
}: {
  title?: string;
  settings?: VolunteersListSettings | null;
  className?: string;
}) {
  const role = typeof settings?.role === 'string' ? settings.role.trim().toUpperCase() : undefined;
  const { data, error, loading, load } = useQuery<
    DirectoryVolunteersQuery,
    DirectoryVolunteersQueryVariables
  >(DIRECTORY_VOLUNTEERS_QUERY, { lazyLoad: true });
  const [personId, setPersonId] = useState<string | undefined>();

  useEffect(() => {
    if (role) load({ variables: { role } });
  }, [load, role]);

  return (
    <>
      <VolunteersTable
        title={title}
        settings={settings}
        className={className}
        data={data}
        error={error}
        loading={loading}
        onSelectPerson={setPersonId}
      />
      <DirectoryContactDialog personId={personId} onClose={() => setPersonId(undefined)} />
    </>
  );
}

// Presentational part: all data is passed in, which also makes it usable with mock data.
export function VolunteersTable({
  title,
  settings,
  className,
  data,
  error,
  loading,
  onSelectPerson,
}: {
  title?: string;
  settings?: VolunteersListSettings | null;
  className?: string;
  data?: DirectoryVolunteersQuery;
  error?: { message: string } | null;
  loading?: boolean;
  onSelectPerson: (personId?: string) => void;
}) {
  const intl = useIntl();
  const role = typeof settings?.role === 'string' ? settings.role.trim().toUpperCase() : undefined;
  const badgeType = settings?.badgeType;
  const badgeMaxAgeYears = parsePositiveInt(settings?.badgeMaxAgeYears);
  const onlyWithBadges = parseBoolean(settings?.onlyWithBadges);
  // default sort as requested in the issue: country, then name
  const [sortKey, setSortKey] = useState<ColumnKey>('countryCode');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const rows = useMemo(
    () =>
      (data?.directoryVolunteers?.results ?? [])
        .filter((r) => isActiveTerm(r?.term))
        .map((r) => {
          const p = r?.Person;
          const countryName = p?.countryCode
            ? intl.formatMessage({
                id: `enums.countryCode.${p.countryCode}`,
                defaultMessage: p.countryCode,
              })
            : '';
          return {
            personId: r?.personId != null ? String(r.personId) : undefined,
            name: [p?.firstName, p?.surname].filter(Boolean).join(' '),
            surname: p?.surname ?? '',
            countryCode: p?.countryCode,
            countryName,
            languages: p?.languages?.filter((l): l is string => !!l) ?? [],
            badgeYears: getBadgeYears({
              badges: p?.badges,
              badgeType,
              maxAgeYears: badgeMaxAgeYears,
            }),
          };
        }),
    [data, intl, badgeType, badgeMaxAgeYears]
  );

  const sortedRows = useMemo(() => {
    const visible = onlyWithBadges ? rows.filter((r) => r.badgeYears.length > 0) : rows;
    const dir = sortDir === 'asc' ? 1 : -1;
    const byName = (a: (typeof rows)[number], b: (typeof rows)[number]) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    const byCountry = (a: (typeof rows)[number], b: (typeof rows)[number]) =>
      a.countryName.localeCompare(b.countryName, undefined, { sensitivity: 'base' });
    return [...visible].sort((a, b) => {
      let result = 0;
      if (sortKey === 'name') result = byName(a, b);
      else if (sortKey === 'countryCode') result = byCountry(a, b) || byName(a, b);
      else if (sortKey === 'languages') result = a.languages.length - b.languages.length;
      else if (sortKey === 'badgeYears') result = (a.badgeYears[0] ?? 0) - (b.badgeYears[0] ?? 0);
      return result * dir || byName(a, b);
    });
  }, [rows, onlyWithBadges, sortKey, sortDir]);

  function handleSort(key: ColumnKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  if (!role) {
    return (
      <Prose>
        <p>The volunteers list needs a role in its settings, e.g. {'{"role": "TRANSLATOR"}'}.</p>
      </Prose>
    );
  }

  const isLoading = loading || (!data && !error);

  if (error) {
    return (
      <Prose>
        <p>Error loading volunteers: {error.message}</p>
      </Prose>
    );
  }

  if (!isLoading && sortedRows.length === 0) {
    return (
      <Prose>
        <p>No data.</p>
      </Prose>
    );
  }

  return (
    <div className={cn('g-max-w-full g-m-auto g-p-8', className)}>
      <Card>
        {title && <CardTitle className="g-p-4">{title}</CardTitle>}
        <div className="g-overflow-auto g-max-h-[80vh]">
          <table className="g-text-sm g-p g-w-full" style={parseTableStyle(settings?.tablestyle)}>
            <thead className="g-sticky g-top-0 g-bg-white g-shadow-sm g-z-10">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    aria-sort={
                      sortKey === col.key
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                    className="g-p-4 g-text-start g-whitespace-nowrap g-cursor-pointer hover:g-bg-gray-100"
                    tabIndex={0}
                    onClick={() => handleSort(col.key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSort(col.key);
                      }
                    }}
                  >
                    {col.label}
                    <span className="g-ms-1 g-inline-block">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <FaCaretUp />
                        ) : (
                          <FaCaretDown />
                        )
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {isLoading ? (
              <SkeletonBody />
            ) : (
              <tbody className="prose-links">
                {sortedRows.map((row, idx) => (
                  <tr
                    key={row.personId ?? idx}
                    className="g-border-t g-border-gray-100 hover:g-bg-gray-50 g-text-gray-900 g-cursor-pointer"
                    onClick={() => onSelectPerson(row.personId)}
                  >
                    <td className="g-px-4 g-py-2" style={{ verticalAlign: 'top' }}>
                      <button
                        type="button"
                        className="g-text-start g-text-inherit g-underline hover:g-decoration-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectPerson(row.personId);
                        }}
                      >
                        {row.name}
                      </button>
                    </td>
                    <td className="g-px-4 g-py-2" style={{ verticalAlign: 'top' }}>
                      {row.countryCode && row.countryName}
                    </td>
                    <td className="g-px-4 g-py-2" style={{ verticalAlign: 'top' }}>
                      {row.languages.map((lang) => (
                        <div key={lang}>
                          <FormattedMessage id={`enums.language.${lang}`} defaultMessage={lang} />
                        </div>
                      ))}
                    </td>
                    <td className="g-px-4 g-py-2" style={{ verticalAlign: 'top' }}>
                      {row.badgeYears.map((year) => (
                        <Tag key={year} className="g-m-1 g-mb-0">
                          {year}
                        </Tag>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </Card>
    </div>
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
