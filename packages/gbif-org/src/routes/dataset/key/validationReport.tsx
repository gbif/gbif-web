import { NoRecords } from '@/components/noDataMessages';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/largeCard';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
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
import useAbove from '@/hooks/useAbove';
import { useStringParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import {
  MdCheckCircle,
  MdError,
  MdErrorOutline,
  MdLinkOff,
  MdTextFields,
  MdVpnKey,
} from 'react-icons/md';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
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

/* ---------- small shared pieces ---------- */

function StatusIcon({ ok, blocking, size = 18 }: { ok: boolean; blocking?: boolean; size?: number }) {
  if (ok) return <MdCheckCircle className="g-shrink-0 g-text-primary-500" size={size} aria-hidden />;
  return (
    <MdError
      className={cn('g-shrink-0', blocking ? 'g-text-red-600' : 'g-text-amber-500')}
      size={size}
      aria-hidden
    />
  );
}

// A small round badge, e.g. a red circle with "!" for an error-severity group header, or a
// red circle with a key/link/text icon in front of a table's key/type violation title.
function RoundBadge({
  glyph,
  tone,
  size = 18,
}: {
  glyph: React.ReactNode;
  tone: 'error' | 'warning' | 'info';
  size?: number;
}) {
  const bg =
    tone === 'error' ? 'g-bg-red-600' : tone === 'warning' ? 'g-bg-amber-500' : 'g-bg-blue-500';
  return (
    <span
      className={cn(
        'g-inline-flex g-items-center g-justify-center g-shrink-0 g-rounded-full g-text-white',
        bg
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {glyph}
    </span>
  );
}

const SEVERITY_TONE: Record<string, 'error' | 'warning' | 'info'> = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

function SeverityIcon({ severity, size = 18 }: { severity?: string | null; size?: number }) {
  const key = severity ?? 'INFO';
  const tone = SEVERITY_TONE[key] ?? 'info';
  return (
    <RoundBadge
      tone={tone}
      size={size}
      glyph={
        <span className="g-text-[10px] g-font-bold g-leading-none">{key === 'INFO' ? 'i' : '!'}</span>
      }
    />
  );
}

function severityTint(severity: string): string {
  if (severity === 'ERROR') return 'g-bg-red-50';
  if (severity === 'WARNING') return 'g-bg-amber-50';
  return 'g-bg-blue-50';
}

// Card look shared by the issue-group and per-table violation cards, matching the design's
// white, bordered, shadowed "card" surface (the same shadow token largeCard.tsx's Card uses).
const ISSUE_CARD_CLASS =
  'g-rounded g-border g-border-slate-200 g-bg-white g-shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] g-overflow-hidden g-mb-0';

function RailItem({
  icon,
  label,
  meta,
  count,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  meta?: React.ReactNode;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'g-flex g-items-center g-gap-2 g-w-full g-min-h-9 g-text-start g-rounded-md g-px-2.5 g-py-2 g-text-sm',
        active
          ? 'g-bg-slate-100 g-text-slate-900 g-font-medium'
          : 'g-text-slate-700 hover:g-bg-slate-50'
      )}
    >
      {icon}
      <span className="g-flex-1 g-truncate">{label}</span>
      {meta && <span className="g-text-xs g-text-slate-400 g-shrink-0">{meta}</span>}
      {!!count && (
        <span className="g-inline-flex g-items-center g-shrink-0 g-rounded-full g-bg-red-100 g-text-red-800 g-text-xs g-font-medium g-px-2 g-py-0.5">
          {count}
        </span>
      )}
    </button>
  );
}

function DetailHeader({ title, meta }: { title: React.ReactNode; meta?: React.ReactNode }) {
  return (
    <div className="g-mb-4">
      <h2 className="g-text-lg g-font-semibold g-text-slate-900">{title}</h2>
      {meta && <div className="g-text-sm g-text-slate-500 g-mt-0.5">{meta}</div>}
    </div>
  );
}

function StatusLine({
  icon,
  title,
  note,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  note?: React.ReactNode;
}) {
  return (
    <div className="g-flex g-items-start g-gap-3">
      <span className="g-mt-0.5 g-shrink-0">{icon}</span>
      <div>
        <div className="g-text-slate-900">{title}</div>
        {note && <div className="g-text-sm g-text-slate-500 g-mt-0.5">{note}</div>}
      </div>
    </div>
  );
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

/* ---------- summary section ---------- */

function SummaryDetail({
  report,
  resources,
  descriptorIssues,
  emlIssues,
  integrityIssueCount,
}: {
  report: NonNullable<DatasetValidationReportQuery['dwdpValidationReport']>;
  resources: DwdpResourceAnalysisResult[];
  descriptorIssues: DwdpValidationIssue[];
  emlIssues: DwdpValidationIssue[];
  integrityIssueCount: number;
}) {
  const started = parseZonelessDateTime(report.metadata?.started);
  const finished = parseZonelessDateTime(report.metadata?.finished);
  const durationSeconds =
    started && finished ? Math.max(0, (finished.getTime() - started.getTime()) / 1000) : undefined;
  const totalRows = resources.reduce((sum, r) => sum + (r.totalRows ?? 0), 0);
  const tablesWithIssues = resources.filter((r) => issueCount(r) > 0).length;
  const metadataIssueCount = descriptorIssues.length + emlIssues.length;

  return (
    <div>
      <DetailHeader
        title={
          <FormattedMessage id="dataset.validationReport.summary" defaultMessage="Validation summary" />
        }
      />
      <div className="g-flex g-flex-col g-gap-4 g-mb-6">
        {integrityIssueCount > 0 && (
          <StatusLine
            icon={<MdError className="g-text-red-600" size={20} aria-hidden />}
            title={
              <span className="g-font-semibold">
                <FormattedMessage
                  id="dataset.validationReport.blockingSummary"
                  defaultMessage="{count, plural, one {# integrity issue} other {# integrity issues}} found in {tables, plural, one {# table} other {# tables}}"
                  values={{ count: integrityIssueCount, tables: tablesWithIssues }}
                />
              </span>
            }
            note={
              <FormattedMessage
                id="dataset.validationReport.blockingNote"
                defaultMessage="See the affected tables below for details."
              />
            }
          />
        )}
        {metadataIssueCount > 0 && (
          <StatusLine
            icon={<MdErrorOutline className="g-text-amber-500" size={20} aria-hidden />}
            title={
              <span className="g-font-semibold">
                <FormattedMessage
                  id="dataset.validationReport.advisorySummary"
                  defaultMessage="{count, plural, one {# metadata issue} other {# metadata issues}} in the descriptor and EML document"
                  values={{ count: metadataIssueCount }}
                />
              </span>
            }
            note={
              <FormattedMessage
                id="dataset.validationReport.advisoryNote"
                defaultMessage="Advisory only — these do not affect data usability, but are worth reviewing."
              />
            }
          />
        )}
        {integrityIssueCount === 0 && metadataIssueCount === 0 && (
          <StatusLine
            icon={<MdCheckCircle className="g-text-primary-500" size={20} aria-hidden />}
            title={
              <span className="g-font-semibold">
                <FormattedMessage id="dataset.validationReport.status.valid" defaultMessage="No issues found" />
              </span>
            }
            note={
              <FormattedMessage
                id="dataset.validationReport.allClearNote"
                defaultMessage="Keys, references, descriptor and EML metadata all check out."
              />
            }
          />
        )}
      </div>
      <div className="g-grid g-grid-cols-2 sm:g-grid-cols-3 g-gap-x-6 g-gap-y-4 g-pt-5 g-border-t g-border-slate-200">
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
            <FormattedMessage id="dataset.validationReport.rowsAnalysed" defaultMessage="Rows analysed" />
          }
          value={totalRows.toLocaleString()}
        />
        <Fact
          label={
            <FormattedMessage id="dataset.validationReport.integrityIssues" defaultMessage="Integrity issues" />
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
          value={metadataIssueCount}
          tone={metadataIssueCount ? 'warn' : undefined}
        />
      </div>
      {report.attempt && (
        <div className="g-text-xs g-text-slate-500 g-mt-4">
          <FormattedMessage
            id="dataset.validationReport.attemptNote"
            defaultMessage="Showing report for attempt {attempt}. Browsing earlier report versions will be available soon."
            values={{ attempt: report.attempt }}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- descriptor / EML section ---------- */

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
      {groups.map(([type, list]) => {
        const worst = worstSeverity(list);
        return (
          <AccordionItem key={type} value={type} className={ISSUE_CARD_CLASS}>
            <AccordionTrigger
              className={cn('g-px-3.5 g-py-3 hover:g-no-underline', severityTint(worst))}
            >
              <span className="g-flex g-items-center g-gap-2.5 g-flex-1 g-text-start">
                <SeverityIcon severity={worst} />
                <span className="g-font-semibold g-text-slate-900">{humanizeViolationType(type)}</span>
                <span className="g-ms-auto g-text-sm g-text-slate-500">{list.length}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="g-pb-0 g-pt-0">
              <div className="g-overflow-x-auto g-border-t g-border-slate-200">
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
                          <FormattedMessage
                            id={`dataset.validationReport.severity.${issue.severity ?? 'INFO'}`}
                            defaultMessage={issue.severity ?? 'Info'}
                          />
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
        );
      })}
    </Accordion>
  );
}

function DescriptorOrEmlDetail({
  title,
  meta,
  issues,
  validMessageId,
  validDefaultMessage,
}: {
  title: React.ReactNode;
  meta?: React.ReactNode;
  issues: DwdpValidationIssue[];
  validMessageId: string;
  validDefaultMessage: string;
}) {
  return (
    <div>
      <DetailHeader title={title} meta={meta} />
      {issues.length === 0 ? (
        <Alert>
          <AlertDescription>
            <FormattedMessage id={validMessageId} defaultMessage={validDefaultMessage} />
          </AlertDescription>
        </Alert>
      ) : (
        <IssueGroups issues={issues} />
      )}
    </div>
  );
}

/* ---------- table (resource) section ---------- */

type ViolationKind = 'pk' | 'fk' | 'dt';

const VIOLATION_LABEL: Record<ViolationKind, { id: string; defaultMessage: string; icon: React.ReactNode }> = {
  pk: {
    id: 'dataset.validationReport.primaryKeyViolation',
    defaultMessage: 'Primary key is not unique',
    icon: <MdVpnKey size={11} />,
  },
  fk: {
    id: 'dataset.validationReport.foreignKeyViolation',
    defaultMessage: 'Foreign key has no matching row',
    icon: <MdLinkOff size={11} />,
  },
  dt: {
    id: 'dataset.validationReport.dataTypeViolation',
    defaultMessage: 'Values do not match the declared type',
    icon: <MdTextFields size={11} />,
  },
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
      <AccordionItem
        value="item"
        className="g-rounded g-border g-border-red-200 g-bg-white g-shadow-[0_10px_40px_-12px_rgba(0,0,0,0.1)] g-overflow-hidden g-mb-0"
      >
        <AccordionTrigger className="g-bg-red-50 g-px-3.5 g-py-3 hover:g-no-underline">
          <span className="g-flex g-items-center g-gap-2.5 g-flex-1 g-text-start">
            <RoundBadge tone="error" glyph={VIOLATION_LABEL[kind].icon} />
            <span className="g-font-semibold g-text-red-800">
              <FormattedMessage id={VIOLATION_LABEL[kind].id} defaultMessage={VIOLATION_LABEL[kind].defaultMessage} />
            </span>
            <span className="g-ms-auto g-text-sm g-font-medium g-text-red-800">
              {violation.violationCount ?? 0}
            </span>
          </span>
        </AccordionTrigger>
        <AccordionContent className="g-px-3.5 g-pt-3 g-pb-4 g-border-t g-border-red-100">
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
  const violations: {
    kind: ViolationKind;
    violation: DwdpPrimaryKeyViolation | DwdpForeignKeyViolation | DwdpDataTypeViolation;
  }[] = [
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
      <DetailHeader
        title={resource.name}
        meta={
          <FormattedMessage
            id="dataset.validationReport.resourceMeta"
            defaultMessage="{rows} rows · {fields} fields · {count, plural, =0 {no issues} one {# issue} other {# issues}}"
            values={{
              rows: (resource.totalRows ?? 0).toLocaleString(),
              fields: resource.columnAnalyses?.length ?? 0,
              count: issueCount(resource),
            }}
          />
        }
      />
      {violations.length === 0 ? (
        <Alert className="g-mb-6">
          <AlertDescription>
            <FormattedMessage
              id="dataset.validationReport.noIntegrityIssues"
              defaultMessage="Keys, references and data types all check out."
            />
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

/* ---------- page ---------- */

export function DatasetKeyValidationReport() {
  const { formatMessage } = useIntl();
  const { dataset } = useDatasetKeyLoaderData().data;
  const showRail = useAbove(900);
  const [onlyIssues, setOnlyIssues] = useState(false);

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
  const descriptorIssues = useMemo(() => result?.descriptorValidation?.issues ?? [], [result]);
  const emlIssues = useMemo(() => result?.emlValidation?.issues ?? [], [result]);
  const integrityIssueCount = useMemo(
    () => resources.reduce((sum, r) => sum + issueCount(r), 0),
    [resources]
  );

  const [section = 'summary', setSection] = useStringParam({
    key: 'section',
    defaultValue: 'summary',
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
              <NoRecords
                messageId="dataset.validationReport.noReport"
                defaultMessage="No validation report is available for this dataset yet."
              />
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  // EML metadata is optional for a data package, so its absence is not itself an issue to
  // flag: the EML rail item/tab is only shown when a document was actually found. A direct
  // link to ?section=eml on a dataset without one still gets an explanation, just without
  // the surrounding rail/card chrome (see the early return below).
  const hasEml = result?.emlValidation?.emlPresent === true;

  const summaryLabel = formatMessage({
    id: 'dataset.validationReport.summaryShort',
    defaultMessage: 'Summary',
  });
  const descriptorLabel = formatMessage({
    id: 'dataset.validationReport.descriptor',
    defaultMessage: 'Descriptor',
  });
  const emlLabel = formatMessage({
    id: 'dataset.validationReport.eml',
    defaultMessage: 'EML metadata',
  });

  const tableItems = onlyIssues ? resources.filter((r) => issueCount(r) > 0) : resources;

  const currentResource = section.startsWith('res:')
    ? resources.find((r) => `res:${r.name}` === section)
    : undefined;
  const currentSection = section === 'descriptor' || section === 'eml' || currentResource ? section : 'summary';

  if (currentSection === 'eml' && !hasEml) {
    return (
      <ArticleContainer className="g-bg-slate-100 g-pt-4">
        <ArticleTextContainer className="g-max-w-screen-xl g-min-h-[50vh]">
          <NoRecords
            messageId="dataset.validationReport.emlNotPresent"
            defaultMessage="No EML document was found for this dataset."
          />
        </ArticleTextContainer>
      </ArticleContainer>
    );
  }

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {!showRail && (
          <div className="g-mb-4">
            <label htmlFor="validation-report-section-select" className="g-sr-only">
              <FormattedMessage id="dataset.validationReport.selectSection" defaultMessage="Select report section" />
            </label>
            <select
              id="validation-report-section-select"
              value={currentSection}
              onChange={(e) => setSection(e.target.value)}
              className="g-w-full g-px-4 g-py-2 g-border g-border-slate-300 g-rounded-md g-bg-white g-text-base focus:g-outline-none focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-transparent"
            >
              <option value="summary">{summaryLabel}</option>
              <option value="descriptor">
                {descriptorIssues.length ? `${descriptorLabel} (${descriptorIssues.length})` : descriptorLabel}
              </option>
              {hasEml && (
                <option value="eml">
                  {emlIssues.length ? `${emlLabel} (${emlIssues.length})` : emlLabel}
                </option>
              )}
              {resources.map((r) => {
                const n = issueCount(r);
                return (
                  <option key={r.name} value={`res:${r.name}`}>
                    {n ? `${r.name} (${n})` : r.name}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        <SidebarLayout
          className="g-grid-cols-1 md:g-grid-cols-[260px_minmax(0,1fr)] lg:g-grid-cols-[288px_minmax(0,1fr)]"
          stack={!showRail}
        >
          {showRail && (
            <Aside>
              <AsideSticky className="-g-mt-4">
                <Card className="g-p-2">
                  <div className="g-flex g-items-center g-gap-2 g-px-2.5 g-py-1.5 g-mb-1">
                    <span className="g-text-xs g-font-semibold g-uppercase g-tracking-wide g-text-slate-400">
                      <FormattedMessage id="dataset.validationReport.package" defaultMessage="Package" />
                    </span>
                    <span className="g-ms-auto g-text-xs g-text-slate-500">
                      <FormattedMessage id="dataset.validationReport.latest" defaultMessage="Latest" />
                    </span>
                  </div>
                  <RailItem
                    icon={<StatusIcon ok={integrityIssueCount === 0} blocking={integrityIssueCount > 0} />}
                    label={summaryLabel}
                    active={currentSection === 'summary'}
                    onClick={() => setSection('summary')}
                  />
                  <RailItem
                    icon={<StatusIcon ok={descriptorIssues.length === 0} />}
                    label={descriptorLabel}
                    count={descriptorIssues.length}
                    active={currentSection === 'descriptor'}
                    onClick={() => setSection('descriptor')}
                  />
                  {hasEml && (
                    <RailItem
                      icon={<StatusIcon ok={emlIssues.length === 0} />}
                      label={emlLabel}
                      count={emlIssues.length}
                      active={currentSection === 'eml'}
                      onClick={() => setSection('eml')}
                    />
                  )}
                  <div className="g-border-t g-border-slate-200 g-my-2" />
                  <div className="g-flex g-items-center g-justify-between g-px-2.5 g-py-1">
                    <span className="g-text-xs g-font-semibold g-uppercase g-tracking-wide g-text-slate-400">
                      <FormattedMessage id="dataset.validationReport.tables" defaultMessage="Tables" />{' '}
                      ({resources.length})
                    </span>
                  </div>
                  {resources.length > 0 && (
                    <label className="g-flex g-items-center g-gap-2 g-px-2.5 g-py-1.5 g-mb-1 g-text-xs g-text-slate-500 g-cursor-pointer">
                      <Switch checked={onlyIssues} onCheckedChange={setOnlyIssues} />
                      <FormattedMessage
                        id="dataset.validationReport.onlyTablesWithIssues"
                        defaultMessage="Only tables with issues"
                      />
                    </label>
                  )}
                  {tableItems.map((r) => {
                    const n = issueCount(r);
                    return (
                      <RailItem
                        key={r.name}
                        icon={<StatusIcon ok={n === 0} blocking={n > 0} />}
                        label={r.name}
                        meta={(r.totalRows ?? 0).toLocaleString()}
                        count={n}
                        active={currentSection === `res:${r.name}`}
                        onClick={() => setSection(`res:${r.name}`)}
                      />
                    );
                  })}
                </Card>
              </AsideSticky>
            </Aside>
          )}
          <div className="g-min-w-0">
            {currentSection === 'summary' && (
              // Only the Summary view gets the white card surface, matching the design: the
              // other sections sit directly on the page background, with each issue/table row
              // providing its own card.
              <Card>
                <CardContent topPadding>
                  <SummaryDetail
                    report={report}
                    resources={resources}
                    descriptorIssues={descriptorIssues}
                    emlIssues={emlIssues}
                    integrityIssueCount={integrityIssueCount}
                  />
                </CardContent>
              </Card>
            )}
            {currentSection === 'descriptor' && (
              <DescriptorOrEmlDetail
                title={<FormattedMessage id="dataset.validationReport.descriptor" defaultMessage="Descriptor" />}
                meta={
                  <FormattedMessage
                    id="dataset.validationReport.descriptorMeta"
                    defaultMessage="{count, plural, =0 {no issues} one {# issue} other {# issues}} · schema and foreign key declarations"
                    values={{ count: descriptorIssues.length }}
                  />
                }
                issues={descriptorIssues}
                validMessageId="dataset.validationReport.descriptorValid"
                validDefaultMessage="No issues found in the descriptor."
              />
            )}
            {currentSection === 'eml' && (
              <DescriptorOrEmlDetail
                title={<FormattedMessage id="dataset.validationReport.eml" defaultMessage="EML metadata" />}
                meta={
                  <FormattedMessage
                    id="dataset.validationReport.emlMeta"
                    defaultMessage="{count, plural, =0 {Present · valid against the GBIF EML profile} one {Present · # issue against the GBIF EML profile} other {Present · # issues against the GBIF EML profile}}"
                    values={{ count: emlIssues.length }}
                  />
                }
                issues={emlIssues}
                validMessageId="dataset.validationReport.emlValid"
                validDefaultMessage="No issues found in the EML document."
              />
            )}
            {currentResource && <ResourceDetail resource={currentResource} />}
          </div>
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
