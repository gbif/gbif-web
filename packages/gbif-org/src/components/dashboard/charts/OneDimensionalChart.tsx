import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import { useI18n } from '@/reactRouterPlugins';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { hash } from '@/utils/hash';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
import { IoMapSharp } from 'react-icons/io5';
import { MdViewStream } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { useUncontrolledProp } from 'uncontrollable';
import { CardHeader } from '../shared';
import { getColumnOptions } from './column';
import { FacetResultRow, GroupBy, Pagging, useFacets } from './GroupByTable';
import Highcharts, { chartPatterns, generateChartsPalette } from './highcharts';
import { Map } from './map/map';
import { getPieOptions } from './pie';
import { getTimeSeriesOptions } from './time';

export const chartsClass = 'g-min-w-full g-h-full g-w-40 g-overflow-hidden';

const enableMapCharts = import.meta.env.PUBLIC_DEFAULT_ENABLE_MAP_CHARTS === 'true';

export type ChartView = 'COLUMN' | 'PIE' | 'TABLE' | 'TIME' | 'MAP';

type ChartViewOptionsProps = {
  view: ChartView;
  setView: (view: ChartView) => void;
  options?: ChartView[];
};

// Component to control the view options: table, pie chart, bar chart
export function ChartViewOptions({
  view,
  setView,
  options = ['COLUMN', 'PIE', 'TABLE'],
}: ChartViewOptionsProps) {
  const allowedOptions = options.filter((option) => {
    if (option === 'MAP' && !enableMapCharts) return false;
    return true;
  });
  if (allowedOptions.length < 2) return null;

  const iconMap: Record<ChartView, React.ReactElement> = {
    COLUMN: <BsFillBarChartFill />,
    PIE: <BsPieChartFill />,
    TABLE: <MdViewStream />,
    TIME: <BsFillBarChartFill />,
    MAP: <IoMapSharp />,
  };
  return (
    <div>
      {allowedOptions.map((option) => (
        <Button
          key={option}
          variant="link"
          style={{ padding: '0 5px', height: 'auto' }}
          className={`g-m-0 ${view === option ? 'g-text-primary-500' : 'g-text-slate-400'}`}
          onClick={() => setView(option)}
        >
          {iconMap[option]}
        </Button>
      ))}
    </div>
  );
}

type FacetQuery = Parameters<typeof useFacets>[0];

type OneDimensionalChartProps = {
  facetQuery: FacetQuery;
  predicateKey: string;
  detailsRoute?: string;
  disableOther?: boolean;
  options?: ChartView[];
  defaultOption?: ChartView;
  disableUnknown?: boolean;
  showUnknownInChart?: boolean;
  messages?: Array<React.ReactNode | string>;
  title?: React.ReactNode;
  subtitleKey?: string;
  transform?: (data: unknown) => FacetResultRow[] | undefined;
  currentFilter?: Record<string, unknown>;
  filterKey?: string;
  handleRedirect?: (args: { filter?: Record<string, unknown> }) => void;
  visibilityThreshold?: number;
  interactive?: boolean;
  setView?: (view: ChartView) => void;
  view?: ChartView;
  showFreeTextWarning?: boolean;
  value2colorMap?: Record<string, string>;
  [key: string]: unknown;
};

export function OneDimensionalChart({
  facetQuery,
  predicateKey,
  disableOther,
  options = ['TABLE', 'PIE', 'COLUMN'],
  defaultOption,
  disableUnknown,
  showUnknownInChart,
  messages: customMessages,
  title,
  subtitleKey,
  transform,
  filterKey,
  handleRedirect,
  visibilityThreshold = -1,
  interactive = false,
  setView: setUserView,
  view: userView,
  showFreeTextWarning,
  value2colorMap,
  ...props
}: OneDimensionalChartProps) {
  const { locale } = useI18n();
  const [view, setView] = useUncontrolledProp<ChartView>(
    userView,
    defaultOption ?? options?.[0] ?? 'TABLE',
    setUserView
  );
  const intl = useIntl();
  const { theme } = useConfig();
  const facetResults = useFacets(facetQuery);
  const showChart = (facetResults?.results?.length ?? 0) > 0;
  const { otherCount, emptyCount, distinct } = facetResults;
  const chartColors: string[] | undefined = theme?.chartColors;
  const palette = chartColors
    ? generateChartsPalette(chartColors)
    : (Highcharts?.defaultOptions?.colors as string[] | undefined);
  const messages: Array<React.ReactNode | string> = [...(customMessages ?? [])];
  const translations = {
    occurrences: intl.formatMessage({ id: 'dashboard.occurrences' }),
  };
  facetResults?.results?.forEach(
    (x) => (x.filter = { [filterKey ?? predicateKey]: [x.key] })
  );
  const mappedResults = transform ? transform(facetResults.data) : facetResults.results;
  const data = mappedResults?.map((x) => {
    const customColor = value2colorMap ? value2colorMap[String(x.key)] : undefined;
    return {
      ...x,
      y: x.count,
      name: x.plainTextTitle ?? x.title,
      key: x.key,
      filter: { [predicateKey]: [x.key] },
      visible: x.count > 0,
      color: customColor,
    } as FacetResultRow & {
      y: number;
      name: React.ReactNode;
      visible: boolean;
      color?: string;
    };
  });

  // count how many results have data
  const notEmptyResults = data?.filter((x) => x.y > 0);

  if (data && (notEmptyResults?.length ?? 0) <= visibilityThreshold) return null;

  if (view === 'PIE') {
    if (!disableOther && otherCount) {
      data?.push({
        key: '__other__',
        count: otherCount,
        y: otherCount,
        name: intl.formatMessage({ id: 'dashboard.other' }),
        color: chartPatterns.OTHER as unknown as string,
        visible: true,
        filter: { [predicateKey]: [] },
      });
    }
    if (showUnknownInChart && emptyCount) {
      data?.push({
        key: '__unknown__',
        count: emptyCount,
        y: emptyCount,
        name: intl.formatMessage({ id: 'dashboard.unknown' }),
        visible: true,
        color: chartPatterns.UNKNOWN as unknown as string,
        filter: { mustNot: [{ [predicateKey]: [{ type: 'isNotNull' }] }] },
      });
    }
  }

  const serie = {
    innerSize: '25%',
    name: intl.formatMessage({ id: 'dashboard.occurrences' }),
    data,
  };

  const pieOptions = getPieOptions({
    serie,
    onClick: handleRedirect,
    interactive,
    colors: palette,
    isRtl: locale.textDirection === 'rtl',
  });

  const columnOptions = getColumnOptions({
    serie,
    onClick: handleRedirect,
    interactive,
    translations,
  });

  // if time series then create the area chart options
  let timeSeriesOptions: ReturnType<typeof getTimeSeriesOptions> | undefined;
  if (view === 'TIME') {
    const facetSection = facetResults?.data?.search?.facet?.results as
      | { interval?: string }
      | undefined;
    const interval = facetSection?.interval;
    const unit = interval?.slice(-1);
    const value = interval ? parseInt(interval.slice(0, -1)) : 0;
    const unitMap: Record<string, string> = {
      y: 'year',
      M: 'month',
      d: 'day',
      h: 'hour',
      m: 'minute',
      s: 'second',
    };

    data?.forEach((x) => {
      const utcRaw = (x as unknown as { utc?: string | number })?.utc;
      const utc = Number.parseInt(String(utcRaw));
      const startDate = new Date(utc);
      const endDate = new Date(utc);

      if (unit === 'y') endDate.setFullYear(startDate.getFullYear() + value);
      if (unit === 'M') endDate.setMonth(startDate.getMonth() + value);
      if (unit === 'd') endDate.setDate(startDate.getDate() + value);
      if (unit === 'h') endDate.setHours(startDate.getHours() + value);
      if (unit === 'm') endDate.setMinutes(startDate.getMinutes() + value);
      if (unit === 's') endDate.setSeconds(startDate.getSeconds() + value);

      let format: Intl.DateTimeFormatOptions = { year: 'numeric' };
      if (unit === 'M') format = { year: 'numeric', month: 'short' };
      if (unit === 'd') format = { year: 'numeric', month: 'short', day: 'numeric' };
      if (unit === 'h')
        format = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric' };
      if (unit === 'm')
        format = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
      if (unit === 's')
        format = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
        };

      const start = new Intl.DateTimeFormat('en', format).format(startDate);
      const end = new Intl.DateTimeFormat('en', format).format(endDate);

      (x as unknown as { name: string }).name = `${start} - ${end}`;
      (x as unknown as { utc: number }).utc = utc;
    });

    const firstUtcRaw = (data?.[0] as unknown as { utc?: string | number })?.utc;
    const histogramSerie = {
      innerSize: '25%',
      name: intl.formatMessage({ id: 'dashboard.occurrences' }),
      pointStart: Number.parseInt(String(firstUtcRaw)),
      pointInterval: value,
      pointIntervalUnit: unit ? unitMap[unit] : undefined,
      pointPadding: 0,
      groupPadding: 0,
      borderWidth: 0.5,
      borderColor: 'rgba(255,255,255,0.5)',
      minPointLength: 2,
      data,
    };

    timeSeriesOptions = getTimeSeriesOptions({
      serie: histogramSerie,
      onClick: handleRedirect,
      interactive,
      translations,
    });
  }

  const isNotNullTotal = facetResults?.data?.isNotNull?.documents?.total ?? 0;
  const searchTotal = facetResults?.data?.search?.documents?.total ?? 0;
  const filledPercentage = searchTotal > 0 ? isNotNullTotal / searchTotal : 0;

  if (showFreeTextWarning) {
    messages.push('dashboard.notVocabularyWarning');
  }

  if (!disableUnknown) {
    messages.push(
      <div>
        <FormattedMessage
          id="dashboard.percentWithValue"
          values={{ percent: formatAsPercentage(filledPercentage) }}
        />
      </div>
    );
  }
  const renderedView = view;

  const contextHash = String(hash(facetQuery));
  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      <CardHeader options={<ChartViewOptions options={options} view={view} setView={setView} />}>
        <CardTitle>{title && <>{title}</>}</CardTitle>
        {subtitleKey && (
          <CardDescription>
            <FormattedMessage id={subtitleKey} defaultMessage="Number of occurrences" />
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {distinct === 0 && (
          <div className="g-text-center g-text-slate-400">
            <FormattedMessage id="dashboard.noData" defaultMessage="No data" />
          </div>
        )}

        {distinct > 0 && (
          <>
            {showChart && (
              <div style={{ margin: '0 auto' }}>
                {renderedView === 'PIE' && (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={pieOptions}
                    className={chartsClass}
                  />
                )}
                {renderedView === 'COLUMN' && (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={columnOptions}
                    className={chartsClass}
                  />
                )}
                {renderedView === 'TIME' && (
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={timeSeriesOptions}
                    className={chartsClass}
                  />
                )}
                {renderedView === 'MAP' && (
                  <Map
                    facetResults={facetResults as unknown as Parameters<typeof Map>[0]['facetResults']}
                    transform={transform as unknown as Parameters<typeof Map>[0]['transform']}
                    onClick={handleRedirect}
                    interactive={interactive}
                    palette={palette ?? []}
                    contextHash={contextHash}
                  />
                )}
              </div>
            )}
            {renderedView === 'TABLE' && (
              <GroupBy
                facetResults={facetResults}
                transform={transform}
                onClick={handleRedirect}
                interactive={interactive}
              />
            )}
            {renderedView !== 'TIME' && <Pagging facetResults={facetResults} />}

            <ChartMessages messages={messages} />
          </>
        )}
      </CardContent>
    </Card>
  );
}

type ChartMessagesProps = {
  messages?: Array<React.ReactNode | string>;
};

export function ChartMessages({ messages = [] }: ChartMessagesProps) {
  if (!messages || messages.length === 0) return null;
  return (
    <div className="g-text-slate-400 g-text-sm hover:g-text-slate-800 p:g-my-1 g-transition-colors">
      {messages.map((message, i) => {
        const isString = typeof message === 'string';
        return (
          <div key={i}>
            {isString && <FormattedMessage id={message as string} />}
            {!isString && message}
          </div>
        );
      })}
    </div>
  );
}
