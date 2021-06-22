import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import DatasetSearch from "./DatasetSearch";

function Standalone(props) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <DatasetSearch {...props} />}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
