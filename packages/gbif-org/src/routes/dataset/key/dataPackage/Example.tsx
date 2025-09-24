import { useState, useEffect } from 'react';
import generateMermaid from './generateMermaid';
import { MermaidChart } from './MermaidChart';
import ResourceList from './ResourceList';
import EntityDetailDrawer from './EntityDetailDrawer';
import { Card } from '@/components/ui/largeCard';
import exampleSchema from './exampleSchema.json';

export default function Example({ datasetKey }: { datasetKey: string }) {
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mermaidString, setMermaidString] = useState<string>('');

  useEffect(() => {
    const fetchSchema = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.gbif-dev.org/v1/dataset/${datasetKey}/datapackage/resource`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch schema: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setSchema(data);
        const mermaid = generateMermaid(data);
        setMermaidString(mermaid);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (datasetKey) {
      fetchSchema();
    }
  }, [datasetKey]);

  if (loading) {
    return (
      <div className="g-flex g-items-center g-justify-center g-p-8">
        <div className="g-text-center">
          <div
            className="g-inline-block g-h-8 g-w-8 g-animate-spin g-rounded-full g-border-4 g-border-solid g-border-current g-border-r-transparent g-align-[-0.125em] g-motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="g-sr-only">Loading...</span>
          </div>
          <p className="g-mt-4 g-text-gray-600">Loading schema...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="g-p-8">
        <div className="g-rounded-lg g-border g-border-red-200 g-bg-red-50 g-p-4">
          <h3 className="g-font-semibold g-text-red-800">Error loading schema</h3>
          <p className="g-mt-2 g-text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!schema) {
    return (
      <div className="g-p-8">
        <p className="g-text-gray-600">No schema available</p>
      </div>
    );
  }

  const fields = ['title', 'name', 'type', 'description', 'test', 'setsets'];
  return (
    <div>
      <MermaidChart chart={mermaidString} />
      <ResourceList datasetKey={datasetKey} />
      <EntityDetailDrawer />
    </div>
  );
}
