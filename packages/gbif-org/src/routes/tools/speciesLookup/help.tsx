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
        <FormattedMessage id="apiHelp.matchSpecies" /> <br />
        <a href={`${import.meta.env.PUBLIC_API}/v1/species/match?name=Puma+concolor&verbose=true`}>
          {`${import.meta.env.PUBLIC_API}/v1/species/match?name=Puma+concolor&verbose=true`}
        </a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.suggestSpecies" /> <br />
        <a href={`${import.meta.env.PUBLIC_API}/v1/species/suggest?q=Puma`}>
          {`${import.meta.env.PUBLIC_API}/v1/species/suggest?q=Puma`}
        </a>
      </Card>
    </div>
  );
}
