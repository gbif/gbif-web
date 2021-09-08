import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';

export const StyledProse = ({source, ...props}) => <Prose style={{background: 'white', overflow: 'hidden'}} {...props}><Markdown source={source} /></Prose>;
