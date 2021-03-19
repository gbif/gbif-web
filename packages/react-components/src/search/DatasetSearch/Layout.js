
import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from '../Layout.styles';
import { Tabs } from '../../components'
import Table from './views/Table';
import { FilterBar } from '../FilterBar';

const { TabList, Tab, TabPanel } = Tabs;

const Layout = ({
  className = '',
  config,
  ...props
}) => {
  const [activeView, setActiveView] = useState('list');
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'datasetSearchLayout';
  
  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })}>
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
      </div>
      <TabPanel lazy tabId="list" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Table />
      </TabPanel>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);