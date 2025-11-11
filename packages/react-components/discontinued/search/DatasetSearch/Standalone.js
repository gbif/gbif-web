import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import DatasetSearch from "./DatasetSearch";
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.datasetSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <DatasetSearch pageLayout config={props?.siteConfig?.dataset} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
