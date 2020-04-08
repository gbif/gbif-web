import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';

export const StyledProse = ({source, ...props}) => <Prose style={{padding: '30px 100px'}} {...props}><Markdown source={source} /></Prose>;
