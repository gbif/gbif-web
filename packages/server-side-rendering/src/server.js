import { join } from 'path';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createApp } from './createApp';
import template from './template';
import compression from 'compression';
import { createServerContext } from 'gbif-react-components';

const server = express();
server.use(compression());

async function findResultsState() {
  return {tesT: 5};
}
server.use('/assets', express.static(join(__dirname, 'assets')));

server.get('/', async (_, res) => {
  const { App, props } = createApp();
  const { ServerDataContext, resolveData } = createServerContext();

  const searchState = {
    query: 'iPhone',
    page: 5,
    refinementList: {
      brand: ['Apple'],
    },
  };

  const resultsState = await findResultsState(App, {
    ...props,
    searchState,
  });

  const initialState = {
    searchState,
    resultsState,
  };

  const _throwAwayRender = renderToString(<ServerDataContext><App {...props} /></ServerDataContext>);

  // Wait for all effects to finish
  const data = await resolveData(500);

  // Now render it again, but with the API calls prefetched and used as initial data
  const plainHTML = renderToString(<ServerDataContext initialState={data}><App {...props} /></ServerDataContext>);

  res.send(
    template({
      body: plainHTML,
      title: 'Hello World from the server',
      initialState: JSON.stringify(data),
    })
  );
});

server.listen(8080, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on: http://localhost:8080');
});
