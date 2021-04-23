
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import * as cssCollection from '../styles';
// import { Properties } from "../../../components";
import { Collectors } from './collectors';
import { join } from '../../../utils/util';

import sortBy from 'lodash/sortBy';
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";

export function People({
  collection,
  recordedByCardinality,
  className,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  const test = 'collection';
  return <div css={css.people({ theme })}>
    <nav css={css.nav({ theme })}>
      <ul>
        <li>
          <NavLink to={url} exact activeClassName="isActive" css={css.navItem({ theme })}>Staff<span css={cssCollection.tabCountChip()}>{collection.contacts?.length}</span></NavLink>
        </li>
        <li>
          <NavLink to={join(url, '/agents')} activeClassName="isActive" css={css.navItem({ theme })}>Collectors and identifiers<span css={cssCollection.tabCountChip()}>{recordedByCardinality}</span></NavLink>
        </li>
      </ul>
    </nav>
    <div style={{ width: '100%', margin: 24 }}>
      <Switch>


        <Route path={join(path, '/agents')}>
          <Collectors id={collection.key} />
        </Route>

        <Route path={path}>
          {collection?.contacts?.length === 0 && <div>
            There is no staff associated with this record. You can change that. <a herf="">Learn more</a>
          </div>}
          <div css={css.staffList({ theme })}>
            {sortBy(collection.contacts, 'position').map(contact => {
              return <article css={css.person({ theme })}>
                {/* <div css={css.staffImage({ theme })}>
                  <JazzIcon seed={contact.email || contact.key} />
                </div> */}
                <div css={css.staffDesc({ theme })}>
                  <a href={`staff/${contact.key}`}><h4>{contact.firstName} {contact.lastName}</h4></a>
                  <div css={css.staffPosition({ theme })}>{contact.position}</div>
                  {contact.researchPursuits && <div>Research pursuits: {contact.researchPursuits}</div>}
                  {/* <div>Associated with <a href="/staff/123">3 collections</a></div> */}
                </div>
                <div css={css.staffContact({ theme })}>
                  <div>
                    {contact.email && <div>{contact.email}</div>}
                    {contact.phone && <div>{contact.phone}</div>}
                    {contact.fax && <div>{contact.fax}</div>}
                  </div>
                  {/* <Button as="a" href="/staff/123">More</Button> */}
                </div>
              </article>
            })}
          </div>
        </Route>
      </Switch>
    </div>
  </div>
};
