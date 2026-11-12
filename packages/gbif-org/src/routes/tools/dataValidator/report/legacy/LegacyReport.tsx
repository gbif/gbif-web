import { TableOfContents } from '@/components/tableOfContents';
import { Card } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { normalizeReport, Report } from '../../data/normalizeReport';
import { useValidatorLookups } from '../../data/useValidatorLookups';
import type { ReportRendererProps } from '../reportRenderers';
import { FileSection, hasTermSection } from './FileSection';
import { StatusDot } from './SeverityTag';
import { Summary } from './Summary';

export default function LegacyReport({ validation }: ReportRendererProps) {
  const lookups = useValidatorLookups();
  const report = useMemo(() => normalizeReport(validation, lookups), [validation, lookups]);
  const sections = useMemo(() => tocSections(report), [report]);
  const removeSidebar = useBelow(1100);
  const finished = validation.status === 'FINISHED';

  if (finished && report.files.length === 0) {
    return (
      <Card className="g-p-6 g-text-slate-600">
        <FormattedMessage
          id="tools.dataValidator.noResults"
          defaultMessage="The validator produced no results for this file."
        />
      </Card>
    );
  }

  return (
    <>
      <Summary
        validation={validation}
        report={report}
        finished={finished}
        extensions={lookups.extensions}
      />
      <SidebarLayout
        reverse
        className="g-grid-cols-[1fr_250px] xl:g-grid-cols-[1fr_300px]"
        stack={removeSidebar}
      >
        <div className="g-min-w-0">
          {report.files.map((file) => (
            <FileSection key={file.anchor} file={file} extensions={lookups.extensions} />
          ))}
        </div>
        {!removeSidebar && report.files.length > 0 && (
          <Aside>
            <AsideSticky className="-g-mt-4">
              <Card>
                <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                  <FormattedMessage id="phrases.pageToc" defaultMessage="On this page" />
                </h4>
                <nav className="g-pb-2">
                  <TableOfContents sections={sections} />
                </nav>
              </Card>
            </AsideSticky>
          </Aside>
        )}
      </SidebarLayout>
    </>
  );
}

function tocSections(report: Report) {
  return report.files.flatMap((file) => [
    { id: file.anchor, title: <span dir="auto">{file.fileName}</span> },
    {
      id: `${file.anchor}-terms`,
      hidden: !hasTermSection(file),
      title: (
        <span className="g-ps-3 g-flex g-items-center g-gap-2">
          <StatusDot severity="NEUTRAL" />
          <FormattedMessage
            id="tools.dataValidator.termsFrequency.title"
            defaultMessage="Term frequency"
          />
        </span>
      ),
    },
    {
      id: `${file.anchor}-issues`,
      title: (
        <span className="g-ps-3 g-flex g-items-center g-gap-2">
          <StatusDot severity={file.issueCount > 0 ? 'WARNING' : 'OK'} />
          <FormattedMessage id="tools.dataValidator.issues" defaultMessage="Validation issues" />
        </span>
      ),
    },
  ]);
}
