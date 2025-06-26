import usePrevious from '@/hooks/usePrevious';
import { cn } from '@/utils/shadcn';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CheckboxField, Inputs, TextField } from '../becomeAPublisherForm';
export function Contacts() {
  return (
    <>
      <p className="g-text-sm g-pt-2">
        <FormattedMessage
          id="eoi.weNeedToKnowHowToKeepInTouchWithYou"
          defaultMessage="We need to know how to keep in touch with you."
        />
      </p>

      <ContactForm contact="mainContact" />

      <p className="g-pt-4 g-text-sm">
        <FormattedMessage
          id="eoi.peopleMoveOn"
          defaultMessage="Please add at least one alternate contact, and consider using a generic email e.g.
          helpdesk@a.com that will always reach an appropriate person."
        />
      </p>

      <div className="g-flex g-gap-4 g-pt-4">
        <CheckboxField
          name="extraContacts.administrative"
          label={
            <FormattedMessage
              id="eoi.addAdministrativeContact"
              defaultMessage="Add administrative contact"
            />
          }
        />
        <CheckboxField
          name="extraContacts.technical"
          label={
            <FormattedMessage id="eoi.addTecnicalContact" defaultMessage="Add technical contact" />
          }
        />
      </div>

      <AdministrativeContact />
      <TechnicalContact />
    </>
  );
}

function AdministrativeContact() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !form.watch('extraContacts.administrative');
  const previousHidden = usePrevious(hidden);

  // Unregister the field if hidden. If not the validation will fail as the otherwise optional object is filled with invalid values
  useEffect(() => {
    if (!previousHidden && hidden) form.unregister('administrativeContact');
  }, [previousHidden, hidden, form]);

  if (hidden) return null;

  return (
    <div className={cn('g-pt-4', { hidden })}>
      <p className="g-text-md g-font-semibold">
        <FormattedMessage id="eoi.administrativeContact" defaultMessage="Administrative Contact" />
      </p>

      <p className="g-text-sm g-py-1">
        <FormattedMessage
          id="eoi.whoCanWeApproachForQuestions"
          defaultMessage="Who can we approach for questions about your organization, for example how you appear on our web pages, data licensing issues etc."
        />
      </p>

      <ContactForm contact="administrativeContact" />
    </div>
  );
}

function TechnicalContact() {
  const form = useFormContext<Partial<Inputs>>();
  const hidden = !form.watch('extraContacts.technical');
  const previousHidden = usePrevious(hidden);

  // Unregister the field if hidden. If not the validation will fail as the otherwise optional object is filled with invalid values
  useEffect(() => {
    if (!previousHidden && hidden) form.unregister('technicalContact');
  }, [previousHidden, hidden, form]);

  if (hidden) return null;

  return (
    <div className={cn('g-pt-4', { hidden })}>
      <p className="g-text-md g-font-semibold">
        <FormattedMessage id="eoi.technicalContact" defaultMessage="Technical Contact" />
      </p>

      <p className="g-text-sm g-py-1">
        <FormattedMessage
          id="eoi.techContactDescription"
          defaultMessage="Who can we approach for technical information such as sending passwords to register data publishing tools?"
        />
      </p>

      <ContactForm contact="technicalContact" />
    </div>
  );
}

type ContactType = 'mainContact' | 'administrativeContact' | 'technicalContact';

function ContactForm({ contact }: { contact: ContactType }) {
  const autoCompletes: Record<string, string> = {};
  if (contact === 'mainContact') {
    autoCompletes.firstName = 'given-name';
    autoCompletes.lastName = 'family-name';
    autoCompletes.email = 'email';
    autoCompletes.phone = 'tel';
  }

  return (
    <div className="g-flex g-flex-col g-gap-4">
      <div className="g-flex g-gap-4">
        <TextField
          autoComplete={autoCompletes?.firstName}
          name={`${contact}.firstName`}
          label={<FormattedMessage id="eoi.firstName" defaultMessage="First name" />}
          required
        />

        <TextField
          autoComplete={autoCompletes?.lastName}
          name={`${contact}.lastName`}
          label={<FormattedMessage id="eoi.lastName" defaultMessage="Last name" />}
          required
        />
      </div>

      <div className="g-flex g-gap-4">
        <TextField
          autoComplete={autoCompletes?.email}
          required
          name={`${contact}.email`}
          label={<FormattedMessage id="eoi.email" defaultMessage="Email" />}
        />

        <TextField
          autoComplete={autoCompletes?.phone}
          name={`${contact}.phone`}
          label={<FormattedMessage id="eoi.phone" defaultMessage="Phone" />}
          description={
            <FormattedMessage
              id="eoi.rememberToPrefixWithCountryCode"
              defaultMessage="Please include country code, e.g. +45 1234 5678"
            />
          }
          descriptionPosition="below"
        />
      </div>
    </div>
  );
}
