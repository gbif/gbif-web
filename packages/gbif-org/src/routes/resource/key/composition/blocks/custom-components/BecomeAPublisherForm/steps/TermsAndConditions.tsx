import { CheckboxField } from '../BecomeAPublisherForm';
import { DynamicLink } from '@/components/dynamicLink';

export function TermsAndConditions() {
  return (
    <div className="g-space-y-4 g-pt-2">
      <CheckboxField
        name="termsAndConditions.dataPublishederAgreement"
        label={
          <>
            I have read and understood{' '}
            <DynamicLink className="g-underline" to="/terms/data-publisher">
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
