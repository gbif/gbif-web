
import { jsx } from '@emotion/react';
import React, { useState, useContext } from 'react';
import ThemeContext from '../style/themes/ThemeContext';
// import PropTypes from 'prop-types';
import { withFilter } from '../widgets/Filter/state';
// import { FormattedMessage, FormattedNumber } from 'react-intl';
import { cssLayout, cssNavBar, cssViewArea, cssFilter } from './Layout.styles';
import { Tabs, DataHeader, NavBar, NavItem } from '../components'
import { FilterBar } from './FilterBar';

const { TabList, Tab, TabPanel } = Tabs;

const Layout = ({
  className = '',
  config,
  Table,
  style,
  ...props
}) => {
  const [activeView, setActiveView] = useState('list');
  const theme = useContext(ThemeContext);
  const prefix = theme.prefix || 'gbif';
  const elementName = 'searchLayout';

  return <div className={`${className} ${prefix}-${elementName}`}
    css={cssLayout({ theme })} style={style}>
    <Tabs activeId={activeView} onChange={setActiveView} >
      <div css={cssNavBar({ theme })}>
        <div css={cssFilter({ theme })}>
          <FilterBar config={config}></FilterBar>
        </div>
      </div>
      <div css={cssViewArea({ theme })}>
        <Table />
      </div>
    </Tabs>
  </div>
}

Layout.propTypes = {
}

const mapContextToProps = ({ test }) => ({ test });
export default withFilter(mapContextToProps)(Layout);