import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'what-is-a-node'} includeTitle />
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
        <FormattedMessage id="apiHelp.singleNode" /> <br />
        <div className="g-mb-2">
          <a href={`https://api.gbif.org/v1/node/${id}`}>https://api.gbif.org/v1/node/{id}</a>
        </div>
        <div className="g-mb-2">
          <a href={`https://api.gbif.org/v1/node/${id}/dataset`}>/dataset</a>
        </div>
        <div className="g-mb-2">
          <a href={`https://api.gbif.org/v1/node/${id}/organization`}>/organization</a>
        </div>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.searchNodes" /> <br />
        <div>
          <a href={`https://api.gbif.org/v1/node`}>https://api.gbif.org/v1/node</a>
        </div>
      </Card>
    </div>
  );
}
