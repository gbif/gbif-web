import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Collection } from './Collection';

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <Collection {...props} />
  </StandaloneWrapper>
}

export default Standalone;
