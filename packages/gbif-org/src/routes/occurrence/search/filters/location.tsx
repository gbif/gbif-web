import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterLocationConfig } from '@/components/filters/filterTools';
import { HelpText } from '@/components/helpText';

export const locationConfig: filterLocationConfig = {
  filterType: filterConfigTypes.LOCATION,
  filterHandle: 'geometry',
  displayName: IdentityLabel,
  filterTranslation: 'filters.geometry.name',
  filterButtonProps: {
    hideSingleValues: true,
    getCount: (filter) => {
      let count = filter?.must?.geometry?.length || 0;
      if (filter?.must?.hasCoordinate !== undefined) count++;
      if (filter?.must?.hasGeospatialIssue !== undefined) count++;
      return count;
    }
  },
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};