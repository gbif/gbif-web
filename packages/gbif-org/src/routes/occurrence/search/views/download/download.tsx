import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import PredicateEditor from '@/routes/occurrence/download/editor/predicateEditor';
import SqlEditor from '@/routes/occurrence/download/editor/sqlEDitor';
import OccurrenceSearchDownload from './OccurrenceSearchDownload';

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
