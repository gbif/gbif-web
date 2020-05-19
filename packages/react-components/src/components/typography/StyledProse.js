import React from 'react';
import { Markdown } from './Markdown';
import { Prose } from './Prose';

export const StyledProse = ({source, ...props}) => <Prose {...props}><Markdown source={source} /></Prose>;
