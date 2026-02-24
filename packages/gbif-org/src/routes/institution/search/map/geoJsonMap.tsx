import { ErrorBoundary } from '@/components/ErrorBoundary';
import { isWebglSupported } from '@/utils/isWebglSupported';
import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

const MapLibreMap = React.lazy(() => import('./geoJsonMapMaplibre'));
const OpenLayersMap = React.lazy(() => import('./geoJsonMapOpenlayers'));

export default function GeoJsonMap(props: {
  geojson: GeoJSON.FeatureCollection;
  loading: boolean;
  error: boolean;
  className?: string;
  defaultMapSettings?: { zoom: number; lat: number; lng: number };
  PopupContent: React.FC<{ features: Record<string, any>[] }>;
}) {
  const MapComponent = isWebglSupported() ? MapLibreMap : OpenLayersMap;

  return (
    <ErrorBoundary
      type="BLOCK"
      title={<FormattedMessage id="error.mapFailed" />}
      errorMessage={<FormattedMessage id="error.mapBrowserIssue" />}
      showReportButton={true}
      debugTitle="GeoJsonMap"
      className="g-mt-8 g-me-2"
    >
      <Suspense fallback={null}>
        <MapComponent {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}
