import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import OccurrenceSearch from "./OccurrenceSearch";
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.occurrenceSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <OccurrenceSearch pageLayout config={props?.siteConfig?.occurrence} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
