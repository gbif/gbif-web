// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsx jsx */
import { jsx } from '@emotion/core';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Layout from './Layout';
import { FilterState } from "../../widgets/Filter/state";
import { Root } from "../../components";
// import history from './history';
// import qs from 'querystringify';
import { compose } from './api/queryAdapter';

function OccurrenceSearch(props) {
//   console.log(`%c 
//  ,_,
// (O,O)
// (   )  Powered by GBIF
// -"-"-

// All GBIF mediated data is freely available through our APIs. 
// https://www.gbif.org/developer/summary

// All GBIF source code is open source.
// https://github.com/gbif

// If your interest is the rendered HTML, then you might be developing a plugin. Let us know if you need custom markup, we would love to know what you are building.
// helpdesk@gbif.org
// `, 'color: green; font-weight: bold;');
  const [filter, setFilter] = useState({ must: { basisOfRecord: [] } });
  // const esQuery = compose(filter).build();
  return (
    <Root>
      <FilterState filter={filter} onChange={setFilter}>
        {/* <pre>{JSON.stringify(filter, null, 2)}</pre>
        <pre>{JSON.stringify(esQuery, null, 2)}</pre> */}
        <Layout {...props}></Layout>
      </FilterState>
    </Root>
  );
}

// OccurrenceSearch.propTypes = {
//   theme: PropTypes.object,
//   settings: PropTypes.object,
//   locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
//   messages: PropTypes.object
// };

export default OccurrenceSearch;