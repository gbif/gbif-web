import { SelectField } from './components';
import { TEMPORAL_GROUPS, CubeDimensions } from './types';

interface TemporalDimensionSectionProps {
  cube: CubeDimensions;
  onUpdate: (updates: Partial<CubeDimensions>) => void;
}

export function TemporalDimensionSection({ cube, onUpdate }: TemporalDimensionSectionProps) {
  return (
    <SelectField
      label="customSqlDownload.temporalDimension"
      helpText="customSqlDownload.help.temporalDimension"
      value={cube.temporalResolution || ''}
      onChange={(value) => onUpdate({ temporalResolution: value })}
      options={TEMPORAL_GROUPS}
      translationPrefix="customSqlDownload.time"
    />
  );
}