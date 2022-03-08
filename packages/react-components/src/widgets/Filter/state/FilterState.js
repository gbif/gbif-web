// This file holds the majority of the app state: current filters, current view, update function etc.
import React from 'react';
import PropTypes from 'prop-types';
import Context from './FilterContext';
import { uncontrollable } from 'uncontrollable';
import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import isEqual from 'react-fast-compare';
import hash from 'object-hash';

class FilterState extends React.Component {
  setFilter = async filter => {
    if (isEqual(filter, this.props.filter)) {
      return;
    }
    if (typeof filter === 'object') {
      filter = this.cleanUpFilter(cloneDeep(filter));
      Object.keys(filter).forEach(key => {
        if (typeof filter[key] === 'undefined') delete filter[key];
      })
      if (isEmpty(filter.must)) delete filter.must;
      if (isEmpty(filter.must_not)) delete filter.must_not;
      if (Object.keys(filter).length === 0) filter = undefined;
    }
    this.props.onChange(filter);
    return filter;
  }

  setField = async (field, value, must = true) => {
    const filter = this.props.filter ? cloneDeep(this.props.filter) : {};
    const type = must ? 'must' : 'must_not';
    this.setFilter({
      ...filter,
      [type]: {
        ...filter[type],
        [field]: value
      }
    });
  }

  setFullField = async (field, mustValue, mustNotValue) => {
    const filter = this.props.filter ? cloneDeep(this.props.filter) : {};
    const result = await this.setFilter({
      ...filter,
      must: {
        ...filter.must,
        [field]: mustValue
      },
      must_not: {
        ...filter.must_not,
        [field]: mustNotValue
      }
    });
    return result;
  }

  negateField = async (field, isNegated) => {
    const filter = this.props.filter ? cloneDeep(this.props.filter) : {};
    let must = get(filter, `must.${field}`, []);
    let mustNot = get(filter, `must_not.${field}`, []);
    let value = [...must, ...mustNot];
    const typeToSet = isNegated ? 'must_not' : 'must';
    const typeToRemove = !isNegated ? 'must_not' : 'must';
    this.setFilter({
      ...filter,
      [typeToSet]: {
        ...filter[typeToSet],
        [field]: value
      },
      [typeToRemove]: {
        ...filter[typeToRemove],
        [field]: []
      }
    });
  }

  add = async (field, value, must = true) => {
    const type = must ? 'must' : 'must_not';
    let values = get(this.props.filter, `${type}.${field}`, []);
    values = values.concat(value);
    values = uniqWith(values, isEqual);
    this.setField(field, values, must);
  };

  remove = async (field, value, must = true) => {
    const type = must ? 'must' : 'must_not';
    let values = get(this.props.filter, `${type}.${field}`, []);
    values = values.filter(e => !isEqual(e, value));
    this.setField(field, values, must);
  };

  toggle = async (field, value, must = true) => {
    const type = must ? 'must' : 'must_not';
    let values = get(this.props.filter, `${type}.${field}`, []);
    if (values.some(e => isEqual(e, value))) {
      this.remove(field, value, must);
    } else {
      this.add(field, value, must);
    }
  };

  cleanUpFilter = filter => {
    const must = pickBy(get(filter, 'must', {}), x => !isEmpty(x));
    const must_not = pickBy(get(filter, 'must_not', {}), x => !isEmpty(x));
    return { must, must_not };
  }

  render() {
    const contextValue = {
      setField: this.setField, // updates a single field
      setFullField: this.setFullField, // updates a single field both must and must_not. Ugly hack as I couldn't get it to work begint to calls. The problem is that the filter isn't updated between the two calls in the event loop and hence the first update is ignored
      setFilter: this.setFilter, // updates the filter as a whole
      add: this.add,
      remove: this.remove,
      toggle: this.toggle,
      negateField: this.negateField,
      filter: this.props.filter,
      filterHash: hash(this.props.filter || {})
    };
    return (
      <Context.Provider value={contextValue}>
        {/* <pre>{JSON.stringify(this.props.filter, null, 2)}</pre> */}
        {this.props.children}
      </Context.Provider>
    );
  }
}

// export default FilterState;

const UncontrollableFilterState = uncontrollable(FilterState, {
  filter: 'onChange'
});

FilterState.propTypes = {
  filter: PropTypes.object,
  onChange: PropTypes.func
}

export default UncontrollableFilterState;