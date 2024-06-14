import { TextField } from '../becomeAPublisherForm';

export function OrganizationDetails() {
  return (
    <div className="g-flex g-flex-col g-gap-4">
      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="organization"
          name="organizationDetails.name"
          label="Organization name"
          required
        />

        <TextField autoComplete="url" name="organizationDetails.homePage" label="Home page" />
      </div>

      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="email"
          name="organizationDetails.email"
          label="Email"
          description="Organization email e.g. secretariat@fibg-museum.org"
          descriptionPosition="below"
        />

        <TextField autoComplete="tel" name="organizationDetails.phone" label="Phone" />
      </div>

      <TextField
        name="organizationDetails.logo"
        label="Logo"
        descriptionPosition="below"
        description="E.g. http://my.organization.org/images/logo.png"
      />

      <TextField
        name="organizationDetails.description"
        label="Description"
        required
        textarea
        descriptionPosition="above"
        description={
          <>
            In <strong>English</strong>, please briefly describe the scope of your
            institution/organization in relation to GBIF's mission (e.g. collection holdings,
            research focus, biodiversity information management, etc.). This description will appear
            on your publisher page. You may also wish to include a version in another language, but
            English is required.
          </>
        }
      />
    </div>
  );
}
