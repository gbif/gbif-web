import React from 'react';
import * as charts from './index';
import DashBoardLayout from './DashboardLayout';
import StandaloneWrapper from '../../StandaloneWrapper';

export function Standalone({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Dashboard {...props} />
  </StandaloneWrapper>
}

export default function Dashboard({
  data = {},
  loading,
  error,
  predicate,
  charts = [],
  className,
  ...props
}) {
  const chartsToRender = charts.map(chart => {
    const Chart = lookup[chart];
    return <Chart predicate={predicate} key={chart} />;
  });
  return <div>
    <DashBoardLayout>
      {chartsToRender}
    </DashBoardLayout>
  </div>
};

const lookup = {
  iucn: ({predicate, ...props}) => <charts.Iucn predicate={predicate} {...props} />,
  license: ({predicate, ...props}) => <charts.Licenses predicate={predicate} {...props} />,
  basisOfRecord: ({predicate, ...props}) => <charts.BasisOfRecord predicate={predicate} {...props} />,
  year: ({predicate, ...props}) => <charts.EventDate options={['TIME']} predicate={predicate} {...props} />,
  synonyms: ({predicate, ...props}) => <charts.Synonyms predicate={predicate} {...props} />,
  iucnCounts: ({predicate, ...props}) => <charts.IucnCounts predicate={predicate} {...props} />,
  country: ({predicate, ...props}) => <charts.Country predicate={predicate} {...props} />,
  continent: ({predicate, ...props}) => <charts.Continent predicate={predicate} {...props} />,
  dwcaExtension: ({predicate, ...props}) => <charts.DwcaExtension predicate={predicate} {...props} />,
  eventId: ({predicate, ...props}) => <charts.EventId predicate={predicate} {...props} />,
  gadmGid: ({predicate, ...props}) => <charts.GadmGid predicate={predicate} {...props} />,
  mediaType: ({predicate, ...props}) => <charts.MediaType predicate={predicate} {...props} />,
  networkKey: ({predicate, ...props}) => <charts.Networks predicate={predicate} {...props} />,
  publisherKey: ({predicate, ...props}) => <charts.Publishers predicate={predicate} {...props} />,
  publishingCountryCode: ({predicate, ...props}) => <charts.PublishingCountryCode predicate={predicate} {...props} />,
  protocol: ({predicate, ...props}) => <charts.Protocol predicate={predicate} {...props} />,
  sampleSizeUnit: ({predicate, ...props}) => <charts.SampleSizeUnit predicate={predicate} {...props} />,
  samplingProtocol: ({predicate, ...props}) => <charts.SamplingProtocol predicate={predicate} {...props} />,
  typeStatus: ({predicate, ...props}) => <charts.TypeStatus predicate={predicate} {...props} />,
  waterBody: ({predicate, ...props}) => <charts.WaterBody predicate={predicate} {...props} />,
  collectionCode: ({predicate, ...props}) => <charts.CollectionCodes predicate={predicate} {...props} />,
  institutionCode: ({predicate, ...props}) => <charts.InstitutionCodes predicate={predicate} {...props} />,
  stateProvince: ({predicate, ...props}) => <charts.StateProvince predicate={predicate} {...props} />,
  identifiedBy: ({predicate, ...props}) => <charts.IdentifiedBy predicate={predicate} {...props} />,
  recordedBy: ({predicate, ...props}) => <charts.RecordedBy predicate={predicate} {...props} />,
  establishmentMeans: ({predicate, ...props}) => <charts.EstablishmentMeans predicate={predicate} defaultOption="PIE" {...props} />,
  month: ({predicate, ...props}) => <charts.Months predicate={predicate} defaultOption="PIE" {...props} />,
  preparations: ({predicate, ...props}) => <charts.Preparations predicate={predicate} defaultOption="PIE" {...props} />,
  datasetKey: ({predicate, ...props}) => <charts.Datasets predicate={predicate} {...props} />,
  taxa: ({predicate, ...props}) => <charts.Taxa predicate={predicate} {...props} />,
  occurrenceIssue: ({predicate, ...props}) => <charts.OccurrenceIssue predicate={predicate} {...props} />,
  dataQuality: ({predicate, ...props}) => <charts.DataQuality predicate={predicate} {...props} />,
  occurrenceSummary: ({predicate, ...props}) => <charts.OccurrenceSummary predicate={predicate} {...props} />,
  collectionKey: ({predicate, ...props}) => <charts.Collections predicate={predicate} {...props} />,
  institutionKey: ({predicate, ...props}) => <charts.Institutions predicate={predicate} {...props} />,
  projectId: ({predicate, ...props}) => <charts.ProjectId predicate={predicate} {...props} />,
  catalogNumber: ({predicate, ...props}) => <charts.CatalogNumber predicate={predicate} {...props} />,
  higherGeography: ({predicate, ...props}) => <charts.HigherGeography predicate={predicate} {...props} />,
};
