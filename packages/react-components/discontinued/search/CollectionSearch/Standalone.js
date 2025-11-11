import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import CollectionSearch from './CollectionSearch';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.collectionSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <CollectionSearch pageLayout config={props?.siteConfig?.collection} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
