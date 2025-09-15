import { TextField } from '../hostedPortalForm';
import { FormattedMessage } from 'react-intl';

export function Timelines() {
  return (
    <TextField
      name="timelines"
      textarea
      descriptionPosition="above"
      description={
        <FormattedMessage
          id="hostedPortalApplication.timelinesDescription"
          defaultMessage="Are there any timelines you need to keep with regards to the deployment, promotion and ongoing use of the portal?"
        />
      }
    />
  );
}
