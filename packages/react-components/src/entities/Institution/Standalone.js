import React, { useContext } from "react";
import StandaloneWrapper from '../../StandaloneWrapper';
import { Institution } from './Institution';
import { Switch, Route } from 'react-router-dom';
import RouteContext from '../../dataManagement/RouteContext';

function Wrap({ siteConfig, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig} {...props}>
    <Standalone {...props} />
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext);
  const path = routeContext.institutionKey.route;
  return <Switch>
    <Route
      path={path}
      render={routeProps => <Institution id={routeProps.match.params.key} {...props} {...routeProps} />}
    >
      </Route>
  </Switch>
}

export default Wrap;

// import React, { useContext } from "react";
// import StandaloneWrapper from '../../StandaloneWrapper';
// import { Institution } from './Institution';
// import { Switch, Route } from 'react-router-dom';
// import RouteContext from '../../dataManagement/RouteContext';

// function Standalone(props) {
//   const routeContext = useContext(RouteContext);
//   const path = routeContext.institutionKey.route;
//   return <StandaloneWrapper {...props}>
//     <Switch>
//       <Route
//         path={path}
//         render={routeProps => <Institution id={routeProps.match.params.key} {...props} {...routeProps}/>}
//       />
//     </Switch>
//   </StandaloneWrapper>
// }

// export default Standalone;
