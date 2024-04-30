import { useFormContext } from 'react-hook-form';
import { Inputs } from '../BecomeAPublisherForm';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioItem } from '../../_shared';
import { NodeType, ParticipationStatus } from '@/gql/graphql';
import { ParticipantSelect, ValidParticipant } from '@/components/Select/ParticipantSelect';
import { useState } from 'react';
import { SuggestedNodeCountry } from '../useSuggestedNodeCountry';

type Props = {
  suggestedNodeCountry: SuggestedNodeCountry | undefined;
};

const PARTICIPANT_SELECT_FILTERS = {
  type: NodeType.Other,
  participationStatus: ParticipationStatus.Associate,
};

export function Endorsment({ suggestedNodeCountry }: Props) {
  const form = useFormContext<Partial<Inputs>>();
  const [participant, setParticipant] = useState<ValidParticipant | undefined>();

  return (
    <>
      <p className="pb-2 text-sm">
        To support publishers and review data quality all publishers are associated with a GBIF
        node. Please check the suggestion below, and correct it if needed:
      </p>

      <FormField
        control={form.control}
        name="endorsingNode"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="flex flex-col space-y-1">
                {!suggestedNodeCountry && (
                  <RadioItem value="help_me_with_endorsement" label="Help me with endorsement" />
                )}

                {suggestedNodeCountry && (
                  <RadioItem
                    value={suggestedNodeCountry.key}
                    label={
                      <span>
                        {suggestedNodeCountry.title}{' '}
                        <span className="text-xs font-semibold text-primary-600">Suggested</span>
                      </span>
                    }
                  />
                )}

                {participant && <RadioItem value={participant.id} label={participant.name} />}

                <RadioItem
                  value="marine_data_publishers"
                  label="Marine data publishers: request endorsement for OBIS (Ocean Biogeographic Information System) related data"
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="pb-2 pt-4 text-sm">
        If endorsement through the country node suggested above is not the right option, please
        check this list of associated participants for multinational or thematic networks:
      </p>

      <ParticipantSelect
        selected={participant}
        onChange={setParticipant}
        filters={PARTICIPANT_SELECT_FILTERS}
      />
    </>
  );
}
