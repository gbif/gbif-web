import React from 'react';
import { useUncontrolledProp } from 'uncontrollable';
import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import isEqual from 'react-fast-compare';
import hash from 'object-hash';

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

export function FilterProvider({ filter: controlledFilter, onChange: controlledOnChange, children }: { filter?: FilterType; onChange?: (filter: FilterType) => void; children: React.ReactNode }) {
  const [currentFilter, onChange] = useUncontrolledProp(controlledFilter, {}, controlledOnChange);

  const setFilter = (filter: FilterType): FilterType => {
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
  };

  const setField = (field: string, value: any[], isNegated?: boolean): FilterType => {
    const filter = currentFilter ? cloneDeep(currentFilter) : {};
    const type = isNegated ? 'mustNot' : 'must';
    return setFilter({
      ...filter,
      [type]: {
        ...filter[type],
        [field]: value.filter((v) => v !== undefined),
      },
    });
  };

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

  const negateField = (field: string, isNegated?: boolean): FilterType => {
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
  };

  const add = (field: string, value: any, isNegated?: boolean): FilterType => {
    const type = isNegated ? 'mustNot' : 'must';
    let values = get(currentFilter, `${type}.${field}`, []);
    values = values.concat(value);
    values = uniqWith(values, isEqual);
    return setField(field, values, isNegated);
  };

  const remove = (field: string, value: any, isNegated?: boolean): FilterType => {
    const type = isNegated ? 'mustNot' : 'must';
    let values = get(currentFilter, `${type}.${field}`, []);
    values = values.filter((e) => !isEqual(e, value));
    return setField(field, values, isNegated);
  };

  const toggle = (field: string, value: any, isNegated?: boolean): FilterType => {
    const type = isNegated ? 'mustNot' : 'must';
    const values = get(currentFilter, `${type}.${field}`, []);
    if (values.some((e) => isEqual(e, value))) {
      return remove(field, value, isNegated);
    } else {
      return add(field, value, isNegated);
    }
  };

  const hashObj = {
    must: currentFilter?.must || {},
    mustNot: currentFilter?.mustNot || {},
  };
  const filterHash = hash(hashObj);
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