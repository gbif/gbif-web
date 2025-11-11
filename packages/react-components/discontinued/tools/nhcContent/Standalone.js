import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import NhcContent from './NhcContent';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  return <NhcContent pageLayout config={props?.siteConfig?.collection} {...props} {...routeProps} />
}

export default Wrap;
