/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter, cssViews, cssFooter } from '../Layout.styles';
import { Tabs } from '../../components'
import Map from './views/Map';
import Table from './views/Table';
import Gallery from './views/Gallery';
import Datasets from './views/Datasets';

import { FilterBar } from '../FilterBar';
import { useUrlState } from '../../dataManagement/state/useUrlState';

const { TabList, Tab, TabPanel, TapSeperator, TapSpacer } = Tabs;

const Layout = ({
  className = '',
  config,
  ...props
}) => {
  const [activeView, setActiveView] = useUrlState({ param: 'view', defaultValue: 'dataset' });
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'occurrenceSearchLayout';

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })}>
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
        <div css={cssViews({ theme })}>
          <TabList aria-labelledby="My tabs">
            <Tab tabId="table">Table</Tab>
            <Tab tabId="map">Map</Tab>
            <Tab tabId="gallery">Gallery</Tab>
            <TapSeperator />
            <Tab tabId="dataset">Datasets</Tab>
            {/* <Tab tabId="publisher">Publishers</Tab> */}
            <TapSpacer />
            <TapSeperator />
            <Tab tabId="test">Test</Tab>
          </TabList>
        </div>
      </div>
      {/* <a href={`http://labs.gbif.org:7022/query-example?queryId=${queryId}&variablesId=${variableId}`}>graphql</a> */}
      <TabPanel lazy tabId="table" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Table />
      </TabPanel>
      <TabPanel lazy tabId="map" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Map />
      </TabPanel>
      <TabPanel lazy tabId="gallery" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Gallery />
      </TabPanel>
      <TabPanel lazy tabId="dataset" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Datasets />
      </TabPanel>
      <div className={`${prefix}-${elementName}-footer`} css={cssFooter({ theme })}>
        <div>Footer content</div>
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);