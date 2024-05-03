import { useFormContext } from 'react-hook-form';
import { Inputs } from '../BecomeAPublisherForm';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioItem } from '../../_shared';
import { NodeType, ParticipationStatus } from '@/gql/graphql';
import { ParticipantSelect, ValidParticipant } from '@/components/Select/ParticipantSelect';
import { useState } from 'react';
import { SuggestedNodeCountry } from '../useSuggestedNodeCountry';
import { useSuggestedNonCountryNode } from '../useSuggestedNonCountryNode';

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
  const { suggestedNonCountryNode, updateSuggestedNonCountryNode } = useSuggestedNonCountryNode();

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
                  <RadioItem value="other" label="Help me with endorsement" />
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

                {suggestedNonCountryNode && (
                  <RadioItem
                    value={suggestedNonCountryNode.key}
                    label={suggestedNonCountryNode.title}
                  />
                )}

                <RadioItem
                  value="ba0670b9-4186-41e6-8e70-f9cb3065551a"
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
        onChange={(participant) => {
          setParticipant(participant);
          updateSuggestedNonCountryNode(participant.id);
        }}
        filters={PARTICIPANT_SELECT_FILTERS}
      />
    </>
  );
}
