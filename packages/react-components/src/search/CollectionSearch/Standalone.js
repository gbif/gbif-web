import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import CollectionSearch from './CollectionSearch';

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <CollectionSearch {...props} />
  </StandaloneWrapper>
}

export default Standalone;
