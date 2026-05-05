import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterHumboldtBooleansConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import set from 'lodash/set';

const terms = [
  'humboldtAreNonTargetTaxaFullyReported',
  'humboldtHasMaterialSamples',
  'humboldtHasNonTargetOrganisms',
  'humboldtHasNonTargetTaxa',
  'humboldtHasVouchers',
  'humboldtIsAbsenceReported',
  'humboldtIsAbundanceCapReported',
  'humboldtIsAbundanceReported',
  'humboldtIsDegreeOfEstablishmentScopeFullyReported',
  'humboldtIsGrowthFormScopeFullyReported',
  'humboldtIsLeastSpecificTargetCategoryQuantityInclusive',
  'humboldtIsLifeStageScopeFullyReported',
  'humboldtIsSamplingEffortReported',
  'humboldtIsTaxonomicScopeFullyReported',
  'humboldtIsVegetationCoverReported',
];

export const humboldtBooleansConfig: filterHumboldtBooleansConfig = {
  filterType: filterConfigTypes.HUMBOLDT_BOOLEANS,
  filterHandle: 'humboldtBooleans',
  displayName: IdentityLabel,
  filterTranslation: 'filters.humboldtBooleans.name',
  filterButtonProps: {
    hideSingleValues: true,
    getCount: (filter) =>
      terms.reduce((agg, cur) => (filter?.must?.[cur] !== undefined ? agg + 1 : agg), 0),
    onClear: (filterContext) => {
      // instead of setting the fields individually we update the whole filter.
      // Else we will update the old object
      const newFilter = JSON.parse(JSON.stringify(filterContext.filter ?? {}));
      terms.forEach((term) => {
        set(newFilter, `must.${term}`, []);
      });

      filterContext.setFilter(newFilter);
    },
  },
  about: () => <Message id="filters.humboldtBooleans.description" />,
  group: 'other',
};
