
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, JazzIcon, Button } from "../../../components";
import { Collectors } from './collectors';
import { removeTrailingSlash, join } from '../../../utils/util';
import sortBy from 'lodash/sortBy';
import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";

const { Term: T, Value: V } = Properties;

export function People({
  collection,
  className,
  ...props
}) {
  let { path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  const test = 'collection';
  return <div css={css.people({ theme })}>
    <nav css={css.nav({ theme })}>
      <ul>
        <li>
          <NavLink to={path} exact activeClassName="isActive" css={css.navItem({ theme })}>Staff</NavLink>
        </li>
        <li>
          <NavLink to={`${removeTrailingSlash(path)}/agents`} activeClassName="isActive" css={css.navItem({ theme })}>Collectors and identifiers</NavLink>
        </li>
      </ul>
    </nav>
    <div style={{ width: '100%', marginBottom: 24 }}>
      <Switch>


        <Route path={`${removeTrailingSlash(path)}/agents`}>
          <Collectors id={collection.key} />
        </Route>

        <Route path={path}>
          <div css={css.staffList({ theme })}>
            {sortBy(collection.contacts, 'position').map(contact => {
              return <article css={css.person({ theme })}>
                <div css={css.staffImage({ theme })}>
                  <JazzIcon seed={contact.email || contact.key} />
                </div>
                <div css={css.staffDesc({ theme })}>
                  <h4>{contact.firstName} {contact.lastName}</h4>
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
                  <Button as="a" href="/staff/123">See profile</Button>
                </div>
              </article>
            })}
          </div>
        </Route>
      </Switch>
    </div>
  </div>
};
