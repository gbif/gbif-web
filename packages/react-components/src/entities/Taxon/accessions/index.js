import React from 'react';
import { ErrorBoundary } from '../../../components';
import StandardSearch from '../../../search/Search';
import Layout from './AccessionsPageLayout';

// Views
import Table from './views/Table';
import Map from './views/Map';

// Config
import defaultFilterConfig from './config/filterConf';
import predicateConfig from './config/predicateConfig';

export default ({ id, config }) => {
  const taxonConfig = config || {};

  // Only show accession events related to the current taxa on the taxon page
  if (!taxonConfig.rootFilter || taxonConfig.rootFilter.type !== 'and') {
    taxonConfig.rootFilter = {
      type: 'and',
      predicates: [
        ...(taxonConfig.rootFilter ? [taxonConfig.rootFilter] : []),
        {
          key: 'taxonKey',
          type: 'equals',
          value: id,
        },
      ],
    };
  }

  return (
    <ErrorBoundary>
      <StandardSearch
        {...{
          config: taxonConfig,
          defaultFilterConfig,
          predicateConfig,
          Table,
          Map,
        }}
        layout={Layout}
        suggestRootFilter
      />
    </ErrorBoundary>
  );
};
