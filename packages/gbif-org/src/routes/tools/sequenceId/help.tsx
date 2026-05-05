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
          id="apiHelp.blastBatch"
          defaultMessage="BLAST a batch of sequences against a reference database"
        />{' '}
        <br />
        <code>POST https://www.gbif.org/api/blast/batch</code>
        <br />
        <code className="g-text-xs">{`{ "sequence": ["ATGC..."], "marker": "COI" }`}</code>
      </Card>
    </div>
  );
}
