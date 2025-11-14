import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FaChevronLeft, FaCog } from 'react-icons/fa';
import TaxonomySelector from './TaxonomySelector';
import ExtensionsSelector from './ExtensionsSelector';
import CubeDimensionsSelector, { CubeDimensions } from './CubeDimensionsSelector';
import { useChecklistKey } from '@/hooks/useChecklistKey';
import { FormattedMessage } from 'react-intl';
import { FilterType } from '@/contexts/filter';
import { generateCubeSql, hasFilter } from './cube/cubeService';
import { DownloadSummary } from './DownloadSummary';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ConfigurationStepProps {
  selectedFormat: any;
  defaultChecklist?: string;
  filter?: FilterType;
  predicate?: any;
  onBack: () => void;
  onContinue: (config: any) => void;
  initialConfig: any;
}

// Format-specific configuration interfaces
interface BaseConfig {
  checklistKey: string;
}

interface DarwinCoreConfig extends BaseConfig {
  extensions: string[];
}

interface CubeConfig extends BaseConfig {
  cube: CubeDimensions;
  sql?: string;
  machineDescription?: string;
}

export default function ConfigurationStep({
  defaultChecklist,
  selectedFormat,
  predicate,
  onBack,
  filter,
  onContinue,
  initialConfig,
}: ConfigurationStepProps) {
  const currentContextChecklistKey = useChecklistKey();
  const isDarwinCoreArchive = selectedFormat?.id === 'DWCA';
  const isCubeData = selectedFormat?.id === 'SQL_CUBE';

  // Initialize configuration based on format
  const getInitialConfig = (): BaseConfig | DarwinCoreConfig | CubeConfig => {
    if (initialConfig) return initialConfig;
    const baseConfig = {
      checklistKey: currentContextChecklistKey ?? defaultChecklist,
    };

    if (isDarwinCoreArchive) {
      return { ...baseConfig, extensions: [] } as DarwinCoreConfig;
    }

    if (isCubeData) {
      return {
        ...baseConfig,
        cube: {
          taxonomicLevel: 'SPECIES',
          selectedHigherTaxonomyGroups: ['KINGDOM', 'PHYLUM', 'CLASS', 'ORDER', 'FAMILY', 'GENUS'],
          includeSpatialUncertainty: 'YES',
          includeTemporalUncertainty: 'YES',
          removeRecordsWithGeospatialIssues: !hasFilter(filter, 'hasGeospatialIssue'),
          removeRecordsTaxonIssues: !hasFilter(filter, 'taxonomicIssue'),
          removeRecordsAtCentroids: !hasFilter(filter, 'distanceFromCentroidInMeters'),
          removeFossilsAndLiving: !hasFilter(filter, 'basisOfRecord'),
          removeAbsenceRecords: !hasFilter(filter, 'occurrenceStatus'),
          temporalResolution: 'YEAR',
          randomize: 'YES',
        },
      } as CubeConfig;
    }

    return baseConfig as BaseConfig;
  };

  const [config, setConfig] = useState(getInitialConfig());
  const [isCubeValid, setIsCubeValid] = useState(false);

  // Determine which section should be expanded initially
  const getInitialActiveSection = () => {
    if (isDarwinCoreArchive) {
      return 'extensions'; // Expand extensions for Darwin Core Archive
    }
    if (isCubeData) {
      return 'cube'; // Expand cube for Cube Data
    }
    return 'taxonomy'; // Default to taxonomy if no other options
  };

  const [activeSection, setActiveSection] = useState<string | null>(getInitialActiveSection());

  const handleTaxonomyChange = (checklistKey: string) => {
    setConfig((prev) => ({ ...prev, checklistKey }));
  };

  const handleExtensionsChange = (extensions: string[]) => {
    if (isDarwinCoreArchive) {
      setConfig((prev) => ({ ...prev, extensions }));
    }
  };

  const handleDimensionsChange = (cube: CubeDimensions) => {
    if (isCubeData) {
      setConfig((prev) => ({ ...prev, cube }));
    }
  };

  const handleCubeValidationChange = (isValid: boolean) => {
    setIsCubeValid(isValid);
  };

  const handleContinue = async () => {
    if (isCubeData && 'cube' in config) {
      // Ensure SQL is generated for cube data before continuing
      const result = await generateCubeSql(config.cube, predicate);
      if (!result.sql) {
        alert('Error generating SQL'); // TODO: Replace with proper error handling UI
        return;
      }
      config.sql = result.sql;
      config.machineDescription = result.machineDescription;
    }
    onContinue(config);
  };

  // Validation logic for cube data
  const isCubeConfigValid = () => {
    if (!isCubeData) {
      return true; // Not cube data, so no validation needed
    }

    return isCubeValid;
  };

  const canContinue = isCubeConfigValid();

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const hasCubeSupport =
    currentContextChecklistKey === import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-mb-4">
        <button
          onClick={onBack}
          className="g-flex g-items-center g-gap-2 g-text-gray-600 hover:g-text-gray-900 g-mb-4 g-transition-colors"
        >
          <FaChevronLeft size={20} />
          <FormattedMessage id="occurrenceDownloadFlow.backToFormatSelection" />
        </button>
      </div>

      {!hasCubeSupport && (
        <Alert variant="info">
          <AlertTitle>Cube Support Unavailable</AlertTitle>
          <AlertDescription>
            No cube support for other checklists than the GBIF backbone
          </AlertDescription>
        </Alert>
      )}

      {hasCubeSupport && (
        <div className="g-grid lg:g-grid-cols-3 g-gap-8">
          {/* Configuration Sections */}
          <div className="lg:g-col-span-2 g-space-y-6">
            {/* Taxonomy Configuration - Always shown */}
            {!isCubeData && (
              <TaxonomySelector
                value={config.checklistKey}
                onChange={handleTaxonomyChange}
                isExpanded={activeSection === 'taxonomy'}
                onToggle={() => toggleSection('taxonomy')}
              />
            )}

            {/* Extensions Selection - Only for Darwin Core Archive */}
            {isDarwinCoreArchive && 'extensions' in config && (
              <ExtensionsSelector
                selectedExtensions={config.extensions}
                onChange={handleExtensionsChange}
                isExpanded={activeSection === 'extensions'}
                onToggle={() => toggleSection('extensions')}
              />
            )}

            {/* Cube Dimensions - Only for Cube Data */}
            {isCubeData && 'cube' in config && (
              <CubeDimensionsSelector
                cube={config.cube}
                onChange={handleDimensionsChange}
                isExpanded={activeSection === 'cube'}
                onToggle={() => toggleSection('cube')}
                onValidationChange={handleCubeValidationChange}
                filter={filter}
                predicate={predicate}
              />
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:g-col-span-1">
            <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
              <h3 className="g-font-semibold g-text-gray-900 g-mb-4">
                <FormattedMessage id="occurrenceDownloadFlow.downloadSummary" />
              </h3>

              <DownloadSummary selectedFormat={selectedFormat} configuration={config} />

              <div className="g-mt-6 g-pt-4 g-border-t g-border-gray-200">
                {canContinue && (
                  <div className="g-text-sm g-text-amber-700 g-bg-amber-50 g-p-3 g-rounded g-mb-4">
                    <FormattedMessage id="downloadKey.downloadExpectTime" />
                  </div>
                )}

                {!canContinue && (
                  <div className="g-text-red-600 g-text-sm g-font-medium g-mb-4">
                    <FormattedMessage id="customSqlDownload.errorMinimumDimensionForCube" />
                  </div>
                )}

                <Button
                  onClick={handleContinue}
                  disabled={!canContinue}
                  className="g-w-full g-flex g-items-center g-justify-center g-gap-2 disabled:g-opacity-50 disabled:g-cursor-not-allowed"
                >
                  <FaCog size={16} />
                  <FormattedMessage id="occurrenceDownloadFlow.continueToTerms" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
