import { TextField } from '../hostedPortalForm';
import { FormattedMessage } from 'react-intl';

export function HostedPortalName() {
  return (
    <TextField
      description={
        <FormattedMessage
          id="hostedPortalApplication.hostedPortalNameDescription"
          defaultMessage="Please provide the name you wish to use for your hosted portal"
        />
      }
      name="hostedPortalName"
    />
  );
}
