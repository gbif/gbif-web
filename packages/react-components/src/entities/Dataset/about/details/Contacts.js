
import { jsx } from '@emotion/react';
import React, { useContext, useState } from 'react';
import { FormattedMessage, FormattedDate } from "react-intl";
import { Properties, Accordion, HyperText } from "../../../../components";

const { Term: T, Value: V } = Properties;

export function Contacts({
  data = {},
  loading,
  error,
  ...props
}) {
  const { dataset } = data;

  return dataset?.contributors?.length > 0 ? <Accordion summary="Contacts" defaultOpen={true}>
        {dataset.contributors.map(contact)}
      </Accordion> : null

};



function contact(ctct) {
  return <Properties id="contacts" style={{ marginBottom: 12 }} horizontal={true} key={ctct.type+ctct.firstName+ctct.lastName}>
    <T>
        {ctct.roles && ctct.roles.map(r => <div key={r}><FormattedMessage id={`enums.role.${r}`} defaultMessage={r}/></div>)}
    
        </T>
    
    <V>
    {(ctct.firstName || ctct.lastName) && <div>{ctct.firstName} {ctct.lastName}</div>}
    {ctct.position && <div>{ctct.position}</div>} 
{ctct?.userId?.length > 0 && ctct.userId.map( id => <HyperText text={id} key={id}/>)}
    {ctct.organization && <div>{ctct.organization}</div>}
    {ctct.address && <div>{ctct.address}</div>}    
    </V>

   
  </Properties>
}
