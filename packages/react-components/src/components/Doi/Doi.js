import React from 'react';
/** @jsx jsx */
import { jsx } from "@emotion/core";
import { doi } from './styles';

export default ({href}) => <a dir="ltr" href={href} css={doi()}>
    <span>DOI</span>
    <span>{ href.replace(/^(.*doi.org\/)?(doi:)?(10\.)/, '10.') }</span></a>;

