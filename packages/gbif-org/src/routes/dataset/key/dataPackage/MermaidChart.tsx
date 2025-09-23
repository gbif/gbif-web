import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Card } from '@/components/ui/largeCard';

interface MermaidChartProps {
  chart: string;
  className?: string;
}

export function MermaidChart({ chart, className = '' }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mermaid with configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      // themeVariables: {
      //   primaryColor: '#3b82f6',
      //   primaryTextColor: '#1e293b',
      //   primaryBorderColor: '#2563eb',
      //   lineColor: '#64748b',
      //   secondaryColor: '#f1f5f9',
      //   tertiaryColor: '#f8fafc',
      // },
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current || !chart) return;

      setIsLoading(true);
      setError(null);

      try {
        // Clear previous content
        containerRef.current.innerHTML = '';

        // Generate a unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, chart);

        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  return (
    <Card className={`g-relative g-w-full g-mb-4 ${className}`}>
      {isLoading && (
        <div className="g-absolute g-inset-0 g-flex g-items-center g-justify-center g-bg-slate-50/50 g-backdrop-blur-sm g-rounded-lg">
          <div className="g-flex g-flex-col g-items-center g-gap-3">
            <div className="g-h-8 g-w-8 g-animate-spin g-rounded-full g-border-4 g-border-slate-200 g-border-t-blue-500" />
            <span className="g-text-sm g-text-slate-600">Rendering diagram...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="g-rounded-lg g-border g-border-red-200 g-bg-red-50 g-p-4">
          <div className="g-flex g-items-start g-gap-3">
            <svg
              className="g-h-5 g-w-5 g-flex-shrink-0 g-text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="g-flex-1">
              <h3 className="g-text-sm g-font-medium g-text-red-800">Failed to render diagram</h3>
              <p className="g-mt-1 g-text-sm g-text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="g-overflow-x-auto g-p-6" style={{ minHeight: '200px' }} />
    </Card>
  );
}
