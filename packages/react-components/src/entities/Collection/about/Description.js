
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';
import env from '../../../../.env.json';

const { Term: T, Value: V } = Properties;

export function Description({
  data = {},
  loading,
  error,
  collection,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);
  const routeContext = useContext(RouteContext);
  const { occurrence } = data;
  // if (loading || !occurrence) return <h1>Loading</h1>;


  return <>
    <div style={{ margin: '12px 0', textAlign: 'right' }}>
      <Button as="a" href={`${env.GBIF_REGISTRY}/collection/${collection.key}`} look="primaryOutline">Suggest a change</Button>
    </div>
    <div css={css.paper({ theme })} style={{ marginTop: 0, marginBottom: 24 }}>
      {/* <Accordion summary="About" defaultOpen={true}> */}
      <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection, 'description', { showEmpty: true })}
        {getPlain(collection, 'code', { showEmpty: true })}
        {/* {getPlain(collection, 'alternativeCodes')} */}
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
      {/* </Accordion> */}

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
    </div>
  </>
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