import { FormattedMessage } from 'react-intl';
import type { ReportIssue } from '../../data/normalizeReport';

function display(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return JSON.stringify(value);
}

export function IssueSamples({ issue }: { issue: ReportIssue }) {
  if (issue.samples && issue.samples.length > 0) {
    const showRecordId = issue.issue !== 'EML_GBIF_SCHEMA';
    const columns = [
      ...new Set(issue.samples.flatMap((sample) => Object.keys(sample.relatedData ?? {}))),
    ];
    return (
      <div className="g-overflow-x-auto">
        <table className="g-w-full g-text-sm g-border g-border-slate-200">
          <thead className="g-bg-slate-50">
            <tr>
              {showRecordId && (
                <th className="g-px-2 g-py-1 g-text-start g-font-medium">
                  <FormattedMessage id="tools.dataValidator.recordId" defaultMessage="Record ID" />
                </th>
              )}
              {columns.map((column) => (
                <th key={column} className="g-px-2 g-py-1 g-text-start g-font-medium" dir="ltr">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {issue.samples.map((sample, index) => (
              <tr key={index} className="g-border-t g-border-slate-100">
                {showRecordId && (
                  <td className="g-px-2 g-py-1 g-align-top g-break-all" dir="auto">
                    {display(sample.recordId)}
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column} className="g-px-2 g-py-1 g-align-top g-break-words" dir="auto">
                    {display(sample.relatedData?.[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (issue.relatedData && issue.relatedData.length > 0) {
    return (
      <ul className="g-list-disc g-ps-5 g-text-sm" dir="ltr">
        {issue.relatedData.map((value, index) => (
          <li key={index} className="g-break-all">
            {display(value)}
          </li>
        ))}
      </ul>
    );
  }

  if (issue.extra) {
    return (
      <p className="g-text-sm g-break-words" dir="auto">
        {issue.extra}
      </p>
    );
  }

  return <IssueFacts issue={issue} />;
}

// Nothing more is known about the issue, so state what the API reported, as portal16 does.
function IssueFacts({ issue }: { issue: ReportIssue }) {
  return (
    <div className="g-overflow-x-auto">
      <table className="g-w-full g-text-sm g-border g-border-slate-200">
        <thead className="g-bg-slate-50">
          <tr>
            <th className="g-px-2 g-py-1 g-text-start g-font-medium">
              <FormattedMessage id="tools.dataValidator.issueFacts.issue" defaultMessage="Issue" />
            </th>
            <th className="g-px-2 g-py-1 g-text-start g-font-medium">
              <FormattedMessage
                id="tools.dataValidator.issueFacts.category"
                defaultMessage="Category"
              />
            </th>
            <th className="g-px-2 g-py-1 g-text-start g-font-medium">
              <FormattedMessage
                id="tools.dataValidator.issueFacts.severity"
                defaultMessage="Severity"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="g-border-t g-border-slate-100">
            <td className="g-px-2 g-py-1 g-align-top g-break-all g-font-mono g-text-xs" dir="ltr">
              {issue.issue}
            </td>
            <td className="g-px-2 g-py-1 g-align-top g-break-all g-font-mono g-text-xs" dir="ltr">
              {issue.issueCategory}
            </td>
            <td className="g-px-2 g-py-1 g-align-top g-font-mono g-text-xs" dir="ltr">
              {issue.severity}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
