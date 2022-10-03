
import { jsx, css } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as styles from './styles';
import { Card, CardHeader2, GrSciCollMetadata as Metadata } from '../../shared';
import { Properties, Property, ResourceLink, ListItem, Image, HyperText, TextButton, Prose } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import env from '../../../../.env.json';
import useBelow from '../../../utils/useBelow';

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
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const { occurrence } = data;
  // if (loading || !occurrence) return <h1>Loading</h1>;


  return <div>
    {isPinned && <Metadata entity={collection} isPinned setPinState={() => setPinState(false)} />}

    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        <Card style={{ marginTop: 12, marginBottom: 24 }}>
          <CardHeader2><FormattedMessage id="grscicoll.description" deafultMessage="Description"/></CardHeader2>
          <Prose style={{marginBottom: 24, maxWidth: '60em', fontSize: '16px'}}>
            {collection.description && <HyperText text={collection.description} />}
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
            <Property value={collection.disciplines} labelId="collection.contentTypes" formatter={e => <FormattedMessage id={`enums.contentTypes.${e}`} defaultMessage={e} />} />

            <Property value={collection.incorporatedCollections} labelId="grscicoll.incorporatedCollections" />
            <Property value={collection.importantCollectors} labelId="grscicoll.importantCollectors" />
            {/* <Property value={collection.personalCollection} labelId="grscicoll.personalCollection" /> */}
          </Properties>
        </Card>
        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2>Contact</CardHeader2>
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
            <Property value={collection?.logoUrl} labelId="grscicoll.logo" formatter={logoUrl => <Image src={logoUrl} h={150} />} />
          </Properties>
        </Card>

        <Card style={{ marginTop: 24, marginBottom: 24 }}>
          <CardHeader2>Identifiers</CardHeader2>
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

        {!isPinned && <Metadata entity={collection} setPinState={() => setPinState(true)} />}
      </div>
      {/* {!hideSideBar && occurrenceSearch?.documents?.total > 0 && <aside css={css`flex: 0 0 280px; margin: 12px;`}>
        {loading && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <SkeletonLoader />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <Quality predicate={{
            type: "equals",
            key: "institutionKey",
            value: collection.key
          }} institution={institution} totalOccurrences={occurrenceSearch?.documents?.total} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopTaxa predicate={{
            type: "equals",
            key: "institutionKey",
            value: collection.key
          }} />
        </Card>}
        {occurrenceSearch?.documents?.total > 0 && <Card style={{ padding: '24px 12px', marginBottom: 12 }}>
          <TopCountries predicate={{
            type: "equals",
            key: "institutionKey",
            value: collection.key
          }} />
        </Card>}
      </aside>} */}
    </div>





    {/* <div css={styles.paper({ theme })} style={{ marginTop: 0, marginBottom: 24 }}>
      <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection, 'description', { showEmpty: true })}
        {getPlain(collection, 'code', { showEmpty: true })}
        {getPlain(collection, 'homePage', { showEmpty: true })}
        {getPlain(collection, 'active')}
        {getPlain(collection, 'personalCollection')}
        {getPlain(collection, 'catalogUrl')}
        {getPlain(collection, 'accessionStatus')}
        {collection.institution && <>
          <T><span style={{ paddingRight: 8 }}>Institution</span></T>
          <V><a href={routeContext.institutionKey.url({ key: collection.institution.key })}>{collection.institution.name}</a> {collection.institution.code && <>({collection.institution.code})</>}</V>
        </>}
        {getPlain(collection, 'notes')}
      </Properties>

      <Accordion summary="Content" defaultOpen={true} style={{ marginBottom: 24 }}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getList(collection, 'contentTypes')}
          {getList(collection, 'preservationTypes')}
          {getPlain(collection, 'taxonomicCoverage', { showEmpty: true })}
          {getPlain(collection, 'geography', { showEmpty: true })}
          {getList(collection, 'incorporatedCollections')}
          {getList(collection, 'importantCollectors')}
        </Properties>
      </Accordion>

      <Accordion summary="Contact" defaultOpen={true} style={{ marginBottom: 24 }}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getPlain(collection.address, 'address')}
          {getPlain(collection.address, 'country')}
          {getPlain(collection.address, 'postalCode')}
        </Properties>
      </Accordion>
    </div> */}

  </div>
};

function getPlain(collection, fieldName, { showEmpty = false } = {}) {
  if (!showEmpty && !collection?.[fieldName]) return null;
  return <><T><span style={{ paddingRight: 8 }}>{fieldName}</span></T><V>{collection?.[fieldName] ? collection[fieldName] : <span style={{ color: '#aaa' }}>Not provided</span>}</V></>
}

function getList(collection, fieldName, { showEmpty = false } = {}) {
  if (!showEmpty && (!collection?.[fieldName] || collection?.[fieldName]?.length === 0)) return null;
  
  return <>
    <T><span style={{ paddingRight: 8 }}>{fieldName}</span></T>
    {collection[fieldName] && collection[fieldName].length > 0 && <div>
      {collection[fieldName].map(item => <V>{item}</V>)}
    </div>}

    {/* {collection[fieldName] && collection[fieldName].length > 0 && <ul>
      {collection[fieldName].map(item => <li>{item}</li>)}
    </ul>} */}

    {!collection[fieldName] || collection[fieldName].length === 0 && <V><span style={{ color: '#aaa' }}>Not provided</span></V>}
  </>
}