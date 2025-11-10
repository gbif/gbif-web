import { useState, useEffect, useRef } from 'react';
import {
  MdCheck,
  MdCopyAll,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md';
import vegaEmbed from 'vega-embed';

interface GeneratedChart {
  id: string;
  prompt: string;
  spec: unknown;
  graphqlQuery?: string;
  createdAt: Date;
  loading?: boolean;
  error?: string;
}

interface GeneratedChartProps {
  chart: GeneratedChart;
  onRemove?: () => void;
}

export default function Custom({ chart, onRemove }: GeneratedChartProps) {
  const [showDebug, setShowDebug] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedSpec, setCopiedSpec] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && chart.spec && !chart.error) {
      vegaEmbed(chartRef.current, chart.spec, {
        actions: {
          export: true,
          source: false,
          compiled: false,
          editor: false,
        },
      });
    }
  }, [chart.spec, chart.error]);

  const handleCopyQuery = () => {
    if (chart.graphqlQuery) {
      navigator.clipboard.writeText(chart.graphqlQuery);
      setCopiedQuery(true);
      setTimeout(() => setCopiedQuery(false), 2000);
    }
  };

  const handleCopySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(chart.spec, null, 2));
    setCopiedSpec(true);
    setTimeout(() => setCopiedSpec(false), 2000);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-2">Generated at {formatTime(chart.createdAt)}</p>
            <p className="text-gray-900 font-medium">{chart.prompt}</p>
          </div>
          {onRemove && (
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {chart.error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">Error: {chart.error}</p>
          </div>
        ) : chart.spec ? (
          <div
            ref={chartRef}
            className="bg-gray-50 rounded-lg p-4 flex justify-center overflow-x-auto"
          ></div>
        ) : (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No chart data</p>
          </div>
        )}
      </div>

      {chart.graphqlQuery && (
        <div className="border-t border-gray-200">
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              {showDebug ? (
                <MdOutlineKeyboardArrowUp className="w-4 h-4 text-gray-500" />
              ) : (
                <MdOutlineKeyboardArrowDown className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-medium text-gray-700">Debug Information</span>
            </div>
          </button>

          {showDebug && (
            <div className="px-6 pb-4 pt-0 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase">
                    GraphQL Query
                  </label>
                  <button
                    onClick={handleCopyQuery}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedQuery ? (
                      <>
                        <MdCheck className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <MdCopyAll className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                  <code className="text-xs text-gray-100 font-mono whitespace-pre-wrap break-words">
                    {chart.graphqlQuery}
                  </code>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-700 uppercase">
                    Vega-Lite Spec
                  </label>
                  <button
                    onClick={handleCopySpec}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    {copiedSpec ? (
                      <>
                        <MdCheck className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <MdCopyAll className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-gray-900 rounded p-3 overflow-x-auto max-h-48 overflow-y-auto">
                  <code className="text-xs text-gray-100 font-mono whitespace-pre">
                    {JSON.stringify(chart.spec, null, 2)}
                  </code>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
