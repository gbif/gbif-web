import { FormattedMessage } from 'react-intl';
import { CheckboxField, RadioGroup } from './components';
import { CubeDimensions } from './types';

interface MeasurementsSectionProps {
  cube: CubeDimensions;
  onUpdate: (updates: Partial<CubeDimensions>) => void;
  higherTaxonomicGroups: readonly string[];
}

export function MeasurementsSection({
  cube,
  onUpdate,
  higherTaxonomicGroups,
}: MeasurementsSectionProps) {
  const toggleHigherTaxonomyGroup = (group: string) => {
    const current = cube.selectedHigherTaxonomyGroups || [];
    const updated = current.includes(group)
      ? current.filter((g) => g !== group)
      : [...current, group];
    onUpdate({ selectedHigherTaxonomyGroups: updated });
  };

  return (
    <div className="g-space-y-4">
      {/* Occurrence Count (Always Included) */}
      <CheckboxField
        checked={true}
        disabled={true}
        labelId="customSqlDownload.occurrenceMeasurements"
        labelDefault="Occurrence count (always included)"
        helpText="customSqlDownload.help.occurrenceCount"
      />

      {/* Higher Taxonomy Groups */}
      {higherTaxonomicGroups.length > 0 && (
        <div>
          <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
            <FormattedMessage
              id="customSqlDownload.countHigherTaxonomy"
              defaultMessage="Occurrence count at higher taxonomic level"
            />
          </label>
          <p className="g-text-sm g-text-gray-600 g-mb-3">
            <FormattedMessage
              id="customSqlDownload.help.higherTaxonomy"
              defaultMessage="Additional higher taxonomic ranks for which the number of occurrences should also be included."
            />
          </p>
          <div className="g-space-y-2">
            {higherTaxonomicGroups.map((group) => (
              <CheckboxField
                key={group}
                checked={(cube.selectedHigherTaxonomyGroups || []).includes(group)}
                onCheckedChange={() => toggleHigherTaxonomyGroup(group)}
                labelId={`customSqlDownload.taxon.${group}`}
                labelDefault={group}
              />
            ))}
          </div>
        </div>
      )}

      {/* Coordinate Uncertainty */}
      <div>
        <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
          <FormattedMessage
            id="customSqlDownload.coordinateUncertainty"
            defaultMessage="Include minimum coordinate uncertainty"
          />
        </label>
        <p className="g-text-sm g-text-gray-600 g-mb-3">
          <FormattedMessage
            id="customSqlDownload.help.minCoordinateUncertainty"
            defaultMessage="The lowest recorded coordinate uncertainty (in meters)."
          />
        </p>
        <RadioGroup
          name="includeSpatialUncertainty"
          value={cube.includeSpatialUncertainty}
          onChange={(value) => onUpdate({ includeSpatialUncertainty: value })}
        />
      </div>

      {/* Temporal Uncertainty */}
      <div>
        <label className="g-block g-text-sm g-font-medium g-text-gray-700 g-mb-2">
          <FormattedMessage
            id="customSqlDownload.temporalUncertainty"
            defaultMessage="Include minimum temporal uncertainty"
          />
        </label>
        <p className="g-text-sm g-text-gray-600 g-mb-3">
          <FormattedMessage
            id="customSqlDownload.help.minTemporalUncertainty"
            defaultMessage="The lowest recorded temporal uncertainty (in seconds)."
          />
        </p>
        <RadioGroup
          name="includeTemporalUncertainty"
          value={cube.includeTemporalUncertainty}
          onChange={(value) => onUpdate({ includeTemporalUncertainty: value })}
        />
      </div>
    </div>
  );
}