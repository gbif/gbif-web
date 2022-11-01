import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';

export const StyledProse = ({source, ...props}) => <Prose style={{margin: '12px 0', padding: 24, background: 'white', overflow: 'hidden'}} {...props}><Markdown source={source} /></Prose>;
