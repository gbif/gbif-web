import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import App from './testing/app';
import PredicateEditor from '@/routes/occurrence/download/editor/predicateEditor';
import SqlEditor from '@/routes/occurrence/download/editor/sqlEDitor';
import OccurrenceSearchDownload from './testing/OccurrenceSearchDownload';

export function Download() {
  const { isGBIFOrg } = useConfig();
  if (!isGBIFOrg) {
    return <DownloadHostedPortal />;
  } else {
    return (
      <>
        <OccurrenceSearchDownload />
        {/* <DownloadGbifOrgVertical />
        <DownloadGbifOrgHorizontal /> */}
      </>
    );
  }
}
