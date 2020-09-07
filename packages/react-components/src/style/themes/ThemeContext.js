import React from 'react';
import themeVariables from './light';
import themeBuilder from '../themeBuilder';

const theme = themeBuilder.build(themeVariables);

// A context to share state for the full app/component
export default React.createContext(theme);