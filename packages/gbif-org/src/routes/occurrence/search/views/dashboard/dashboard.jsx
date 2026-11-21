import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import { MapChartsEnabledContext } from '@/components/dashboard/charts/OneDimensionalChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/smallCard';
import { useParam } from '@/hooks/useParam';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'use-local-storage';
import { parseLayout, serializeLayout } from './layoutSerialization';
import { Map } from '../map';
import { Media } from '../media';
import { OccurrenceTable as Table } from '../table/occurrenceTable';
const DashboardBuilder = React.lazy(() => import('./DashboardBuilder'));

/**
 * @typedef {import('./layoutSerialization').Layout} Layout
 * @typedef {import('./DashboardBuilder').ChartTypes} ChartTypes
 */

/**
 * The search filters available on this site. Charts for fields that might not have a filter only
 * set a filter on click when it exists.
 * @type {React.Context<string[]>}
 */
const AvailableFiltersContext = React.createContext(/** @type {string[]} */ ([]));

/**
 * @param {{
 *   chart: React.ComponentType<any>,
 *   filter: string,
 *   [key: string]: unknown,
 * }} props
 */
function FilterAwareChart({ chart: Chart, filter, ...props }) {
  const availableFilters = useContext(AvailableFiltersContext);
  return <Chart {...props} interactive={availableFilters.includes(filter)} />;
}

/**
 * @param {{
 *   predicate?: import('@/gql/graphql').Predicate,
 *   q?: string,
 *   chartsTypes: string[],
 *   availableFilters?: string[],
 * }} props
 */
export function Dashboard({ predicate, q, chartsTypes: chartsTypesProp, availableFilters = [] }) {
  const [urlLayout, setUrlLayout] = /** @type {typeof useParam<Layout | undefined>} */ (useParam)({
    key: 'layout',
    parse: parseLayout,
    serialize: serializeLayout,
  });
  const [layout = [[]], setLayoutState] = useLocalStorage(
    'occurrenceDashboardLayout',
    /** @type {Layout} */ ([[]])
  );
  const [chartsTypes, setChartsTypes] = useState(/** @type {ChartTypes} */ ({}));

  useEffect(() => {
    const charts = { ...preconfiguredCharts };
    // delete charts that are not in the chartsTypesProp array
    Object.keys(charts).forEach((key) => {
      if (!chartsTypesProp.includes(key)) {
        delete charts[key];
      }
    });
    setChartsTypes(charts);
  }, [chartsTypesProp]);

  const updateState = useCallback(
    /** @type {import('./DashboardBuilder').SetLayout} */
    (value, useUrl) => {
      if (useUrl) {
        setUrlLayout(value);
      } else {
        setLayoutState(value);
        setUrlLayout(undefined);
      }
    },
    [setLayoutState, setUrlLayout]
  );

  // Compare the canonical serialized form rather than the raw objects: the URL
  // representation intentionally omits ids/translation and normalizes param
  // order/types, so a freshly shared layout would otherwise look "different"
  // from the identical layout in local storage.
  const isUrlLayoutDifferent = urlLayout && serializeLayout(urlLayout) !== serializeLayout(layout);
  return (
    <MapChartsEnabledContext.Provider value={true}>
      <AvailableFiltersContext.Provider value={availableFilters}>
        <div>
          {isUrlLayoutDifferent && (
            <div className="g-mb-4">
              <FormattedMessage id="dashboard.sharedLayout" />{' '}
              <Button className="g-ms-4" onClick={() => setUrlLayout(undefined)}>
                <FormattedMessage id="phrases.discard" />
              </Button>{' '}
              <Button
                variant="primaryOutline"
                className="g-ms-4"
                onClick={() => {
                  setLayoutState(urlLayout);
                  setUrlLayout(undefined);
                }}
              >
                <FormattedMessage id="phrases.keep" />
              </Button>
            </div>
          )}
          <DashboardBuilder
            chartsTypes={chartsTypes}
            predicate={predicate}
            q={q}
            setState={updateState}
            state={urlLayout ?? layout}
            lockedLayout={!!isUrlLayoutDifferent}
          />
        </div>
      </AvailableFiltersContext.Provider>
    </MapChartsEnabledContext.Provider>
  );
}

/** @type {ChartTypes} */
const preconfiguredCharts = {
  iucn: {
    translation: 'dashboard.iucnThreatStatus',
    component: ({ predicate, ...props }) => {
      return <charts.Iucn predicate={predicate} interactive {...props} />;
    },
  },
  license: {
    component: ({ predicate, ...props }) => {
      return <charts.Licenses predicate={predicate} interactive {...props} />;
    },
  },
  basisOfRecord: {
    component: ({ predicate, ...props }) => {
      return <charts.BasisOfRecord predicate={predicate} interactive {...props} />;
    },
  },
  nucleotideSequenceTargetGene: {
    translation: 'filters.nucleotideSequenceTargetGene.name',
    component: ({ predicate, ...props }) => {
      return <charts.NucleotideSequenceTargetGene predicate={predicate} interactive {...props} />;
    },
  },
  sequencePhylogeny: {
    translation: 'dashboard.sequenceDendrogram',
    component: ({ predicate, ...props }) => {
      return <charts.SequencePhylogeny predicate={predicate} {...props} />;
    },
  },
  nucleotideSequenceSequenceLength: {
    translation: 'filters.nucleotideSequenceSequenceLength.name',
    component: ({ predicate, ...props }) => {
      return <charts.NucleotideSequenceLength predicate={predicate} interactive {...props} />;
    },
  },
  year: {
    component: ({ predicate, ...props }) => {
      return <charts.EventDate options={['TIME']} predicate={predicate} {...props} />;
    },
  },
  synonyms: {
    translation: 'dashboard.synonyms',
    component: ({ predicate, ...props }) => {
      return <charts.Synonyms predicate={predicate} interactive {...props} />;
    },
  },
  organismId: {
    translation: 'dashboard.organismId',
    component: ({ predicate, ...props }) => {
      return <charts.OrganismId predicate={predicate} interactive {...props} />;
    },
  },
  iucnCounts: {
    translation: 'filters.iucnRedListCategory.name',
    component: ({ predicate, ...props }) => {
      return <charts.IucnCounts predicate={predicate} interactive {...props} />;
    },
  },
  country: {
    translation: 'filters.occurrenceCountry.name',
    component: ({ predicate, ...props }) => {
      return <charts.Country predicate={predicate} interactive {...props} />;
    },
  },
  continent: {
    component: ({ predicate, ...props }) => {
      return <charts.Continent predicate={predicate} interactive {...props} />;
    },
  },
  dwcaExtension: {
    component: ({ predicate, ...props }) => {
      return <charts.DwcaExtension predicate={predicate} interactive {...props} />;
    },
  },
  eventId: {
    component: ({ predicate, ...props }) => {
      return <charts.EventId predicate={predicate} interactive {...props} />;
    },
  },
  gadmGid: {
    translation: 'dashboard.gadmLevel',
    component: ({ predicate, ...props }) => {
      return <charts.GadmGid predicate={predicate} interactive {...props} />;
    },
  },
  higherGeography: {
    component: ({ predicate, ...props }) => {
      return <charts.HigherGeography predicate={predicate} interactive {...props} />;
    },
  },
  mediaType: {
    component: ({ predicate, ...props }) => {
      return <charts.MediaType predicate={predicate} interactive {...props} />;
    },
  },
  networkKey: {
    component: ({ predicate, ...props }) => {
      return <charts.Networks predicate={predicate} interactive {...props} />;
    },
  },
  publishingOrg: {
    translation: 'filters.publisherKey.name',
    component: ({ predicate, ...props }) => {
      return <charts.Publishers predicate={predicate} interactive {...props} />;
    },
  },
  publishingCountry: {
    translation: 'filters.publishingCountryCode.name',
    component: ({ predicate, ...props }) => {
      return <charts.PublishingCountryCode predicate={predicate} interactive {...props} />;
    },
  },
  publishedByGbifRegion: {
    translation: 'filters.publishedByGbifRegion.name',
    component: ({ predicate, ...props }) => {
      return <charts.PublishedByGbifRegion predicate={predicate} interactive {...props} />;
    },
  },
  protocol: {
    component: ({ predicate, ...props }) => {
      return <charts.Protocol predicate={predicate} interactive {...props} />;
    },
  },
  sampleSizeUnit: {
    component: ({ predicate, ...props }) => {
      return <charts.SampleSizeUnit predicate={predicate} interactive {...props} />;
    },
  },
  samplingProtocol: {
    component: ({ predicate, ...props }) => {
      return <charts.SamplingProtocol predicate={predicate} interactive {...props} />;
    },
  },
  lithostratigraphy: {
    translation: 'filters.lithostratigraphy.name',
    component: ({ predicate, ...props }) => {
      return <charts.Lithostratigraphy predicate={predicate} interactive {...props} />;
    },
  },
  biostratigraphy: {
    translation: 'filters.biostratigraphy.name',
    component: ({ predicate, ...props }) => {
      return <charts.Biostratigraphy predicate={predicate} interactive {...props} />;
    },
  },
  typeStatus: {
    component: ({ predicate, ...props }) => {
      return <charts.TypeStatus predicate={predicate} interactive {...props} />;
    },
  },
  sex: {
    // offered whether or not the site has a sex filter
    component: (props) => <FilterAwareChart chart={charts.Sex} filter="sex" {...props} />,
  },
  waterBody: {
    component: ({ predicate, ...props }) => {
      return <charts.WaterBody predicate={predicate} interactive {...props} />;
    },
  },
  collectionCode: {
    translation: 'filters.collectionCode.name',
    component: ({ predicate, ...props }) => {
      return <charts.CollectionCodes predicate={predicate} interactive {...props} />;
    },
  },
  institutionCode: {
    translation: 'filters.institutionCode.name',
    component: ({ predicate, ...props }) => {
      return <charts.InstitutionCodes predicate={predicate} interactive {...props} />;
    },
  },
  stateProvince: {
    translation: 'filters.stateProvince.name',
    component: ({ predicate, ...props }) => {
      return <charts.StateProvince predicate={predicate} interactive {...props} />;
    },
  },
  identifiedBy: {
    translation: 'filters.identifiedBy.name',
    component: ({ predicate, ...props }) => {
      return <charts.IdentifiedBy predicate={predicate} interactive {...props} />;
    },
  },
  recordedBy: {
    translation: 'filters.recordedBy.name',
    component: ({ predicate, ...props }) => {
      return <charts.RecordedBy predicate={predicate} interactive {...props} />;
    },
  },
  establishmentMeans: {
    component: ({ predicate, ...props }) => {
      return (
        <charts.EstablishmentMeans
          predicate={predicate}
          interactive
          defaultOption="PIE"
          {...props}
        />
      );
    },
  },
  month: {
    component: ({ predicate, ...props }) => {
      return <charts.Months predicate={predicate} interactive defaultOption="PIE" {...props} />;
    },
  },
  preparations: {
    component: ({ predicate, ...props }) => {
      return <charts.Preparations predicate={predicate} defaultOption="PIE" {...props} />;
    },
  },
  datasetKey: {
    component: ({ predicate, ...props }) => {
      return <charts.Datasets predicate={predicate} interactive {...props} />;
    },
  },
  crosstab: {
    translation: 'dashboard.crosstab.name',
    component: ({ predicate, ...props }) => {
      return <charts.Crosstab predicate={predicate} interactive {...props} />;
    },
  },
  taxa: {
    translation: 'dashboard.taxa',
    component: ({ predicate, ...props }) => {
      return <charts.Taxa predicate={predicate} interactive {...props} />;
    },
  },
  occurrenceIssue: {
    component: ({ predicate, ...props }) => {
      return <charts.OccurrenceIssue predicate={predicate} interactive {...props} />;
    },
  },
  dataQuality: {
    translation: 'dashboard.richness',
    component: ({ predicate, ...props }) => {
      return <charts.DataQuality predicate={predicate} interactive {...props} />;
    },
  },
  occurrenceSummary: {
    translation: 'dashboard.statistics',
    component: ({ predicate, ...props }) => {
      return <charts.OccurrenceSummary predicate={predicate} {...props} />;
    },
  },
  TaxonomicBreakdown: {
    translation: 'dashboard.taxonomicBreakdown',
    component: ({ predicate, ...props }) => {
      return <charts.OccurrenceTaxonomySunburst predicate={predicate} {...props} />;
    },
  },
  collectionKey: {
    translation: 'filters.collectionKey.name',
    component: ({ predicate, ...props }) => {
      return <charts.Collections predicate={predicate} interactive {...props} />;
    },
  },
  institutionKey: {
    translation: 'filters.institutionKey.name',
    component: ({ predicate, ...props }) => {
      return <charts.Institutions predicate={predicate} interactive {...props} />;
    },
  },
  catalogNumber: {
    translation: 'filters.catalogNumber.name',
    component: ({ predicate, ...props }) => {
      return <charts.CatalogNumber predicate={predicate} interactive {...props} />;
    },
  },
  projectId: {
    translation: 'filters.projectId.name',
    component: ({ predicate, ...props }) => {
      return <charts.ProjectId predicate={predicate} interactive {...props} />;
    },
  },
  datasetId: {
    translation: 'filters.datasetId.name',
    component: ({ predicate, ...props }) => {
      return <charts.DatasetId predicate={predicate} interactive {...props} />;
    },
  },
  // Charts below are offered whether or not the site has a filter for the field.
  occurrenceStatus: {
    component: (props) => (
      <FilterAwareChart chart={charts.OccurrenceStatus} filter="occurrenceStatus" {...props} />
    ),
  },
  gbifRegion: {
    component: (props) => (
      <FilterAwareChart chart={charts.GbifRegion} filter="gbifRegion" {...props} />
    ),
  },
  taxonomicIssue: {
    translation: 'filters.occurrenceTaxonomicIssue.name',
    component: (props) => (
      <FilterAwareChart chart={charts.TaxonomicIssue} filter="taxonomicIssue" {...props} />
    ),
  },
  lifeStage: {
    component: (props) => (
      <FilterAwareChart chart={charts.LifeStage} filter="lifeStage" {...props} />
    ),
  },
  degreeOfEstablishment: {
    component: (props) => (
      <FilterAwareChart
        chart={charts.DegreeOfEstablishment}
        filter="degreeOfEstablishment"
        {...props}
      />
    ),
  },
  pathway: {
    component: (props) => <FilterAwareChart chart={charts.Pathway} filter="pathway" {...props} />,
  },
  recordNumber: {
    component: (props) => (
      <FilterAwareChart chart={charts.RecordNumber} filter="recordNumber" {...props} />
    ),
  },
  fieldNumber: {
    component: (props) => (
      <FilterAwareChart chart={charts.FieldNumber} filter="fieldNumber" {...props} />
    ),
  },
  parentEventId: {
    component: (props) => (
      <FilterAwareChart chart={charts.ParentEventId} filter="parentEventId" {...props} />
    ),
  },
  programme: {
    component: (props) => (
      <FilterAwareChart chart={charts.Programme} filter="programme" {...props} />
    ),
  },
  locality: {
    component: (props) => <FilterAwareChart chart={charts.Locality} filter="locality" {...props} />,
  },
  island: {
    component: (props) => <FilterAwareChart chart={charts.Island} filter="island" {...props} />,
  },
  islandGroup: {
    component: (props) => (
      <FilterAwareChart chart={charts.IslandGroup} filter="islandGroup" {...props} />
    ),
  },
  georeferencedBy: {
    component: (props) => (
      <FilterAwareChart chart={charts.GeoreferencedBy} filter="georeferencedBy" {...props} />
    ),
  },
  verbatimScientificName: {
    component: (props) => (
      <FilterAwareChart
        chart={charts.VerbatimScientificName}
        filter="verbatimScientificName"
        {...props}
      />
    ),
  },
  organismQuantityType: {
    component: (props) => (
      <FilterAwareChart
        chart={charts.OrganismQuantityType}
        filter="organismQuantityType"
        {...props}
      />
    ),
  },
  isInCluster: {
    component: (props) => (
      <FilterAwareChart chart={charts.IsInCluster} filter="isInCluster" {...props} />
    ),
  },
  isSequenced: {
    component: (props) => (
      <FilterAwareChart chart={charts.IsSequenced} filter="isSequenced" {...props} />
    ),
  },
  repatriated: {
    component: (props) => (
      <FilterAwareChart chart={charts.IsRepatriated} filter="repatriated" {...props} />
    ),
  },
  datasetCategory: {
    component: (props) => (
      <FilterAwareChart chart={charts.DatasetCategory} filter="datasetCategory" {...props} />
    ),
  },
  installationKey: {
    translation: 'installation.installation',
    // there is no installation filter, so this chart is never interactive
    component: (props) => <charts.Installations {...props} />,
  },
  map: {
    translation: 'search.tabs.map',
    r: true, // resizable
    component: ({ predicate, ...props }) => {
      return (
        <Card className="g-overflow-y-auto g-h-full g-p-2 g-overflow-x-hidden">
          <Map
            className=""
            mapStyleAttr={{
              border: 0,
              borderRadius: '0 0 var(--borderRadiusPx) var(--borderRadiusPx)',
            }}
            {...props}
          />
        </Card>
      );
    },
  },
  table: {
    translation: 'search.tabs.table',
    r: true, // resizable
    component: ({ predicate, ...props }) => {
      return (
        <Card className="g-overflow-hidden g-overflow-y-auto g-h-full g-p-2">
          <ClientSideOnly>
            <Table {...props} />
          </ClientSideOnly>
        </Card>
      );
    },
  },
  gallery: {
    translation: 'search.tabs.gallery',
    r: true, // resizable
    component: ({ predicate, ...props }) => {
      return (
        <Card className="g-overflow-y-auto g-h-full g-p-2">
          <Media size={10} {...props} />
        </Card>
      );
    },
  },
};

/** Chart types that are offered even when the site has no search filter for the field. */
export const filterIndependentCharts = [
  'occurrenceStatus',
  'gbifRegion',
  'taxonomicIssue',
  'lifeStage',
  'degreeOfEstablishment',
  'pathway',
  'recordNumber',
  'fieldNumber',
  'parentEventId',
  'programme',
  'locality',
  'island',
  'islandGroup',
  'georeferencedBy',
  'verbatimScientificName',
  'organismQuantityType',
  'isInCluster',
  'isSequenced',
  'repatriated',
  'installationKey',
  'datasetCategory',
];
