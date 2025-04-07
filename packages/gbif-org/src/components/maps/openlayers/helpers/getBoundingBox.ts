import { BoundingBox } from '@/types';
import type Map from 'ol/Map';
import { transform } from 'ol/proj';

type Args = {
  map: Map;
};

export function getBoundingBox({ map }: Args): BoundingBox {
  const view = map.getView();
  const size = map.getSize();
  const extent = view.calculateExtent(size);
  const [left, top] = transform([extent[0], extent[3]], view.getProjection(), 'EPSG:4326');
  const [right, bottom] = transform([extent[2], extent[1]], view.getProjection(), 'EPSG:4326');

  return { top, left, bottom, right };
}
