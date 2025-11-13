import { useConfig } from '@/config/config';
import { DownloadHostedPortal } from './DownloadHostedPortal';
import OccurrenceSearchDownload from './OccurrenceSearchDownload';

export function Download() {
  const { isGBIFOrg } = useConfig();
  if (!isGBIFOrg) {
    return <DownloadHostedPortal />;
  } else {
    return (
      <>
        <OccurrenceSearchDownload />
      </>
    );
  }
}
