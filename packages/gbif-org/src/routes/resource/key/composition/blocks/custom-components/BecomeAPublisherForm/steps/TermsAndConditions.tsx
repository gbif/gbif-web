import { CheckboxField } from '../BecomeAPublisherForm';
import { DynamicLink } from '@/components/DynamicLink';

export function TermsAndConditions() {
  return (
    <div className="space-y-4 pt-2">
      <CheckboxField
        name="termsAndConditions.dataPublishederAgreement"
        label={
          <>
            I have read and understood{' '}
            <DynamicLink className="underline" to="/terms/data-publisher">
              GBIF's Data Publisher Agreement
            </DynamicLink>{' '}
            and agree to its terms.
          </>
        }
      />

      <CheckboxField
        name="termsAndConditions.confirmRegistration"
        label="I understand that I am seeking registration on behalf of my organization, and confirm that the responsible authorities of my organization are aware of this registration."
      />

      <CheckboxField
        name="termsAndConditions.dataWillBePublic"
        label="I understand that my organizational information, including the contact details provided, will be made publicly available through GBIF.org."
      />
    </div>
  );
}
