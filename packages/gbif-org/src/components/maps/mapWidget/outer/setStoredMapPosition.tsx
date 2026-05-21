import proj4 from 'proj4';
import { EpsgName, srsByEpsgName } from '@/components/maps/projectionDefinitions';

export function setStoredMapPosition({
  center = [0, 0],
  zoom = 0,
  currentEpsg = 'EPSG_4326',
}: {
  center?: [number, number];
  zoom?: number;
  currentEpsg?: EpsgName;
}) {
  if (typeof sessionStorage === 'undefined') return;
  const fromSrs = srsByEpsgName[currentEpsg] ?? 'EPSG:4326';
  const reprojectedCenter =
    fromSrs === 'EPSG:4326'
      ? center
      : (proj4(fromSrs, 'EPSG:4326', center) as [number, number]);
  sessionStorage.setItem('mapZoom', zoom.toString());
  sessionStorage.setItem('mapLng', reprojectedCenter[0].toString());
  sessionStorage.setItem('mapLat', reprojectedCenter[1].toString());
}
