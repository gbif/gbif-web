import { SearchInput } from '@/components/searchInput';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { useSearchContext } from '@/contexts/search';
import { cn } from '@/utils/shadcn';
import cloneDeep from 'lodash/cloneDeep';
import React, { useContext, useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { PiEmptyBold } from 'react-icons/pi';
import { FormattedMessage, useIntl } from 'react-intl';
import { SimpleTooltip } from '../simpleTooltip';
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

type RangeProps = Omit<filterRangeConfig, 'filterType' | 'filterTranslation'> &
  AdditionalFilterProps & {
    className?: string;
  };

export const RangeFilter = React.forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      className,
      searchConfig,
      regex = /^((-)?[0-9]{0,10})(,)?((-)?[0-9]{0,10})$/,
      filterHandle,
      displayName: DisplayName,
      onApply,
      onCancel,
      pristine,
      about,
      rangeExample,
      allowExistence,
    }: RangeProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const { formatMessage } = useIntl();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, setFilter, filterHash } = currentFilterContext;
    const [selected, setSelected] = useState<(string | number | object)[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [q, setQ] = useState<string>('');
    const [backupFilter, setBackupFilter] = useState<FilterType | undefined>(undefined);
    const [filterSummary, setFilterSummary] = useState<FilterSummaryType>(
      getFilterSummary(filter, filterHandle)
    );
    const [filterType, setFilterType] = useState(
      filterSummary?.isNotNull || filterSummary?.isNull ? 'EXISTS' : 'SELECT'
    );
    const {
      upperBound = 'lte',
      lowerBound = 'gte',
      placeholder = 'search.placeholders.rangeExample',
    } = {};

    const About = about;
    const RangeHelp = rangeExample
      ? rangeExample
      : () => <FormattedMessage id={'filterSupport.rangeHelp'} />;

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
        <div className="g-flex g-flex-none">
          <div className="g-p-2 g-w-full g-relative g-group">
            <SearchInput
              ref={ref}
              value={q}
              onChange={(e) => {
                const value = e.target.value;
                if (regex) {
                  if (e.target.value.match(regex) !== null) {
                    setQ(value);
                  }
                } else {
                  setQ(value);
                }
              }}
              placeholder={formatMessage({ id: placeholder })}
              className="g-text-sm g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border g-border-solid focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
              onKeyDown={(e) => {
                // if user press enter, then update the value
                const value = e.currentTarget.value;
                if (e.key === 'Enter') {
                  if (value !== '') {
                    const rangeQuery = rangeOrTerm(value, lowerBound, upperBound, true);
                    // const filters = unionBy([q], selected, hash);
                    add(filterHandle, rangeQuery);
                    setQ('');
                    e.preventDefault();
                  } else {
                    onApply?.();
                  }
                }
              }}
            />
            {/* {selected.length === 0 && <div className="g-hidden group-focus-within:g-block g-pointer-events-none g-absolute g-text-white g-text-sm g-bg-slate-500 g-p-4 g-border g-shadow-md g-left-0 g-right-0 g-mx-2 g-rounded">
              Enter a range or a single value. E.g. 100,200 or 100. Or use blanks to have open ends like: 100,
            </div>} */}
          </div>
        </div>
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
        {selected.length === 0 && (
          <div className="g-pointer-events-none g-text-slate-700 g-text-sm g-bg-slate-100 g-p-4 g-border g-border-solid g-left-0 g-right-0 g-mx-2 g-rounded">
            <RangeHelp />
          </div>
        )}
        <div className="g-flex-auto g-overflow-auto">
          {selected.length > 0 && (
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
                        {option?.value &&
                          option?.value[upperBound] &&
                          option?.value[lowerBound] && <>.&nbsp;</>}
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
                      key={option}
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
          )}
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </div>
    );
  }
);

/**
 * Generate a range or a terms predicate. This is useful for years,
 * that can both be queried as a range or as a term.
 * E.g. year=1950,2000
 * @param {string} value
 * @param {string} upperBound
 * @param {string} lowerBound
 */
export function rangeOrTerm(
  value: string,
  lowerBound = 'gte',
  upperBound = 'lte',
  expectNumbers?: boolean
) {
  // has a comma in the string
  let delimter = value.indexOf(',') > -1 ? ',' : null;
  if (expectNumbers && !delimter && value.trim().indexOf('-') > 0) {
    delimter = '-';
  }

  if (typeof value !== 'string' || !delimter) {
    return {
      type: 'equals',
      value: value,
    };
  } else {
    const values = value.split(delimter);
    const cleanedValues = values
      .map((s) => s.trim())
      .map((s) => (s === '*' || s === '' ? undefined : s));

    if (expectNumbers && !cleanedValues.some((x) => x === undefined || isNaN(parseFloat(x)))) {
      const sortedValues = cleanedValues.map((x) => parseFloat(x)).sort();
      return {
        type: 'range',
        value: {
          [lowerBound]: sortedValues[0],
          [upperBound]: sortedValues[1],
        },
      };
    }
    return {
      type: 'range',
      value: {
        [lowerBound]: cleanedValues[0],
        [upperBound]: cleanedValues[1],
      },
    };
  }
}
