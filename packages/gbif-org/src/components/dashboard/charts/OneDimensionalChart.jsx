// @ts-nocheck
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/smallCard';
import HighchartsReact from 'highcharts-react-official';
import { FormattedMessage, useIntl } from 'react-intl';
import { CardHeader } from '../shared';
import { getColumnOptions } from './column';
import Highcharts, { generateChartsPalette } from './highcharts';
import { getPieOptions } from './pie';
// import { getTimeSeriesOptions } from './area';
import { Button } from '@/components/ui/button';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { BsFillBarChartFill, BsPieChartFill } from 'react-icons/bs';
import { MdViewStream } from 'react-icons/md';
import { useUncontrolledProp } from 'uncontrollable';
import { GroupBy, Pagging, useFacets } from './GroupByTable';
import { getTimeSeriesOptions } from './time';
import { useConfig } from '@/config/config';

export const chartsClass = 'g-min-w-full g-h-full g-w-40 g-overflow-hidden';

// Component to control the view options: table, pie chart, bar chart
function ViewOptions({ view, setView, options = ['COLUMN', 'PIE', 'TABLE'] }) {
  if (options.length < 2) return null;

  // option to icon component map
  const iconMap = {
    COLUMN: <BsFillBarChartFill />,
    PIE: <BsPieChartFill />,
    TABLE: <MdViewStream />,
    TIME: <BsFillBarChartFill />,
  };
  return (
    <div>
      {options.map((option) => (
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

export function OneDimensionalChart({
  facetQuery,
  predicateKey,
  detailsRoute,
  disableOther,
  options = ['TABLE', 'PIE', 'COLUMN'],
  defaultOption,
  disableUnknown,
  showUnknownInChart,
  messages: customMessages,
  title,
  subtitleKey,
  transform,
  currentFilter = {}, //excluding root predicate
  filterKey,
  handleRedirect,
  visibilityThreshold = -1,
  interactive = false,
  setView: setUserView,
  view: userView,
  showFreeTextWarning,
  value2colorMap,
  ...props
}) {
  const [view, setView] = useUncontrolledProp(
    userView,
    defaultOption ?? options?.[0] ?? 'TABLE',
    setUserView
  );
  const intl = useIntl();
  const { theme } = useConfig();
  const facetResults = useFacets(facetQuery);
  // const [view, setView] = useState(defaultOption ?? options?.[0] ?? 'TABLE');
  const showChart = facetResults?.results?.length > 0;
  const { otherCount, emptyCount, distinct } = facetResults;
  // if (!view) setView(defaultOption ?? options?.[0] ?? 'TABLE');
  const { chartColors } = theme;
  const palette = chartColors
    ? generateChartsPalette(chartColors)
    : Highcharts?.defaultOptions?.colors;
  const messages = [...(customMessages ?? [])];
  const translations = {
    occurrences: intl.formatMessage({ id: 'dashboard.occurrences' }),
  };
  facetResults?.results?.forEach((x) => (x.filter = { [filterKey ?? predicateKey]: [x.key] }));
  const mappedResults = transform ? transform(facetResults.data) : facetResults.results;
  const data = mappedResults?.map((x) => {
    const customColor = value2colorMap ? value2colorMap[x.key] : chartColors.OTHER;
    return {
      ...x,
      y: x.count,
      name: x.plainTextTitle ?? x.title,
      key: x.key,
      filter: { [predicateKey]: [x.key] },
      visible: x.count > 0,
      color: customColor,
    };
  });

  // count how many results have data
  const notEmptyResults = data?.filter((x) => x.y > 0);

  if (data && notEmptyResults?.length <= visibilityThreshold) return null;

  if (view === 'PIE') {
    // if the series have less than 5 items, then use every 2th color from the default palette Highcharts?.defaultOptions?.colors
    if (data?.length < 5) {
      data.forEach((x, i) => {
        x.color = x.color ?? palette[i * 2];
      });
    }
    if (!disableOther && otherCount) {
      data.push({
        y: otherCount,
        name: intl.formatMessage({ id: 'dashboard.other' }),
        color: chartColors.OTHER,
        visible: true,
      });
    }
    if (showUnknownInChart && emptyCount) {
      data.push({
        y: emptyCount,
        name: intl.formatMessage({ id: 'dashboard.unknown' }),
        visible: true,
        color: chartColors.UNKNOWN,
        filter: { mustNot: { [predicateKey]: [{ type: 'isNotNull' }] } },
      });
    }
  }

  const serie = {
    innerSize: '25%',
    name: intl.formatMessage({ id: 'dashboard.occurrences' }),
    data,
    // color: palette[0],
  };

  const pieOptions = getPieOptions({
    serie,
    onClick: handleRedirect,
    interactive,
    translations,
    colors: palette,
  });

  const columnOptions = getColumnOptions({
    serie,
    onClick: handleRedirect,
    interactive,
    translations,
  });

  // if time series then create the area chart options
  let timeSeriesOptions;
  if (view === 'TIME') {
    const interval = facetResults?.data?.search?.facet?.results?.interval; // e.g. 10y = 10 years, could also be months, days, hours, minutes, seconds, abbreviated as y, M, d, h, m, s
    // extract the unit and value from the interval
    const unit = interval?.slice(-1);
    const value = parseInt(interval?.slice(0, -1));
    // translate unit to fulls string for the pointIntervalUnit (year, month, day, hour, minute, second)
    const unitMap = {
      y: 'year',
      M: 'month',
      d: 'day',
      h: 'hour',
      m: 'minute',
      s: 'second',
    };

    // // rename the data to get names with time interval
    data?.forEach((x) => {
      const utc = Number.parseInt(x?.utc);
      // add the interval to the date, and serialize as yyyy-mm-dd - yyyy-mm-dd (start date - end date)
      const startDate = new Date(utc);
      // add the interval to the startDate (e.g. adding 10 years)
      const endDate = new Date(utc);

      if (unit === 'y') endDate.setFullYear(startDate.getFullYear() + value);
      if (unit === 'M') endDate.setMonth(startDate.getMonth() + value);
      if (unit === 'd') endDate.setDate(startDate.getDate() + value);
      if (unit === 'h') endDate.setHours(startDate.getHours() + value);
      if (unit === 'm') endDate.setMinutes(startDate.getMinutes() + value);
      if (unit === 's') endDate.setSeconds(startDate.getSeconds() + value);

      // format the name as start - end. The resolution should reflect the units, so if the units are years, then only show startyear - endyear, but if the units are days, then show startdate - enddate
      // we should ONLY show the year if the interval is years, otherwise we should show the full date
      let format = { year: 'numeric' };
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

      x.name = `${start} - ${end}`;

      x.utc = utc;
    });
    // create the serie
    const histogramSerie = {
      innerSize: '25%',
      name: intl.formatMessage({ id: 'dashboard.occurrences' }),
      // pointStart: -10476864000000,
      pointStart: Number.parseInt(data?.[0]?.utc), //Date.UTC(1638, 0, 1), // first of April
      // pointRange: 3600 * 1000 * 24 * 365 * 10, // hourly data
      pointInterval: value,
      pointIntervalUnit: unitMap[unit],
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

  const filledPercentage =
    facetResults?.data?.isNotNull?.documents?.total / facetResults?.data?.search?.documents?.total;

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
  // the idea with this was that it looks odd with a pie chart with only one value, but it looks even worse with a table with only one value. Similar for column charts. But in reality it was also confusing changing the layout when changing filters, so we removed this.
  // const singleValue = notEmptyResults?.length === 1 ? notEmptyResults[0] : null;
  // const renderedView = singleValue ? 'TABLE' : view;

  return (
    <Card
      {...props}
      loading={facetResults.loading || !facetResults.data}
      error={!!facetResults.error}
    >
      {/* <CardTitle options={(singleValue || (distinct === 0)) ? null : <ViewOptions options={options} view={view} setView={setView} />}> */}
      <CardHeader options={<ViewOptions options={options} view={view} setView={setView} />}>
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

export function ChartMessages({ messages = [] }) {
  if (!messages || messages.length === 0) return null;
  return (
    <div className="g-text-slate-400 g-text-sm hover:g-text-slate-800 p:g-my-1 g-transition-colors">
      {messages.map((message, i) => {
        const isString = typeof message === 'string';
        return (
          <div key={i}>
            {isString && <FormattedMessage id={message} />}
            {!isString && message}
          </div>
        );
      })}
    </div>
  );
}
