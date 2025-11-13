import { CheckboxField } from './components';
import { CubeDimensions } from './types';
import { hasFilter } from './cubeService';

interface DataQualitySectionProps {
  cube: CubeDimensions;
  onUpdate: (updates: Partial<CubeDimensions>) => void;
  filter?: any;
}

export function DataQualitySection({ cube, onUpdate, filter }: DataQualitySectionProps) {
  return (
    <div className="g-space-y-3">
      {!hasFilter(filter, 'hasGeospatialIssue') && (
        <CheckboxField
          checked={cube.removeRecordsWithGeospatialIssues}
          onCheckedChange={(checked) =>
            onUpdate({ removeRecordsWithGeospatialIssues: checked as boolean })
          }
          labelId="customSqlDownload.removeRecordsWithGeospatialIssues"
        />
      )}
      {!hasFilter(filter, 'taxonomicIssue') && (
        <CheckboxField
          checked={cube.removeRecordsTaxonIssues}
          onCheckedChange={(checked) => onUpdate({ removeRecordsTaxonIssues: checked as boolean })}
          labelId="customSqlDownload.removeRecordsTaxonIssues"
        />
      )}
      {!hasFilter(filter, 'distanceFromCentroidInMeters') && (
        <CheckboxField
          checked={cube.removeRecordsAtCentroids}
          onCheckedChange={(checked) => onUpdate({ removeRecordsAtCentroids: checked as boolean })}
          labelId="customSqlDownload.removeRecordsAtCentroids"
        />
      )}
      {!hasFilter(filter, 'basisOfRecord') && (
        <CheckboxField
          checked={cube.removeFossilsAndLiving}
          onCheckedChange={(checked) => onUpdate({ removeFossilsAndLiving: checked as boolean })}
          labelId="customSqlDownload.removeFossilsAndLiving"
        />
      )}
      {!hasFilter(filter, 'occurrenceStatus') && (
        <CheckboxField
          checked={cube.removeAbsenceRecords}
          onCheckedChange={(checked) => onUpdate({ removeAbsenceRecords: checked as boolean })}
          labelId="customSqlDownload.removeAbsenceRecords"
        />
      )}
    </div>
  );
}
