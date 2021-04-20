
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, Button } from "../../../components";
import RouteContext from '../../../dataManagement/RouteContext';

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
    {/* <div style={{margin: '12px 0', textAlign: 'right'}}>
      <Button>Suggest a change</Button>
    </div> */}
    <div css={css.paper({ theme })} style={{marginTop: 24, marginBottom: 24}}>
      {/* <Accordion summary="About" defaultOpen={true}> */}
      <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection, 'name')}
        {getPlain(collection, 'description')}
        {getPlain(collection, 'code')}
        {/* {getPlain(collection, 'alternativeCodes')} */}
        {getPlain(collection, 'homePage')}
        {getPlain(collection, 'active')}
        {getPlain(collection, 'personalCollection')}
        {getPlain(collection, 'catalogUrl')}
        {getPlain(collection, 'accessionStatus')}
        {getPlain(collection, 'institutionName')}
        {getPlain(collection, 'institutionCode')}
        {collection.institution && <>
          <T><span style={{paddingRight: 8}}>Institution</span></T>
          <V><a href={routeContext.institutionKey.url({key: collection.institution.key})}>{collection.institution.name}</a></V>
        </>}
        {getPlain(collection, 'notes')}
      </Properties>
      {/* </Accordion> */}

      <Accordion summary="Content" defaultOpen={true} style={{marginBottom: 24}}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getPlain(collection, 'contentTypes')}
          {getPlain(collection, 'preservationTypes')}
          {getPlain(collection, 'taxonomicCoverage')}
          {getPlain(collection, 'geography')}
          {getList(collection, 'incorporatedCollections')}
          {getList(collection, 'importantCollectors')}
        </Properties>
      </Accordion>

      <Accordion summary="Contact" defaultOpen={true} style={{marginBottom: 24}}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getPlain(collection.address, 'address')}
          {getPlain(collection.address, 'country')}
          {getPlain(collection.address, 'postalCode')}
        </Properties>
      </Accordion>
    </div>
  </>
};

function getPlain(collection, fieldName) {
  return <><T><span style={{paddingRight: 8}}>{fieldName}</span></T><V>{ collection?.[fieldName] ? collection[fieldName] : <span style={{color: '#aaa'}}>Not provided</span>}</V></>
}

function getList(collection, fieldName) {
  return <>
    <T><span style={{paddingRight: 8}}>{fieldName}</span></T>
    {collection[fieldName] && collection[fieldName].length > 0 && <div>
      {collection[fieldName].map(item => <V>{item}</V>)}
    </div>}

    {/* {collection[fieldName] && collection[fieldName].length > 0 && <ul>
      {collection[fieldName].map(item => <li>{item}</li>)}
    </ul>} */}

    {!collection[fieldName] || collection[fieldName].length === 0 && <V><span style={{color: '#aaa'}}>Not provided</span></V>}
  </>
}