// This file holds the majority of the app state: current filters, current view, update function etc.
import React from 'react';
import AppContext from './AppContext';
// import api from '../api';
// import TablePresentation from '../components/views/Table/TablePresentation';
// import MapPresentation from '../components/views/Map/MapPresentation';
// import QuickSearchPresentation from '../components/QuickSearch/QuickSearchPresentation';
// import { get } from 'lodash';
// import { getFilterFromUrl, getUpdatedFilter, pushStateToUrl } from './stateHelper';
// import { strToHash } from '../util/helpers';
// import history from './history';

// export const views = {
//   TABLE: 'TABLE',
//   GALLERY: 'GALLERY',
//   MAP: 'MAP',
// }

/**
 * Holds all cross cutting state for the occurrence search (most prominently the current filter) and is responsible for managing URL params as well
 */
class StateProvider extends React.Component {
  constructor(props) {
    super(props);

    // const components = {
    //   TableView: get(props, 'settings.components.TableView', TablePresentation),
    //   MapView: get(props, 'settings.components.MapView', MapPresentation),
    //   QuickSearch: get(props, 'settings.components.QuickSearch', QuickSearchPresentation),
    // }

    // let filter = getFilterFromUrl(window.location.search);
    // this.unlisten = history.listen((location, action) => {
    //   this.updateStateFilter(getFilterFromUrl(location.search));
    // });

    this.state = {
      // appRef: React.createRef(),
      // activeView: views.TABLE,
      // filter,//{year: [2018, {gte: 1928, lt:1929}]}, // current filter
      stateApi: {
        // updateView: this.updateView, // update the active view
        setField: this.setField, // updates a single field
        setFilter: this.setFilter, // updates the filter as a whole
        // updateQuery, // sets the full query
      },
      // components,
      // api
      test: 10,
      filter: { must: { datasetKey: ['1234-1234-1234-1234'] } } // current filter
    }
  }

  // updateView = selected => {
  //   if (!views[selected]) return;
  //   this.setState({ activeView: selected });
  // }

  setFilter = async filter => {
    if (typeof filter === 'object') {
      Object.keys(filter).forEach(key => {
        if (typeof filter[key] === 'undefined') delete filter[key];
      })
      if (Object.keys(filter).length === 0) filter = undefined;
    }
    this.setState({ filter });
  }

  setField = async (field, value, must = true) => {
    const type = must ? 'must' : 'must_not';
    this.setFilter({
      ...this.state.filter,
      [type]: {
        ...this.state.filter[type],
        [field]: value
      }
    });
  }

  // updateStateFilter = filter => {
  //   const filterHash = strToHash(JSON.stringify(filter));
  //   this.setState({
  //     filter,
  //     filterHash
  //   });
  // }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default StateProvider;