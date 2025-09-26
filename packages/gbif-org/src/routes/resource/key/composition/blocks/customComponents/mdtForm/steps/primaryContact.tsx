import { ParticipantSelect, ValidParticipant } from '@/components/select/participantSelect';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Inputs, TextField } from '../mdtForm';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Required } from '../../_shared';

type Props = {
  participant?: ValidParticipant;
  setParticipant: (value?: ValidParticipant) => void;
};

export function PrimaryContact({ participant, setParticipant }: Props) {
  const { control, setValue, trigger: triggerValidation } = useFormContext<Partial<Inputs>>();

  // Sync the selected participant with the form state
  useEffect(() => {
    if (participant) {
      setValue('participant', {
        title: participant.name,
        country: participant?.country ?? undefined,
      });
      triggerValidation('participant');
    } else {
      setValue('participant', undefined);
    }
  }, [setValue, triggerValidation, participant]);

  return (
    <div className="g-flex g-flex-col g-gap-4">
      <div className="g-flex g-gap-4">
        <TextField required name="person_name" label={<FormattedMessage id="mdt.personName" />} />

        <TextField required name="email" label={<FormattedMessage id="mdt.email" />} />
      </div>

      <FormField
        control={control}
        name="participant"
        render={() => (
          <FormItem className="g-flex-1">
            <FormLabel>
              <FormattedMessage id="mdt.participantLabel" />
              <Required />
            </FormLabel>
            <FormDescription>
              <FormattedMessage id="mdt.participantDescription" />
            </FormDescription>
            <FormControl>
              <ParticipantSelect selected={participant} onChange={setParticipant} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
