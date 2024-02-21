
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
  collection,
  occurrenceSearch,
  className,
  ...props
}) {
  const [isPinned, setPinState, removePinState] = useLocalStorage('pin_metadata', false);
  const hideSideBar = useBelow(1100);
  const addressesIdentical = JSON.stringify(collection.mailingAddress) === JSON.stringify(collection.address);
  const contacts = collection?.contactPersons.filter(x => x.firstName);

  return <div>
    {isPinned && <Metadata entity={collection} isPinned setPinState={() => setPinState(false)} />}

    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        <Card style={{ marginTop: 12, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.description" deafultMessage="Description" /></CardHeader2>
          <Prose style={{ marginBottom: 24, maxWidth: '60em', fontSize: '16px' }}>
            {collection.description && <HyperText text={collection.description} sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'h3', 'li', 'ul', 'ol'] }} />}
            {!collection.description && <EmptyValue />}
          </Prose>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            {/* <Property value={collection.description} labelId="grscicoll.description" showEmpty /> */}
            <Property value={collection.taxonomicCoverage} labelId="grscicoll.taxonomicDescription" showEmpty />
            <Property value={collection.geography} labelId="grscicoll.geographicDescription" showEmpty />
            <Property value={collection.notes} labelId="grscicoll.notes" />
            <Property value={collection.code} labelId="grscicoll.code" showEmpty />
            <Property value={collection.numberSpecimens} labelId="collection.numberSpecimens" />
            {occurrenceSearch?.documents?.total > 0 && <Property value={occurrenceSearch?.documents?.total} labelId="grscicoll.specimensViaGbif" formatter={count => {
              return <ResourceLink type="collectionKeySpecimens" id={collection.key}>
                <FormattedNumber value={count} />
              </ResourceLink>
            }} />}
            <Property value={collection.catalogUrl} labelId="grscicoll.catalogUrl" />
            <Property value={collection.apiUrl} labelId="grscicoll.apiUrl" />
            <Property value={collection.contentTypes} labelId="collection.contentTypes" formatter={e => <FormattedMessage id={`enums.collectionContentType.${e}`} defaultMessage={e} />} />
            <Property value={collection.preservationTypes} labelId="collection.preservationTypes" formatter={e => <FormattedMessage id={`enums.preservationType.${e}`} defaultMessage={e} />} />

            <Property value={collection.incorporatedCollections} labelId="grscicoll.incorporatedCollections" />
            <Property value={collection.importantCollectors} labelId="grscicoll.importantCollectors" />
            {/* <Property labelId="grscicoll.importantCollectors">
              <ul>
                {collection.importantCollectors.map((v, i) => <li key={i}><Link to={{pathname: "/specimens", search: `?recordedBy=${encodeURIComponent(v)}`}}>{v}</Link></li>)}
              </ul>
            </Property> */}
            {collection.personalCollection && <Property value={collection.personalCollection} labelId="collection.personalCollection" formatter={e => <FormattedMessage id={`enums.yesNo.${e}`} defaultMessage={e} />} />}
          </Properties>
        </Card>
        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.contacts" deafultMessage="Contacts" /></CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={collection?.email} labelId="grscicoll.email" />
            <Property value={collection?.homepage} labelId="grscicoll.homepage" />
            <Property value={collection?.address?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
            <Property value={collection?.address?.province} labelId="grscicoll.province" />
            <Property value={collection?.address?.city} labelId="grscicoll.city" />
            <Property value={collection?.address?.postalCode} labelId="grscicoll.postalCode" />
            <Property value={collection?.address?.address} labelId="grscicoll.address" />
            {!addressesIdentical && <>
              <T><FormattedMessage id="grscicoll.mailingAddress" /></T>
              <V>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  <Property value={collection?.mailingAddress?.country} labelId="grscicoll.country" showEmpty formatter={countryCode => <FormattedMessage id={`enums.countryCode.${countryCode}`} />} />
                  <Property value={collection?.mailingAddress?.province} labelId="grscicoll.province" />
                  <Property value={collection?.mailingAddress?.city} labelId="grscicoll.city" />
                  <Property value={collection?.mailingAddress?.postalCode} labelId="grscicoll.postalCode" />
                  <Property value={collection?.mailingAddress?.address} labelId="grscicoll.address" />
                </Properties>
              </V>
            </>}
            <Property value={collection?.logoUrl} labelId="grscicoll.logoUrl" formatter={logoUrl => <Image src={logoUrl} h={150} />} />
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
          <CardHeader2><FormattedMessage id="grscicoll.identifiers" deafultMessage="Identifiers" /></CardHeader2>
          <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
            <Property value={collection.code} labelId="grscicoll.code" showEmpty />
            {collection?.alternativeCodes?.length > 0 && <Property value={collection.alternativeCodes} labelId="grscicoll.alternativeCodes">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {collection.alternativeCodes.map((x, i) => {
                  return <li key={`${i}_${x.code}`} css={css`margin-bottom: 8px;`}>
                    <div>{x.code}</div>
                    <div css={css`color: var(--color400);`}>{x.description}</div>
                  </li>
                })}
              </ul>
            </Property>}
            <Property value={collection.additionalNames} labelId="grscicoll.additionalNames" />
            {collection?.identifiers?.length > 0 && <Property value={collection.identifiers} labelId="grscicoll.identifiers">
              <ul css={css`padding: 0; margin: 0; list-style: none;`}>
                {collection.identifiers.map((x, i) => {

                  const IdentifierItem = ({ link, text, type }) => <li css={css`margin-bottom: 8px;`}>
                    <div css={css`color: var(--color400); font-size: 0.9em;`}><FormattedMessage id={`enums.identifierType.${type}`} defaultMessage={type} /></div>
                    <div css={HyperText.content()}><a href={link}>{text}</a></div>
                  </li>

                  let identifier = x.identifier;
                  if (['ROR', 'GRID', 'IH_IRN'].includes(x.type)) {
                    if (x.type === 'ROR') {
                      identifier = 'https://ror.org/' + x.identifier;
                    } else if (x.type === 'GRID') {
                      identifier = 'https://grid.ac/institutes/' + x.identifier; // GRID doesn't exists anymore. They left the space and refer to ROR as checked today September 2022
                    } else if (x.type === 'IH_IRN') {
                      identifier = 'http://sweetgum.nybg.org/science/ih/herbarium-details/?irn=' + x.identifier.substr(12);
                    }
                    return <IdentifierItem key={`${i}_${x.identifier}`} link={identifier} type={x.type} text={x.identifier} />
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

        {!isPinned && <Metadata entity={collection} setPinState={() => setPinState(true)} />}
      </div>

      {!hideSideBar && occurrenceSearch?.documents?.total > 0 && <aside css={css`flex: 0 0 350px; margin: 12px;`}>
        {loading && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <SideBarLoader />
        </Card>}
        {/* {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <Quality predicate={{
            type: "equals",
            key: "institutionKey",
            value: collection.key
          }} institution={institution} totalOccurrences={occurrenceSearch?.documents?.total} />
        </Card>} */}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: 0, marginBottom: 12 }}>
          <MapThumbnail predicate={{
            type: "equals",
            key: "collectionKey",
            value: collection.key
          }} />
          {/* <ThumbnailMap filter={{ collectionKey: collection.key }} /> */}
          <TotalAndDistinct style={{ padding: '24px 12px' }} predicate={{
            type: "equals",
            key: "collectionKey",
            value: collection.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopTaxa predicate={{
            type: "equals",
            key: "collectionKey",
            value: collection.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopCountries predicate={{
            type: "equals",
            key: "collectionKey",
            value: collection.key
          }} />
        </Card>}
      </aside>}
    </div>
  </div>
};