import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';
import type { Report } from '../../data/normalizeReport';
import { CLB_CATEGORY, OCC_CATEGORY } from '../../data/normalizeReport';
import type { DwcExtension } from '../../data/types';
import { useLabels } from '../useLabels';
import { SeverityTag, StatusDot } from './SeverityTag';

const OCCURRENCE = 'http://rs.tdwg.org/dwc/terms/Occurrence';
const TAXON = 'http://rs.tdwg.org/dwc/terms/Taxon';

export function Summary({
  report,
  finished,
  extensions,
}: {
  report: Report;
  finished: boolean;
  extensions: Record<string, DwcExtension>;
}) {
  const labels = useLabels();
  const found = new Set(report.summary.map((entry) => entry.category));
  // categories without issues that are still worth stating for the core type
  const cleanCategories = [
    report.coreRowType === OCCURRENCE && !found.has(OCC_CATEGORY) ? OCC_CATEGORY : undefined,
    report.coreRowType === TAXON && !found.has(CLB_CATEGORY) ? CLB_CATEGORY : undefined,
  ].filter((category): category is string => !!category);

  return (
    <Card className="g-mb-4" id="validator-summary">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="tools.dataValidator.summary" defaultMessage="Validation summary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-grid md:g-grid-cols-[minmax(0,2fr)_minmax(0,1fr)] g-gap-6">
          <div>
            {finished && (
              <p className="g-flex g-items-center g-gap-2 g-text-lg g-font-semibold g-mb-3">
                <StatusDot severity={report.indexeable === true ? 'OK' : 'ERROR'} />
                {report.indexeable === true ? (
                  <FormattedMessage
                    id="tools.dataValidator.indexeable"
                    defaultMessage="The file can be indexed by GBIF"
                  />
                ) : (
                  <FormattedMessage
                    id="tools.dataValidator.notIndexeable"
                    defaultMessage="The file cannot be indexed by GBIF"
                  />
                )}
              </p>
            )}

            {!report.hasIssues && finished && (
              <p className="g-flex g-items-center g-gap-2">
                <StatusDot severity="OK" />
                <FormattedMessage
                  id="tools.dataValidator.fileHasNoIssues"
                  defaultMessage="No issues found in the file"
                />
              </p>
            )}

            {(report.hasIssues || cleanCategories.length > 0) && (
              <>
                {report.hasIssues && (
                  <p className="g-text-sm g-text-slate-600 g-mb-2">
                    <FormattedMessage
                      id="tools.dataValidator.fileHasIssues"
                      defaultMessage="Some issues were detected by the validator:"
                    />
                  </p>
                )}
                <table className="g-w-full g-text-sm">
                  <tbody>
                    {report.summary.map(({ category, issues }) => (
                      <tr key={category} className="g-border-t g-border-slate-100">
                        <th
                          scope="row"
                          className="g-py-2 g-pe-4 g-text-start g-align-top g-font-medium g-w-1/3"
                        >
                          {labels.category(category)}
                        </th>
                        <td className="g-py-2">
                          <div className="g-flex g-flex-wrap g-gap-1">
                            {issues.map((issue) => (
                              <SeverityTag key={issue.id} severity={issue.severity}>
                                {labels.issue(issue.id, category)}
                              </SeverityTag>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {finished &&
                      cleanCategories.map((category) => (
                        <tr key={category} className="g-border-t g-border-slate-100">
                          <th
                            scope="row"
                            className="g-py-2 g-pe-4 g-text-start g-align-top g-font-medium g-w-1/3"
                          >
                            {labels.category(category)}
                          </th>
                          <td className="g-py-2">
                            <NoIssuesTag />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </>
            )}

            {report.zippedButNotDwca && (
              <p className="g-bg-amber-50 g-border g-border-amber-200 g-rounded g-p-3 g-text-sm g-mt-4">
                <FormattedMessage
                  id="tools.dataValidator.zipNotDwca"
                  defaultMessage="The file was a zipped archive, but it was not interpreted as a Darwin Core Archive because its metadata is missing or cannot be parsed."
                />
              </p>
            )}
          </div>

          <dl className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-1 g-text-sm g-content-start">
            <dt className="g-text-slate-500">
              <FormattedMessage
                id="tools.dataValidator.coreRowType"
                defaultMessage="Core row type"
              />
            </dt>
            <dd className="g-break-words">
              {report.coreRowType ? labels.rowType(report.coreRowType, extensions) : '–'}
            </dd>
            <dt className="g-text-slate-500">
              <FormattedMessage
                id="tools.dataValidator.fileType.EXTENSION.title"
                defaultMessage="Extensions"
              />
            </dt>
            <dd>{report.extensionCount}</dd>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}

export function NoIssuesTag() {
  return (
    <SeverityTag severity="OK">
      <FormattedMessage id="tools.dataValidator.noIssuesFound" defaultMessage="No issues found" />
    </SeverityTag>
  );
}
