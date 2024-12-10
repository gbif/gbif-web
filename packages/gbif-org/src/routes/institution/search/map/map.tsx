import { Card } from "@/components/ui/smallCard";
import { GeoJsonMap } from "./geoJsonMap";

export function Map({
  geojson,
  geojsonLoading,
  geojsonError,
  className,
  PopupContent,
}: {
  geojson?: GeoJSON.FeatureCollection;
  geojsonLoading: boolean;
  geojsonError: boolean;
  className?: string;
  PopupContent: React.FC<{ feature: GeoJSON.Feature }>;
}) {
  return <Card className="g-mb-4">{geojson && <GeoJsonMap {...{geojson, loading: geojsonLoading, error: geojsonError, className, PopupContent}} />}</Card>;
}
