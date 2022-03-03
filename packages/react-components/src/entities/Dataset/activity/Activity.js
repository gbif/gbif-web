
import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from './styles';
import * as cssDataset from '../styles';
import { join } from '../../../utils/util';
import LiteratureSearch from '../../../search/LiteratureSearch/LiteratureSearch';

import {
  Switch,
  Route,
  NavLink,
  useRouteMatch,
} from "react-router-dom";

export function Activity({
  dataset,
  className,
  ...props
}) {
  let { url, path } = useRouteMatch();
  const theme = useContext(ThemeContext);

  const config = { 
    rootFilter:{gbifDatasetKey: [dataset.key]}, 
    excludedFilters: ['datasetKey'], 
    // highlightedFilters: ['taxonKey', 'catalogNumber', 'recordedBy', 'identifiedBy', 'typeStatus']
  };

  return <div>
    <LiteratureSearch config={config} style={{ margin: 'auto', maxWidth: '100%', minHeight: 'calc(90vh)' }}></LiteratureSearch>
  </div>
};
