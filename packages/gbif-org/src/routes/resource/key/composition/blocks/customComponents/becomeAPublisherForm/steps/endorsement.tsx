import { ParticipantSelect, ValidParticipant } from '@/components/select/participantSelect';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { useConfig } from '@/config/config';
import { NodeType, ParticipationStatus } from '@/gql/graphql';
import { Setter } from '@/types';
import { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { RadioItem } from '../../_shared';
import { Inputs } from '../becomeAPublisherForm';
import { SuggestedNodeCountry } from '../useSuggestedNodeCountry';
import { useSuggestedNonCountryNode } from '../useSuggestedNonCountryNode';

const MemoParticipantSelect = memo(ParticipantSelect);

type Props = {
  suggestedNodeCountry: SuggestedNodeCountry | undefined;
  participant: ValidParticipant | undefined;
  setParticipant: Setter<ValidParticipant | undefined>;
};

const PARTICIPANT_SELECT_FILTERS = {
  type: NodeType.Other,
  participationStatus: ParticipationStatus.Associate,
};

export function Endorsment({ suggestedNodeCountry, participant, setParticipant }: Props) {
  const form = useFormContext<Partial<Inputs>>();
  const config = useConfig();

  const { suggestedNonCountryNode, updateSuggestedNonCountryNode } = useSuggestedNonCountryNode();
  useEffect(() => {
    if (participant?.id) updateSuggestedNonCountryNode(participant?.id);
  }, [participant?.id, updateSuggestedNonCountryNode]);

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
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="g-flex g-flex-col g-space-y-1"
              >
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

      <MemoParticipantSelect
        selected={participant}
        onChange={setParticipant}
        filters={PARTICIPANT_SELECT_FILTERS}
      />
    </>
  );
}
