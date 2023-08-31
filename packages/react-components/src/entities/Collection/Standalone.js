import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Collection } from './Collection';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';
import SiteContext from "../../dataManagement/SiteContext";

function Wrap({ siteConfig, router, ...props }) {
  const routeContext = useContext(RouteContext);
  const siteContext = useContext(SiteContext);
  // console.log(routeContext);
  console.log(siteConfig);
  return <StandaloneWrapper siteConfig={siteConfig} router={router}>
    <Standalone {...props} />
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  console.log(routeContext);
  const path = routeContext.collectionKey.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <Collection id={routeProps.match.params.key} {...props} {...routeProps}/>}
    />
  </Switch>
}

export default Wrap;
