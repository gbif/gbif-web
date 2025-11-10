import Anthropic from '@anthropic-ai/sdk';
import config from '#/config';

const anthropic = new Anthropic({
  apiKey: config.claudeApiKey, // This is the default and can be omitted
});

const systemPrompt = `This query is performed in context of a website dashboard for exploring GBIF mediated biodiversity data. 
The user has already applied filters and are now exploring the data. 
When the create_visualization tool is called the user will see the resulting chart.
The user will only see the chart and not anything else you write. You are welcome to think out loud if that helps you, but keep it short as it will not be seen by anyone.`;

export default async function ask({ query, queryId }) {
  if (typeof query !== 'string') {
    throw new Error('Query must be a string');
  }
  if (query.length === 0) {
    throw new Error('Query cannot be empty');
  }
  console.log(query);

  // get claude specific system prompt
  try {
    const message = await anthropic.beta.messages.create({
      model: 'claude-sonnet-4-5', // 'claude-sonnet-4-5', 'claude-3-5-haiku-20241022'
      max_tokens: 1000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: query,
        },
      ],
      mcp_servers: [
        {
          type: 'url',
          url: config.mcpChartEndpoint ?? `${config.origin}/mcp/chart`,
          name: 'gbif-mcp',
          authorization_token: `${config.mcpApiToken} ${queryId}`,
        },
      ],
      betas: ['mcp-client-2025-04-04'],
    });

    console.log(message);
    console.log(message.content);
    return message.content;
  } catch (error) {
    console.error('Error in ask function:', error);
    throw error;
  }
}

console.log('mcp endpoint:', config.mcpChartEndpoint);
