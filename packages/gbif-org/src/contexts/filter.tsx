import React from 'react';
import { useUncontrolledProp } from 'uncontrollable';
import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import isEqual from 'react-fast-compare';
import hash from 'object-hash';

export const FilterContext = React.createContext<FilterContextType | undefined >(undefined);

export type FilterType = {
  must?: Record<string, any[]>;
  must_not?: Record<string, any[]>;
};

export type FilterContextType = {
  setFilter: (filter: FilterType | undefined) => FilterType | undefined;
  setField: (field: string, value: any[], isNegated?: boolean) => void;
  setFullField: (field: string, must: any[], mustNot: any[]) => void;
  add: (field: string, value: any, isNegated?: boolean) => void;
  remove: (field: string, value: any, isNegated?: boolean) => void;
  toggle: (field: string, value: any, isNegated?: boolean) => void;
  negateField: (field: string, isNegated?: boolean) => void;
  filter: FilterType;
  filterHash: string;
};

export function FilterProvider({ filter: controlledFilter, onChange: controlledOnChange, children }: { filter?: FilterType; onChange?: (filter: FilterType) => void; children: React.ReactNode }) {
  const [currentFilter, onChange] = useUncontrolledProp(controlledFilter, {}, controlledOnChange);

  const setFilter = (filter: FilterType | undefined) => {
    if (isEqual(filter, currentFilter)) {
      return;
    }
    if (typeof filter === 'object') {
      filter = cleanUpFilter(cloneDeep(filter));
      if (isEmpty(filter.must)) delete filter.must;
      if (isEmpty(filter.must_not)) delete filter.must_not;
      if (Object.keys(filter).length === 0) filter = undefined;
    }
    onChange(filter || {});
    return filter;
  };

  const setField = (field: string, value: any[], isNegated?: boolean) => {
    const filter = currentFilter ? cloneDeep(currentFilter) : {};
    const type = isNegated ? 'must_not' : 'must';
    setFilter({
      ...filter,
      [type]: {
        ...filter[type],
        [field]: value,
      },
    });
  };

  const setFullField = (field: string, must: any[], mustNot: any[]) => {
    const filter = currentFilter ? cloneDeep(currentFilter) : {};
    const result = setFilter({
      ...filter,
      must: {
        ...filter.must,
        [field]: mustNot,
      },
      must_not: {
        ...filter.must_not,
        [field]: must,
      },
    });
    return result;
  };

  const negateField = (field: string, isNegated?: boolean) => {
    const filter = currentFilter ? cloneDeep(currentFilter) : {};
    let must = get(filter, `must.${field}`, []);
    let mustNot = get(filter, `must_not.${field}`, []);
    let value = [...must, ...mustNot];
    const uniqValues = uniqWith(value, isEqual);
    const typeToSet = isNegated ? 'must_not' : 'must';
    const typeToRemove = !isNegated ? 'must_not' : 'must';
    setFilter({
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

  const add = (field: string, value: any, isNegated?: boolean) => {
    const type = isNegated ? 'must_not' : 'must';
    let values = get(currentFilter, `${type}.${field}`, []);
    values = values.concat(value);
    values = uniqWith(values, isEqual);
    setField(field, values, isNegated);
  };

  const remove = (field: string, value: any, isNegated?: boolean) => {
    const type = isNegated ? 'must_not' : 'must';
    let values = get(currentFilter, `${type}.${field}`, []);
    values = values.filter((e) => !isEqual(e, value));
    setField(field, values, isNegated);
  };

  const toggle = (field: string, value: any, isNegated?: boolean) => {
    const type = isNegated ? 'must_not' : 'must';
    let values = get(currentFilter, `${type}.${field}`, []);
    if (values.some((e) => isEqual(e, value))) {
      remove(field, value, isNegated);
    } else {
      add(field, value, isNegated);
    }
  };

  const cleanUpFilter = (filter: FilterType) => {
    const must = pickBy(get(filter, 'must', {}), (x) => !isEmpty(x));
    const must_not = pickBy(get(filter, 'must_not', {}), (x) => !isEmpty(x));
    return { must, must_not };
  };

  const hashObj = {
    must: currentFilter?.must || {},
    must_not: currentFilter?.must_not || {},
  };
  const filterHash = hash(hashObj);
  const contextValue = {
    setField, // updates a single field
    setFullField, // updates a single field both must and must_not. Ugly hack as I couldn't get it to work begint to calls. The problem is that the filter isn't updated between the two calls in the event loop and hence the first update is ignored
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
