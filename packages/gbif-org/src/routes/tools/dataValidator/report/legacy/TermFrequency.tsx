import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import { ReactNode, useMemo, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { MdLink } from 'react-icons/md';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import type { ReportFile } from '../../data/normalizeReport';
import { nextTermSort, sortTerms, TermSort, TermSortKey } from './sortTerms';

const UNKNOWN_PREFIX = 'http://unknown.org/';
const ARCHIVE_RECORD_ID = 'http://unknown.org/ARCHIVE_RECORD_ID';

export function TermFrequency({ file }: { file: ReportFile }) {
  const { locale } = useI18n();
  const intl = useIntl();
  const total = file.count ?? 0;
  const [sort, setSort] = useState<TermSort>();
  const terms = useMemo(
    () =>
      sortTerms(
        file.terms,
        sort,
        new Intl.Collator(intl.locale, { sensitivity: 'base', numeric: true })
      ),
    [file.terms, sort, intl.locale]
  );
  const header = (key: TermSortKey) => ({
    sort,
    sortKey: key,
    onSort: () => setSort((current) => nextTermSort(current, key)),
  });

  return (
    <div className="g-overflow-x-auto">
      <table className="g-w-full g-text-sm">
        <thead>
          <tr className="g-text-slate-500 g-text-start">
            <SortableHeader {...header('term')} className="g-pe-4 g-text-start">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.term"
                defaultMessage="Term"
              />
            </SortableHeader>
            <SortableHeader {...header('count')} className="g-pe-4 g-text-end">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.count"
                defaultMessage="Count"
              />
            </SortableHeader>
            <SortableHeader {...header('percentage')} className="g-pe-4 g-text-start">
              <FormattedMessage
                id="tools.dataValidator.termsFrequency.percentage"
                defaultMessage="Percentage"
              />
            </SortableHeader>
            {file.hasInterpretedCounts && (
              <SortableHeader {...header('interpreted')} className="g-text-end">
                <FormattedMessage
                  id="tools.dataValidator.termsFrequency.interpreted"
                  defaultMessage="Interpreted"
                />
              </SortableHeader>
            )}
          </tr>
        </thead>
        <tbody>
          {terms.map((term, index) => {
            const name = term.term ?? '';
            // columns the archive reader could not map to a known term get the unknown.org namespace
            const isUnknown = name.startsWith(UNKNOWN_PREFIX) && name !== ARCHIVE_RECORD_ID;
            const fraction =
              total > 0 && term.rawIndexed !== undefined ? term.rawIndexed / total : 0;
            return (
              <tr key={`${name}-${index}`} className="g-border-t g-border-slate-100">
                <td className="g-py-1.5 g-pe-4 g-break-all" dir="ltr">
                  <span className={cn({ 'g-text-red-700': isUnknown })}>{name}</span>
                  {/^https?:\/\//.test(name) && !name.startsWith(UNKNOWN_PREFIX) && (
                    <a
                      href={name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="g-ms-1 g-inline-block g-align-middle g-text-slate-400 hover:g-text-primary-600"
                    >
                      <MdLink />
                      <span className="g-sr-only">{name}</span>
                    </a>
                  )}
                </td>
                <td className="g-py-1.5 g-pe-4 g-text-end g-tabular-nums">
                  {term.rawIndexed !== undefined && <FormattedNumber value={term.rawIndexed} />}
                </td>
                <td className="g-py-1.5 g-pe-4">
                  <div className="g-flex g-items-center g-gap-2">
                    <Progress
                      value={Math.min(100, fraction * 100)}
                      dir={locale.textDirection}
                      className="g-w-20 g-flex-none"
                    />
                    <span className="g-tabular-nums">
                      <FormattedNumber value={fraction} style="percent" maximumFractionDigits={0} />
                    </span>
                  </div>
                </td>
                {file.hasInterpretedCounts && (
                  <td className="g-py-1.5 g-text-end g-tabular-nums">
                    {typeof term.interpretedIndexed === 'number' && (
                      <FormattedNumber value={term.interpretedIndexed} />
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function SortableHeader({
  sort,
  sortKey,
  onSort,
  className,
  children,
}: {
  sort: TermSort;
  sortKey: TermSortKey;
  onSort: () => void;
  className?: string;
  children: ReactNode;
}) {
  const active = sort?.key === sortKey ? sort.direction : undefined;
  const Icon = active === 'asc' ? FaSortUp : active === 'desc' ? FaSortDown : FaSort;
  return (
    <th
      scope="col"
      aria-sort={active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : undefined}
      className={cn('g-py-2 g-font-medium', className)}
    >
      <button
        type="button"
        onClick={onSort}
        className={cn(
          'g-inline-flex g-items-center g-gap-1 g-rounded hover:g-text-slate-800 focus-visible:g-outline-none focus-visible:g-ring-2 focus-visible:g-ring-primary-500',
          { 'g-text-slate-800': active }
        )}
      >
        {children}
        <Icon aria-hidden className={cn('g-h-3 g-w-3 g-flex-none', { 'g-opacity-40': !active })} />
      </button>
    </th>
  );
}
