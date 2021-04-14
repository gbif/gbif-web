
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion } from "../../../components";

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
  const { occurrence } = data;
  // if (loading || !occurrence) return <h1>Loading</h1>;


  return <div css={css.paper({ theme })} style={{marginTop: 24}}>
    <Accordion summary="About" defaultOpen={true}>
      <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection, 'name')}
        {getPlain(collection, 'description')}
        {getPlain(collection, 'Code')}
        {getPlain(collection, 'alternativeCodes')}
        {getPlain(collection, 'homePage')}
        {getPlain(collection, 'active')}
        {getPlain(collection, 'personalCollection')}
        {getPlain(collection, 'catalogUrl')}
        {getPlain(collection, 'accessionStatus')}
        {getPlain(collection, 'incorporatedCollections')}
        {getPlain(collection, 'institutionName')}
        {getPlain(collection, 'institutionCode')}
        {getPlain(collection, 'notes')}
      </Properties>
    </Accordion>

    <Accordion summary="Content" defaultOpen={true}>
      <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection, 'contentTypes')}
        {getPlain(collection, 'preservationTypes')}
        {getPlain(collection, 'taxonomicCoverage')}
        {getPlain(collection, 'geography')}
        {getPlain(collection, 'incorporatedCollections')}
        {getPlain(collection, 'importantCollectors')}
      </Properties>
    </Accordion>

    <Accordion summary="Contact" defaultOpen={true}>
      <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
        {getPlain(collection.address, 'address')}
        {getPlain(collection.address, 'country')}
        {getPlain(collection.address, 'postalCode')}
      </Properties>
    </Accordion>
  </div>
};

function getPlain(collection, fieldName) {
  return <><T>{fieldName}</T><V>{ collection[fieldName] ? collection[fieldName] : <span style={{color: '#aaa'}}>Not provided</span>}</V></>
}