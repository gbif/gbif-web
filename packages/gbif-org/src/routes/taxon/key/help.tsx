import { HelpText } from '@/components/helpText';
import { Card } from '@/components/ui/smallCard';
import { FormattedMessage } from 'react-intl';

export function AboutContent() {
  return (
    <div>
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'what-is-a-taxon'} includeTitle />
      </div>
    </div>
  );
}

export function ApiContent({ id = 5231190 }: { id?: number }) {
  return (
    <div className="g-text-sm g-prose">
      <div className="g-prose g-text-sm [&_h3]:g-m-0 [&_h3]:g-text-sm">
        <HelpText identifier={'api-access'} includeTitle />
      </div>
      <h4>
        <FormattedMessage id="apiHelp.examples" />
      </h4>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.singleSpecies" /> <br />
        <a href={`https://api.gbif.org/v1/species/${id}`}>https://api.gbif.org/v1/species/{id}</a>
      </Card>
      <Card className="g-p-2 g-mb-2">
        <FormattedMessage id="apiHelp.searchSpecies" /> <br />
        <a href={`https://api.gbif.org/v1/species/search?q=Passer`}>
          https://api.gbif.org/v1/species/search?q=passer
        </a>
      </Card>
    </div>
  );
}
