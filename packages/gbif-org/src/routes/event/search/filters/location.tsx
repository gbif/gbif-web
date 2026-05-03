import { IdentityLabel } from '@/components/filters/displayNames';
import { filterConfigTypes, filterLocationConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import set from 'lodash/set';

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
    },
    onClear: (filterContext) => {
      // instead of setting the fields individually we update the whole filter.
      // Else we will update the old object
      const newFilter = JSON.parse(JSON.stringify(filterContext.filter ?? {}));
      set(newFilter, `must.hasGeospatialIssue`, []);
      set(newFilter, `must.hasCoordinate`, []);
      set(newFilter, `must.geometry`, []);
      filterContext.setFilter(newFilter);
    },
  },
  about: () => <Message id="filters.geometry.description" />,
  group: 'location',
};
