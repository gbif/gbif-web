
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, JazzIcon, Button } from "../../../components";
import { Collectors } from './Collectors';
import { removeTrailingSlash, join } from '../../../utils/util';
import sortBy from 'lodash/sortBy';
import {
  Switch,
  Route,
  Link,
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
          <Link to={path} css={css.navItem({ theme, isActive: true })}>Staff</Link>
        </li>
        <li>
          <Link to={`${removeTrailingSlash(path)}/agents`} css={css.navItem({ theme, isActive: true })}>Collectors and identifiers</Link>
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

function getPlain(collection, fieldName) {
  return <><T>{fieldName}</T><V>{collection[fieldName] ? collection[fieldName] : <span style={{ color: '#aaa' }}>Not provided</span>}</V></>
}

const collection = {
  "key": "1d1393bd-7edd-46fe-a224-ac8ff8e38402",
  "code": "Crustacea - SMF",
  "name": "Crustacea - SMF",
  "description": "worldwide Crustacea Collection in Senckenberg Research Institute (SMF) Frankfurt am Main, Germany",
  "contentTypes": [
    "BIOLOGICAL_PRESERVED_ORGANISMS"
  ],
  "active": true,
  "personalCollection": false,
  "email": [
    "info_sesam@senckenberg.de"
  ],
  "phone": [
    "+49 69 7542-1369"
  ],
  "homepage": "https://www.senckenberg.de/de/institute/senckenberg-gesellschaft-fuer-naturforschung-frankfurt-main/abt-marine-zoologie/sekt-crustaceen/crustaceen-sammlung/",
  "catalogUrl": "https://search.senckenberg.de",
  "preservationTypes": [
    "STORAGE_INDOORS",
    "STORAGE_FROZEN_MINUS_20",
    "SAMPLE_DRIED"
  ],
  "accessionStatus": "INSTITUTIONAL",
  "institutionKey": "16946ec1-8db3-45b8-b084-7644384cc5f5",
  "mailingAddress": {
    "key": 41844,
    "address": "Senckenberganlage 25",
    "city": "Frankfurt am Main",
    "province": "Hessen",
    "postalCode": "60325",
    "country": "DE"
  },
  "address": {
    "key": 41843,
    "address": "Mertonstraße 17-21",
    "city": "Frankfurt am Main",
    "province": "Hessen",
    "postalCode": "60325",
    "country": "DE"
  },
  "createdBy": "info_sesam",
  "modifiedBy": "info_sesam",
  "created": "2021-03-02T14:03:06.887+00:00",
  "modified": "2021-03-03T07:10:54.341+00:00",
  "tags": [],
  "identifiers": [],
  "contacts": [],
  "indexHerbariorumRecord": false,
  "numberSpecimens": 0,
  "machineTags": [],
  "taxonomicCoverage": "Animalia - Arthropoda - Crustacea",
  "geography": "worldwide",
  "incorporatedCollections": [],
  "importantCollectors": [],
  "collectionSummary": {},
  "alternativeCodes": [],
  "comments": [],
  "occurrenceMappings": [],
  "institutionName": "Forschungsinstitut und Natur-Museum Senckenberg",
  "institutionCode": "SMF"
};
