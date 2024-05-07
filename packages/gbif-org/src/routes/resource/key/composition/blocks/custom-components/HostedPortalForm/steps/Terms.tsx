import { CheckboxField } from '../HostedPortalForm';

export function Terms() {
  return (
    <CheckboxField
      className="pt-2"
      name="termsAccepted"
      label="I have read the service agreement and data processor agreement and I accept these terms and conditions for the hosted portal I plan to launch."
    />
  );
}
