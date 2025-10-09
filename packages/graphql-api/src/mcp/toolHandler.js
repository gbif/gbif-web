import { SEARCH_GUIDE } from './guides';
import {
  handleDatasetSearch,
  handleOccurrenceSearch,
  handleSpeciesMatch,
  handleSpeciesSearch,
  handleSpeciesSuggest,
} from './handlers/handlers';

export class McpError extends Error {
  constructor(
    message = 'Unable to fetch data right now, please try again later.',
    status = 500,
  ) {
    super(message);
    this.status = status;
  }
}

export default async function toolHandler(tool, args) {
  try {
    let result;

    switch (tool) {
      case 'gbif_usage_guidelines': {
        console.log('guidelines requested');
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
        result = handleOccurrenceSearch(args);
        break;
      }
      case 'species_search': {
        validateUsageToken(args);
        result = handleSpeciesSearch(args);
        break;
      }
      case 'species_match': {
        validateUsageToken(args);
        result = handleSpeciesMatch(args);
        break;
      }
      case 'species_suggest': {
        validateUsageToken(args);
        result = handleSpeciesSuggest(args);
        break;
      }
      case 'dataset_search': {
        validateUsageToken(args);
        result = handleDatasetSearch(args);
        break;
      }
      default:
        throw new McpError(`Tool ${tool} not found`, 404);
    }
    console.log('return result of execution');
    return result;
  } catch (error) {
    console.error(error);
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
