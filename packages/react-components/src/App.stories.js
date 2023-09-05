import React from 'react';
import { MemoryRouter as Router } from "react-router-dom";
import App from './App';
import { defaultContext as defaultSiteConfig } from './dataManagement/SiteContext';
const siteConfig = {
  locale: 'es',
  availableCatalogues: ['DATASET', 'OCCURRENCE'],
  messages: {
    'dataset.longType.OCCURRENCE': 'TEsT'
  },
  occurrence: {
    rootPredicate: { type: 'equals', key: 'country', value: 'DE' }
  },
};

export const StandaloneExample = () => <App siteConfig={defaultSiteConfig} router={Router} />;

export default {
  title: 'App/Hosted portal',
  component: StandaloneExample,
};