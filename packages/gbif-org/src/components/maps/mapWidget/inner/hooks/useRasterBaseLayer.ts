import { ProjectionHelpers } from '@/components/maps/openlayers/projections';
import { useI18n } from '@/reactRouterPlugins';
import { formatTimeAgo } from '@/utils/formatTimeAgo';
import type Map from 'ol/Map';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { mapWidgetOptions } from '../../options';

type Args = {
  map?: Map | null;
  projection: ProjectionHelpers;
  baseLayerStyle: string;
  generatedAt?: string;
  capabilities?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
};

export function useRasterBaseLayer({
  map,
  projection,
  baseLayerStyle,
  generatedAt,
  capabilities,
}: Args) {
  const { locale } = useI18n();
  const { formatRelativeTime, formatMessage } = useIntl();

  const localizedStyle =
    mapWidgetOptions.localizedStyles[baseLayerStyle] && locale.mapTileLocale
      ? `${baseLayerStyle}-${locale.mapTileLocale}`
      : baseLayerStyle;

  useEffect(() => {
    if (!map) return;

    // Remove the old base layer
    map.getLayers().forEach((layer) => {
      if (layer != null && layer.get('name') === 'baseLayer') {
        map.removeLayer(layer);
      }
    });
    const view = projection.getView(0, 0, 0);

    if (capabilities && capabilities.maxLng - capabilities.minLng < 180) {
      const extent = [
        capabilities.minLng,
        capabilities.minLat,
        capabilities.maxLng,
        capabilities.maxLat,
      ];

      // Add padding to the extent
      const padding = 0.1; // 10% padding
      const width = capabilities.maxLng - capabilities.minLng;
      const height = capabilities.maxLat - capabilities.minLat;

      const paddedExtent = [
        extent[0] - width * padding,
        extent[1] - height * padding,
        extent[2] + width * padding,
        extent[3] + height * padding,
      ];

      view.fit(paddedExtent, {
        size: map.getSize(),
        padding: [50, 50, 50, 50], // Add some padding around the edges
        maxZoom: 18,
      });
    } else {
      view.fit([-180, -90, 180, 90]);
    }
    map.setView(view);
    if ('zoomToFitContainer' in projection) {
      projection.zoomToFitContainer(map);
    }

    const attributions: string[] = [];
    if (generatedAt) {
      const timeAgo = formatTimeAgo({
        date: generatedAt,
        formatRelativeTime,
      });
      const message = formatMessage({ id: 'map.generatedDateAgo' }, { DATE_AGO: timeAgo });
      if (timeAgo) attributions.push(message);
    }

    const baseLayer = projection.getRasterBaseLayer({
      style: localizedStyle,
      attributions: attributions,
    });

    map.getLayers().insertAt(0, baseLayer);
  }, [
    projection,
    map,
    generatedAt,
    localizedStyle,
    formatRelativeTime,
    formatMessage,
    capabilities,
  ]);
}
