import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDna,
  FaSatellite,
  FaUsers,
  FaTh,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaChevronRight,
} from 'react-icons/fa';

interface QualityFiltersProps {
  onContinue: (filters: any) => void;
}

export default function QualityFilters({ onContinue }: QualityFiltersProps) {
  const [filters, setFilters] = useState({
    coordinates: {
      requireCoordinates: true,
      removeCoordinateIssues: true,
      removeZeroCoordinates: true,
    },
    taxonomy: {
      requireTaxonomy: true,
      requireTaxonomicMatch: true,
      removeUnknownRank: false,
    },
    temporal: {
      requireDate: true,
      removeFutureDate: true,
      requireCompleteDate: false,
    },
    datasetTypes: {
      includeDNA: true,
      includeGPSTracking: true,
      includeCitizenScience: true,
      includeGriddedData: true,
      includeSpecimens: true,
      includeObservations: true,
    },
  });

  const [expandedSection, setExpandedSection] = useState<string | null>('coordinates');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const updateFilter = (category: string, key: string, value: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((total, category) => {
      return total + Object.values(category).filter(Boolean).length;
    }, 0);
  };

  const handleContinue = () => {
    onContinue(filters);
  };

  const filterSections = [
    {
      id: 'coordinates',
      title: 'Coordinate Quality',
      icon: FaMapMarkerAlt,
      description: 'Filter records based on coordinate data quality',
      color: 'primary',
      filters: [
        {
          key: 'requireCoordinates',
          label: 'Require coordinates',
          description: 'Remove records without latitude/longitude data',
          recommended: true,
        },
        {
          key: 'removeCoordinateIssues',
          label: 'Remove coordinate issues',
          description: 'Exclude records flagged with coordinate problems',
          recommended: true,
        },
        {
          key: 'removeZeroCoordinates',
          label: 'Remove zero coordinates',
          description: 'Exclude records at 0°N, 0°E (likely data errors)',
          recommended: true,
        },
      ],
    },
    {
      id: 'taxonomy',
      title: 'Taxonomic Quality',
      icon: FaDna,
      description: 'Filter records based on taxonomic information',
      color: 'green',
      filters: [
        {
          key: 'requireTaxonomy',
          label: 'Require taxonomic name',
          description: 'Remove records without scientific names',
          recommended: true,
        },
        {
          key: 'requireTaxonomicMatch',
          label: 'Require taxonomic match',
          description: 'Only include names matched to taxonomic backbone',
          recommended: true,
        },
        {
          key: 'removeUnknownRank',
          label: 'Remove unknown taxonomic rank',
          description: 'Exclude records with unclear taxonomic hierarchy',
          recommended: false,
        },
      ],
    },
    {
      id: 'temporal',
      title: 'Date Quality',
      icon: FaCalendarAlt,
      description: 'Filter records based on temporal data quality',
      color: 'purple',
      filters: [
        {
          key: 'requireDate',
          label: 'Require event date',
          description: 'Remove records without collection/observation dates',
          recommended: true,
        },
        {
          key: 'removeFutureDate',
          label: 'Remove future dates',
          description: 'Exclude records with dates in the future',
          recommended: true,
        },
        {
          key: 'requireCompleteDate',
          label: 'Require complete date',
          description: 'Only include records with full year-month-day dates',
          recommended: false,
        },
      ],
    },
    {
      id: 'datasetTypes',
      title: 'Dataset Types',
      icon: FaTh,
      description: 'Include or exclude specific types of datasets',
      color: 'amber',
      filters: [
        {
          key: 'includeDNA',
          label: 'DNA/Genetic data',
          description: 'Include datasets with genetic sequences',
          recommended: true,
          icon: FaDna,
        },
        {
          key: 'includeGPSTracking',
          label: 'GPS tracking data',
          description: 'Include animal tracking and telemetry data',
          recommended: true,
          icon: FaSatellite,
        },
        {
          key: 'includeCitizenScience',
          label: 'Citizen science',
          description: 'Include community-contributed observations',
          recommended: true,
          icon: FaUsers,
        },
        {
          key: 'includeGriddedData',
          label: 'Gridded data',
          description: 'Include systematically sampled grid data',
          recommended: true,
          icon: FaTh,
        },
        {
          key: 'includeSpecimens',
          label: 'Museum specimens',
          description: 'Include preserved specimens from collections',
          recommended: true,
        },
        {
          key: 'includeObservations',
          label: 'Field observations',
          description: 'Include direct field observations',
          recommended: true,
        },
      ],
    },
  ];

  return (
    <div className="g-max-w-4xl g-mx-auto">
      {/* Header */}
      <div className="g-text-center g-mb-8">
        {/* <div className="g-flex g-items-center g-justify-center g-gap-3 g-mb-4">
          <div className="g-p-3 g-bg-primary-100 g-rounded">
            <FaFilter size={24} className="g-text-primary-600" />
          </div>
          <h1 className="g-text-2xl g-font-bold g-text-gray-900">Quality Filters</h1>
        </div> */}
        <p className="g-text-gray-600 g-max-w-2xl g-mx-auto">
          Did you know? Most users improve data quality by applying filters. Learn more
        </p>
      </div>

      <div className="g-grid lg:g-grid-cols-3 g-gap-8">
        {/* Filter Sections */}
        <div className="lg:g-col-span-2 g-space-y-4">
          {filterSections.map((section) => {
            const isExpanded = expandedSection === section.id;
            const activeCount = Object.entries(filters[section.id]).filter(
              ([_, value]) => value
            ).length;

            return (
              <div
                key={section.id}
                className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="g-w-full g-p-6 g-text-left g-flex g-items-center g-justify-between hover:g-bg-gray-50 g-transition-colors"
                >
                  <div className="g-flex g-items-center g-gap-4">
                    <div className={`g-p-2 g-bg-${section.color}-100 g-rounded`}>
                      <section.icon size={20} className={`g-text-${section.color}-600`} />
                    </div>
                    <div>
                      <h3 className="g-font-semibold g-text-gray-900">{section.title}</h3>
                      <p className="g-text-sm g-text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <div className="g-flex g-items-center g-gap-3">
                    <span className="g-text-sm g-text-gray-500">{activeCount} active</span>
                    <FaChevronRight
                      size={20}
                      className={`g-text-gray-400 g-transition-transform ${
                        isExpanded ? 'g-rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="g-border-t g-border-gray-200 g-p-6 g-bg-gray-50">
                    <div className="g-space-y-4">
                      {section.filters.map((filter) => {
                        const FilterIcon = filter.icon;
                        const isActive = filters[section.id][filter.key];

                        return (
                          <label
                            key={filter.key}
                            className="g-flex g-items-start g-gap-4 g-p-4 g-bg-white g-rounded g-border g-border-gray-200 hover:g-border-gray-300 g-cursor-pointer g-transition-colors"
                          >
                            <div className="g-flex-shrink-0 g-mt-1">
                              <Checkbox
                                checked={isActive}
                                onCheckedChange={(checked) =>
                                  updateFilter(section.id, filter.key, checked === true)
                                }
                              />
                            </div>
                            <div className="g-flex-1">
                              <div className="g-flex g-items-center g-gap-2 g-mb-1">
                                {FilterIcon && <FilterIcon size={16} className="g-text-gray-500" />}
                                <span className="g-font-medium g-text-gray-900">
                                  {filter.label}
                                </span>
                                {filter.recommended && (
                                  <span className="g-text-xs g-bg-green-100 g-text-green-700 g-px-2 g-py-0.5 g-rounded-full">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <p className="g-text-sm g-text-gray-600">{filter.description}</p>
                            </div>
                            <div className="g-flex-shrink-0">
                              {isActive ? (
                                <FaCheck size={16} className="g-text-green-600" />
                              ) : (
                                <FaTimes size={16} className="g-text-gray-300" />
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:g-col-span-1">
          <div className="g-bg-white g-rounded g-shadow-md g-border g-border-gray-200 g-p-6 g-sticky g-top-6">
            <h3 className="g-font-semibold g-text-gray-900 g-mb-4">Filter Summary</h3>

            <div className="g-space-y-3 g-text-sm g-mb-6">
              <div className="g-flex g-justify-between">
                <span className="g-text-gray-600">Active filters:</span>
                <span className="g-font-medium g-text-primary-600">{getActiveFiltersCount()}</span>
              </div>

              {filterSections.map((section) => {
                const activeCount = Object.entries(filters[section.id]).filter(
                  ([_, value]) => value
                ).length;
                return (
                  <div key={section.id} className="g-flex g-justify-between">
                    <span className="g-text-gray-600">{section.title}:</span>
                    <span className="g-font-medium">{activeCount}</span>
                  </div>
                );
              })}
            </div>

            <div className="g-bg-primary-50 g-border g-border-primary-200 g-rounded g-p-4 g-mb-6">
              <div className="g-flex g-items-start g-gap-3">
                <FaInfoCircle size={16} className="g-text-primary-600 g-mt-0.5 g-flex-shrink-0" />
                <div>
                  <h4 className="g-font-medium g-text-primary-900 g-mb-1">Quality Impact</h4>
                  <p className="g-text-primary-800 g-text-sm">
                    These filters will improve data quality but may reduce the total number of
                    records in your download.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="g-w-full g-flex g-items-center g-justify-center g-gap-2"
            >
              Continue to Formats
              <FaChevronRight size={16} />
            </Button>

            <p className="g-text-xs g-text-gray-500 g-text-center g-mt-3">
              You can modify these filters later if needed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
