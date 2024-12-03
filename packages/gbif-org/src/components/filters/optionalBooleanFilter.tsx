import React, { useContext, useEffect, useState } from 'react';
import hash from 'object-hash';
import { cn } from '@/utils/shadcn';
import { cleanUpFilter, FilterContext } from '@/contexts/filter';
import useQuery from '@/hooks/useQuery';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import {
  AdditionalFilterProps,
  ApplyCancel,
  FacetQuery,
  filterBoolConfig,
  getAsQuery,
} from './filterTools';
import cloneDeep from 'lodash/cloneDeep';
import { useSearchContext } from '@/contexts/search';
import { AboutButton } from './aboutButton';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

type BoolProps = Omit<filterBoolConfig, 'filterType' | 'filterTranslation'> & AdditionalFilterProps & {
  className?: string;
};

export const OptionalBooleanFilter = React.forwardRef(
  (
    {
      className,
      searchConfig,
      filterHandle,
      displayName: DisplayName,
      facetQuery,
      onApply,
      onCancel,
      pristine,
      about,
    }: BoolProps,
    ref
  ) => {
    const searchContext = useSearchContext();
    const currentFilterContext = useContext(FilterContext);
    const { filter, filterHash, setFullField } = currentFilterContext;
    const [filterBeforeHash, setFilterBeforeHash] = useState<string | undefined>(undefined);

    const {
      data: facetData,
      error: facetError,
      loading: facetLoading,
      load: facetLoad,
    } = useQuery<FacetQuery, unknown>(facetQuery ?? '', {
      lazyLoad: true,
    });

    useEffect(() => {
      if (!facetQuery) return;
      // if the filter has changed, then get facet values from API
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      delete prunedFilter.mustNot?.[filterHandle];

      const query = getAsQuery({ filter: prunedFilter, searchContext, searchConfig });
      if (searchContext.queryType === 'V1') {
        facetLoad({ variables: { query: query } });
      } else {
        facetLoad({ variables: { predicate: query }, keepDataWhileLoading: true });
      }
    }, [facetQuery, filterBeforeHash, facetLoad, searchContext, searchConfig, filterHandle]);

    useEffect(() => {
      // keep track the facets without the current filter
      const prunedFilter = cleanUpFilter(cloneDeep(filter));
      delete prunedFilter.must?.[filterHandle];
      setFilterBeforeHash(hash(prunedFilter));
    }, [filterHash, filterHandle])

    const About = about;

    // get counts for true and false values from the facets
    const trueCount =
      facetData?.search?.facet?.field?.find((x) => x.name.toString() === 'true')?.count ??
      0;
    const falseCount =
      facetData?.search?.facet?.field?.find((x) => x.name.toString() === 'false')?.count ??
      0;

    const defaultSelected = filter?.must?.[filterHandle]?.[0]?.toString() ?? '';

    return (
      <>
        <div
          className={cn(
            'g-flex g-flex-none g-text-sm g-text-slate-400 g-py-0 g-px-4 g-items-center g-pt-2',
            className
          )}
        >
          <div className="g-flex-auto"></div>
          <div className="g-flex-none g-text-base" style={{ marginTop: '-0.2em' }}>
            {About && (
              <AboutButton className="-g-me-1">
                <About />
              </AboutButton>
            )}
          </div>
        </div>
        <div className="g-pb-1.5 g-px-4 g-w-full">
          <RadioGroup
            onValueChange={(val) => {
              setFullField(filterHandle, val === '' ? [] : [val], []);
            }}
            defaultValue={defaultSelected}
            className="g-gap-1"
          >
            <label className={cn('g-flex g-w-full')}>
              <RadioGroupItem value="" className="g-flex-none g-me-2 g-mt-1" />
              <div className="g-flex-auto g-overflow-hidden">
                <FormattedMessage id="search.ternary.either" />
              </div>
            </label>
            <label className={cn('g-flex g-w-full g-items-center')}>
              <RadioGroupItem value="true" className="g-flex-none g-me-2 g-mt-1" />
              <div className="g-flex-auto g-overflow-hidden">
                <DisplayName id="true" />
              </div>
              {!facetLoading && <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                <FormattedNumber value={trueCount ?? 0} />
              </span>}
            </label>
            <label className={cn('g-flex g-w-full g-items-center')}>
              <RadioGroupItem value="false" className="g-flex-none g-me-2 g-mt-1" />
              <div className="g-flex-auto g-overflow-hidden">
                <DisplayName id="false" />
              </div>
              {!facetLoading && <span className="g-flex-none g-text-slate-400 g-text-xs g-ms-1">
                <FormattedNumber value={falseCount ?? 0} />
              </span>}
            </label>
          </RadioGroup>
        </div>
        <ApplyCancel onApply={onApply} onCancel={onCancel} pristine={pristine} />
      </>
    );
  }
);
