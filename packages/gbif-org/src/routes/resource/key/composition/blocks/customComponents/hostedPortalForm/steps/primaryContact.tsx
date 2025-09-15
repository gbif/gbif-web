import { FormattedMessage } from 'react-intl';
import { TextField } from '../hostedPortalForm';

export function PrimaryContact() {
  return (
    <div className="g-flex g-flex-col g-gap-4">
      <div className="g-flex g-gap-4">
        <TextField
          name="primaryContact.name"
          label={<FormattedMessage id="hostedPortalApplication.name" defaultMessage="Name" />}
          required
        />

        <TextField
          name="primaryContact.email"
          label={<FormattedMessage id="hostedPortalApplication.email" defaultMessage="Email" />}
          required
        />
      </div>

      <TextField
        name="primaryContact.github"
        label={
          <FormattedMessage id="hostedPortalApplication.github" defaultMessage="GitHub username" />
        }
        description={
          <FormattedMessage
            id="hostedPortalApplication.githubDescription"
            defaultMessage="Please provide your GitHub username if possible. We will use it to give you access to follow the progress of your application"
          />
        }
      />
    </div>
  );
}
