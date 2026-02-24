import { Card } from '@/components/ui/smallCard';
import { GeoJsonMap } from './index';

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
  PopupContent: React.FC<{ features: Record<string, any>[] }>;
}) {
  return (
    <Card className="g-mb-4">
      {geojson && (
        <GeoJsonMap
          {...{ geojson, loading: geojsonLoading, error: geojsonError, className, PopupContent }}
        />
      )}
    </Card>
  );
}
