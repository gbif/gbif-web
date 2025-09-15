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
          defaultMessage="I have read the service agreement and data processor agreement and I accept these terms and conditions for the hosted portal I plan to launch."
        />
      }
    />
  );
}
