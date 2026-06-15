import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterSequenceConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { parseSequenceFilterValue } from '@/utils/sequenceSearch';

export const nucleotideSequenceIdConfig: filterSequenceConfig = {
  filterType: filterConfigTypes.SEQUENCE,
  filterHandle: 'nucleotideSequenceId',
  displayName: IdentityLabel,
  filterTranslation: 'filters.nucleotideSequenceId.name',
  // Don't render the value as the button label; show the number of unique matched
  // nucleotideSequenceIDs across the selected bins. The IDs are injected into the
  // in-memory filter value by useSequenceAugmentedFilter (as `ids`); the count appears
  // once the sequence has resolved.
  filterButtonProps: {
    hideSingleValues: true,
    getCount: (filter) => {
      const value = parseSequenceFilterValue(filter?.must?.nucleotideSequenceId?.[0]);
      return value?.ids?.length ?? 0;
    },
  },
  about: () => <Message id="filters.nucleotideSequenceId.description" />,
  group: 'nucleotideSequence',
};
