import { FormattedMessage } from 'react-intl';
import { TextField } from '../becomeAPublisherForm';
export function OrganizationDetails() {
  return (
    <div className="g-flex g-flex-col g-gap-4">
      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="organization"
          name="organizationDetails.name"
          label={<FormattedMessage id="eoi.orgName" defaultMessage="Organization name" />}
          required
        />

        <TextField
          autoComplete="url"
          name="organizationDetails.homePage"
          label={<FormattedMessage id="eoi.homePage" defaultMessage="Home page" />}
        />
      </div>

      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="email"
          name="organizationDetails.email"
          label={<FormattedMessage id="eoi.email" defaultMessage="Email" />}
          description={
            <FormattedMessage
              id="eoi.orgEmailExample"
              defaultMessage="Organization email e.g. secretariat@fibg-museum.org"
            />
          }
          descriptionPosition="below"
        />

        <TextField
          autoComplete="tel"
          name="organizationDetails.phone"
          label={<FormattedMessage id="eoi.phone" defaultMessage="Phone" />}
        />
      </div>

      <TextField
        name="organizationDetails.logo"
        label={<FormattedMessage id="eoi.logo" defaultMessage="Logo" />}
        descriptionPosition="below"
        description={
          <FormattedMessage
            id="eoi.exampleImageUrl"
            defaultMessage="E.g. http://my.organization.org/images/logo.png"
          />
        }
      />

      <TextField
        name="organizationDetails.description"
        label={<FormattedMessage id="eoi.description" defaultMessage="Description" />}
        required
        textarea
        descriptionPosition="above"
        description={
          <FormattedMessage
            id="eoi.brieflyDescribeScope"
            defaultMessage="In English, please briefly describe the scope of your institution/organization in relation to GBIF's mission (e.g. collection holdings, research focus, biodiversity information management, etc.). This description will appear on your publisher page."
          />
        }
      />
    </div>
  );
}
