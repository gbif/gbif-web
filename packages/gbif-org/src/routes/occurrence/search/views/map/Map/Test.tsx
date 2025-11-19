import { ErrorBoundary } from '@/components/ErrorBoundary';
import MapComponentOL from './OpenlayersMap';
import { getMapStyles } from './standardMapStyles';
import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import { useEffect, useState } from 'react';

const layers = [
  {
    id: 'something',
    predicateHash: '-1312810364',
    style: {
      // 5 blue purple gradients. going from blue to purple
      colors: ['#4343d3'],
    },
  },
  {
    id: 'triangle',
    predicateHash: '-1312791797',
    style: {
      // 5 purple gradients
      colors: ['#800080', '#bf40bf', '#d580d5', '#e6a6e6', '#f2c2f2'],
    },
  },
];
export function TestMap() {
  const config = useConfig();
  const { locale } = useI18n();
  const [mapStyles, setMapStyles] = useState({});

  useEffect(() => {
    const mapStyles = getMapStyles({
      apiKeys: config?.apiKeys,
      language: locale.mapTileLocale || 'en',
    });
    setMapStyles(mapStyles);
  }, [config, locale]);

  const mapConfig = mapStyles?.NATURAL_PLATE_CAREE?.mapConfig;
  if (!mapConfig) {
    return null;
  }
  return (
    <ErrorBoundary type="BLOCK">
      <MapComponentOL
        overlays={layers}
        mapConfig={mapConfig}
        className="mapComponent g-h-96 g-w-full g-border g-border-gray-300"
      />
    </ErrorBoundary>
  );
}
