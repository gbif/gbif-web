import React from 'react';
import { jsx } from '@emotion/react';
import {lsid} from './styles';

export default ({identifier}) => <a dir="ltr" href={`http://lsid.info/${identifier}`} css={lsid()}>
    <span>URN:LSID:</span>
    <span>{ identifier.replace('urn:lsid:', '') }</span></a>;

