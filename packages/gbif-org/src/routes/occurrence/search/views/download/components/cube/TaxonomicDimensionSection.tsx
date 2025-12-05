import { SelectField } from './components';
import { TAXONOMIC_GROUPS, CubeDimensions } from './types';
import { getHigherTaxonomicGroups } from './utils';

interface TaxonomicDimensionSectionProps {
  cube: CubeDimensions;
  onUpdate: (updates: Partial<CubeDimensions>) => void;
}

export function TaxonomicDimensionSection({ cube, onUpdate }: TaxonomicDimensionSectionProps) {
  const handleTaxonomicLevelChange = (taxonomicLevel: string) => {
    const higherGroups = getHigherTaxonomicGroups(taxonomicLevel);
    onUpdate({
      taxonomicLevel,
      selectedHigherTaxonomyGroups: Array.from(higherGroups),
    });
  };

  return (
    <div className="g-space-y-4">
      <SelectField
        label="customSqlDownload.taxonomicDimension"
        helpText="customSqlDownload.help.taxonomicDimension"
        value={cube.taxonomicLevel || ''}
        onChange={handleTaxonomicLevelChange}
        options={TAXONOMIC_GROUPS}
        translationPrefix="customSqlDownload.taxon"
      />
    </div>
  );
}
