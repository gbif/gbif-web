import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Collection } from './Collection';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.collectionKey.route;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <Collection id={routeProps.match.params.key} {...props} {...routeProps}/>}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
