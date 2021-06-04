import React from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import OccurrenceSearch from "./OccurrenceSearch";

function Standalone(props) {
  const path = window.location.pathname;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <OccurrenceSearch {...props} {...routeProps}/>}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
