/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React, { useState, useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFooter, cssFilter, cssViews } from './Layout.styles';
import { Tabs } from '../../components'
import Map from './views/Map';
import Table from './views/Table';
import Gallery from './views/Gallery';

import { FilterBar } from './FilterBar';

const { TabList, Tab, TabPanel } = Tabs;

const Layout = ({
  className = '',
  ...props
}) => {
  const [activeView, setActiveView] = useState('table');
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'occurrenceSearchLayout';
  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} {...props}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })}>
        <div css={cssFilter({ theme })}>
          <FilterBar></FilterBar>
        </div>
        <div css={cssViews({ theme })}>
          <TabList aria-labelledby="My tabs">
            <Tab tabId="table">Table</Tab>
            <Tab tabId="map">Map</Tab>
            <Tab tabId="gallery">Gallery</Tab>
          </TabList>
        </div>
      </div>
      <TabPanel lazy tabId="table" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Table />
      </TabPanel>
      <TabPanel lazy tabId="map" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Map />
      </TabPanel>
      <TabPanel lazy tabId="gallery" className={`${prefix}-${elementName}-views`} css={cssViewArea({ theme })}>
        <Gallery />
      </TabPanel>

      {/* <div className={`${prefix}-${elementName}-body`}>
      <div className={`${prefix}-${elementName}-main`}>content {props.test}<br />
      <FormattedMessage
                id='pagination.pageXofY'
                defaultMessage={'Loading'}
                values={{ current: <FormattedNumber value={10}/>, total: <FormattedNumber value={20000}/> }}
              />
      </div>
      <aside className={`${prefix}-${elementName}-drawer`}>right drawer</aside>
    </div> */}
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