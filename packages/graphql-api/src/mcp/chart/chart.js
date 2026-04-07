import { McpError } from '../handlers/utils';
import { addChart, getChartConfig } from './store';

const jq = require('node-jq');

export default async function handleOccurrenceSearch(
  { graphQuery, jqQuery },
  server,
  queryId = 'unknown',
) {
  const chartConfig = getChartConfig(queryId);
  const predicate = chartConfig?.predicate || null;
  const variables = {
    language: 'eng',
    predicate,
    size: 50,
    from: 0,
  };
  try {
    let response;
    try {
      // response = await server.executeOperation({
      //   query: graphQuery,
      //   variables,
      // });
      // instead of doing server.executeOperation then just do a fetch post to the graphql endpoint https://graphql.gbif-uat.org/graphql
      // response = await fetch('https://graphql.gbif-uat.org/graphql', {
      response = await fetch('http://localhost:4002/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: graphQuery,
          variables,
        }),
      });

      const responseData = await response.json();
      if (responseData.errors) {
        throw new McpError(
          `GraphQL query errors: ${JSON.stringify(
            responseData.errors.map((e) => e.message).join(', '),
          )}`,
          response.status,
        );
      }
      response = responseData;
    } catch (error) {
      console.error('GraphQL query error:', error);
      throw new McpError(
        `Failed to execute GraphQL query: ${error.message}`,
        500,
      );
    }

    if (jqQuery) {
      const cleanData = JSON.parse(JSON.stringify(response));
      const result = await jq.run(jqQuery, cleanData, { input: 'json' });

      const vegaspecs = JSON.parse(result);
      console.log('Generated Vega Specs:', JSON.stringify(vegaspecs, null, 2));
      // await validateChartConfig(vegaspecs);
      if (!vegaspecs || !vegaspecs.$schema) {
        throw new McpError('Invalid Vega specs', 400);
      }
      const id = addChart(queryId, {
        vegaspecs,
        graphQuery,
        jqQuery,
        graphqlData: response,
        variables,
      });
      console.log(
        `============== chartId: ${id} ============ queryId: ${queryId} ============`,
      );
      return `Chart configuration saved with ID: ${id}`;
    }

    return response;
  } catch (error) {
    console.error('Error in handleOccurrenceSearch:', error);
    throw new McpError(error.message, 500);
  }
}
