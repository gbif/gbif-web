import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'what-is-a-download'} includeTitle />
      </div>
    </div>
  );
}

export function ApiContent({ id = '0058296-160910150852091' }: { id?: string }) {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.singleEntry" /> <br />
        <a href={`https://api.gbif.org/v1/occurrence/download/${id}`} className="g-break-all">
          https://api.gbif.org/v1/occurrence/download/{id}
        </a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.downloadKeyDatasets" /> <br />
        <a
          href={`https://api.gbif.org/v1/occurrence/download/${id}/datasets`}
          className="g-break-all"
        >
          https://api.gbif.org/v1/occurrence/download/{id}/datasets
        </a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.downloadKeyDatasetsExport" /> <br />
        <a
          href={`https://api.gbif.org/v1/occurrence/download/${id}/datasets/export?format=TSV`}
          className="g-break-all"
        >
          https://api.gbif.org/v1/occurrence/download/{id}/datasets/export?format=TSV
        </a>
      </Card>
    </div>
  );
}
