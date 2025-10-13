import { ApiClient } from '../apiClient';
import config from '#/config.js';
import json2str from './utils';
import searchSpeciesMultiStrategy from './speciesUtils';

const apiV2Client = new ApiClient(config.apiv2);

export default async function handleSpeciesMatch(args) {
  return searchSpeciesMultiStrategy(args);
}

async function handlePureSpeciesMatch(args) {
  const params = {
    scientificName: args.scientificName,
    strict: false,
    verbose: true,
    // datasetKey: config.defaultChecklist, // the API do not take a checklistKey parameter so this will only work with the backbone
  };

  // uppercase the first letter of the name to improve matching
  // it is almost(?) always the case that names should be capitalized.
  // so if we assume the tool is used for good reasons, we can do this automatically
  if (params.scientificName) {
    params.scientificName =
      params.scientificName.charAt(0).toUpperCase() +
      params.scientificName.slice(1);
  }

  const data = await apiV2Client.get('/species/match', params);

  try {
    // format result for compactness and readability
    const formattedResult = formatMatchResult(data);

    return {
      content: [
        {
          type: 'text',
          text: formattedResult,
        },
      ],
    };
  } catch (error) {
    console.error(error);
    throw GBIFAPIError('Error processing match result', 500);
  }
}

function formatMatchResult(data) {
  if (!data) return 'No match data';
  const lines = [];
  if (data.usage) {
    // this means there is prefered hit
    const { name, key, rank, status } = data.acceptedUsage || data.usage;
    if (data.acceptedUsage) {
      lines.push(
        `Matched as synonym: ${json2str({ name, key, rank, status })}`,
      );
      const {
        name: aname,
        key: akey,
        rank: arank,
        status: astatus,
      } = data.usage;
      lines.push(
        `Accepted name: ${json2str({
          name: aname,
          key: akey,
          rank: arank,
          status: astatus,
        })}`,
      );
    } else {
      lines.push(`Matched as: ${json2str({ name, key, rank, status })}`);
      // add the classification for the first match
      if (data.classification && data.classification.length > 1) {
        const classification = data.classification.map((x) => ({
          name: x.name,
          key: x.key,
        }));
        lines.push(`\nClassification:\n${json2str(classification)}`);
      }
    }
  }

  if (
    data?.diagnostics?.alternatives &&
    data?.diagnostics?.alternatives.length > 0
  ) {
    let optionCount = 3;
    // show a few alternatives
    if (data.usage) {
      lines.push(`\nAlternative matches:`);
    } else {
      optionCount = 5;
      lines.push(`\n${data.diagnostics.note}. Options:`);
    }
    data.diagnostics.alternatives.slice(0, optionCount).forEach((alt) => {
      const { name, key, rank, status } = alt.acceptedUsage || alt.usage;
      const colator = { name, key, rank, status };
      if (alt.acceptedUsage) {
        colator.acceptedNameFor = { name: alt.usage.name, key: alt.usage.key };
      }
      lines.push(`- ${json2str(colator)}`);
    });
  }

  return lines.join('\n');
}
