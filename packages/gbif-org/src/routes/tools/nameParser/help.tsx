import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function ApiContent() {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage
          id="apiHelp.parseName"
          defaultMessage="Parse a single scientific name"
        />{' '}
        <br />
        <a href={`${import.meta.env.PUBLIC_API}/v1/parser/name?name=Abies+alba+Mill.`}>
          {`${import.meta.env.PUBLIC_API}/v1/parser/name?name=Abies+alba+Mill.`}
        </a>
      </Card>
    </div>
  );
}
