
import { jsx, css } from '@emotion/react';
import React from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Card, CardHeader2, GrSciCollMetadata as Metadata, SideBarLoader, MapThumbnail } from '../../shared';
import { Properties, Property, ResourceLink, Image, HyperText, ListItem, Prose } from "../../../components";
import useBelow from '../../../utils/useBelow';
import sortBy from 'lodash/sortBy';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon } from 'react-icons/md';
import { TopTaxa, TopCountries, TotalAndDistinct } from '../../shared/stats';

const { Term: T, Value: V, EmptyValue } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

export function Description({
  data = {},
  loading,
  error,
  specimen,
  occurrenceSearch,
  className,
  ...props
}) {
  const [isPinned, setPinState, removePinState] = useLocalStorage('pin_metadata', false);
  const hideSideBar = useBelow(1100);
  const addressesIdentical = JSON.stringify(specimen.mailingAddress) === JSON.stringify(specimen.address);
  const contacts = specimen?.contactPersons.filter(x => x.firstName);

  return <div>
    {isPinned && <Metadata entity={specimen} isPinned setPinState={() => setPinState(false)} />}

    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        <Card style={{ marginTop: 12, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.description" deafultMessage="Description" /></CardHeader2>
          <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
            {specimen.description && <HyperText text={specimen.description} />}
            {!specimen.description && <EmptyValue />}
          </Prose>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            {/* <Property value={specimen.description} labelId="grscicoll.description" showEmpty /> */}
            <Property value={specimen.taxonomicCoverage} labelId="grscicoll.taxonomicDescription" showEmpty />
            <Property value={specimen.geography} labelId="grscicoll.geographicDescription" showEmpty />
            <Property value={specimen.notes} labelId="grscicoll.notes" />
            <Property value={specimen.code} labelId="grscicoll.code" showEmpty />
            <Property value={specimen.numberSpecimens} labelId="specimen.numberSpecimens" />
            {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
              return <ResourceLink type="specimenKeySpecimens" id={specimen.key}>
                <FormattedNumber value={count} />
              </ResourceLink>
            }} />}
            <Property value={specimen.catalogUrl} labelId="grscicoll.catalogUrl" />
            <Property value={specimen.apiUrl} labelId="grscicoll.apiUrl" />
            <Property value={specimen.disciplines} labelId="specimen.contentTypes" formatter={e => <FormattedMessage id={`enums.contentTypes.${e}`} defaultMessage={e} />} />

            <Property value={specimen.incorporatedSpecimens} labelId="grscicoll.incorporatedSpecimens" />
            <Property value={specimen.importantCollectors} labelId="grscicoll.importantCollectors" />
            {/* <Property value={specimen.personalSpecimen} labelId="grscicoll.personalSpecimen" /> */}
          </Properties>
        </Card>
        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2>Contact</CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={specimen?.email} labelId="grscicoll.email" />
            <Property value={specimen?.homepage} labelId="grscicoll.homepage" />
            <Property value={specimen?.address?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
            <Property value={specimen?.address?.province} labelId="grscicoll.province" />
            <Property value={specimen?.address?.city} labelId="grscicoll.city" />
            <Property value={specimen?.address?.postalCode} labelId="grscicoll.postalCode" />
            <Property value={specimen?.address?.address} labelId="grscicoll.address" />
            {!addressesIdentical && <>
              <T><FormattedMessage id="grscicoll.mailingAddress" /></T>
              <V>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  <Property value={specimen?.mailingAddress?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
                  <Property value={specimen?.mailingAddress?.province} labelId="grscicoll.province" />
                  <Property value={specimen?.mailingAddress?.city} labelId="grscicoll.city" />
                  <Property value={specimen?.mailingAddress?.postalCode} labelId="grscicoll.postalCode" />
                  <Property value={specimen?.mailingAddress?.address} labelId="grscicoll.address" />
                </Properties>
              </V>
            </>}
            <Property value={specimen?.logoUrl} labelId="grscicoll.logo" formatter={logoUrl => <Image src={logoUrl} h={150} />} />
          </Properties>
          {contacts?.length > 0 && <div css={css`
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
            {sortBy(contacts, 'position').map(contact => {
              let actions = [];
              if (contact.email?.[0]) actions.push(<a href={`mailto:${contact.email?.[0]}`}><MailIcon />{contact.email?.[0]}</a>);
              if (contact.phone?.[0]) actions.push(<a href={`tel:${contact.phone?.[0]}`}><PhoneIcon />{contact.phone?.[0]}</a>);
              return <ListItem
                key={contact.key}
                isCard
                firstName={contact.firstName}
                lastName={contact.lastName}
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
            <Property value={specimen.code} labelId="grscicoll.code" showEmpty />
            {specimen?.alternativeCodes?.length > 0 && <Property value={specimen.alternativeCodes} labelId="grscicoll.alternativeCodes">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {specimen.alternativeCodes.map((x, i) => {
                  return <li key={`${i}_${x.code}`} css={css`margin-bottom: 8px;`}>
                    <div>{x.code}</div>
                    <div css={css`color: var(--color400);`}>{x.description}</div>
                  </li>
                })}
              </ul>
            </Property>}
            <Property value={specimen.additionalNames} labelId="grscicoll.additionalNames" />
            {specimen?.identifiers?.length > 0 && <Property value={specimen.identifiers} labelId="grscicoll.identifiers">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {specimen.identifiers.map((x, i) => {
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

        {!isPinned && <Metadata entity={specimen} setPinState={() => setPinState(true)} />}
      </div>

      {!hideSideBar && occurrenceSearch?.documents?.total > 0 && <aside css={css`flex: 0 0 280px; margin: 12px;`}>
        {loading && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <SideBarLoader />
        </Card>}
        {/* {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <Quality predicate={{
            type: "equals",
            key: "institutionKey",
            value: specimen.key
          }} institution={institution} totalOccurrences={occurrenceSearch?.documents?.total} />
        </Card>} */}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: 0, marginBottom: 12 }}>
          <MapThumbnail predicate={{
            type: "equals",
            key: "specimenKey",
            value: specimen.key
          }}/>
          {/* <ThumbnailMap filter={{ specimenKey: specimen.key }} /> */}
          <TotalAndDistinct style={{padding: '24px 12px'}} predicate={{
            type: "equals",
            key: "specimenKey",
            value: specimen.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopTaxa predicate={{
            type: "equals",
            key: "specimenKey",
            value: specimen.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopCountries predicate={{
            type: "equals",
            key: "specimenKey",
            value: specimen.key
          }} />
        </Card>}
      </aside>}
    </div>
  </div>
};