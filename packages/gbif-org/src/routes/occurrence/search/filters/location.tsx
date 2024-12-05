import { WildcardLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterLocationConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';

export const locationConfig: filterLocationConfig = {
  filterType: filterConfigTypes.LOCATION,
  filterHandle: 'geometry',
  displayName: WildcardLabel,
  filterTranslation: 'filters.geometry.name',
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};