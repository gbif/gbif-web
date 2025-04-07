import { ProjectionHelpers } from '@/components/maps/openlayers/projections';
import { useI18n } from '@/reactRouterPlugins';
import type Map from 'ol/Map';
import { useEffect } from 'react';
import { mapWidgetOptions } from '../../options';
import { useIntl } from 'react-intl';
import { formatTimeAgo } from '@/utils/formatTimeAgo';

type Args = {
  map?: Map | null;
  projection: ProjectionHelpers;
  baseLayerStyle: string;
  generatedAt?: string;
};

export function useRasterBaseLayer({ map, projection, baseLayerStyle, generatedAt }: Args) {
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

    map.setView(projection.getView(0, 0, 0));
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
  }, [projection, map, generatedAt, localizedStyle, formatRelativeTime, formatMessage]);
}
