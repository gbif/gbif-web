import React from 'react';
import { MemoryRouter as Router } from "react-router-dom";
import App from './App';
import { defaultContext as defaultSiteConfig } from './dataManagement/SiteContext';

export const StandaloneExample = () => <App siteConfig={defaultSiteConfig} router={Router} />;

export default {
  title: 'App/Hosted portal',
  component: StandaloneExample,
};