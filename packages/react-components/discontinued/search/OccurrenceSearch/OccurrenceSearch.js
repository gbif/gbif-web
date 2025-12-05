// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement

import { jsx } from '@emotion/react';
import React, { useMemo, useContext } from 'react';
import { useIntl } from 'react-intl';
import ComponentLayout from './Layout';
import PageLayout from './PageLayout';
import { FilterState } from "../../widgets/Filter/state";
import { ErrorBoundary, Root } from "../../components";
import OccurrenceContext from '../SearchContext';
import LocaleContext from '../../dataManagement/LocaleProvider/LocaleContext';
import { ApiContext } from '../../dataManagement/api';
import predicateConfig from './config/predicateConfig';
import ThemeContext from '../../style/themes/ThemeContext';
import { useFilterParams } from '../../dataManagement/state/useFilterParams';
import defaultFilterConfig from './config/filterConf';
import { tableConfig } from './config/tableConfig';
import { buildConfig } from '../buildSearchConfig';
import hash from 'object-hash';


function OccurrenceSearch({ config: customConfig = {}, pageLayout, ...props }) {
  const theme = useContext(ThemeContext);
  const localeSettings = useContext(LocaleContext);
  const [filter, setFilter] = useFilterParams({predicateConfig});

  const Layout = pageLayout ? PageLayout : ComponentLayout;

  const apiContext = useContext(ApiContext);
  const intl = useIntl();
  const enrichedConfig = useMemo(() => {
    return buildConfig({
      customConfig: {
        tableConfig,
        ...customConfig
      },
      predicateConfig,
      defaultFilterConfig
    }, { client: apiContext, formatMessage: intl.formatMessage, localeSettings });
  }, [apiContext, intl, localeSettings, hash(customConfig)]);

  return (
    <Root dir={theme.dir}>
      <OccurrenceContext.Provider value={enrichedConfig}>
        <FilterState filter={filter || {}} onChange={setFilter}>
          <Layout config={enrichedConfig} {...props} tabs={customConfig.occurrenceSearchTabs}></Layout>
        </FilterState>
      </OccurrenceContext.Provider>
    </Root>
  );
}

export default props => <ErrorBoundary><OccurrenceSearch {...props} /></ErrorBoundary>;
