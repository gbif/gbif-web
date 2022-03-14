import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import LiteratureSearch from './LiteratureSearch';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig}>
    <Standalone {...props} siteConfig={siteConfig}/>
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.literatureSearch.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <LiteratureSearch pageLayout config={props?.siteConfig?.literature} {...props} {...routeProps} />}
    />
  </Switch>
}

export default Wrap;
