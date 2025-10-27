import { Tabs } from '@/components/tabs';
import { FilterContext } from '@/contexts/filter';
import { useUpdateViewParams } from '@/hooks/useUpdateViewParams';
import { useContext } from 'react';
import { allFilters, orderedTabs, tabsConfig } from './tabsConfig';
import { FormattedMessage } from 'react-intl';

type Props = {
  activeTab: string;
  defaultTab: string;
};

export function ResourceSearchTabs({ activeTab, defaultTab }: Props): React.ReactElement {
  const { getParams } = useUpdateViewParams(['from', 'sort', 'limit', 'offset'], 'contentType'); // Removes 'from' and 'sort'
  const { filter } = useContext(FilterContext);

  const filterIsActive = (filterHandle: string) =>
    filter?.must?.[filterHandle] || filter?.mustNot?.[filterHandle];
  const activeFilters = allFilters.filter(filterIsActive);

  return (
    <Tabs
      disableAutoDetectActive
      className="g-border-none"
      links={orderedTabs
        .filter(
          (tab) =>
            activeFilters.length === 0 ||
            activeFilters.some((activeFilter) => tabsConfig[tab].filters.includes(activeFilter))
        )
        .map((tab) => ({
          isActive: activeTab === tab,
          to: { search: getParams(tab, defaultTab).toString() },
          children: <FormattedMessage id={tabsConfig[tab].tabKey} defaultMessage={tab} />,
        }))}
    />
  );
}
