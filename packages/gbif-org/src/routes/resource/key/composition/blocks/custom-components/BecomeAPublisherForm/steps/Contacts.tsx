import { useFormContext } from 'react-hook-form';
import { CheckboxField, Inputs, TextField } from '../BecomeAPublisherForm';
import { useEffect } from 'react';
import { cn } from '@/utils/shadcn';
import usePrevious from '@/hooks/usePrevious';

export function Contacts() {
  return (
    <>
      <p className="text-sm pt-2">We need to know how to keep in touch with you.</p>

      <ContactForm contact="mainContact" />

      <p className="pt-4 text-sm">
        Please add at least one alternate contact, and consider using a generic email e.g.
        helpdesk@a.com that will always reach an appropriate person.
      </p>

      <div className="flex gap-4 pt-4">
        <CheckboxField name="extraContacts.administrative" label="Add administrative contact" />
        <CheckboxField name="extraContacts.technical" label="Add technical contact" />
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
    <div className={cn('pt-4', { hidden })}>
      <p className="text-md font-semibold">Administrative Contact</p>

      <p className="text-sm py-1">
        Who can we approach for questions about your organization, for example how you appear on our
        web pages, data licensing issues etc.
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
    <div className={cn('pt-4', { hidden })}>
      <p className="text-md font-semibold">Technical contact</p>

      <p className="text-sm py-1">
        Who can we approach for technical information such as sending passwords to register data
        publishing tools?
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
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <TextField
          autoComplete={autoCompletes?.firstName}
          name={`${contact}.firstName`}
          label="First name"
          required
        />

        <TextField
          autoComplete={autoCompletes?.lastName}
          name={`${contact}.lastName`}
          label="Last name"
          required
        />
      </div>

      <div className="flex gap-4">
        <TextField
          autoComplete={autoCompletes?.email}
          required
          name={`${contact}.email`}
          label="Email"
        />

        <TextField
          autoComplete={autoCompletes?.phone}
          name={`${contact}.phone`}
          label="Phone"
          description="Remember to prefix with country code"
          descriptionPosition="below"
        />
      </div>
    </div>
  );
}
