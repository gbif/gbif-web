import { TextField } from '../HostedPortalForm';

export function HostedPortalName() {
  return (
    <TextField
      description="Please provide the name you wish to use for your hosted portal"
      name="hostedPortalName"
    />
  );
}
