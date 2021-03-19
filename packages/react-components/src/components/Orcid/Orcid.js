import React from 'react';
/** @jsxImportSource @emotion/core */
import { jsx } from "@emotion/core";
import { orcid } from './styles';

export default ({href}) => <a dir="ltr" href={href} css={orcid()}>
    <img src="https://www.gbif.org/img/orcid_16x16.png"/>{href}</a>;

