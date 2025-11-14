import { FormattedMessage } from 'react-intl';
import { SelectField, RadioGroup } from './components';
import { SPATIAL_GROUPS, RESOLUTION_OPTIONS, RESOLUTION_DEFAULTS, CubeDimensions } from './types';

interface SpatialDimensionSectionProps {
  cube: CubeDimensions;
  onUpdate: (updates: Partial<CubeDimensions>) => void;
}

export function SpatialDimensionSection({ cube, onUpdate }: SpatialDimensionSectionProps) {
  const handleSpatialChange = (spatial: string) => {
    const resolution = RESOLUTION_DEFAULTS[spatial] || '';
    onUpdate({ spatial, resolution });
  };

  return (
    <div className="g-space-y-4">
      <SelectField
        label="customSqlDownload.spatialDimension"
        helpText="customSqlDownload.help.grid"
        value={cube.spatial || ''}
        onChange={handleSpatialChange}
        options={SPATIAL_GROUPS}
        translationPrefix="customSqlDownload.grid"
      />

      {cube.spatial && cube.spatial !== 'COUNTRY' && (
        <div>
          <SelectField
            label="customSqlDownload.spatialResolution"
            helpText="customSqlDownload.help.gridResolution"
            value={String(cube.resolution || '')}
            onChange={(value) => onUpdate({ resolution: parseInt(value) })}
            options={RESOLUTION_OPTIONS[cube.spatial] || []}
            translationPrefix={`customSqlDownload.resolution.${cube.spatial}`}
            disableNone
          />
        </div>
      )}

      {cube.spatial && (
        <div>
          <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
            <FormattedMessage
              id="customSqlDownload.randomPoints"
              defaultMessage="Randomize points within uncertainty circle"
            />
          </label>
          <p className="g-text-sm g-text-gray-600 g-mb-3">
            <FormattedMessage
              id="customSqlDownload.help.randomizePoints"
              defaultMessage="For occurrence records with a coordinate uncertainty that covers more than one grid cell, should a random cell be chosen?"
            />
          </p>
          <RadioGroup
            name="randomize"
            value={cube.randomize}
            onChange={(value) => onUpdate({ randomize: value })}
          />
        </div>
      )}
    </div>
  );
}