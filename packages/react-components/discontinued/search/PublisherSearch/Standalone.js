import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import PublisherSearch from './PublisherSearch';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.publisherSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <PublisherSearch pageLayout config={props?.siteConfig?.publisher} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
