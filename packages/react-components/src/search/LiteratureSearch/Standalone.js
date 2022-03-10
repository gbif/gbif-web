import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import LiteratureSearch from './LiteratureSearch';

function Standalone(props) {
  // config refactor patch/fallback
  const siteConfig = props?.siteConfig;
  let patch = {};
  if (siteConfig) {
    patch = {...siteConfig, config: siteConfig.literature, routeContext: siteConfig.routes}
  }

  return <StandaloneWrapper {...patch} {...props}>
    <LiteratureSearch {...patch} {...props} />
  </StandaloneWrapper>
}

export default Standalone;
