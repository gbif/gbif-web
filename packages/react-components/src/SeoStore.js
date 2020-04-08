/**
 * This store is only intended as an init store for server rendering. 
 * The default is empty and hence components can use it if it is not empty 
 * to bootstrap content provided by the server.
 */
import React from 'react';

// A context to share state for the full app/component
export default React.createContext({});