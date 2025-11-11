import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import InstitutionSearch from './InstitutionSearch';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.institutionSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <InstitutionSearch pageLayout config={props?.siteConfig?.institution} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
