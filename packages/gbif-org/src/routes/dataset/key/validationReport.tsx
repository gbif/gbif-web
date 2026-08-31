import { NoRecords } from '@/components/noDataMessages';
import { SeverityTag } from '@/components/severityTag';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DatasetValidationReportQuery,
  DatasetValidationReportQueryVariables,
  DwdpColumnAnalysis,
  DwdpDataTypeViolation,
  DwdpForeignKeyViolation,
  DwdpPrimaryKeyViolation,
  DwdpResourceAnalysisResult,
  DwdpValidationIssue,
} from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';

const VALIDATION_REPORT_QUERY = /* GraphQL */ `
  query DatasetValidationReport($datasetKey: ID!, $attempt: String) {
    dwdpValidationReport(datasetKey: $datasetKey, attempt: $attempt) {
      datasetKey
      attempt
      metadata {
        started
        finished
        valid
      }
      result {
        descriptorValidation {
          valid
          canProceedToDataAnalysis
          issues {
            severity
            violationType
            message
            detail
            location
          }
        }
        emlValidation {
          valid
          emlPresent
          issues {
            severity
            violationType
            message
            detail
            location
          }
        }
        resourceAnalysisResults {
          name
          totalRows
          columnAnalyses {
            name
            populatedValues
            uniqueValues
          }
          dataTypeViolations {
            resource
            field
            declaredType
            violationCount
            sampleValues
          }
          foreignKeyViolations {
            resource
            fields
            referenceResource
            referenceFields
            violationCount
            sampleRows
          }
          primaryKeyViolation {
            resource
            fields
            violationCount
            sampleRows
          }
        }
      }
    }
  }
`;

// The graphql-api resolver normalises Jackson's array-form java.time.LocalDateTime into a
// zone-less ISO-8601 string (e.g. "2026-08-31T11:59:47.890170096"). Parse it as UTC
// explicitly here rather than relying on the native Date parser's "no offset -> local time"
// behaviour, which would render a different instant on the server than in the browser.
function parseZonelessDateTime(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?$/.exec(value);
  if (!match) return new Date(value);
  const [, y, mo, d, h, mi, s, frac] = match;
  const ms = frac ? Math.round(Number(`0.${frac.slice(0, 3).padEnd(3, '0')}`) * 1000) : 0;
  return new Date(
    Date.UTC(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s), ms)
  );
}

function hasViolations(v?: { violationCount?: number | null } | null): boolean {
  return !!v && (v.violationCount ?? 0) > 0;
}

function issueCount(resource: DwdpResourceAnalysisResult): number {
  return (
    (hasViolations(resource.primaryKeyViolation) ? 1 : 0) +
    (resource.foreignKeyViolations?.filter(hasViolations).length ?? 0) +
    (resource.dataTypeViolations?.filter(hasViolations).length ?? 0)
  );
}

function humanizeViolationType(type: string): string {
  const lower = type.toLowerCase().replace(/_/g, ' ');
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function worstSeverity(issues: DwdpValidationIssue[]): string {
  if (issues.some((i) => i.severity === 'ERROR')) return 'ERROR';
  if (issues.some((i) => i.severity === 'WARNING')) return 'WARNING';
  return 'INFO';
}

function Fact({
  label,
  value,
  tone,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  tone?: 'error' | 'warn';
}) {
  return (
    <div>
      <div className="g-text-xs g-uppercase g-tracking-wide g-text-slate-400">{label}</div>
      <div
        className={cn('g-text-xl g-font-semibold g-mt-0.5', {
          'g-text-red-700': tone === 'error',
          'g-text-amber-700': tone === 'warn',
        })}
      >
        {value}
      </div>
    </div>
  );
}

function IssueGroups({ issues }: { issues: DwdpValidationIssue[] }) {
  const groups = useMemo(() => {
    const byType = new Map<string, DwdpValidationIssue[]>();
    issues.forEach((issue) => {
      const key = issue.violationType ?? 'OTHER';
      if (!byType.has(key)) byType.set(key, []);
      byType.get(key)?.push(issue);
    });
    const rank: Record<string, number> = { ERROR: 0, WARNING: 1, INFO: 2 };
    return Array.from(byType.entries()).sort(
      ([, a], [, b]) => (rank[worstSeverity(a)] ?? 3) - (rank[worstSeverity(b)] ?? 3)
    );
  }, [issues]);

  if (groups.length === 0) return null;

  return (
    <Accordion type="multiple" defaultValue={[groups[0][0]]} className="g-flex g-flex-col g-gap-2">
      {groups.map(([type, list]) => (
        <AccordionItem
          key={type}
          value={type}
          className="g-border g-border-slate-200 g-rounded g-px-3 g-mb-0"
        >
          <AccordionTrigger className="hover:g-no-underline">
            <span className="g-flex g-items-center g-gap-2 g-text-start">
              <SeverityTag severity={worstSeverity(list)} />
              <span className="g-font-medium">{humanizeViolationType(type)}</span>
              <span className="g-text-slate-500 g-text-xs">({list.length})</span>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="g-overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <FormattedMessage
                        id="dataset.validationReport.severityColumn"
                        defaultMessage="Severity"
                      />
                    </TableHead>
                    <TableHead>
                      <FormattedMessage
                        id="dataset.validationReport.messageColumn"
                        defaultMessage="Problem"
                      />
                    </TableHead>
                    <TableHead>
                      <FormattedMessage
                        id="dataset.validationReport.locationColumn"
                        defaultMessage="Where"
                      />
                    </TableHead>
                    <TableHead>
                      <FormattedMessage
                        id="dataset.validationReport.detailColumn"
                        defaultMessage="Detail"
                      />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((issue, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <TableRow key={i}>
                      <TableCell>
                        <SeverityTag severity={issue.severity} />
                      </TableCell>
                      <TableCell>{issue.message}</TableCell>
                      <TableCell className="g-font-mono g-text-xs g-text-slate-500 g-break-all">
                        {issue.location}
                      </TableCell>
                      <TableCell className="g-text-slate-600">{issue.detail ?? '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

function DescriptorOrEmlDetail({
  title,
  issues,
  validMessageId,
}: {
  title: React.ReactNode;
  issues: DwdpValidationIssue[];
  validMessageId: string;
}) {
  return (
    <div>
      <h2 className="g-text-lg g-font-semibold g-mb-4">{title}</h2>
      {issues.length === 0 ? (
        <Alert>
          <AlertDescription>
            <FormattedMessage id={validMessageId} />
          </AlertDescription>
        </Alert>
      ) : (
        <IssueGroups issues={issues} />
      )}
    </div>
  );
}

type ViolationKind = 'pk' | 'fk' | 'dt';

const VIOLATION_LABEL_ID: Record<ViolationKind, string> = {
  pk: 'dataset.validationReport.primaryKeyViolation',
  fk: 'dataset.validationReport.foreignKeyViolation',
  dt: 'dataset.validationReport.dataTypeViolation',
};

function ViolationCard({
  kind,
  violation,
}: {
  kind: ViolationKind;
  violation: DwdpPrimaryKeyViolation | DwdpForeignKeyViolation | DwdpDataTypeViolation;
}) {
  const pk = kind === 'pk' ? (violation as DwdpPrimaryKeyViolation) : undefined;
  const fk = kind === 'fk' ? (violation as DwdpForeignKeyViolation) : undefined;
  const dt = kind === 'dt' ? (violation as DwdpDataTypeViolation) : undefined;

  const fields = pk?.fields ?? fk?.fields ?? (dt?.field ? [dt.field] : []) ?? [];
  const sampleRows: Record<string, unknown>[] =
    pk?.sampleRows ??
    fk?.sampleRows ??
    dt?.sampleValues?.map((value) => ({ [dt.field ?? 'value']: value })) ??
    [];
  const SAMPLE_CAP = 6;

  return (
    <Accordion type="single" collapsible defaultValue="item">
      <AccordionItem value="item" className="g-border g-border-red-200 g-rounded g-overflow-hidden g-mb-0">
        <AccordionTrigger className="g-bg-red-50 g-px-3 hover:g-no-underline">
          <span className="g-flex g-items-center g-gap-2 g-flex-1 g-text-start">
            <span className="g-font-semibold g-text-red-800">
              <FormattedMessage id={VIOLATION_LABEL_ID[kind]} />
            </span>
            <span className="g-ms-auto g-text-xs g-font-medium g-text-red-800 g-bg-red-100 g-rounded-full g-px-2 g-py-0.5">
              {violation.violationCount ?? 0}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="g-px-3">
          <div className="g-flex g-flex-wrap g-gap-x-8 g-gap-y-3 g-text-sm g-mb-3">
            {fields.length > 0 && (
              <div>
                <div className="g-text-xs g-text-slate-500 g-mb-1">
                  <FormattedMessage id="dataset.validationReport.fields" defaultMessage="Field(s)" />
                </div>
                <div className="g-font-mono g-text-xs g-flex g-flex-wrap g-gap-x-2">
                  {fields.map((field) => (
                    <span key={field}>{field}</span>
                  ))}
                </div>
              </div>
            )}
            {fk && (
              <div>
                <div className="g-text-xs g-text-slate-500 g-mb-1">
                  <FormattedMessage
                    id="dataset.validationReport.references"
                    defaultMessage="References"
                  />
                </div>
                <div className="g-font-mono g-text-xs">
                  {fk.referenceResource}.{(fk.referenceFields ?? []).join(', ')}
                </div>
              </div>
            )}
            {dt && (
              <div>
                <div className="g-text-xs g-text-slate-500 g-mb-1">
                  <FormattedMessage
                    id="dataset.validationReport.declaredType"
                    defaultMessage="Declared type"
                  />
                </div>
                <div className="g-font-mono g-text-xs">{dt.declaredType}</div>
              </div>
            )}
          </div>
          {sampleRows.length > 0 && (
            <div>
              <div className="g-text-xs g-text-slate-500 g-mb-1">
                <FormattedMessage
                  id="dataset.validationReport.sampleRows"
                  defaultMessage="Sample rows"
                />
              </div>
              <div className="g-flex g-flex-col g-gap-1">
                {sampleRows.slice(0, SAMPLE_CAP).map((row, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <code key={i} className="g-font-mono g-text-xs g-break-all g-text-slate-600">
                    {Object.entries(row)
                      .map(([k, value]) => `${k}=${value}`)
                      .join('  ')}
                  </code>
                ))}
              </div>
              {sampleRows.length > SAMPLE_CAP && (
                <div className="g-text-xs g-text-slate-400 g-mt-1">
                  <FormattedMessage
                    id="dataset.validationReport.andNMore"
                    defaultMessage="and {count} more"
                    values={{
                      count: Math.max((violation.violationCount ?? sampleRows.length) - SAMPLE_CAP, 0),
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function ColumnStatsTable({
  columns,
  totalRows,
}: {
  columns: DwdpColumnAnalysis[];
  totalRows: number;
}) {
  return (
    <div className="g-border g-border-slate-200 g-rounded g-overflow-hidden g-overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <FormattedMessage id="dataset.validationReport.field" defaultMessage="Field" />
            </TableHead>
            <TableHead>
              <FormattedMessage id="dataset.validationReport.populated" defaultMessage="Populated" />
            </TableHead>
            <TableHead className="g-text-end">
              <FormattedMessage
                id="dataset.validationReport.uniqueValues"
                defaultMessage="Unique values"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {columns.map((col) => {
            const populated = col.populatedValues ?? 0;
            const pct = totalRows ? Math.round((populated / totalRows) * 100) : 0;
            return (
              <TableRow key={col.name}>
                <TableCell className="g-font-mono g-text-xs">{col.name}</TableCell>
                <TableCell>
                  <div className="g-flex g-items-center g-gap-2">
                    <Progress value={pct} className="g-w-16" />
                    <span className="g-text-xs g-text-slate-500 g-w-9 g-shrink-0">{pct}%</span>
                  </div>
                </TableCell>
                <TableCell className="g-text-end">{(col.uniqueValues ?? 0).toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function ResourceDetail({ resource }: { resource: DwdpResourceAnalysisResult }) {
  const violations: { kind: ViolationKind; violation: DwdpPrimaryKeyViolation | DwdpForeignKeyViolation | DwdpDataTypeViolation }[] = [
    ...(hasViolations(resource.primaryKeyViolation)
      ? [{ kind: 'pk' as const, violation: resource.primaryKeyViolation as DwdpPrimaryKeyViolation }]
      : []),
    ...(resource.foreignKeyViolations ?? [])
      .filter(hasViolations)
      .map((violation) => ({ kind: 'fk' as const, violation })),
    ...(resource.dataTypeViolations ?? [])
      .filter(hasViolations)
      .map((violation) => ({ kind: 'dt' as const, violation })),
  ];

  return (
    <div>
      <h2 className="g-text-lg g-font-semibold g-mb-1">{resource.name}</h2>
      <div className="g-text-sm g-text-slate-500 g-mb-4">
        <FormattedMessage
          id="dataset.validationReport.resourceSummary"
          defaultMessage="{rows} rows analysed across {fields} fields"
          values={{
            rows: (resource.totalRows ?? 0).toLocaleString(),
            fields: resource.columnAnalyses?.length ?? 0,
          }}
        />
      </div>
      {violations.length === 0 ? (
        <Alert className="g-mb-6">
          <AlertDescription>
            <FormattedMessage id="dataset.validationReport.noIntegrityIssues" />
          </AlertDescription>
        </Alert>
      ) : (
        <div className="g-flex g-flex-col g-gap-2 g-mb-6">
          {violations.map((item, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <ViolationCard key={i} kind={item.kind} violation={item.violation} />
          ))}
        </div>
      )}
      <h3 className="g-text-base g-font-semibold g-mb-2">
        <FormattedMessage id="dataset.validationReport.columnStats" defaultMessage="Field summary" />
      </h3>
      <ColumnStatsTable columns={resource.columnAnalyses ?? []} totalRows={resource.totalRows ?? 0} />
    </div>
  );
}

export function DatasetKeyValidationReport() {
  const { dataset } = useDatasetKeyLoaderData().data;

  const { data, load, loading } = useQuery<
    DatasetValidationReportQuery,
    DatasetValidationReportQueryVariables
  >(VALIDATION_REPORT_QUERY, { throwAllErrors: false, lazyLoad: true, notifyOnErrors: true });

  useEffect(() => {
    load({ variables: { datasetKey: dataset.key } });
  }, [load, dataset.key]);

  const report = data?.dwdpValidationReport;
  const result = report?.result;
  const resources = useMemo(() => result?.resourceAnalysisResults ?? [], [result]);
  const descriptorIssues = useMemo(
    () => result?.descriptorValidation?.issues ?? [],
    [result]
  );
  const emlIssues = useMemo(() => result?.emlValidation?.issues ?? [], [result]);
  const integrityIssueCount = useMemo(
    () => resources.reduce((sum, r) => sum + issueCount(r), 0),
    [resources]
  );

  const defaultSection = descriptorIssues.length > 0 || resources.length === 0 ? 'descriptor' : 'eml';
  const [section = defaultSection, setSection] = useStringParam({
    key: 'section',
    defaultValue: defaultSection,
    hideDefault: true,
  });

  if (loading || !data) {
    return (
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <CardListSkeleton />
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  if (!report) {
    return (
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl g-min-h-[50vh]">
          <Card>
            <CardContent topPadding>
              <NoRecords messageId="dataset.validationReport.noReport" />
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  const started = parseZonelessDateTime(report.metadata?.started);
  const finished = parseZonelessDateTime(report.metadata?.finished);
  const durationSeconds =
    started && finished ? Math.max(0, (finished.getTime() - started.getTime()) / 1000) : undefined;
  const totalRows = resources.reduce((sum, r) => sum + (r.totalRows ?? 0), 0);

  const statusVariant = integrityIssueCount > 0 ? 'destructive' : descriptorIssues.length + emlIssues.length > 0 ? 'warning' : 'default';
  const statusMessageId =
    integrityIssueCount > 0
      ? 'dataset.validationReport.status.dataIssues'
      : descriptorIssues.length + emlIssues.length > 0
        ? 'dataset.validationReport.status.metadataIssues'
        : 'dataset.validationReport.status.valid';

  const sectionOptions: { key: string; label: React.ReactNode; count: number }[] = [
    {
      key: 'descriptor',
      label: <FormattedMessage id="dataset.validationReport.descriptor" defaultMessage="Descriptor" />,
      count: descriptorIssues.length,
    },
    {
      key: 'eml',
      label: <FormattedMessage id="dataset.validationReport.eml" defaultMessage="EML metadata" />,
      count: emlIssues.length,
    },
    ...resources.map((r) => ({
      key: `res:${r.name}`,
      label: r.name,
      count: issueCount(r),
    })),
  ];
  const currentSection = sectionOptions.some((opt) => opt.key === section) ? section : defaultSection;
  const currentResource = currentSection.startsWith('res:')
    ? resources.find((r) => `res:${r.name}` === currentSection)
    : undefined;

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <Card className="g-mb-6">
          <CardHeader>
            <CardTitle>
              <FormattedMessage
                id="dataset.validationReport.summary"
                defaultMessage="Validation summary"
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="g-flex g-flex-col g-gap-4">
            <Alert variant={statusVariant}>
              <AlertTitle>
                <FormattedMessage id={statusMessageId} />
              </AlertTitle>
            </Alert>
            <div className="g-grid g-grid-cols-2 sm:g-grid-cols-3 lg:g-grid-cols-6 g-gap-4">
              <Fact
                label={<FormattedMessage id="dataset.validationReport.processed" defaultMessage="Processed" />}
                value={
                  finished ? (
                    <FormattedDate
                      value={finished}
                      year="numeric"
                      month="short"
                      day="numeric"
                      hour="2-digit"
                      minute="2-digit"
                    />
                  ) : (
                    '—'
                  )
                }
              />
              <Fact
                label={<FormattedMessage id="dataset.validationReport.duration" defaultMessage="Duration" />}
                value={durationSeconds !== undefined ? `${durationSeconds.toFixed(1)}s` : '—'}
              />
              <Fact
                label={<FormattedMessage id="dataset.validationReport.tables" defaultMessage="Tables" />}
                value={resources.length}
              />
              <Fact
                label={
                  <FormattedMessage
                    id="dataset.validationReport.rowsAnalysed"
                    defaultMessage="Rows analysed"
                  />
                }
                value={totalRows.toLocaleString()}
              />
              <Fact
                label={
                  <FormattedMessage
                    id="dataset.validationReport.integrityIssues"
                    defaultMessage="Integrity issues"
                  />
                }
                value={integrityIssueCount}
                tone={integrityIssueCount ? 'error' : undefined}
              />
              <Fact
                label={
                  <FormattedMessage
                    id="dataset.validationReport.descriptorAndEmlIssues"
                    defaultMessage="Descriptor & EML issues"
                  />
                }
                value={descriptorIssues.length + emlIssues.length}
                tone={descriptorIssues.length + emlIssues.length ? 'warn' : undefined}
              />
            </div>
            {report.attempt && (
              <div className="g-text-xs g-text-slate-500">
                <FormattedMessage
                  id="dataset.validationReport.attemptNote"
                  defaultMessage="Showing report for attempt {attempt}. Browsing earlier report versions will be available soon."
                  values={{ attempt: report.attempt }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="g-flex g-flex-wrap g-gap-2 g-mb-6">
          {sectionOptions.map((opt) => (
            <Button
              key={opt.key}
              onClick={() => setSection(opt.key)}
              variant={currentSection === opt.key ? 'default' : 'plain'}
              className={cn('g-gap-2', {
                'g-bg-slate-200 g-border g-border-slate-300': currentSection !== opt.key,
              })}
            >
              {opt.label}
              {opt.count > 0 && (
                <span className="g-inline-flex g-items-center g-rounded-full g-bg-red-100 g-text-red-800 g-text-xs g-font-medium g-px-2 g-py-0.5">
                  {opt.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent topPadding>
            {currentSection === 'descriptor' && (
              <DescriptorOrEmlDetail
                title={
                  <FormattedMessage id="dataset.validationReport.descriptor" defaultMessage="Descriptor" />
                }
                issues={descriptorIssues}
                validMessageId="dataset.validationReport.descriptorValid"
              />
            )}
            {currentSection === 'eml' &&
              (result?.emlValidation?.emlPresent === false ? (
                <NoRecords messageId="dataset.validationReport.emlNotPresent" />
              ) : (
                <DescriptorOrEmlDetail
                  title={
                    <FormattedMessage id="dataset.validationReport.eml" defaultMessage="EML metadata" />
                  }
                  issues={emlIssues}
                  validMessageId="dataset.validationReport.emlValid"
                />
              ))}
            {currentResource && <ResourceDetail resource={currentResource} />}
          </CardContent>
        </Card>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
