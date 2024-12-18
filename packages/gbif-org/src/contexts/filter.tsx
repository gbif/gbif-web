import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import uniqWith from 'lodash/uniqWith';
import hash from 'object-hash';
import React, { useCallback } from 'react';
import isEqual from 'react-fast-compare';
import { useUncontrolledProp } from 'uncontrollable';

export const FilterContext = React.createContext<FilterContextType>({
  setField: () => ({}),
  setFullField: () => ({}),
  setFilter: () => ({}),
  add: () => ({}),
  remove: () => ({}),
  toggle: () => ({}),
  negateField: () => ({}),
  filter: { must: {} },
  filterHash: '',
});

export type FilterType = {
  must?: Record<string, any[]>;
  mustNot?: Record<string, any[]>;
};

export type FilterContextType = {
  setFilter: (filter: FilterType) => FilterType;
  setField: (field: string, value: any[], isNegated?: boolean) => FilterType;
  setFullField: (field: string, must: any[], mustNot: any[]) => FilterType;
  add: (field: string, value: any, isNegated?: boolean) => FilterType;
  remove: (field: string, value: any, isNegated?: boolean) => FilterType;
  toggle: (field: string, value: any, isNegated?: boolean) => FilterType;
  negateField: (field: string, isNegated?: boolean) => FilterType;
  filter: FilterType;
  filterHash: string;
};

export function FilterProvider({
  filter: controlledFilter,
  onChange: controlledOnChange,
  children,
}: {
  filter?: FilterType;
  onChange?: (filter: FilterType) => void;
  children: React.ReactNode;
}) {
  const [currentFilter, onChange] = useUncontrolledProp(controlledFilter, {}, controlledOnChange);

  const hashObj = {
    must: currentFilter?.must || {},
    mustNot: currentFilter?.mustNot || {},
  };

  const filterHash = hash(hashObj);

  const setFilter = useCallback(
    (filter: FilterType): FilterType => {
      if (isEqual(filter, currentFilter)) {
        return currentFilter;
      }
      if (typeof filter === 'object') {
        filter = cleanUpFilter(cloneDeep(filter));
        if (isEmpty(filter?.must)) delete filter.must;
        if (isEmpty(filter?.mustNot)) delete filter.mustNot;
        if (Object.keys(filter).length === 0) filter = {};
      }
      onChange(filter || {});
      return filter;
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash, onChange]
  );

  const setField = useCallback(
    (field: string, value: any[], isNegated?: boolean): FilterType => {
      const filter = currentFilter ? cloneDeep(currentFilter) : {};
      const type = isNegated ? 'mustNot' : 'must';
      return setFilter({
        ...filter,
        [type]: {
          ...filter[type],
          [field]: value.filter((v) => v !== undefined),
        },
      });
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash, setFilter]
  );

  const setFullField = (field: string, must: any[], mustNot: any[]): FilterType => {
    const filter = currentFilter ? cloneDeep(currentFilter) : {};
    const result = setFilter({
      ...filter,
      must: {
        ...filter.must,
        [field]: must,
      },
      mustNot: {
        ...filter.mustNot,
        [field]: mustNot,
      },
    });
    return result;
  };

  const negateField = useCallback(
    (field: string, isNegated?: boolean): FilterType => {
      const filter = currentFilter ? cloneDeep(currentFilter) : {};
      const must = get(filter, `must.${field}`, []);
      const mustNot = get(filter, `mustNot.${field}`, []);
      const value = [...must, ...mustNot];
      const uniqValues = uniqWith(value, isEqual);
      const typeToSet = isNegated ? 'mustNot' : 'must';
      const typeToRemove = !isNegated ? 'mustNot' : 'must';
      return setFilter({
        ...filter,
        [typeToSet]: {
          ...filter[typeToSet],
          [field]: uniqValues,
        },
        [typeToRemove]: {
          ...filter[typeToRemove],
          [field]: [],
        },
      });
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash, setFilter]
  );

  const add = useCallback(
    (field: string, value: any, isNegated?: boolean): FilterType => {
      const type = isNegated ? 'mustNot' : 'must';
      let values = get(currentFilter, `${type}.${field}`, []);
      values = values.concat(value);
      values = uniqWith(values, isEqual);
      return setField(field, values, isNegated);
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash, setField]
  );

  const remove = useCallback(
    (field: string, value: any, isNegated?: boolean): FilterType => {
      const type = isNegated ? 'mustNot' : 'must';
      let values = get(currentFilter, `${type}.${field}`, []);
      values = values.filter((e) => {
        //check if strings or numbers, then just do a string comparison
        if (typeof e === 'string' || typeof e === 'number') {
          return e.toString() !== value.toString();
        }
        return !isEqual(e, value);
      });
      return setField(field, values, isNegated);
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterHash, setField]
  );

  const toggle = useCallback(
    (field: string, value: any, isNegated?: boolean): FilterType => {
      const type = isNegated ? 'mustNot' : 'must';
      const values = get(currentFilter, `${type}.${field}`, []);
      if (
        values.some((e) => {
          //check if strins or numbers, then just do a string comparison
          if (typeof e === 'string' || typeof e === 'number') {
            return e.toString() === value.toString();
          }
          return isEqual(e, value);
        })
      ) {
        return remove(field, value, isNegated);
      } else {
        return add(field, value, isNegated);
      }
    },
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [add, filterHash, remove]
  );

  const contextValue = {
    setField, // updates a single field
    setFullField, // updates a single field both must and mustNot. Ugly hack as I couldn't get it to work begint to calls. The problem is that the filter isn't updated between the two calls in the event loop and hence the first update is ignored
    setFilter, // updates the filter as a whole
    add,
    remove,
    toggle,
    negateField,
    filter: currentFilter,
    filterHash,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {/* <pre>{JSON.stringify(currentFilter, null, 2)}</pre> */}
      {children}
    </FilterContext.Provider>
  );
}

export const cleanUpFilter = (filter: FilterType): FilterType => {
  const must = pickBy(get(filter, 'must', {}), (x) => !isEmpty(x));
  const mustNot = pickBy(get(filter, 'mustNot', {}), (x) => !isEmpty(x));
  return { must, mustNot };
};
