import config from '#/config';
import { SEARCH_GUIDE } from './guides';
import handleDatasetSearch from './handlers/handleDatasetSearch';
import handleGadmSearch from './handlers/handleGadmSearch';
import handleOccurrenceSearch from './handlers/handleOccurrenceSearch';
import handleSpeciesMatch from './handlers/handleSpeciesMatch';
import handleSpeciesSearch from './handlers/handleSpeciesSearch';
import { McpError } from './handlers/utils';

export default async function toolHandler(tool, args) {
  try {
    let result;

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
      case 'occurrence_search': {
        validateUsageToken(args);
        result = await handleOccurrenceSearch(args);
        break;
      }
      case 'species_search': {
        validateUsageToken(args);
        result = await handleSpeciesSearch(args);
        break;
      }
      case 'gadm_search': {
        validateUsageToken(args);
        result = await handleGadmSearch(args);
        break;
      }
      case 'species_match': {
        validateUsageToken(args);
        result = await handleSpeciesMatch(args);
        break;
      }
      case 'dataset_search': {
        validateUsageToken(args);
        result = await handleDatasetSearch(args);
        break;
      }
      default:
        throw new McpError(`Tool ${tool} not found`, 404);
    }
    if (config.debug) console.log('return result of execution');
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
