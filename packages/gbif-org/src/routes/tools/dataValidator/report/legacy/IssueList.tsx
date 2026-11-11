import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FormattedNumber } from 'react-intl';
import type { ReportFile } from '../../data/normalizeReport';
import { useLabels } from '../useLabels';
import { IssueSamples } from './IssueSamples';
import { SeverityTag } from './SeverityTag';
import { NoIssuesTag } from './Summary';

export function IssueList({ file }: { file: ReportFile }) {
  const labels = useLabels();

  if (file.issueCount === 0) return <NoIssuesTag />;

  return (
    <div className="g-space-y-4">
      {file.categories.map(({ category, issues }) => (
        <section key={category}>
          <h4 className="g-text-sm g-font-semibold g-text-slate-700 g-mb-1">
            {labels.category(category)}
          </h4>
          <Accordion type="multiple">
            {issues.map((issue) => {
              const help = labels.issueHelp(issue.issue);
              return (
                <AccordionItem key={issue.issue} value={issue.issue} className="g-border-slate-100">
                  <AccordionTrigger className="g-py-2 hover:g-no-underline">
                    <SeverityTag severity={issue.severity}>
                      {labels.issue(issue.issue, category)}
                      {issue.count !== undefined && (
                        <span className="g-ms-1 g-font-semibold">
                          <FormattedNumber value={issue.count} />
                        </span>
                      )}
                    </SeverityTag>
                  </AccordionTrigger>
                  <AccordionContent>
                    {help && <p className="g-text-sm g-text-slate-600 g-mb-3">{help}</p>}
                    <IssueSamples issue={issue} />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>
      ))}
    </div>
  );
}
