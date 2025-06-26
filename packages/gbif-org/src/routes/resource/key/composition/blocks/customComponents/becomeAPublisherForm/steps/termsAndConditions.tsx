import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import { CheckboxField } from '../becomeAPublisherForm';
import styles from './style.module.css';
export function TermsAndConditions() {
  return (
    <div className="g-space-y-4 g-pt-2">
      <CheckboxField
        name="termsAndConditions.dataPublishederAgreement"
        className={cn(`${styles.endorsementFormLabel}`)}
        label={
          <FormattedMessage
            id="eoi.iHaveReadAndUnderstood"
            defaultMessage="I have read and understood GBIF's Data Publisher Agreement and agree to its terms."
          >
            {(data) => <span dangerouslySetInnerHTML={{ __html: data }}></span>}
          </FormattedMessage>
        }
      />

      <CheckboxField
        name="termsAndConditions.confirmRegistration"
        label={
          <FormattedMessage
            id="eoi.iUnderstandThatIAmSeekingRegistrationOnBehalf"
            defaultMessage="I understand that I am seeking registration on behalf of my organization, and confirm that the responsible authorities of my organization are aware of this registration."
          />
        }
      />

      <CheckboxField
        name="termsAndConditions.dataWillBePublic"
        label={
          <FormattedMessage
            id="eoi.iUnderstandThatMyOrganizationalInformation"
            defaultMessage="I understand that my organizational information, including the contact details provided, will be made publicly available through GBIF.org."
          />
        }
      />
    </div>
  );
}
