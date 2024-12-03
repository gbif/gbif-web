import { SearchInput } from '@/components/searchInput';
import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react';
import {
  MdDeleteOutline,
  MdOutlineRemoveCircleOutline,
  MdInfo,
  MdInfoOutline,
  MdShuffle,
  MdPieChart,
  MdPieChartOutline,
} from 'react-icons/md';
import { PiEmptyBold, PiEmptyFill } from 'react-icons/pi';
import { TiArrowShuffle as InvertIcon } from 'react-icons/ti';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext, FilterType } from '@/contexts/filter';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import useQuery from '@/hooks/useQuery';
import hash from 'object-hash';
import cloneDeep from 'lodash/cloneDeep';
import { Suggest, SuggestionItem } from './suggest';
import { HelpLine } from '@/components/helpText';
import { FormattedMessage, FormattedNumber, IntlShape } from 'react-intl';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Option, SkeletonOption } from './option';
import { AdditionalFilterProps, FacetQuery, filterRangeConfig, getAsQuery } from './filterTools';
import { useSearchContext } from '@/contexts/search';

type RangeProps = Omit<filterRangeConfig, 'filterType' | 'filterTranslation'> & AdditionalFilterProps & {
  className?: string;
};

export const RangeFilter = React.forwardRef<HTMLInputElement, RangeProps>(
  (
    {
      className,
      searchConfig,
      regex,
      filterHandle,
      displayName: DisplayName,
      onApply,
      onCancel,
      pristine,
    }: RangeProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, toggle, add, setFullField, filterHash } = currentFilterContext;
    const [selected, setSelected] = useState<(string | number | object)[]>([]);
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);
    const [q, setQ] = useState<string>('');
    const { upperBound = 'lte', lowerBound = 'gte', placeholder = 'E.g. 100,200' } = {};

    useEffect(() => {
      // filter has changed updateed the listed of selected values
      const selectedList = filter?.must?.[filterHandle] ?? [];
      setSelected(selectedList);
    }, [filterHash, filterHandle]);

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
          {/* <SimpleTooltip delayDuration={300} title="Exclude selected">
          <button
            className="g-px-1"
            onClick={() => {
              // negateField('publishingOrg', true)
            }}
          >
            <MdOutlineRemoveCircleOutline />
          </button>
        </SimpleTooltip> */}
          {/* <SimpleTooltip delayDuration={300} title="Invert selection">
          <button className="g-px-1">
            <MdShuffle />
          </button>
        </SimpleTooltip>
        <SimpleTooltip delayDuration={300} title="Filter by existence">
          <button className="g-px-1">
            <PiEmptyBold />
          </button>
        </SimpleTooltip> */}

          <SimpleTooltip delayDuration={300} title="About this filter">
            <span>
              <HelpLine
                id="how-to-link-datasets-to-my-project-page"
                title={<MdInfoOutline className="-g-me-1" />}
              />
            </span>
          </SimpleTooltip>
        </div>
      </>
    );

    return (
      <div className="g-flex g-flex-col">
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
              placeholder="Search"
              className="g-w-full g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
              onKeyDown={(e) => {
                // if user press enter, then update the value
                const value = e.currentTarget.value;
                if (e.key === 'Enter') {
                  if (value !== '') {
                    const rangeQuery = rangeOrTerm(value, upperBound, lowerBound);
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
            <div className="g-flex-none g-text-xs g-font-bold">{selected?.length} selected</div>
          )}
          {options}
        </div>
        {selected.length === 0 && <div className="g-pointer-events-none g-text-slate-700 g-text-sm g-bg-slate-100 g-p-4 g-border g-left-0 g-right-0 g-mx-2 g-rounded">
          Enter a range or a single value. E.g. 100,200 or 100. Or use blanks to have open ends like: 100,
        </div>}
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
        {onApply && onCancel && (
          <div className="g-flex-none g-py-2 g-px-2 g-flex g-justify-between">
            <Button size="sm" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {!pristine && (
              <Button
                type="submit"
                role="button"
                size="sm"
                onClick={() => onApply({ keepOpen: false })}
              >
                Apply
              </Button>
            )}
          </div>
        )}
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
export function rangeOrTerm(value, lowerBound = 'gte', upperBound = 'lte') {
  // has a comma in the string
  let delimter = value.indexOf(',') > -1 ? ',' : null;
  if (!delimter) {
    // no comma, but a dash, and since it isn't the first character then it isn't a negation
    delimter = value.indexOf('-') > 0 ? '-' : null;
  }

  if (typeof value !== 'string' || !delimter) {
    return {
      type: 'equals',
      value: value,
    };
  } else {
    let values = value.split(delimter);
    const cleanedValues = values
      .map((s) => s.trim())
      .map((s) => (s === '*' || s === '' ? undefined : s));
    return {
      type: 'range',
      value: {
        [upperBound]: cleanedValues[0],
        [lowerBound]: cleanedValues[1],
      },
    };
  }
}
