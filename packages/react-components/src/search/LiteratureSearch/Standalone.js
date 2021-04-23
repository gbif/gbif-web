import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import LiteratureSearch from './LiteratureSearch';

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <LiteratureSearch {...props} />
  </StandaloneWrapper>
}

export default Standalone;
