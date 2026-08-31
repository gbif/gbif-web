import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';

const SEVERITY_COLORS: Record<string, string> = {
  ERROR: 'g-bg-red-100 g-text-red-800 dark:g-bg-red-900 dark:g-text-red-300',
  WARNING: 'g-bg-yellow-100 g-text-yellow-800 dark:g-bg-yellow-900 dark:g-text-yellow-300',
  INFO: 'g-bg-blue-100 g-text-blue-800 dark:g-bg-blue-900 dark:g-text-blue-300',
};

// Shared with occurrence/key/properties.tsx's local IssueTag, kept in sync visually
// (ERROR/WARNING/INFO colour mapping) so severity reads the same across the site.
export function SeverityTag({
  severity,
  className,
}: {
  severity?: string | null;
  className?: string;
}) {
  const key = severity ?? 'INFO';
  const color = SEVERITY_COLORS[key] ?? SEVERITY_COLORS.INFO;
  return (
    <span
      className={cn(
        'g-inline-block g-text-xs g-font-medium g-px-2.5 g-py-0.5 g-rounded g-whitespace-nowrap',
        color,
        className
      )}
    >
      <FormattedMessage id={`dataset.validationReport.severity.${key}`} defaultMessage={key} />
    </span>
  );
}
