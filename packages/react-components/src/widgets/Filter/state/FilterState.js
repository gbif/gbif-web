// This file holds the majority of the app state: current filters, current view, update function etc.
import React from 'react';
import PropTypes from 'prop-types';
import Context from './FilterContext';
import { uncontrollable } from 'uncontrollable';
import cloneDeep from 'lodash/cloneDeep';
import uniqWith from 'lodash/uniqWith';
import get from 'lodash/get';
import isEqual from 'react-fast-compare';
import hash from 'object-hash';

class FilterState extends React.Component {
  setFilter = async filter => {
    if (isEqual(filter, this.props.filter)) {
      return;
    }
    if (typeof filter === 'object') {
      filter = cloneDeep(filter);
      Object.keys(filter).forEach(key => {
        if (typeof filter[key] === 'undefined') delete filter[key];
      })
      if (Object.keys(filter).length === 0) filter = undefined;
    }
    this.props.onChange(filter);
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

  render() {
    const contextValue = {
      setField: this.setField, // updates a single field
      setFilter: this.setFilter, // updates the filter as a whole
      add: this.add,
      remove: this.remove,
      toggle: this.toggle,
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