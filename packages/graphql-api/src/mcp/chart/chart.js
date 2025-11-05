const jq = require('node-jq');

export default async function handleOccurrenceSearch(
  { graphQuery, jqQuery },
  server,
) {
  try {
    const response = await server.executeOperation({
      query: graphQuery,
      // variables: { taxonKey, languageCode },
    });

    if (jqQuery) {
      const cleanData = JSON.parse(JSON.stringify(response));
      const result = await jq.run(jqQuery, cleanData, { input: 'json' });
      return result;
    }

    return response;
  } catch (error) {
    console.error('Error in handleOccurrenceSearch:', error);
    throw error;
  }
}
