
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import * as cssDataset from '../styles';
import { join } from '../../../utils/util';
import LiteratureSearch from '../../../search/LiteratureSearch/LiteratureSearch';

import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";

export function Activity({
  dataset,
  className,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  return <div css={css.people({ theme })}>
    <nav css={css.nav({ theme })}>
      <ul>
        <li>
          <NavLink to={url} exact activeClassName="isActive" css={css.navItem({ theme })}>Downloads<span css={cssDataset.tabCountChip()}>{10}</span></NavLink>
        </li>
        <li>
          <NavLink to={join(url, '/citations')} activeClassName="isActive" css={css.navItem({ theme })}>Citations<span css={cssDataset.tabCountChip()}>{20}</span></NavLink>
        </li>
      </ul>
    </nav>
    <div style={{ width: '100%', margin: 24, overflow: 'hidden' }}>
      <Switch>
        <Route path={join(path, '/citations')}>
          {/* <Citations id={dataset.key} /> */}
          {/* <div>citation search of the citations</div> */}
          <LiteratureSearch style={{ margin: 'auto', maxWidth: '100%', minHeight: 'calc(90vh)' }}></LiteratureSearch>;
        </Route>

        <Route path={path}>
          {/* <Downloads id={dataset.key} /> */}
          <div>list of downloads</div>
        </Route>
      </Switch>
    </div>
  </div>
};
