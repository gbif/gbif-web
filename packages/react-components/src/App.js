import React, { useContext } from "react";
import StandaloneWrapper from './StandaloneWrapper';

import { Collection } from './entities/Collection/Collection';
import CollectionSearch from './search/CollectionSearch/CollectionSearch';
import { Institution } from './entities/Institution/Institution';
import InstitutionSearch from './search/InstitutionSearch/InstitutionSearch';

import { Dataset } from './entities/Dataset/Dataset';
import DatasetSearch from './search/DatasetSearch/DatasetSearch';
import PublisherSearch from './search/PublisherSearch/PublisherSearch';
import { Publisher } from './entities/Publisher/Publisher';
import LiteratureSearch from './search/LiteratureSearch/LiteratureSearch';
import OccurrenceSearch from './search/OccurrenceSearch/OccurrenceSearch';

import { Switch, Route, Link } from 'react-router-dom';
import RouteContext from './dataManagement/RouteContext';

function Wrap({ siteConfig, router, ...props }) {
  return <StandaloneWrapper siteConfig={siteConfig} router={router}>
    <Standalone {...props} siteConfig={siteConfig} />
  </StandaloneWrapper>
}

function Standalone(props) {
  const routeContext = useContext(RouteContext); 
  return <Switch>
    <Route
      exact
      path={routeContext.collectionSearch.route}
      render={routeProps => <CollectionSearch pageLayout config={props?.siteConfig?.collection} {...props} {...routeProps} />}
    />
    <Route
      path={routeContext.collectionKey.route}
      render={routeProps => <Collection id={routeProps.match.params.key} {...props} {...routeProps} />}
    />
    <Route
      exact
      path={routeContext.institutionSearch.route}
      render={routeProps => <InstitutionSearch pageLayout config={props?.siteConfig?.institution} {...props} {...routeProps} />}
    />
    <Route
      path={routeContext.institutionKey.route}
      render={routeProps => <Institution id={routeProps.match.params.key} {...props} {...routeProps} />}
    />
    <Route
      exact
      path={routeContext.datasetSearch.route}
      render={routeProps => <DatasetSearch pageLayout config={props?.siteConfig?.dataset} {...props} {...routeProps} />}
    />
    <Route
      path={routeContext.datasetKey.route}
      render={routeProps => <Dataset id={routeProps.match.params.key} {...props} {...routeProps} />}
    />
    <Route
      exact
      path={routeContext.publisherSearch.route}
      render={routeProps => <PublisherSearch pageLayout config={props?.siteConfig?.publisher} {...props} {...routeProps} />}
    />
    <Route
      path={routeContext.publisherKey.route}
      render={routeProps => <Publisher id={routeProps.match.params.key} {...props} {...routeProps} />}
    />
    <Route
      exact
      path={routeContext.literatureSearch.route}
      render={routeProps => <LiteratureSearch pageLayout config={props?.siteConfig?.literature} {...props} {...routeProps} />}
    />
    <Route
      exact
      path={routeContext.occurrenceSearch.route}
      render={routeProps => <OccurrenceSearch pageLayout config={props?.siteConfig?.occurrence} {...props} {...routeProps} />}
    />
    <Route
      path='/'
      render={routeProps => <div>
        <h1>Select a route to start</h1>
        <ul>
          <li><Link to={routeContext.collectionSearch.route}>Collection search</Link></li>
          <li><Link to="/collection/dceb8d52-094c-4c2c-8960-75e0097c6861">Collection example</Link></li>
          <li><Link to={routeContext.institutionSearch.route}>Institution search</Link></li>
          <li><Link to="/institution/fa252605-26f6-426c-9892-94d071c2c77f">Institution example</Link></li>
          <li><Link to={routeContext.datasetSearch.route}>Dataset search</Link></li>
          <li><Link to="/dataset/2985efd1-45b1-46de-b6db-0465d2834a5a">Dataset example</Link></li>
          <li><Link to={routeContext.publisherSearch.route}>Publisher search</Link></li>
          <li><Link to="/publisher/e2e717bf-551a-4917-bdc9-4fa0f342c530">Publisher example</Link></li>
          <li><Link to={routeContext.literatureSearch.route}>Literature search</Link></li>
          <li><Link to={routeContext.occurrenceSearch.route}>Occurrence search</Link></li>
        </ul>
      </div>}
    />
  </Switch>
}



export default Wrap;
