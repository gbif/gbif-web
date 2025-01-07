import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'what-is-an-installation'} includeTitle />
      </div>
    </div>
  );
}

export function ApiContent({ id = '4051783990' }: { id?: string }) {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.singleInstallation" /> <br />
        <a href={`https://api.gbif.org/v1/installation/${id}`}>
          https://api.gbif.org/v1/installation/{id}
        </a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.searchInstallations" /> <br />
        <a href={`https://api.gbif.org/v1/installation?type=IPT_INSTALLATION`}>
          https://api.gbif.org/v1/installation?type=IPT_INSTALLATION
        </a>
      </Card>
    </div>
  );
}
