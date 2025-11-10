import { useEffect, useRef, useState } from 'react';
// import { VegaEmbed } from 'react-vega';
import vegaEmbed from 'vega-embed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/smallCard';

export default function CustomChart({ queryId = 234, ...props }) {
  const [chartData, setChartData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('chartData changed:', chartData);
    const vegaspecs = chartData?.charts?.[0]?.vegaspecs;
    if (chartRef.current && vegaspecs) {
      vegaEmbed(chartRef.current, vegaspecs, {
        actions: {
          export: true,
          source: false,
          compiled: false,
          editor: false,
        },
      });
    }
  }, [chartData]);

  useEffect(() => {
    async function getChart() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:4002/mcp/chart/key/${queryId}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch chart data: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Chart data:', data);
        setChartData(data);
      } catch (err) {
        console.error('Error fetching chart:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    getChart();
  }, [queryId]);

  return (
    <Card loading={loading} error={error}>
      <CardHeader>
        <CardTitle>Custom Chart {queryId}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData && !loading && !error && <div ref={chartRef} className="g-w-full g-h-96"></div>}
      </CardContent>
    </Card>
  );
}
