import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Institution } from './Institution';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} />
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  // if an explitit id is passed in, use it instead of extracting it from the route
  if (props.id) {
    return <Institution {...props} />
  }
  const path = routeContext.institutionKey.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <Institution id={routeProps.match.params.key} {...props} {...routeProps}/>}
    />
  </Switch>
}

export default Wrap;
