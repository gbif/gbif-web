import { useState, useEffect } from 'react';
import ResourceCard from './ResourceCard';
import { CardTitle } from '@/components/ui/largeCard';

interface ResourceListProps {
  datasetKey: string;
}

export default function ResourceList({ datasetKey }: ResourceListProps) {
  const [resources, setResources] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://api.gbif-dev.org/v1/dataset/${datasetKey}/datapackage/resourceNames`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (datasetKey) {
      fetchResources();
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
          <p className="g-mt-4 g-text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="g-p-8">
        <div className="g-rounded-lg g-border g-border-red-200 g-bg-red-50 g-p-4">
          <h3 className="g-font-semibold g-text-red-800">Error loading resources</h3>
          <p className="g-mt-2 g-text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!resources || resources.length === 0) {
    return (
      <div className="g-p-8">
        <p className="g-text-gray-600">No resources available</p>
      </div>
    );
  }

  return (
    <div className="g-py-6">
      <CardTitle className="g-mb-8 g-px-6">Available Resources</CardTitle>
      <div className="g-flex g-flex-col g-gap-6">
        {resources.map((resource) => (
          <ResourceCard key={resource} datasetKey={datasetKey} resourceName={resource} />
        ))}
      </div>
    </div>
  );
}
