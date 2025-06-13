import { useConfig } from '@/config/config';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { GeoTimeConceptsQuery, GeoTimeConceptsQueryVariables } from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useI18n } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, useIntl } from 'react-intl';
import { SearchSuggest } from '../searchSelect/searchSuggest';
import { SimpleTooltip } from '../simpleTooltip';
import { Button } from '../ui/button';
import { Card } from '../ui/smallCard';
import { AboutButton } from './aboutButton';
import {
  AdditionalFilterProps,
  ApplyCancel,
  ExistsSection,
  filterRangeConfig,
  FilterSummaryType,
  getFilterSummary,
} from './filterTools';
import { Option } from './option';
import { rangeOrTerm } from './rangeFilter';

const partialRegex = /^\d{0,4}(-\d{0,2}){0,2}$/;
const fullRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

type RangeProps = Omit<filterRangeConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const GeoTimeFilter = React.forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      className,
      searchConfig,
      filterHandle,
      displayName: DisplayName,
      onApply,
      onCancel,
      pristine,
      about,
      allowExistence,
    }: RangeProps,
    ref
  ) => {
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash } = currentFilterContext;
    const [selected, setSelected] = useState<(string | number | object)[]>([]);
    const [start, setStart] = useState<string>('');
    const [type, setType] = useState<string>('between');
    const [end, setEnd] = useState<string>('');
    const [singleDate, setSingleDate] = useState<string>('');
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const { upperBound = 'lte', lowerBound = 'gte' } = {};
    // generate a stable across renders unique id for the input field using nanoid()
    const inputEndId = useMemo(() => nanoid(), []);
    const [touched, setTouched] = useState({
      start: false,
      end: false,
      singleDate: false,
    });

    const handleBlur = (field: keyof typeof touched) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // is start date smaller than end date
    const isValidRange = (start: string, end: string) => {
      return start || end;
    };
    const errors = {
      start: null,
      singleDate: null,
      end: !isValidRange(start, end) ? (
        <FormattedMessage id="filterSupport.invalidRange" defaultMessage="Invalid range" />
      ) : null,
    };

    const About = about;

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? [];
      setSelected(selectedList);

      const filterSummary = getFilterSummary(filter, filterHandle);
      setFilterSummary(filterSummary);
      // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterHash, filterHandle, setFilterSummary]);

    // watch filter summary and update filter type
    useEffect(() => {
      if (filterSummary?.isNotNull || filterSummary?.isNull) {
        setFilterType('EXISTS');
      } else {
        setFilterType('SELECT');
      }
    }, [filterSummary]);

    const resetFields = () => {
      setStart('');
      setEnd('');
      setSingleDate('');
      setTouched({ start: false, end: false, singleDate: false });
    };

    const handleAdd = useCallback(() => {
      if (type === 'between') {
        if (isValidRange(start, end)) {
          // if enter then add the filter if legal
          const rangeQuery = rangeOrTerm(`${start},${end}`, lowerBound, upperBound);
          // const filters = unionBy([q], selected, hash);
          add(filterHandle, rangeQuery);
          resetFields();
        }
      } else {
        const rangeQuery =
          type === 'equals'
            ? rangeOrTerm(`${singleDate}`, lowerBound, upperBound)
            : type === 'after'
            ? rangeOrTerm(`${singleDate},`, lowerBound, upperBound)
            : rangeOrTerm(`,${singleDate}`, lowerBound, upperBound);

        add(filterHandle, rangeQuery);
        resetFields();
      }
    }, [type, start, end, singleDate, upperBound, lowerBound, filterHandle, add]);

    const options = (
      <>
        <div className="g-flex-auto"></div>
        <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
          {selected.length > 0 && (
            <button
              className="g-mx-1 g-me-2 g-px-1 g-pe-3 g-border-r"
              onClick={() => setFullField(filterHandle, [], [])}
            >
              <MdDeleteOutline />
            </button>
          )}

          {allowExistence && (
            <button
              className="g-px-1"
              onClick={() => {
                const backup = cleanUpFilter(cloneDeep(filter));
                setBackupFilter(backup);
                setFullField(filterHandle, [{ type: 'isNotNull' }], []);
              }}
            >
              <SimpleTooltip
                delayDuration={300}
                title={<FormattedMessage id="filterSupport.existence" />}
                asChild
              >
                <span>
                  <PiEmptyBold />
                </span>
              </SimpleTooltip>
            </button>
          )}

          {About && (
            <AboutButton className="-g-me-1">
              <About />
            </AboutButton>
          )}
        </div>
      </>
    );

    if (filterType === 'EXISTS') {
      return (
        <ExistsSection
          className={className}
          backupFilter={backupFilter}
          setFilter={setFilter}
          setFullField={setFullField}
          filterHandle={filterHandle}
          About={About}
          filterSummary={filterSummary}
          onApply={onApply}
          onCancel={onCancel}
          pristine={pristine}
        />
      );
    }

    return (
      <div className={cn('g-flex g-flex-col g-max-h-[100dvh]', className)}>
        <div
          className={cn(
            'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-1.5 g-px-4 g-items-center',
            className
          )}
        >
          {selected.length > -1 && (
            <div className="g-flex-none g-text-xs g-font-bold">
              <FormattedMessage id="counts.nSelected" values={{ total: selected?.length }} />
            </div>
          )}
          {options}
        </div>
        <div className="g-flex-auto g-overflow-auto">
          <div className={cn('g-text-base g-mt-2 g-px-4', className)}>
            <div role="group" className="g-text-sm">
              {selected.map((option) => {
                let helpText;
                if (typeof option === 'string' || typeof option === 'number') {
                  helpText = (
                    <FormattedMessage
                      id={`intervals.geoTime.e`}
                      defaultMessage={'Filter name'}
                      values={{ from: option }}
                    />
                  );
                } else if (option?.type === 'equals') {
                  helpText = (
                    <FormattedMessage
                      id={`intervals.geoTime.e`}
                      defaultMessage={'Filter name'}
                      values={{ from: option.value, is: option.value }}
                    />
                  );
                } else {
                  helpText = (
                    <>
                      {option?.value && option?.value[lowerBound] && (
                        <FormattedMessage
                          id={`intervals.geoTime.${lowerBound}`}
                          defaultMessage={'Filter name'}
                          values={{ from: option?.value[lowerBound] }}
                        />
                      )}
                      {option?.value && option?.value[upperBound] && option?.value[lowerBound] && (
                        <>.&nbsp;</>
                      )}
                      {option?.value && option?.value[upperBound] && (
                        <FormattedMessage
                          id={`intervals.geoTime.${upperBound}`}
                          defaultMessage={'Filter name'}
                          values={{ to: option?.value[upperBound] }}
                        />
                      )}
                    </>
                  );
                }

                return (
                  <Option
                    key={JSON.stringify(option)}
                    className="g-mb-2"
                    onClick={() => {
                      toggle(filterHandle, option);
                    }}
                    onKeyDown={(e) => (e.key === 'Enter' ? onApply?.({}) : null)}
                    checked={true}
                    helpText={helpText}
                  >
                    <div className="g-flex g-items-center">
                      <span className="g-flex-auto">
                        <DisplayName id={option} />
                      </span>
                    </div>
                  </Option>
                );
              })}
            </div>
          </div>
        </div>
        <Card className="g-mx-2">
          <div className="g-p-2 g-pb-0">
            <div className="g-text-sm g-inline-block">
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (type === 'between') {
                    if (value === 'after') {
                      setSingleDate(start);
                    }
                    if (value === 'before') {
                      setSingleDate(end);
                    }
                    if (value === 'equals') {
                      setSingleDate(start);
                    }
                  } else {
                    setStart(singleDate);
                    setEnd('');
                  }

                  setType(value);
                }}
                value={type}
                className="g-text-sm focus-within:g-ring-2 g-rounded focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
              >
                <option value="between">
                  <FormattedMessage id="intervals.year.select.between" defaultMessage="Between" />
                </option>
                <option value="equals">
                  <FormattedMessage id="intervals.year.select.equals" defaultMessage="Equals" />
                </option>
                <option value="after">
                  <FormattedMessage
                    id="intervals.year.select.greaterThanOrEquals"
                    defaultMessage="After"
                  />
                </option>
                <option value="before">
                  <FormattedMessage
                    id="intervals.year.select.lessThanOrEquals"
                    defaultMessage="Before"
                  />
                </option>
              </select>
            </div>
            <div className="g-pb-0 g-w-full g-flex g-flex-col g-gap-2 g-items-end">
              {type === 'between' && (
                <>
                  <label className="g-text-sm g-flex-1 g-w-full">
                    <GeoTimeInput
                      inputMode="numeric"
                      ref={ref}
                      value={start}
                      onBlur={() => handleBlur('start')}
                      onChange={(value) => {
                        setStart(value);
                      }}
                      onKeyDown={(e) => {
                        // if user press enter or a digit then change focus to next input box
                        const value = e.currentTarget.value;
                        if (/^\d$/.test(e.key) && end.length === 0 && value.length >= 10) {
                          e.preventDefault();
                          // set focus to next field
                          document.getElementById(inputEndId)?.focus();
                          setEnd(e.key);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          // set focus to next field
                          document.getElementById(inputEndId)?.focus();
                        }
                      }}
                    />
                  </label>
                  <label className="g-text-sm g-flex-1 g-w-full">
                    <GeoTimeInput
                      id={inputEndId}
                      value={end}
                      onBlur={() => handleBlur('end')}
                      onChange={(value) => {
                        setEnd(value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (isValidRange(start, end)) {
                            handleAdd();
                            e.preventDefault();
                          }
                        }
                      }}
                    />
                  </label>
                </>
              )}
              {type !== 'between' && (
                <label className="g-text-sm g-flex-1 g-w-full">
                  <GeoTimeInput
                    value={singleDate}
                    onBlur={() => handleBlur('singleDate')}
                    onChange={(value) => {
                      setSingleDate(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAdd();
                        e.preventDefault();
                      }
                    }}
                  />
                </label>
              )}
              <div className="g-flex g-justify-between g-items-center g-w-full g-gap-2">
                <div className="g-px-2">
                  {type === 'between' && (
                    <>
                      {touched.start && errors.start && (
                        <p className="g-mb-1 g-text-xs g-text-red-600">{errors.start}</p>
                      )}
                      {touched.end && errors.end && (
                        <p className="g-mb-1 g-text-xs g-text-red-600">{errors.end}</p>
                      )}
                    </>
                  )}
                  {type !== 'between' && (
                    <>
                      {touched.singleDate && errors.singleDate && (
                        <p className="g-mb-1 g-text-xs g-text-red-600">{errors.singleDate}</p>
                      )}
                    </>
                  )}
                </div>
                <Button
                  size="sm"
                  className="g-flex-none g-mb-2"
                  disabled={
                    type === 'between'
                      ? !isValidRange(start, end)
                      : !singleDate || singleDate.length === 0
                  }
                  onClick={handleAdd}
                >
                  <FormattedMessage id="filterSupport.add" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);

export type GeoTimeOption = {
  key: string;
  title: string;
  parents?: string;
  startAge?: number;
};

const GeoTimeInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    [key: string]: unknown;
  }
>(({ value, onChange, onBlur, ...props }, ref) => {
  const {
    data: concepts,
    error,
    loading,
    load,
  } = useQuery<GeoTimeConceptsQuery, GeoTimeConceptsQueryVariables>(GEOTIME_CONCEPTS, {
    lazyLoad: false,
    variables: {
      language: useI18n().locale.vocabularyLocale,
    },
  });

  const [suggestions, setSuggestions] = useState<GeoTimeOption[]>([]);
  const [data, setVisible] = useState<GeoTimeOption[]>([]);
  const config = useConfig();
  const intl = useIntl();
  const searchContext = useSearchContext();
  const { locale: currentLocale } = useI18n();
  const [element, setElement] = useState<GeoTimeOption | null>(null);

  useEffect(() => {
    // sort the concepts by starting time. the start time can be extracted from the tags. The tags that start with "startAge:" are the start time of the concept
    if (loading || error || !concepts?.vocabularyConceptSearch?.results) return;
    const sorted = concepts.vocabularyConceptSearch.results
      .map((concept) => {
        const startTag = concept.tags?.find((tag) => tag.name.startsWith('startAge:'));
        const startAge = startTag ? parseInt(startTag.name.replace('startAge:', ''), 10) : null;
        return {
          key: concept.name,
          title: concept.uiLabel,
          parents: concept.parents?.map((parent) => parent.uiLabel).join(', '),
          startAge,
        };
      })
      .filter((concept) => concept.startAge !== null)
      .sort((a, b) => (a.startAge ?? 0) - (b.startAge ?? 0))
      .reverse();
    setVisible(sorted);
    setSuggestions(sorted);
  }, [concepts, loading, error, setVisible, setSuggestions]);

  // useEffect(() => {
  //   if (!config || !intl || !searchContext || !currentLocale) return;
  //   const { cancel, promise } = geoTimeSuggest.getSuggestions({
  //     q: '',
  //     limit: 200,
  //     intl,
  //     searchContext,
  //     siteConfig: config,
  //     locale: intl.locale,
  //     currentLocale,
  //   });

  //   promise.then((data) => {
  //     setSuggestions(data);
  //   });
  //   return () => {
  //     if (cancel) {
  //       cancel();
  //     }
  //   };
  // }, [config, intl, searchContext, currentLocale]);

  const search = React.useCallback(
    (searchTerm: string) => {
      // filter suggestions based on the search term and setVisible
      const filteredSuggestions = suggestions.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVisible(filteredSuggestions);
      // if searchTerm is empty, show all suggestions
      if (searchTerm === '') {
        setVisible(suggestions);
      }
    },
    [suggestions, setVisible] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    // if value is not empty, find the element in suggestions and set it
    if (value) {
      const foundElement = suggestions.find((s) => s.key === value);
      if (foundElement) {
        setElement(foundElement);
      } else {
        setElement(null);
      }
    } else {
      setElement(null);
    }
  }, [value, suggestions]);

  return (
    <SearchSuggest
      variant="outline"
      className="g-font-normal"
      setSelected={(e) => {
        onChange(e?.key ?? '');
      }}
      selected={element}
      search={search}
      results={data ?? []}
      labelSelector={(value) => value.title}
      suggestLabel={(value) => (
        <div>
          <span>{value.title}</span>
          <div className="g-text-slate-400 g-text-xs">{value.parents}</div>
        </div>
      )}
      keySelector={(value) => value.key}
      noSearchResultsPlaceholder={<span>No period found</span>}
      noSelectionPlaceholder={<span>Select a period</span>}
      searchInputPlaceholder="Search periods..."
    />
  );
});
GeoTimeInput.displayName = 'GeoTimeInput';

const GEOTIME_CONCEPTS = /* GraphQL */ `
  query geoTimeConcepts($language: String) {
    vocabularyConceptSearch(vocabulary: "GeoTime", limit: 200) {
      results {
        name
        parents {
          uiLabel
          name
        }
        uiLabel(language: $language)
        uiDefinition(language: $language)
        tags {
          name
        }
      }
    }
  }
`;
