import { TextField } from '../HostedPortalForm';

export function Timelines() {
  return (
    <TextField
      name="timelines"
      textarea
      descriptionPosition="above"
      description="Are there any timelines you need to keep with regards to the deployment, promotion and ongoing use of the portal?"
    />
  );
}
