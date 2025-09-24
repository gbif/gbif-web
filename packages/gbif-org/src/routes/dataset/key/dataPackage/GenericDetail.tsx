import { useParam } from '@/hooks/useParam';
import { HelpLine } from '@/components/helpText';
import { useState, useEffect } from 'react';

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

export default function GenericDetail({ id, resourceType }: GenericDetailProps) {
  // const [datasetKey] = useParam({ key: 'key' });
  const datasetKey = 'bb1bcfd9-7ee3-4c6e-9b8d-661cc4c524f4';
  const [schemas, setSchemas] = useState<ResourceSchema[]>([]);
  const [rowData, setRowData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Find the schema for the current resource type
  const currentSchema = schemas.find((s) => s.name === resourceType)?.schema;

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

  const renderFieldValue = (field: Field, value: any) => {
    if (value === null || value === undefined || value === '') {
      return <span className="g-text-gray-400 g-italic">No data</span>;
    }

    // Handle different field types
    switch (field.type) {
      case 'number':
      case 'integer':
        return <span className="g-font-mono g-text-blue-600">{value}</span>;
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
    </div>
  );
}
