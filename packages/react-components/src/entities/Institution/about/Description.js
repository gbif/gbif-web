
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { Row, Col, Properties, Accordion, Prose, Property, ResourceLink } from "../../../components";
import { Card, CardHeader2 } from '../../shared';

const { Term: T, Value: V } = Properties;

export function Description({
  data = {},
  loading,
  error,
  institution,
  occurrenceSearch,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  return <div style={{ paddingBottom: 100 }}>
    <Card style={{ marginTop: 24, marginBottom: 24 }}>
      <CardHeader2>About</CardHeader2>
      <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
        <Property value={institution.description} labelId="grscicoll.description" showEmpty />
        <Property value={institution.code} labelId="grscicoll.code" showEmpty />
        <Property value={institution.numberSpecimens} labelId="institution.numberSpecimens" />
        {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
          return <ResourceLink type="institutionKeySpecimens" id={institution.key}>
            <FormattedNumber value={count} />
          </ResourceLink>
        }} />}
        <Property value={institution.catalogUrl} labelId="grscicoll.catalogUrl" />
        <Property value={institution.apiUrl} labelId="grscicoll.apiUrl" />
        <Property value={institution.taxonomicDescription} labelId="grscicoll.taxonomicDescription" showEmpty />
        <Property value={institution.geographicDescription} labelId="grscicoll.geographicDescription" showEmpty />
        <Property value={institution.disciplines} labelId="institution.disciplines" showEmpty formatter={e => <FormattedMessage id={`enums.discipline.${e}`} defaultMessage={e} />} />
        {institution.foundingDate && <Property labelId="grscicoll.foundingDate">
          <FormattedDate value={institution.foundingDate} year="numeric" />
        </Property>}
        <Property value={institution.additionalNames} labelId="grscicoll.additionalNames" />
        {institution.type && <Property labelId="institution.type">
          <FormattedMessage id={`enums.institutionType.${institution.type}`} defaultMessage={institution.type} />
        </Property>}
        {institution.institutionalGovernance && <Property labelId="institution.institutionalGovernance">
          <FormattedMessage id={`enums.institutionalGovernance.${institution.institutionalGovernance}`} defaultMessage={institution.institutionalGovernance} />
        </Property>}
        <Property value={institution.citesPermitNumber} labelId="grscicoll.citesPermitNumber" />
      </Properties>
    </Card>
    <Card style={{ marginTop: 24, marginBottom: 24 }}>
      <CardHeader2>Contact</CardHeader2>
      <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
        <Property value={institution?.email} labelId="grscicoll.email" linkOptions={{ email: true }} />
        <Property value={institution?.homepage} labelId="grscicoll.homepage" />
        <Property value={institution?.address?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
        <Property value={institution?.address?.province} labelId="grscicoll.province" />
        <Property value={institution?.address?.city} labelId="grscicoll.city" />
        <Property value={institution?.address?.postalCode} labelId="grscicoll.postalCode" />
        <Property value={institution?.address?.address} labelId="grscicoll.address" />
        <T><FormattedMessage id="grscicoll.mailingAddress" /></T>
        <V>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={institution?.mailingAddress?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
            <Property value={institution?.mailingAddress?.province} labelId="grscicoll.province" />
            <Property value={institution?.mailingAddress?.city} labelId="grscicoll.city" />
            <Property value={institution?.mailingAddress?.postalCode} labelId="grscicoll.postalCode" />
            <Property value={institution?.mailingAddress?.address} labelId="grscicoll.address" />
          </Properties>
        </V>
      </Properties>
    </Card>

    <div css={css`
      color: #aaa; 
      display: flex;
      > div {
        flex: 0 0 auto;
        margin: 0 24px 8px 24px;;
      }
      `}>
      <div>Entry created: <FormattedDate value={institution.created}
        year="numeric"
        month="long"
        day="2-digit" /></div>
      <div>Last modified: <FormattedDate value={institution.modified}
        year="numeric"
        month="long"
        day="2-digit" /></div>
    </div>
  </div>
};