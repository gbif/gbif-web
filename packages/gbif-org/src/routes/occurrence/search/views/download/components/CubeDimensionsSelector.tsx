import { FaInfoCircle } from 'react-icons/fa';
import { FaCube as CubeIcon } from 'react-icons/fa6';
import { hasAllFilters } from './cube/cubeService';
import { FormattedMessage } from 'react-intl';
import ExpandableSection from './ExpandableSection';

// Import types
import { CubeDimensions, CubeDimensionsSelectorProps } from './cube/types';

// Import hooks
import { useCubeDimensions } from './cube/useCubeDimensions';
import { useCubeValidation } from './cube/useCubeValidation';
import { useSqlGeneration } from './cube/hooks';

// Import section components
import { TaxonomicDimensionSection } from './cube/TaxonomicDimensionSection';
import { TemporalDimensionSection } from './cube/TemporalDimensionSection';
import { SpatialDimensionSection } from './cube/SpatialDimensionSection';
import { MeasurementsSection } from './cube/MeasurementsSection';
import { DataQualitySection } from './cube/DataQualitySection';
import { FieldsetSection } from './cube/components';

// Import utils
import { getHigherTaxonomicGroups } from './cube/utils';

// Re-export types for external consumers
export type { CubeDimensions };

// ============================================================================
// Main Component
// ============================================================================

export default function CubeDimensionsSelector({
  cube,
  onChange,
  isExpanded,
  onToggle,
  filter,
  predicate,
  onValidationChange,
}: CubeDimensionsSelectorProps) {
  const { updateDimensions } = useCubeDimensions({ cube, onChange });
  const { isValid } = useCubeValidation({ cube, onValidationChange });
  const { isGenerating, error: sqlError, generateAndNavigate } = useSqlGeneration();

  const hideDataQuality = hasAllFilters(filter, [
    'hasGeospatialIssue',
    'taxonomicIssue',
    'distanceFromCentroidInMeters',
    'basisOfRecord',
    'occurrenceStatus',
  ]);

  const handleEditSql = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    generateAndNavigate(cube, predicate);
  };

  const higherTaxonomicGroups = getHigherTaxonomicGroups(cube.taxonomicLevel);

  return (
    <ExpandableSection
      icon={<CubeIcon size={20} className="g-text-primary-600" />}
      title={
        <FormattedMessage
          id="customSqlDownload.cubeConfiguration"
          defaultMessage="Cube configuration"
        />
      }
      description={
        <FormattedMessage
          id="customSqlDownload.cubeDescription"
          defaultMessage="Configure spatial, temporal, and taxonomic resolution"
        />
      }
      isExpanded={isExpanded}
      onToggle={onToggle}
    >
      {isExpanded && (
        <div className="g-space-y-8">
          {/* Info Banner */}
          <div className="g-mb-4 g-bg-blue-50 g-border g-border-blue-200 g-rounded g-p-4">
            <div className="g-flex g-items-start g-gap-3">
              <FaInfoCircle size={16} className="g-text-blue-600 g-mt-0.5 g-flex-shrink-0" />
              <p className="g-text-sm g-text-blue-800">
                <FormattedMessage
                  id="customSqlDownload.help.whatIsThis"
                  defaultMessage="This download format allows you to aggregate occurrences by their taxonomic, temporal and/or spatial properties."
                />
              </p>
            </div>
          </div>

          {/* Dimensions Section */}
          <FieldsetSection
            title="customSqlDownload.dimensions"
            helpText="customSqlDownload.help.dimensions"
          >
            <TaxonomicDimensionSection cube={cube} onUpdate={updateDimensions} />
            <TemporalDimensionSection cube={cube} onUpdate={updateDimensions} />
            <SpatialDimensionSection cube={cube} onUpdate={updateDimensions} />
          </FieldsetSection>

          {/* Measurements Section */}
          <FieldsetSection
            title="customSqlDownload.measurements"
            helpText="customSqlDownload.help.measurements"
          >
            <MeasurementsSection
              cube={cube}
              onUpdate={updateDimensions}
              higherTaxonomicGroups={higherTaxonomicGroups}
            />
          </FieldsetSection>

          {/* Data Quality Section */}
          {!hideDataQuality && (
            <FieldsetSection
              title="customSqlDownload.dataQuality"
              helpText="customSqlDownload.help.dataQuality"
            >
              <DataQualitySection cube={cube} onUpdate={updateDimensions} filter={filter} />
            </FieldsetSection>
          )}

          {/* Validation Message */}
          {!isValid && (
            <div className="g-text-red-600 g-text-sm g-font-medium">
              <FormattedMessage
                id="customSqlDownload.errorMinimumDimension"
                defaultMessage="At least one dimension must be selected"
              />
            </div>
          )}

          {/* Edit SQL Section */}
          <div className="g-mt-6 g-pt-6 g-border-t g-border-gray-200">
            <button
              onClick={handleEditSql}
              disabled={!isValid || isGenerating}
              className="g-text-primary-600 hover:g-text-primary-700 g-text-sm g-font-medium g-underline disabled:g-text-gray-400 disabled:g-no-underline"
            >
              {isGenerating ? (
                'Generating SQL...'
              ) : (
                <FormattedMessage id="customSqlDownload.editSql" defaultMessage="Edit as SQL" />
              )}
            </button>
            <p className="g-text-xs g-text-gray-600 g-mt-1">
              <FormattedMessage
                id="customSqlDownload.help.editSql"
                defaultMessage="The easiest way to download and explore data is via the occurrence search user interface. But for complex queries and aggregations, the SQL editor provides more freedom."
              />
            </p>
            {sqlError && <p className="g-text-xs g-text-red-600 g-mt-1">{sqlError}</p>}
          </div>
        </div>
      )}
    </ExpandableSection>
  );
}
