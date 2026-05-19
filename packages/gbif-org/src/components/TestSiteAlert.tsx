import { FormattedMessage } from 'react-intl';
import { Alert } from './ui/alert';
import { cn } from '@/utils/shadcn';

export default function TestSiteAlert({ className }: { className?: string }) {
  const testSite = import.meta.env.PUBLIC_TEST_SITE === 'true';
  if (!testSite) return null;
  return (
    <Alert variant="destructive" className={cn('g-text-site-dir-start', className)} dir="auto">
      <FormattedMessage id="phrases.testSiteWarning" />
    </Alert>
  );
}
