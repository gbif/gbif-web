import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import OccurrenceSearch from "./OccurrenceSearch";

function Standalone(props) {
  // config refactor patch/fallback
  const siteConfig = props?.siteConfig;
  let patch = {};
  if (siteConfig) {
    patch = {...siteConfig, config: siteConfig.occurrence, routeContext: siteConfig.routes}
  }
  
  return <StandaloneWrapper {...patch} {...props}>
    <OccurrenceSearch pageLayout {...patch} {...props} />
  </StandaloneWrapper>
}

export default Standalone;
