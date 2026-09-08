import { FormattedMessage } from 'react-intl';

export function ApiContent() {
  return (
    <div className="g-text-sm g-prose">
      <p>
        <FormattedMessage
          id="tools.validationReport.apiComingSoon"
          defaultMessage="API access details will be added once this tool is available."
        />
      </p>
    </div>
  );
}
