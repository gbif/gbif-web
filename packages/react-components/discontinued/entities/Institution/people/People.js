
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, JazzIcon, Button } from "../../../components";
import sortBy from 'lodash/sortBy';
import {
  useRouteMatch,
} from "react-router-dom";

export function People({
  institution,
  className,
  ...props
}) {
  let { path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  const test = 'institution';
  return <div css={css.people({ theme })}>
    <div style={{ width: '100%', marginBottom: 24 }}>
      <div css={css.staffList({ theme })}>
        {sortBy(institution.contacts, 'position').map(contact => {
          return <article css={css.person({ theme })}>
            <div css={css.staffImage({ theme })}>
              <JazzIcon seed={contact.email || contact.key} />
            </div>
            <div css={css.staffDesc({ theme })}>
              <h4>{contact.firstName} {contact.lastName}</h4>
              <div css={css.staffPosition({ theme })}>{contact.position}</div>
              {contact.researchPursuits && <div>Research pursuits: {contact.researchPursuits}</div>}
              {/* <div>Associated with <a href="/staff/123">3 institutions</a></div> */}
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
    </div>
  </div>
};
