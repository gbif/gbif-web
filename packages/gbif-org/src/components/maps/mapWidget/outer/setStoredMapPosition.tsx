import { transform } from 'ol/proj';
import { projections } from '../../openlayers/projections';

export function setStoredMapPosition({
  center = [0, 0],
  zoom = 0,
  currentEpsg = 'EPSG_4326',
}: {
  center?: [number, number];
  zoom?: number;
  currentEpsg?: keyof typeof projections;
}) {
  const currentProjection = projections[currentEpsg ?? 'EPSG_4326'];
  const reprojectedCenter = transform(center, currentProjection.srs, 'EPSG:4326');
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('mapZoom', zoom.toString());
    sessionStorage.setItem('mapLng', reprojectedCenter[0].toString());
    sessionStorage.setItem('mapLat', reprojectedCenter[1].toString());
  }
}
