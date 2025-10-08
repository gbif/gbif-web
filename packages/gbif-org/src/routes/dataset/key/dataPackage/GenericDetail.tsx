import { useParam, useStringParam } from '@/hooks/useParam';
import { HelpLine } from '@/components/helpText';
import { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa6';
import { FaChevronDown } from 'react-icons/fa';

interface Field {
  name: string;
  title: string;
  type: string;
  description?: string;
  format?: string;
  examples?: string;
  comments?: string;
  namespace?: string;
  constraints?: {
    required?: boolean;
    unique?: boolean;
    minimum?: number;
    maximum?: number;
  };
}

interface Schema {
  name: string;
  title: string;
  description?: string;
  fields: Field[];
  primaryKey?: string;
}

interface ResourceSchema {
  name: string;
  schema: Schema;
}

interface GenericDetailProps {
  id: string;
  resourceType: string;
}

interface RelatedRecord {
  resourceName: string;
  resourceTitle: string;
  fieldName: string;
  count: number;
  records: Record<string, any>[];
  loading: boolean;
  hasMore: boolean;
  offset: number;
}

interface SearchResponse {
  results: Record<string, any>[];
  count: number;
  limit: number;
  offset: number;
}

export default function GenericDetail({ id, resourceType }: GenericDetailProps) {
  // const [datasetKey] = useParam({ key: 'key' });
  const datasetKey = 'bb1bcfd9-7ee3-4c6e-9b8d-661cc4c524f4';
  const [schemas, setSchemas] = useState<ResourceSchema[]>([]);
  const [rowData, setRowData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [entity, setEntity] = useStringParam({ key: 'entity' });
  const [relatedRecords, setRelatedRecords] = useState<RelatedRecord[]>([]);
  const [expandedRelated, setExpandedRelated] = useState<Set<string>>(new Set());

  // Find the schema for the current resource type
  const currentSchema = schemas.find((s) => s.name === resourceType)?.schema;

  // Helper function to check if a field is a foreign key
  const isForeignKey = (fieldName: string): boolean => {
    if (!currentSchema?.foreignKeys) return false;
    return currentSchema.foreignKeys.some((fk) => fk.fields === fieldName);
  };

  // Helper function to get the target resource for a foreign key field
  const getForeignKeyTarget = (fieldName: string): string | null => {
    if (!currentSchema?.foreignKeys) return null;
    const foreignKey = currentSchema.foreignKeys.find((fk) => fk.fields === fieldName);
    return foreignKey?.reference?.resource || null;
  };

  // Helper function to find resources that reference the current entity
  const findReferencingResources = () => {
    if (!schemas || !currentSchema) return [];

    const referencingResources: {
      resourceName: string;
      resourceTitle: string;
      fieldName: string;
    }[] = [];

    schemas.forEach(({ name: resourceName, schema }) => {
      if (resourceName === resourceType) return; // Skip self-references

      schema.foreignKeys?.forEach((fk) => {
        if (fk.reference?.resource === resourceType) {
          referencingResources.push({
            resourceName,
            resourceTitle: schema.title || resourceName,
            fieldName: fk.fields,
          });
        }
      });
    });

    return referencingResources;
  };

  useEffect(() => {
    const fetchSchemas = async () => {
      if (!datasetKey) return;

      try {
        const response = await fetch(
          `https://api.gbif-dev.org/v1/dataset/${datasetKey}/datapackage/resource`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch schemas: ${response.status}`);
        }

        const schemasData = await response.json();
        setSchemas(schemasData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schemas');
      }
    };

    fetchSchemas();
  }, [datasetKey]);

  useEffect(() => {
    const fetchRowData = async () => {
      if (!datasetKey || !resourceType || !id) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://api.gbif-dev.org/v1/dataset/${datasetKey}/datapackage/${resourceType}/${encodeURIComponent(
            id
          )}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch row data: ${response.status}`);
        }

        const data = await response.json();
        setRowData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load row data');
      } finally {
        setLoading(false);
      }
    };

    if (schemas.length > 0) {
      fetchRowData();
    }
  }, [datasetKey, resourceType, id, schemas]);

  // Initialize related records when schemas and rowData are available
  useEffect(() => {
    if (!schemas.length || !rowData || !currentSchema) return;

    const referencingResources = findReferencingResources();
    const initialRelatedRecords: RelatedRecord[] = referencingResources.map((ref) => ({
      ...ref,
      count: 0,
      records: [],
      loading: true, // Set to true initially while we fetch counts and data
      hasMore: false, // Start with false, will be updated when we get actual data
      offset: 0,
    }));

    setRelatedRecords(initialRelatedRecords);
    // Expand all related records by default
    setExpandedRelated(new Set(referencingResources.map((ref) => ref.resourceName)));

    // Fetch counts and initial data for all related records immediately
    referencingResources.forEach((ref) => {
      fetchRelatedRecordsCountAndData(ref.resourceName, ref.fieldName);
    });
  }, [schemas, rowData, currentSchema]);

  const fetchRelatedRecordsCount = async (resourceName: string, fieldName: string) => {
    if (!datasetKey || !id) return;

    try {
      const searchPayload = {
        datasetKey,
        resource: resourceName,
        limit: 5,
        offset,
        filters: {
          [fieldName]: [id],
        },
      };

      const response = await fetch('https://api.gbif-dev.org/v1/dataset/datapackage/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch related records count: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      setRelatedRecords((prev) =>
        prev.map((record) =>
          record.resourceName === resourceName
            ? {
                ...record,
                count: data.count,
                loading: false,
              }
            : record
        )
      );
    } catch (err) {
      console.error('Failed to fetch related records count:', err);
      setRelatedRecords((prev) =>
        prev.map((record) =>
          record.resourceName === resourceName ? { ...record, loading: false } : record
        )
      );
    }
  };

  const fetchRelatedRecordsCountAndData = async (resourceName: string, fieldName: string) => {
    if (!datasetKey || !id) return;

    try {
      // First get the count
      const countPayload = {
        datasetKey,
        resource: resourceName,
        limit: 0,
        offset: 0,
        filters: {
          [fieldName]: [id],
        },
      };

      const countResponse = await fetch('https://api.gbif-dev.org/v1/dataset/datapackage/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(countPayload),
      });

      if (!countResponse.ok) {
        throw new Error(`Failed to fetch related records count: ${countResponse.status}`);
      }

      const countData: SearchResponse = await countResponse.json();

      // If there are records, fetch the first batch
      if (countData.count > 0) {
        const dataPayload = {
          datasetKey,
          resource: resourceName,
          limit: 5,
          offset: 0,
          filters: {
            [fieldName]: [id],
          },
        };

        const dataResponse = await fetch('https://api.gbif-dev.org/v1/dataset/datapackage/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataPayload),
        });

        if (!dataResponse.ok) {
          throw new Error(`Failed to fetch related records data: ${dataResponse.status}`);
        }

        const dataResults: SearchResponse = await dataResponse.json();

        setRelatedRecords((prev) =>
          prev.map((record) =>
            record.resourceName === resourceName
              ? {
                  ...record,
                  count: countData.count,
                  records: dataResults.results,
                  loading: false,
                  hasMore: dataResults.results.length === 5 && 5 < countData.count,
                  offset: dataResults.results.length,
                }
              : record
          )
        );
      } else {
        // No records found
        setRelatedRecords((prev) =>
          prev.map((record) =>
            record.resourceName === resourceName
              ? {
                  ...record,
                  count: 0,
                  records: [],
                  loading: false,
                  hasMore: false,
                  offset: 0,
                }
              : record
          )
        );
      }
    } catch (err) {
      console.error('Failed to fetch related records count and data:', err);
      setRelatedRecords((prev) =>
        prev.map((record) =>
          record.resourceName === resourceName ? { ...record, loading: false } : record
        )
      );
    }
  };

  const fetchRelatedRecords = async (
    resourceName: string,
    fieldName: string,
    offset: number = 0,
    append: boolean = false
  ) => {
    if (!datasetKey || !id) return;

    setRelatedRecords((prev) =>
      prev.map((record) =>
        record.resourceName === resourceName ? { ...record, loading: true } : record
      )
    );

    try {
      const searchPayload = {
        datasetKey,
        resource: resourceName,
        limit: 20,
        offset,
        filters: {
          [fieldName]: [id],
        },
      };

      const response = await fetch('https://api.gbif-dev.org/v1/dataset/datapackage/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchPayload),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch related records: ${response.status}`);
      }

      const data: SearchResponse = await response.json();

      setRelatedRecords((prev) =>
        prev.map((record) =>
          record.resourceName === resourceName
            ? {
                ...record,
                count: data.count,
                records: append ? [...record.records, ...data.results] : data.results,
                loading: false,
                hasMore: data.results.length === 5 && offset + 5 < data.count,
                offset: offset + data.results.length,
              }
            : record
        )
      );
    } catch (err) {
      console.error('Failed to fetch related records:', err);
      setRelatedRecords((prev) =>
        prev.map((record) =>
          record.resourceName === resourceName ? { ...record, loading: false } : record
        )
      );
    }
  };

  const toggleRelatedRecords = async (resourceName: string, fieldName: string) => {
    const isExpanded = expandedRelated.has(resourceName);

    if (isExpanded) {
      setExpandedRelated((prev) => {
        const newSet = new Set(prev);
        newSet.delete(resourceName);
        return newSet;
      });
    } else {
      setExpandedRelated((prev) => new Set([...prev, resourceName]));
      // Data is already loaded during initialization, so no need to fetch here
    }
  };

  const renderFieldValue = (field: Field, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="g-text-gray-400 g-italic">No data</span>;
    }

    // Check if this field is a foreign key
    const isFK = isForeignKey(field.name);
    const targetResource = isFK ? getForeignKeyTarget(field.name) : null;

    // Handle foreign key fields as clickable links
    if (isFK && targetResource) {
      return (
        <button
          onClick={() => setEntity(`${targetResource}__${value}`)}
          className="g-text-blue-600 hover:g-text-blue-800 hover:g-underline g-cursor-pointer g-bg-transparent g-border-none g-p-0 g-font-inherit g-break-words"
        >
          {String(value)}
        </button>
      );
    }

    // Handle different field types
    switch (field.type) {
      case 'boolean':
        return (
          <span className={`g-font-semibold ${value ? 'g-text-green-600' : 'g-text-red-600'}`}>
            {value ? 'Yes' : 'No'}
          </span>
        );
      default:
        // Check if it looks like a URL
        if (
          typeof value === 'string' &&
          (value.startsWith('http://') || value.startsWith('https://'))
        ) {
          return (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="g-text-blue-600 hover:g-text-blue-800 hover:g-underline g-break-all"
            >
              {value}
            </a>
          );
        }
        return <span className="g-break-words">{String(value)}</span>;
    }
  };

  const renderFieldHelp = (field: Field) => {
    const hasMetadata =
      field.description ||
      field.examples ||
      field.comments ||
      field.constraints ||
      field.namespace ||
      field.format;

    if (!hasMetadata) return null;

    const helpContent = (
      <div className="g-space-y-3">
        <div className="g-text-sm">
          <div className="g-font-medium g-text-gray-700 g-mb-2">Field Information</div>
          <div className="g-space-y-2 g-text-xs g-text-gray-600">
            <div>
              <span className="g-font-medium">Name:</span>{' '}
              <code className="g-bg-gray-100 g-px-1 g-rounded">{field.name}</code>
            </div>
            <div>
              <span className="g-font-medium">Type:</span>{' '}
              <code className="g-bg-gray-100 g-px-1 g-rounded">{field.type}</code>
            </div>
            {field.namespace && (
              <div>
                <span className="g-font-medium">Namespace:</span>{' '}
                <code className="g-bg-gray-100 g-px-1 g-rounded">{field.namespace}</code>
              </div>
            )}
            {field.format && (
              <div>
                <span className="g-font-medium">Format:</span>{' '}
                <code className="g-bg-gray-100 g-px-1 g-rounded">{field.format}</code>
              </div>
            )}
          </div>
        </div>

        {field.description && (
          <div>
            <div className="g-font-medium g-text-gray-700 g-text-sm g-mb-1">Description</div>
            <p className="g-text-xs g-text-gray-600 g-leading-relaxed">{field.description}</p>
          </div>
        )}

        {field.examples && (
          <div>
            <div className="g-font-medium g-text-gray-700 g-text-sm g-mb-1">Examples</div>
            <p className="g-text-xs g-text-gray-600 g-font-mono g-bg-gray-100 g-p-2 g-rounded">
              {field.examples}
            </p>
          </div>
        )}

        {field.comments && (
          <div>
            <div className="g-font-medium g-text-gray-700 g-text-sm g-mb-1">Comments</div>
            <p className="g-text-xs g-text-gray-600 g-leading-relaxed">{field.comments}</p>
          </div>
        )}

        {field.constraints && (
          <div>
            <div className="g-font-medium g-text-gray-700 g-text-sm g-mb-1">Constraints</div>
            <div className="g-flex g-flex-wrap g-gap-1">
              {field.constraints.required && (
                <span className="g-text-xs g-bg-red-100 g-text-red-700 g-px-2 g-py-1 g-rounded">
                  Required
                </span>
              )}
              {field.constraints.unique && (
                <span className="g-text-xs g-bg-blue-100 g-text-blue-700 g-px-2 g-py-1 g-rounded">
                  Unique
                </span>
              )}
              {field.constraints.minimum !== undefined && (
                <span className="g-text-xs g-bg-gray-100 g-text-gray-700 g-px-2 g-py-1 g-rounded">
                  Min: {field.constraints.minimum}
                </span>
              )}
              {field.constraints.maximum !== undefined && (
                <span className="g-text-xs g-bg-gray-100 g-text-gray-700 g-px-2 g-py-1 g-rounded">
                  Max: {field.constraints.maximum}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );

    return (
      <HelpLine
        icon
        className="g-text-gray-500 hover:g-text-gray-700 g-ml-2"
        contentClassName="g-w-80"
      >
        {helpContent}
      </HelpLine>
    );
  };

  if (error) {
    return (
      <div className="g-p-6">
        <div className="g-rounded-lg g-border g-border-red-200 g-bg-red-50 g-p-4">
          <h3 className="g-font-semibold g-text-red-800">Error</h3>
          <p className="g-mt-2 g-text-sm g-text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="g-p-6">
        <div className="g-flex g-items-center g-justify-center g-py-8">
          <div
            className="g-inline-block g-h-8 g-w-8 g-animate-spin g-rounded-full g-border-4 g-border-solid g-border-current g-border-r-transparent"
            role="status"
          >
            <span className="g-sr-only">Loading...</span>
          </div>
          <p className="g-ml-4 g-text-gray-600">Loading details...</p>
        </div>
      </div>
    );
  }

  if (!currentSchema || !rowData) {
    return (
      <div className="g-p-6">
        <div className="g-rounded-lg g-border g-border-gray-200 g-bg-gray-50 g-p-4">
          <p className="g-text-gray-600">No data available for this resource.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="g-p-6 g-max-w-4xl">
      <div className="g-mb-6">
        <h2 className="g-text-2xl g-font-bold g-text-gray-900 g-mb-2">
          {currentSchema.title || resourceType.replace(/-/g, ' ')}
        </h2>
        {currentSchema.description && (
          <p className="g-text-gray-600 g-text-sm g-leading-relaxed">{currentSchema.description}</p>
        )}
        <div className="g-mt-2 g-text-xs g-text-gray-500">
          Resource: {resourceType} • ID: {id}
        </div>
      </div>

      <div className="g-grid g-gap-4 g-grid-cols-1 md:g-grid-cols-2">
        {currentSchema.fields.map((field) => {
          const value = rowData[field.name];
          const hasValue = value !== null && value !== undefined && value !== '';

          return (
            <div
              key={field.name}
              className={`g-rounded-lg g-border g-p-4 ${
                hasValue ? 'g-border-gray-200 g-bg-white' : 'g-border-gray-100 g-bg-gray-50'
              }`}
            >
              <div className="g-flex g-items-start g-justify-between g-mb-3">
                <div className="g-flex g-items-center g-gap-1">
                  <h3 className="g-font-medium g-text-gray-900">{field.title}</h3>
                  {renderFieldHelp(field)}
                </div>
                <div className="g-flex g-gap-1">
                  {field.constraints?.required && (
                    <span className="g-text-xs g-bg-red-100 g-text-red-700 g-px-1.5 g-py-0.5 g-rounded">
                      Required
                    </span>
                  )}
                  {field.constraints?.unique && (
                    <span className="g-text-xs g-bg-blue-100 g-text-blue-700 g-px-1.5 g-py-0.5 g-rounded">
                      Unique
                    </span>
                  )}
                </div>
              </div>

              <div className="g-text-sm">{renderFieldValue(field, value)}</div>
            </div>
          );
        })}
      </div>

      {/* Related Records Section */}
      {relatedRecords.length > 0 && (
        <div className="g-mt-8">
          <h3 className="g-text-xl g-font-bold g-text-gray-900 g-mb-4">Related Records</h3>
          <div className="g-space-y-4">
            {relatedRecords.map((related) => {
              const isExpanded = expandedRelated.has(related.resourceName);
              const relatedSchema = schemas.find((s) => s.name === related.resourceName)?.schema;

              return (
                <div key={related.resourceName} className="g-border g-rounded-lg g-bg-white">
                  <button
                    onClick={() => toggleRelatedRecords(related.resourceName, related.fieldName)}
                    className="g-w-full g-px-4 g-py-3 g-flex g-items-center g-justify-between g-text-left hover:g-bg-gray-50 g-rounded-lg"
                  >
                    <div>
                      <h4 className="g-font-semibold g-text-gray-900">{related.resourceTitle}</h4>
                      <p className="g-text-sm g-text-gray-600">
                        {related.count > 0
                          ? `${related.count} record${
                              related.count !== 1 ? 's' : ''
                            } reference this ${resourceType}`
                          : related.loading
                          ? 'Loading...'
                          : 'No related records'}
                      </p>
                    </div>
                    {isExpanded ? (
                      <FaChevronUp className="g-h-5 g-w-5 g-text-gray-400" />
                    ) : (
                      <FaChevronDown className="g-h-5 g-w-5 g-text-gray-400" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="g-px-4 g-pb-4">
                      {related.loading && related.records.length === 0 ? (
                        <div className="g-flex g-items-center g-justify-center g-py-4">
                          <div className="g-inline-block g-h-6 g-w-6 g-animate-spin g-rounded-full g-border-2 g-border-solid g-border-current g-border-r-transparent" />
                          <span className="g-ml-2 g-text-gray-600">Loading related records...</span>
                        </div>
                      ) : related.count === 0 ? (
                        <p className="g-text-gray-500 g-py-4">No related records found.</p>
                      ) : (
                        <>
                          <div className="g-grid g-gap-2">
                            {related.records.map((record, index) => {
                              const primaryKeyField = relatedSchema?.primaryKey;
                              const primaryKeyValue = primaryKeyField
                                ? record[primaryKeyField]
                                : null;

                              return (
                                <div key={index} className="g-p-3 g-border g-rounded g-bg-gray-50">
                                  <div className="g-flex g-items-center g-justify-between">
                                    <div className="g-flex-1">
                                      {primaryKeyField && primaryKeyValue && (
                                        <button
                                          onClick={() =>
                                            setEntity(`${related.resourceName}__${primaryKeyValue}`)
                                          }
                                          className="g-text-blue-600 hover:g-text-blue-800 hover:g-underline g-font-medium g-text-sm"
                                        >
                                          {primaryKeyField}: {primaryKeyValue}
                                        </button>
                                      )}
                                      <div className="g-text-xs g-text-gray-600 g-mt-1 g-space-y-1">
                                        {Object.entries(record)
                                          .filter(
                                            ([key, value]) =>
                                              key !== primaryKeyField &&
                                              value !== null &&
                                              value !== ''
                                          )
                                          .slice(0, 3)
                                          .map(([key, value]) => (
                                            <div key={key}>
                                              <span className="g-font-medium">{key}:</span>{' '}
                                              {String(value)}
                                            </div>
                                          ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {related.hasMore && related.records.length > 0 && (
                            <div className="g-mt-4 g-text-center">
                              <button
                                onClick={() =>
                                  fetchRelatedRecords(
                                    related.resourceName,
                                    related.fieldName,
                                    related.offset,
                                    true
                                  )
                                }
                                disabled={related.loading}
                                className="g-px-4 g-py-2 g-text-sm g-bg-blue-600 g-text-white g-rounded hover:g-bg-blue-700 disabled:g-opacity-50 disabled:g-cursor-not-allowed"
                              >
                                {related.loading
                                  ? 'Loading...'
                                  : `Load More (${
                                      related.count - related.records.length
                                    } remaining)`}
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
