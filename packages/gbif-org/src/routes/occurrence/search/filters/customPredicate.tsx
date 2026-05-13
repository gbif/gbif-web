import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterCustomPredicateConfig } from '@/components/filters/filterTools';

export const customPredicateConfig: filterCustomPredicateConfig = {
  filterType: filterConfigTypes.CUSTOM_PREDICATE,
  filterHandle: 'predicate',
  displayName: IdentityLabel,
  filterTranslation: 'filters.predicate.name',
  // The value is a JSON string. Don't render it as the button label.
  filterButtonProps: {
    hideSingleValues: true,
    getCount: (filter) => {
      const must = filter?.must?.predicate ?? [];
      return must.length > 0 ? 1 : 0;
    },
  },
  group: 'other',
};
