import { ParticipantSelect } from '@/components/select/participantSelect';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';

export function PrimaryContact() {
  const form = useFormContext<Partial<Inputs>>();
  const [participant, setParticipant] = useState();

  useEffect(() => {
    // console.log(participant);
    form.setValue('participantTitle', participant?.name || '');
    form.setValue('participantCountry', participant?.country || '');
  }, [participant]);

  return (
    <>
      <FormField
        control={form.control}
        name="person_name"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField
                required
                name="person_name"
                label={<FormattedMessage id="mdt.person_name" defaultMessage="Name" />}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <TextField
                required
                name={`email`}
                label={<FormattedMessage id="mdt.email" defaultMessage="Email" />}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <div className="g-mt-4">
        <p>Please select which participant node this application relates to.</p>
        <ParticipantSelect
          selected={participant}
          onChange={(participant) => {
            setParticipant(participant);
          }}
          filters={{}}
        />
      </div>
    </>
  );
}
