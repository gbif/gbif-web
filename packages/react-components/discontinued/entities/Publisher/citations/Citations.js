
import { jsx } from '@emotion/react';
import React from 'react';
import LiteratureSearch from '../../../search/LiteratureSearch/LiteratureSearch';
import * as charts from '../../../widgets/dashboard';
import DashBoardLayout from '../../../widgets/dashboard/DashboardLayout';

export function Citations({
  publisher,
  className,
  ...props
}) {
  const config = {
    rootFilter:{publishingOrganizationKey: [publisher.key]}, 
    excludedFilters: ['gbifPublisherKey'],
    // highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };

  const predicate = {
    type: "equals",
    key: "publishingOrganizationKey",
    value: publisher.key
  };

  return <div>
    <LiteratureSearch config={config} style={{ margin: 'auto', maxWidth: '100%', minHeight: '800px' }}></LiteratureSearch>
    <div style={{ overflow: 'hidden' }}>
      <DashBoardLayout>
        <charts.LiteratureTopics visibilityThreshold={1} predicate={predicate} />
        <charts.LiteratureType visibilityThreshold={1} options={['TABLE', 'PIE']} predicate={predicate} />
        <charts.LiteratureRelevance visibilityThreshold={1} predicate={predicate} />
        <charts.LiteratureCreatedAt predicate={predicate} />
        <charts.LiteratureCountriesOfResearcher visibilityThreshold={1} predicate={predicate} />
        <charts.LiteratureCountriesOfCoverage visibilityThreshold={1} predicate={predicate} />
      </DashBoardLayout>
    </div>
  </div>
};
