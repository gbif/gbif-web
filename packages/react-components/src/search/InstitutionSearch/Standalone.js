import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import InstitutionSearch from './InstitutionSearch';

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <InstitutionSearch {...props} />
  </StandaloneWrapper>
}

export default Standalone;
