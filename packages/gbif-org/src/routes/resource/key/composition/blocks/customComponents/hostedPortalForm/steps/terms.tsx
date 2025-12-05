import { CheckboxField } from '../hostedPortalForm';
import { FormattedMessage } from 'react-intl';

export function Terms() {
  return (
    <CheckboxField
      className="g-pt-2"
      name="termsAccepted"
      label={
        <FormattedMessage
          id="hostedPortalApplication.termsLabel"
          defaultMessage="I have read the <service-agreement-link>service agreement</service-agreement-link> and <data-processor-agreement-link>data processor agreement</data-processor-agreement-link> and I accept these terms and conditions for the hosted portal I plan to launch."
          values={{
            'service-agreement-link': (text) => (
              <a
                href="/terms/hosted-portal/service-agreement"
                target="_blank"
                rel="noopener noreferrer"
                className="g-text-primary-500 hover:g-text-primary-700 g-underline"
              >
                {text}
              </a>
            ),
            'data-processor-agreement-link': (text) => (
              <a
                href="/terms/hosted-portal/data-processor"
                target="_blank"
                rel="noopener noreferrer"
                className="g-text-primary-500 hover:g-text-primary-700 g-underline"
              >
                {text}
              </a>
            ),
          }}
        />
      }
    />
  );
}
