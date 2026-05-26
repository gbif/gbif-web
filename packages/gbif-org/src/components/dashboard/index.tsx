import React, { ComponentType, Suspense } from 'react';
import type * as Charts from './_chartImpl';
import ChartSkeletonCard from './skeletons/ChartSkeletonCard';
import { ChartSkeleton } from './skeletons/ChartSkeleton';

// All chart components are lazy-loaded. Every React.lazy below resolves through
// the same dynamic import, so Rollup keeps every chart implementation + highcharts
// in a single shared chunk that is only fetched when a chart first renders.
const loadCharts = () => import('./_chartImpl');

type ChartName = keyof typeof Charts;

function lazyChart<K extends ChartName>(name: K): ComponentType<any> {
  const Lazy = React.lazy(() =>
    loadCharts().then((m) => ({ default: m[name] as ComponentType<any> }))
  );
  const Wrapped = (props: any) => (
    <Suspense
      fallback={
        <ChartSkeletonCard>
          <ChartSkeleton />
        </ChartSkeletonCard>
      }
    >
      <Lazy {...props} />
    </Suspense>
  );
  Wrapped.displayName = name;
  return Wrapped;
}

// enumCharts
export const Licenses = lazyChart('Licenses');
export const BasisOfRecord = lazyChart('BasisOfRecord');
export const Months = lazyChart('Months');
export const MediaType = lazyChart('MediaType');
export const OccurrenceIssue = lazyChart('OccurrenceIssue');
export const Country = lazyChart('Country');
export const PublishingCountryCode = lazyChart('PublishingCountryCode');
export const Continent = lazyChart('Continent');
export const DwcaExtension = lazyChart('DwcaExtension');
export const Protocol = lazyChart('Protocol');
export const IucnCounts = lazyChart('IucnCounts');
export const LiteratureTopics = lazyChart('LiteratureTopics');
export const LiteratureType = lazyChart('LiteratureType');
export const LiteratureRelevance = lazyChart('LiteratureRelevance');
export const LiteratureCountriesOfResearcher = lazyChart('LiteratureCountriesOfResearcher');
export const LiteratureCountriesOfCoverage = lazyChart('LiteratureCountriesOfCoverage');

// keyCharts
export const Datasets = lazyChart('Datasets');
export const Publishers = lazyChart('Publishers');
export const HostingOrganizations = lazyChart('HostingOrganizations');
export const Collections = lazyChart('Collections');
export const Institutions = lazyChart('Institutions');
export const Networks = lazyChart('Networks');
export const EstablishmentMeans = lazyChart('EstablishmentMeans');
export const Synonyms = lazyChart('Synonyms');
export const TypeStatus = lazyChart('TypeStatus');
export const Sex = lazyChart('Sex');

// stringCharts
export const InstitutionCodes = lazyChart('InstitutionCodes');
export const ProjectId = lazyChart('ProjectId');
export const DatasetId = lazyChart('DatasetId');
export const CollectionCodes = lazyChart('CollectionCodes');
export const StateProvince = lazyChart('StateProvince');
export const WaterBody = lazyChart('WaterBody');
export const IdentifiedBy = lazyChart('IdentifiedBy');
export const RecordedBy = lazyChart('RecordedBy');
export const Preparations = lazyChart('Preparations');
export const OrganismId = lazyChart('OrganismId');
export const HigherGeography = lazyChart('HigherGeography');
export const CatalogNumber = lazyChart('CatalogNumber');
export const EventId = lazyChart('EventId');
export const SampleSizeUnit = lazyChart('SampleSizeUnit');
export const SamplingProtocol = lazyChart('SamplingProtocol');
export const GadmGid = lazyChart('GadmGid');

// timeCharts
export const EventDate = lazyChart('EventDate');
export const LiteratureCreatedAt = lazyChart('LiteratureCreatedAt');

// Custom
export const Taxa = lazyChart('Taxa');
export const Iucn = lazyChart('Iucn');

// Top-level
export const DataQuality = lazyChart('DataQuality');
export const OccurrenceSummary = lazyChart('OccurrenceSummary');
export const OccurrenceTaxonomySunburst = lazyChart('OccurrenceTaxonomySunburst');
export const OccurrenceTaxonomyTree = lazyChart('OccurrenceTaxonomyTree');
