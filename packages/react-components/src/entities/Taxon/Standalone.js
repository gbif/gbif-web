import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Taxon } from './Taxon';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.taxonKey.route;
  return <StandaloneWrapper {...props}>
    <Switch>
      <Route
        path={path}
        render={routeProps => <Taxon id={routeProps.match.params.key} {...props} {...routeProps}/>}
      />
    </Switch>
  </StandaloneWrapper>
}

export default Standalone;
