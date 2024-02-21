
import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from './Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem, ErrorBoundary } from '../components'
import { FilterBar } from './FilterBar';

const { TabList, Tab, TabPanel } = Tabs;

const Layout = ({
  className = '',
  styles = {},
  style = '',
  config,
  Table,
  ...props
}) => {
  const [activeView, setActiveView] = useState('list');
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} style={style} styles={styles}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })} style={{ margin: '0 0 10px 0', borderRadius: 0 }}>
        <DataHeader availableCatalogues={config.availableCatalogues} style={{ borderBottom: '1px solid #ddd' }} />
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
      </div>
      <div css={cssViewArea({ theme })}>
        <ErrorBoundary><Table /></ErrorBoundary>
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);