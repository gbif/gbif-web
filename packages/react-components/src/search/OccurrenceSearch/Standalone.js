import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import OccurrenceSearch from "./OccurrenceSearch";

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <OccurrenceSearch pageLayout {...props} />
  </StandaloneWrapper>
}

export default Standalone;
