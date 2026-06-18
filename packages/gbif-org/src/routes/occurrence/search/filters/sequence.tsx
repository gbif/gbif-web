import { filterConfigTypes, filterSequenceConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import { parseSequenceFilterValue, summariseSelectedBins } from '@/utils/sequenceSearch';
import { FormattedMessage } from 'react-intl';

// Chip value label: describes the selected identity intervals. A merged range when the ticked
// bins are consecutive (e.g. "99 to 100 %"), or just the exact value for the 100% bin. When
// the selection is not consecutive, getCount returns the count so FilterButton renders a badge
// instead of this label.
function SequenceSimilarityLabel({ id }: { id: string | number | object }) {
  const value = parseSequenceFilterValue(id);
  const { from, to } = summariseSelectedBins(value?.selected ?? []);
  if (from === to) {
    return (
      <FormattedMessage
        id="filters.nucleotideSequenceId.similarityExact"
        defaultMessage="{value} %"
        values={{ value: from }}
      />
    );
  }
  return (
    <FormattedMessage
      id="filters.nucleotideSequenceId.similarityRange"
      defaultMessage="{from} to {to} %"
      values={{ from, to }}
    />
  );
}

export const nucleotideSequenceIdConfig: filterSequenceConfig = {
  filterType: filterConfigTypes.SEQUENCE,
  filterHandle: 'nucleotideSequenceId',
  displayName: SequenceSimilarityLabel,
  filterTranslation: 'filters.nucleotideSequenceId.name',
  // Makes the identity-bin counts in the popover reflect the other active filters (restricts a
  // facet on nucleotideSequenceID to the matched ids via `include`, scoped by the pruned filter).
  facetQuery: `
    query OccurrenceNucleotideSequenceIdFacet($q: String, $predicate: Predicate, $include: [String!], $size: Int) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: nucleotideSequenceNucleotideSequenceID(include: $include, size: $size) {
            name: key
            count
          }
        }
      }
    }
  `,
  // The chip describes the selected intervals rather than a count: consecutive bins render as a
  // single range via the displayName (count forced to 1 → FilterButton's single-value path);
  // non-consecutive bins fall back to a count badge.
  filterButtonProps: {
    hideSingleValues: false,
    getCount: (filter) => {
      const value = parseSequenceFilterValue(filter?.must?.nucleotideSequenceId?.[0]);
      const { consecutive, count } = summariseSelectedBins(value?.selected ?? []);
      if (count === 0) return 0;
      return consecutive ? 1 : count;
    },
  },
  about: () => <Message id="filters.nucleotideSequenceId.description" />,
  group: 'nucleotideSequence',
  // Sort first within the Nucleotide Sequence group (others default to 1000 and then sort
  // alphabetically).
  order: 0,
};
