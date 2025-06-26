import { ParticipantSelect, ValidParticipant } from '@/components/select/participantSelect';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useConfig } from '@/config/config';
import { NodeType, ParticipationStatus } from '@/gql/graphql';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem } from '../../_shared';
import { Inputs } from '../becomeAPublisherForm';
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
  const config = useConfig();

  return (
    <>
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="eoi.pleaseCheckSuggestionBelow"
          defaultMessage="To support publishers and review data quality all publishers are associated with a GBIF
        node. Please check the suggestion below, and correct it if needed:"
        />
      </p>

      <FormField
        control={form.control}
        name="endorsingNode"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <RadioGroup onValueChange={field.onChange} className="g-flex g-flex-col g-space-y-1">
                {!suggestedNodeCountry && (
                  <RadioItem
                    value="other"
                    label={
                      <FormattedMessage
                        id="eoi.helpMeWithEndorsement"
                        defaultMessage="Help me with endorsement"
                      />
                    }
                  />
                )}

                {suggestedNodeCountry && (
                  <RadioItem
                    value={suggestedNodeCountry.key}
                    label={
                      <span>
                        {suggestedNodeCountry.title}{' '}
                        <span className="g-text-xs g-font-semibold g-text-primary-600">
                          <FormattedMessage id="eoi.suggested" defaultMessage="Suggested" />
                        </span>
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
                  value={config.hardcodedKeys.OBISKey}
                  label={
                    <FormattedMessage
                      id="eoi.marineDataPublishers"
                      defaultMessage="Marine data publishers: request endorsement for OBIS (Ocean Biogeographic Information System) related data"
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="g-pb-2 g-pt-4 g-text-sm">
        <FormattedMessage
          id="eoi.orSelectAnotherAssOrg"
          defaultMessage="If endorsement through the country node suggested above is not the right option, please
        check this list of associated participants for multinational or thematic networks:"
        />
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
