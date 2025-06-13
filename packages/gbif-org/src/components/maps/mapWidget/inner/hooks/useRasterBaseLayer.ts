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
      view.fit([
        capabilities.minLng,
        capabilities.minLat,
        capabilities.maxLng,
        capabilities.maxLat,
      ]);
      //const v = map.getView(); // zoom out a bit see https://github.com/gbif/maps/issues/17
      view.setZoom(view?.getZoom() - 0.5);
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
