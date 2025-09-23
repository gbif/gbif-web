import { useState, useEffect } from 'react';

interface Field {
  name: string;
  title: string;
  type: string;
  description?: string;
}

interface Schema {
  name: string;
  title: string;
  fields: Field[];
}

interface ResourceCardProps {
  datasetKey: string;
  resourceName: string;
}

interface PaginatedData {
  results: Record<string, any>[];
  count: number;
}

export default function ResourceCard({ datasetKey, resourceName }: ResourceCardProps) {
  const [schema, setSchema] = useState<Schema | null>(null);
  const [data, setData] = useState<PaginatedData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageSize] = useState<number>(25);

  // Fetch schema
  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const response = await fetch(
          `https://api.gbif-dev.org/v1/dataset/${datasetKey}/datapackage/resource/${resourceName}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.status}`);
        }
        
        const schemaData = await response.json();
        setSchema(schemaData.schema);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load schema');
      }
    };

    fetchSchema();
  }, [datasetKey, resourceName]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(
          'https://api.gbif-dev.org/v1/dataset/datapackage/search',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              datasetKey,
              resource: resourceName,
              limit: pageSize,
              offset: currentPage * pageSize,
            }),
          }
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (schema) {
      fetchData();
    }
  }, [datasetKey, resourceName, currentPage, pageSize, schema]);

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  if (error) {
    return (
      <div className="g-w-full g-rounded-lg g-border g-border-red-200 g-bg-red-50 g-p-4">
        <h3 className="g-font-semibold g-text-red-800">Error loading {resourceName}</h3>
        <p className="g-mt-2 g-text-sm g-text-red-600">{error}</p>
      </div>
    );
  }

  if (!schema || loading) {
    return (
      <div className="g-w-full g-rounded-lg g-border g-border-gray-200 g-bg-white g-p-6">
        <div className="g-flex g-items-center g-justify-center g-py-8">
          <div className="g-inline-block g-h-8 g-w-8 g-animate-spin g-rounded-full g-border-4 g-border-solid g-border-current g-border-r-transparent" role="status">
            <span className="g-sr-only">Loading...</span>
          </div>
          <p className="g-ml-4 g-text-gray-600">Loading {resourceName}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="g-w-full g-rounded-lg g-border g-border-gray-200 g-bg-white g-p-6 g-shadow-sm">
      <h3 className="g-mb-4 g-text-xl g-font-bold g-text-gray-900 g-capitalize">
        {schema.title || resourceName.replace(/-/g, ' ')}
      </h3>
      
      {data && data.results.length > 0 ? (
        <>
          <div className="g-overflow-x-auto">
            <table className="g-w-full g-border-collapse">
              <thead>
                <tr className="g-border-b g-border-gray-200 g-bg-gray-50">
                  {schema.fields.map((field) => (
                    <th
                      key={field.name}
                      className="g-px-4 g-py-3 g-text-left g-text-sm g-font-semibold g-text-gray-700"
                      title={field.description}
                    >
                      {field.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.results.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="g-border-b g-border-gray-100 hover:g-bg-gray-50"
                  >
                    {schema.fields.map((field) => (
                      <td
                        key={field.name}
                        className="g-px-4 g-py-3 g-text-sm g-text-gray-900"
                      >
                        {row[field.name] !== null && row[field.name] !== undefined
                          ? String(row[field.name])
                          : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="g-mt-4 g-flex g-items-center g-justify-between g-border-t g-border-gray-200 g-pt-4">
            <div className="g-text-sm g-text-gray-600">
              Showing {currentPage * pageSize + 1} to{' '}
              {Math.min((currentPage + 1) * pageSize, data.count)} of {data.count} results
            </div>
            <div className="g-flex g-gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="g-rounded g-border g-border-gray-300 g-bg-white g-px-4 g-py-2 g-text-sm g-font-medium g-text-gray-700 hover:g-bg-gray-50 disabled:g-cursor-not-allowed disabled:g-opacity-50"
              >
                Previous
              </button>
              <span className="g-flex g-items-center g-px-4 g-text-sm g-text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="g-rounded g-border g-border-gray-300 g-bg-white g-px-4 g-py-2 g-text-sm g-font-medium g-text-gray-700 hover:g-bg-gray-50 disabled:g-cursor-not-allowed disabled:g-opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="g-py-8 g-text-center g-text-gray-500">No data available</p>
      )}
    </div>
  );
}