import { cn } from '@/utils/shadcn';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import type { ReportIssue } from '../../data/normalizeReport';

function display(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

// As wide as its content and at least full width, so many columns scroll instead of being squeezed.
function ScrollTable({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="g-max-w-full g-overflow-x-auto">
      <table className="g-w-max g-min-w-full g-border-collapse g-text-sm g-leading-relaxed">
        <thead className="g-bg-slate-100 g-text-slate-700">
          <tr>{head}</tr>
        </thead>
        <tbody className="[&>tr:nth-child(even)]:g-bg-slate-50">{children}</tbody>
      </table>
    </div>
  );
}

function HeadCell({ children, dir }: { children: ReactNode; dir?: 'ltr' }) {
  return (
    <th
      className="g-border g-border-slate-200 g-px-3 g-py-2 g-text-start g-font-semibold g-whitespace-nowrap"
      dir={dir}
    >
      {children}
    </th>
  );
}

// long values wrap at a readable width rather than stretching the column
function Cell({
  children,
  dir,
  className,
}: {
  children: ReactNode;
  dir: 'ltr' | 'auto';
  className?: string;
}) {
  return (
    <td className="g-border g-border-slate-200 g-px-3 g-py-2 g-align-top" dir={dir}>
      <div className={cn('g-max-w-xs g-break-words', className)}>{children}</div>
    </td>
  );
}

export function IssueSamples({ issue }: { issue: ReportIssue }) {
  if (issue.samples && issue.samples.length > 0) {
    const showRecordId = issue.issue !== 'EML_GBIF_SCHEMA';
    const columns = [
      ...new Set(issue.samples.flatMap((sample) => Object.keys(sample.relatedData ?? {}))),
    ];
    return (
      <ScrollTable
        head={
          <>
            {showRecordId && (
              <HeadCell>
                <FormattedMessage id="tools.dataValidator.recordId" defaultMessage="Record ID" />
              </HeadCell>
            )}
            {columns.map((column) => (
              <HeadCell key={column} dir="ltr">
                {column}
              </HeadCell>
            ))}
          </>
        }
      >
        {issue.samples.map((sample, index) => (
          <tr key={index}>
            {showRecordId && (
              <Cell dir="auto" className="g-break-all">
                {display(sample.recordId)}
              </Cell>
            )}
            {columns.map((column) => (
              <Cell key={column} dir="auto">
                {display(sample.relatedData?.[column])}
              </Cell>
            ))}
          </tr>
        ))}
      </ScrollTable>
    );
  }

  return <IssueFacts issue={issue} />;
}

// Nothing more is known about the issue, so state what the API reported, as portal16 does.
function IssueFacts({ issue }: { issue: ReportIssue }) {
  const code =
    'g-border g-border-slate-200 g-px-3 g-py-2 g-align-top g-whitespace-nowrap g-font-mono g-text-xs';
  return (
    <ScrollTable
      head={
        <>
          <HeadCell>
            <FormattedMessage id="tools.dataValidator.issueFacts.issue" defaultMessage="Issue" />
          </HeadCell>
          <HeadCell>
            <FormattedMessage
              id="tools.dataValidator.issueFacts.category"
              defaultMessage="Category"
            />
          </HeadCell>
          <HeadCell>
            <FormattedMessage
              id="tools.dataValidator.issueFacts.severity"
              defaultMessage="Severity"
            />
          </HeadCell>
        </>
      }
    >
      <tr>
        <td className={code} dir="ltr">
          {issue.issue}
        </td>
        <td className={code} dir="ltr">
          {issue.issueCategory}
        </td>
        <td className={code} dir="ltr">
          {issue.severity}
        </td>
      </tr>
    </ScrollTable>
  );
}
