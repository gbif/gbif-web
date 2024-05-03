import { Required } from '../../_shared';
import { TextField } from '../HostedPortalForm';

export function HostedPortalName() {
  return (
    <TextField
      name="hostedPortalName"
      label={
        <span className="text-md font-semibold">
          2. Hosted portal name
          <Required />
        </span>
      }
    />
  );
}
