import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import Annotations from './Annotations';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.annotations.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <Annotations config={props?.siteConfig?.annotations} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
