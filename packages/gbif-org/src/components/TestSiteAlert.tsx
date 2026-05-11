import { FormattedMessage } from 'react-intl';
import { Alert } from './ui/alert';

export default function TestSiteAlert({ className }: { className?: string }) {
  const testSite = import.meta.env.PUBLIC_TEST_SITE === 'true';
  if (!testSite) return null;
  return (
    <Alert variant="destructive" className={className}>
      <FormattedMessage id="phrases.testSiteWarning" />
    </Alert>
  );
}
