
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, Accordion, Button } from "../../../components";

const { Term: T, Value: V } = Properties;

export function Description({
  data = {},
  loading,
  error,
  institution,
  className,
  ...props
}) {
  const theme = useContext(ThemeContext);

  return <>
    {/* <div style={{margin: '12px 0', textAlign: 'right'}}>
      <Button>Suggest a change</Button>
    </div> */}
    <div css={css.paper({ theme })} style={{marginTop: 24, marginBottom: 24}}>
      {/* <Accordion summary="About" defaultOpen={true}> */}
      <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
        {getPlain(institution, 'name')}
        {getPlain(institution, 'description')}
        {getPlain(institution, 'code')}
        {/* {getPlain(institution, 'alternativeCodes')} */}
        {getPlain(institution, 'homePage')}
        {getPlain(institution, 'active')}
        {getPlain(institution, 'personalCollection')}
        {getPlain(institution, 'catalogUrl')}
        {getPlain(institution, 'accessionStatus')}
        {getPlain(institution, 'institutionName')}
        {getPlain(institution, 'institutionCode')}
        {getPlain(institution, 'notes')}
      </Properties>
      {/* </Accordion> */}

      <Accordion summary="Content" defaultOpen={true} style={{marginBottom: 24}}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getPlain(institution, 'contentTypes')}
          {getPlain(institution, 'preservationTypes')}
          {getPlain(institution, 'taxonomicCoverage')}
          {getPlain(institution, 'geography')}
          {getList(institution, 'incorporatedCollections')}
          {getList(institution, 'importantCollectors')}
        </Properties>
      </Accordion>

      <Accordion summary="Contact" defaultOpen={true} style={{marginBottom: 24}}>
        <Properties style={{ fontSize: 14, marginBottom: 12 }} horizontal={true}>
          {getPlain(institution.address, 'address')}
          {getPlain(institution.address, 'country')}
          {getPlain(institution.address, 'postalCode')}
        </Properties>
      </Accordion>
    </div>
  </>
};

function getPlain(institution, fieldName) {
  return <><T><span style={{paddingRight: 8}}>{fieldName}</span></T><V>{ institution?.[fieldName] ? institution[fieldName] : <span style={{color: '#aaa'}}>Not provided</span>}</V></>
}

function getList(institution, fieldName) {
  return <>
    <T><span style={{paddingRight: 8}}>{fieldName}</span></T>
    {institution[fieldName] && institution[fieldName].length > 0 && <div>
      {institution[fieldName].map(item => <V>{item}</V>)}
    </div>}

    {/* {institution[fieldName] && institution[fieldName].length > 0 && <ul>
      {institution[fieldName].map(item => <li>{item}</li>)}
    </ul>} */}

    {!institution[fieldName] || institution[fieldName].length === 0 && <V><span style={{color: '#aaa'}}>Not provided</span></V>}
  </>
}