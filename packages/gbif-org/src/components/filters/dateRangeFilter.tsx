import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import { nanoid } from 'nanoid';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, useIntl } from 'react-intl';
import { SimpleTooltip } from '../simpleTooltip';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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

export const DateRangeFilter = React.forwardRef<HTMLInputElement, RangeProps>(
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
      if (start && end) {
        const result = isValidDate(start) && isValidDate(end) && new Date(start) < new Date(end);
        return result;
      }
      return false;
    };
    const errors = {
      start:
        !isValidDate(start) && start !== '' ? (
          <FormattedMessage id="filterSupport.invalidDate" defaultMessage="Invalid date" />
        ) : null,
      singleDate:
        !isValidDate(singleDate) && singleDate !== '' ? (
          <FormattedMessage id="filterSupport.invalidDate" defaultMessage="Invalid date" />
        ) : null,
      end:
        !isValidDate(end) && end !== '' ? (
          <FormattedMessage id="filterSupport.invalidDate" defaultMessage="Invalid date" />
        ) : !isValidRange(start, end) ? (
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
        if (isValidDate(end) && isValidRange(start, end)) {
          // if enter then add the filter if legal
          const rangeQuery = rangeOrTerm(`${start},${end}`, lowerBound, upperBound);
          // const filters = unionBy([q], selected, hash);
          add(filterHandle, rangeQuery);
          resetFields();
        }
      } else if (isValidDate(singleDate)) {
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
                      id={`intervals.description.e`}
                      defaultMessage={'Filter name'}
                      values={{ from: option }}
                    />
                  );
                } else if (option?.type === 'equals') {
                  helpText = (
                    <FormattedMessage
                      id={`intervals.description.e`}
                      defaultMessage={'Filter name'}
                      values={{ from: option.value, is: option.value }}
                    />
                  );
                } else {
                  helpText = (
                    <>
                      {option?.value && option?.value[lowerBound] && (
                        <FormattedMessage
                          id={`intervals.description.${lowerBound}`}
                          defaultMessage={'Filter name'}
                          values={{ from: option?.value[lowerBound] }}
                        />
                      )}
                      {option?.value && option?.value[upperBound] && option?.value[lowerBound] && (
                        <>.&nbsp;</>
                      )}
                      {option?.value && option?.value[upperBound] && (
                        <FormattedMessage
                          id={`intervals.description.${upperBound}`}
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
            <div className="g-pb-0 g-w-full g-flex g-gap-2 g-items-end">
              {type === 'between' && (
                <>
                  <label className="g-text-sm g-flex-1">
                    <DateInput
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
                  <label className="g-text-sm g-flex-1">
                    <DateInput
                      id={inputEndId}
                      value={end}
                      onBlur={() => handleBlur('end')}
                      onChange={(value) => {
                        setEnd(value);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (isValidDate(end) && isValidRange(start, end)) {
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
                <label className="g-text-sm g-flex-1">
                  <DateInput
                    value={singleDate}
                    onBlur={() => handleBlur('singleDate')}
                    onChange={(value) => {
                      setSingleDate(value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (isValidDate(singleDate)) {
                          handleAdd();
                          e.preventDefault();
                        }
                      }
                    }}
                  />
                </label>
              )}
              <Button
                className="g-flex-none"
                disabled={type === 'between' ? !isValidRange(start, end) : !isValidDate(singleDate)}
                onClick={handleAdd}
              >
                <FormattedMessage id="filterSupport.add" />
              </Button>
            </div>
          </div>
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
          <div className="g-text-sm g-text-slate-600">
            <div className="g-flex g-items-center g-gap-2 g-flex-wrap g-p-2 g-text-slate-400">
              <button
                className="g-underline"
                onClick={() => {
                  // last week
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  const lastWeekString = lastWeek.toISOString().split('T')[0];
                  add(filterHandle, { type: 'range', value: { gte: lastWeekString } });
                }}
              >
                <FormattedMessage id="filterSupport.lastWeek" defaultMessage="Last week" />
              </button>
              <button
                className="g-underline"
                onClick={() => {
                  // last month
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  const lastMonthString = lastMonth.toISOString().split('T')[0];
                  add(filterHandle, { type: 'range', value: { gte: lastMonthString } });
                }}
              >
                <FormattedMessage id="filterSupport.lastMonth" defaultMessage="Last month" />
              </button>
              <button
                className="g-underline"
                onClick={() => {
                  // last year
                  const lastYear = new Date();
                  lastYear.setFullYear(lastYear.getFullYear() - 1);
                  const lastYearString = lastYear.toISOString().split('T')[0];
                  add(filterHandle, { type: 'range', value: { gte: lastYearString } });
                }}
              >
                <FormattedMessage id="filterSupport.lastYear" defaultMessage="Last year" />
              </button>
            </div>
          </div>
        </Card>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);

const DateInput = React.forwardRef<
  HTMLInputElement,
  {
    value: string;
    onChange: (value: string) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    className?: string;
    [key: string]: unknown;
  }
>(({ value, onChange, onBlur, className, ...props }, ref) => {
  const { formatMessage } = useIntl();
  const [isTouched, setIsTouched] = useState(false);
  const placeholder = formatMessage({
    id: 'search.placeholders.dateTemplate',
  });

  const colorAsError =
    (isTouched && !isValidDate(value) && value !== '') ||
    (value.length >= 10 && !isValidDate(value));

  return (
    <Input
      ref={ref}
      inputMode="numeric"
      className={cn(
        'g-text-sm g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset',
        className,
        {
          'g-text-red-500': colorAsError,
          'g-border-red-500': colorAsError,
        }
      )}
      placeholder={placeholder}
      value={value}
      onBlur={(e) => {
        setIsTouched(true);
        onBlur?.(e);
      }}
      onChange={(e) => {
        const newValue = e.target.value;
        const length = e.target.value.length;
        const isLastCharacter =
          e.target.selectionStart === e.target.value.length && length > value.length;
        const lastCharacter = e.target.value.substring(length - 1, length);

        if (!isLastCharacter) {
          if (e.target.value.match(partialRegex) !== null) {
            onChange(newValue);
          } else {
            return;
          }
        }
        if (isLastCharacter) {
          // if last characted is anything but a digit, then replace it with a dash
          if (length === 5 || length === 8) {
            const isNumber = /^\d$/.test(lastCharacter);
            if (lastCharacter !== '-') {
              if (!isNumber) {
                onChange(value + '-');
              }
              if (isNumber) {
                onChange(value + '-' + lastCharacter);
              }
            } else {
              onChange(value + lastCharacter);
            }
          } else {
            if (e.target.value.match(partialRegex) !== null) {
              onChange(newValue);
            } else {
              return;
            }
          }
        }
      }}
      {...props}
    />
  );
});
DateInput.displayName = 'DateInput';

function isValidDate(dateString: string) {
  if (typeof dateString !== 'string') return false;
  // check against fullRegex
  if (dateString.match(fullRegex) === null) return false;
  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Months are zero-based
  const day = parseInt(parts[2], 10);
  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}
