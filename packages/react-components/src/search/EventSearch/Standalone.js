import React, { useContext } from 'react';
import StandaloneWrapper from '../../StandaloneWrapper';
import { Switch, Route } from 'react-router-dom';
import EventSearch from './EventSearch';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return (
    <StandaloneWrapper siteConfig={siteConfig}>
      <Standalone {...props} siteConfig={siteConfig} />
    </StandaloneWrapper>
  );
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.eventSearch.route;

  return (
    <Switch>
      <Route
        path={path}
        render={(routeProps) => (
          <EventSearch
            pageLayout
            config={props?.siteConfig?.event}
            {...props}
            {...routeProps}
          />
        )}
      />
    </Switch>
  );
}

export default Wrap;
