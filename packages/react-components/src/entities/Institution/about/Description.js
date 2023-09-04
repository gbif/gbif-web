
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Properties, Property, ResourceLink, ListItem, Image, HyperText, Prose } from "../../../components";
import { Card, CardHeader2, GrSciCollMetadata as Metadata, SideBarLoader } from '../../shared';
import { TopTaxa, TopCountries } from '../../shared/stats';
import sortBy from 'lodash/sortBy';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';
import { Quality } from './stats';
import useBelow from '../../../utils/useBelow';

const { Term: T, Value: V, EmptyValue } = Properties;
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
  const [isPinned, setPinState, removePinState] = useLocalStorage('pin_metadata', false);
  const hideSideBar = useBelow(1100);
  const addressesIdentical = JSON.stringify(institution.mailingAddress) === JSON.stringify(institution.address);
  return <div>
    {isPinned && <Metadata entity={institution} isPinned setPinState={() => setPinState(false)} />}
    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        <Card style={{ marginTop: 12, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.description" deafultMessage="Description" /></CardHeader2>
          <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
            {institution.description && <HyperText text={institution.description}  sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'h3', 'li', 'ul', 'ol'] }} />}
            {!institution.description && <EmptyValue />}
          </Prose>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            {/* <Property value={institution.description} labelId="grscicoll.description" showEmpty /> */}
            <Property value={institution.taxonomicDescription} labelId="grscicoll.taxonomicDescription" showEmpty />
            <Property value={institution.geographicDescription} labelId="grscicoll.geographicDescription" showEmpty />
            <Property value={institution.code} labelId="grscicoll.code" showEmpty />
            <Property value={institution.numberSpecimens} labelId="institution.numberSpecimens" />
            {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
              return <ResourceLink type="institutionKeySpecimens" id={institution.key}>
                <FormattedNumber value={count} />
              </ResourceLink>
            }} />}
            <Property value={institution.catalogUrl} labelId="grscicoll.catalogUrl" />
            <Property value={institution.apiUrl} labelId="grscicoll.apiUrl" />
            <Property value={institution.disciplines} labelId="institution.disciplines" showEmpty formatter={e => <FormattedMessage id={`enums.discipline.${e}`} defaultMessage={e} />} />
            {institution.foundingDate && <Property labelId="grscicoll.foundingDate">
              {institution.foundingDate}
            </Property>}
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
            <Property value={institution?.email} labelId="grscicoll.email" />
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
            <Property value={institution?.logoUrl} labelId="grscicoll.logo" formatter={logoUrl => <Image src={logoUrl} h={120} />} />
          </Properties>
          {institution?.contactPersons?.length > 0 && <div css={css`
            display: flex;
            flex-wrap: wrap;
            padding-top: 24px;
            border-top: 1px solid #eee;
            margin-top: 24px;
            > div {
              flex: 1 1 auto;
              width: 40%;
              max-width: 400px;
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
          </div>}
        </Card>

        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2>Identifiers</CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={institution.code} labelId="grscicoll.code" showEmpty />
            {institution?.alternativeCodes?.length > 0 && <Property value={institution.alternativeCodes} labelId="grscicoll.alternativeCodes">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {institution.alternativeCodes.map((x, i) => {
                  return <li key={`${i}_${x.code}`} css={css`margin-bottom: 8px;`}>
                    <div>{x.code}</div>
                    <div css={css`color: var(--color400);`}>{x.description}</div>
                  </li>
                })}
              </ul>
            </Property>}
            <Property value={institution.additionalNames} labelId="grscicoll.additionalNames" />
            {institution?.identifiers?.length > 0 && <Property value={institution.identifiers} labelId="grscicoll.identifiers">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {institution.identifiers.map((x, i) => {
                  let identifier = x.identifier;
                  if (x.type === 'ROR') {
                    identifier = 'https://ror.org/' + x.identifier;
                  } else if (x.type === 'GRID') {
                    identifier = 'https://grid.ac/institutes/' + x.identifier; // GRID doesn't exists anymore. They left the space and refer to ROR as checked today September 2022
                  } else if (x.type === 'IH_IRN') {
                    identifier = 'http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' + x.identifier.substr(12);
                  }

                  return <li key={`${i}_${x.identifier}`} css={css`margin-bottom: 8px;`}>
                    <div css={css`color: var(--color400); font-size: 0.9em;`}><FormattedMessage id={`enums.identifierType.${x.type}`} defaultMessage={x.type} /></div>
                    <div><HyperText text={identifier} inline /></div>
                  </li>
                })}
              </ul>
            </Property>}
          </Properties>
        </Card>

        {!isPinned && <Metadata entity={institution} setPinState={() => setPinState(true)} />}
      </div>
      {!hideSideBar && occurrenceSearch?.documents?.total > 0 && <aside css={css`flex: 0 0 280px; margin: 12px;`}>
        {loading && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <SideBarLoader />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <Quality predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} institution={institution} totalOccurrences={occurrenceSearch?.documents?.total} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopTaxa predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopCountries predicate={{
            type: "equals",
            key: "institutionKey",
            value: institution.key
          }} />
        </Card>}
      </aside>}
    </div>
  </div>
};
