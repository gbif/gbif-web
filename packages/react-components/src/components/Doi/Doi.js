import React from 'react';
import { jsx } from '@emotion/react';
import { doi } from './styles';

export default ({href}) => <a dir="ltr" href={href} css={doi()}>
    <span>DOI</span>
    <span>{ href.replace(/^(.*doi.org\/)?(doi:)?(10\.)/, '10.') }</span></a>;

