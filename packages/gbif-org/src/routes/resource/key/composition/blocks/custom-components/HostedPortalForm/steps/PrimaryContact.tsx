import { TextField } from '../HostedPortalForm';

export function PrimaryContact() {
  return (
    <div className="flex gap-4">
      <TextField name="primaryContact.name" label="Name" required />

      <TextField name="primaryContact.email" label="Email" required />
    </div>
  );
}
