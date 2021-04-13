
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, JazzIcon, Button } from "../../../components";
import { CollectorsPresentation } from './collectors';

const { Term: T, Value: V } = Properties;

export function People({
  data = {},
  loading,
  error,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const { occurrence } = data;
  // if (loading || !occurrence) return <h1>Loading</h1>;


  return <div css={css.people({theme})}>
    <nav css={css.nav({theme})}>
      <ul>
        <li css={css.navItem({theme, isActive: true})}>Staff</li>
        <li css={css.navItem({theme})}>Collectors and identifiers</li>
      </ul>
    </nav>
    <div css={css.staffList({ theme })}>
      <article css={css.person({ theme })}>
        <div css={css.staffImage({ theme })}>
          <JazzIcon seed="jfranklin@gmail.com"/>
        </div>
        <div css={css.staffDesc({ theme })}>
          <h4>Jane Franklin</h4>
          <div css={css.staffPosition({ theme })}>Curator</div>
          <div>Research area: Magnolia and tropical flowers</div>
          <div>Associated with <a href="/staff/123">3 collections</a></div>
        </div>
        <div css={css.staffContact({ theme })}>
          <div>
            <div>jfranklin@gmail.com</div>
            <div>+45 234876 2347</div>
          </div>
          <Button as="a" href="/staff/123">See profile</Button>
        </div>
      </article>
      <article css={css.person({ theme })}>
        <div css={css.staffImage({ theme })}>
          <JazzIcon seed="peterd@gmail.com"/>
        </div>
        <div css={css.staffDesc({ theme })}>
          <h4>Peter Desmet</h4>
          <div css={css.staffPosition({ theme })}>Curator</div>
          <div>Research area: Magnolia and tropical flowers</div>
        </div>
        <div css={css.staffContact({ theme })}>
          <div>
            <div>jfranklin@gmail.com</div>
          </div>
          <Button as="a" href="/staff/123">See profile</Button>
        </div>
      </article>

      <div>
        <CollectorsPresentation />
      </div>
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
