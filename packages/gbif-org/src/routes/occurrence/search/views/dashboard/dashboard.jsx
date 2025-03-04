import { ClientSideOnly } from '@/components/clientSideOnly';
import * as charts from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/smallCard';
import { useJsonParam } from '@/hooks/useParam';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import useLocalStorage from 'use-local-storage';
import { Map } from '../map';
import { Media } from '../media';
import { OccurrenceTable as Table } from '../table/occurrenceTable';
import DashboardBuilder from './DashboardBuilder';

export function Dashboard({ predicate, chartsTypes: chartsTypesProp, ...props }) {
  const [urlLayout, setUrlLayout] = useJsonParam({ key: 'layout' });
  const [layout = [[]], setLayoutState] = useLocalStorage('occurrenceDashboardLayout', [[]]);
  const [chartsTypes, setChartsTypes] = useState([]);

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
    (value, useUrl) => {
      if (useUrl) {
        setUrlLayout(value);
      } else {
        setLayoutState(value);
        setUrlLayout();
      }
    },
    [setLayoutState, setUrlLayout]
  );

  const isUrlLayoutDifferent = urlLayout && JSON.stringify(urlLayout) !== JSON.stringify(layout);
  return (
    <div>
      {isUrlLayoutDifferent && (
        <div className="g-mb-4">
          <FormattedMessage id="dashboard.sharedLayout" />{' '}
          <Button className="g-ms-4" onClick={() => setUrlLayout()}>
            <FormattedMessage id="phrases.discard" />
          </Button>{' '}
          <Button
            look="primaryOutline"
            className="g-ms-4"
            onClick={() => {
              setLayoutState(urlLayout);
              setUrlLayout();
            }}
          >
            <FormattedMessage id="phrases.keep" />
          </Button>
        </div>
      )}
      <DashboardBuilder
        chartsTypes={chartsTypes}
        predicate={predicate}
        setState={updateState}
        state={urlLayout ?? layout}
        {...{ lockedLayout: isUrlLayoutDifferent }}
      />
    </div>
  );
}

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
  publisherKey: {
    component: ({ predicate, ...props }) => {
      return <charts.Publishers predicate={predicate} interactive {...props} />;
    },
  },
  publishingCountryCode: {
    translation: 'filters.publishingCountryCode.name',
    component: ({ predicate, ...props }) => {
      return <charts.PublishingCountryCode predicate={predicate} interactive {...props} />;
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
  typeStatus: {
    component: ({ predicate, ...props }) => {
      return <charts.TypeStatus predicate={predicate} interactive {...props} />;
    },
  },
  sex: {
    component: ({ predicate, ...props }) => {
      return <charts.Sex predicate={predicate} {...props} />;
    },
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
      return <charts.DataQuality predicate={predicate} {...props} />;
    },
  },
  occurrenceSummary: {
    translation: 'dashboard.statistics',
    component: ({ predicate, ...props }) => {
      return <charts.OccurrenceSummary predicate={predicate} {...props} />;
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
  map: {
    translation: 'search.tabs.map',
    r: true, // resizable
    component: ({ predicate, ...props }) => {
      return (
        <Card className="g-overflow-y-auto g-h-full g-p-2 g-overflow-x-hidden">
          <Map
            className=""
            mapProps={{
              style: { border: 0, borderRadius: '0 0 var(--borderRadiusPx) var(--borderRadiusPx)' },
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
          <Media
            size={10}
            className="g-pt-2 g-border g-rounded g-overflow-auto g-h-full"
            {...props}
          />
        </Card>
      );
    },
  },
};
