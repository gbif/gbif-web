
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { Properties, Property, ResourceLink, ListItem } from "../../../components";
import { Card, CardHeader2 } from '../../shared';
import sortBy from 'lodash/sortBy';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';

const { Term: T, Value: V } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

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
  const addressesIdentical = JSON.stringify(institution.mailingAddress) === JSON.stringify(institution.address)
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
        {!addressesIdentical && <>
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
        </>}
      </Properties>
      <div css={css`
        display: flex;
        flex-wrap: wrap;
        > div {
          flex: 0 0 auto;
          width: 50%;
          max-width: 500px;
          min-width: 300px;
          margin: 12px;
        }
      `}>
        {sortBy(institution.contactPersons, 'position').map(contact => {
          let actions = [];
          if (contact.email?.[0]) actions.push(<a href={`mailto:${contact.email?.[0]}`}><MailIcon />{contact.email?.[0]}</a>);
          if (contact.phone?.[0]) actions.push(<a href={`tel:${contact.phone?.[0]}`}><PhoneIcon />{contact.phone?.[0]}</a>);
          return <ListItem
            key={contact.key}
            isCard
            title={`${contact.firstName} ${contact.lastName}`}
            avatar={<Name2Avatar first={contact.firstName} last={contact.lastName} />}
            description={contact.position?.[0]}
            footerActions={actions}>
            {contact.researchPursuits}
          </ListItem>
        })}
      </div>
    </Card>

    <div css={css`
      color: #aaa; 
      display: flex;
      flex-wrap: wrap;
      > div {
        flex: 0 0 auto;
        margin: 0 24px 8px 24px;
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