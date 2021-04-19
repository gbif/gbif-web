import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Institution } from './Institution';

function Standalone(props) {
  return <StandaloneWrapper {...props}>
    <Institution {...props} />
  </StandaloneWrapper>
}

export default Standalone;
