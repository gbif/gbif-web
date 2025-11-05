import config from '#/config';
import { SEARCH_GUIDE } from './guides';
import { McpError } from '../handlers/utils';
import handleOccurrenceSearch from './chart';

export default async function toolHandler(tool, args, server) {
  try {
    let result;
    if (config.debug) console.log('Tool requested:', tool, 'with args:', args);

    switch (tool) {
      case 'gbif_usage_guidelines': {
        if (config.debug)
          console.log('guidelines requested with the query:', args.query);
        if (!args.query || args.query.trim() === '') {
          throw new McpError(
            'Query parameter is required for gbif_usage_guidelines tool',
            400,
          );
        }
        result = {
          content: [
            {
              type: 'text',
              text: SEARCH_GUIDE,
            },
          ],
        };
        break;
      }
      case 'create_visualization': {
        validateUsageToken(args);
        const { graphQuery, jqQuery } = args;
        if (!graphQuery || !jqQuery) {
          throw new McpError(
            'Both graphQuery and jqQuery are required for create_visualization tool',
            400,
          );
        }
        const data = await handleOccurrenceSearch(args, server);
        result = {
          content: [
            {
              type: 'text',
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
        break;
      }
      default:
        throw new McpError(`Tool ${tool} not found`, 404);
    }
    if (config.debug) console.log('return result of execution');
    if (config.debug) console.log(typeof result);
    if (config.debug) console.log(result);
    return result;
  } catch (error) {
    if (config.debug) console.error(error);
    if (error instanceof McpError) {
      throw error;
    } else {
      throw new McpError('Internal Server Error', 500);
    }
  }
}

function validateUsageToken(args) {
  if (!args.usageToken || args.usageToken !== 'I_HAVE_READ_THE_GUIDELINES') {
    throw new McpError(
      'You must provide a valid usageToken to use this tool. Obtain it from the gbif_usage_guidelines tool.',
      400,
    );
  }
  return true;
}
